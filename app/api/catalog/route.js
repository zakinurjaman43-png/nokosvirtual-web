import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

const SMSCODE_BASE_URL = "https://api.smscode.gg/v1";

async function smsGet(path) {
  const response = await fetch(
    `${SMSCODE_BASE_URL}${path}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.SMSCODE_TOKEN}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = {
      success: false,
      message: text || "Response SMSCode tidak valid.",
    };
  }

  return { response, data };
}

function parsePrice(price) {
  if (typeof price === "number") {
    return price;
  }

  if (typeof price === "string") {
    const value = Number(price);
    return Number.isFinite(value) ? value : 0;
  }

  if (price && typeof price === "object") {
    const value =
      price.canonical_amount ??
      price.amount ??
      price.value;

    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : 0;
  }

  return 0;
}

async function getMarkup() {
  const { data, error } =
    await supabaseAdmin
      .from("pricing_settings")
      .select("markup")
      .eq("id", 1)
      .maybeSingle();

  if (error) throw error;

  const markup = Number(data?.markup ?? 1000);

  if (!Number.isInteger(markup) || markup < 0) {
    throw new Error("Markup pricing tidak valid.");
  }

  return markup;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const action =
      searchParams.get("action") || "countries";

    const countryId =
      searchParams.get("country_id");

    const platformId =
      searchParams.get("platform_id");

    const operatorId =
      searchParams.get("operator_id");

    // =========================
    // COUNTRIES
    // =========================

    if (action === "countries") {
      const result = await smsGet(
        "/catalog/countries"
      );

      if (
        !result.response.ok ||
        !result.data?.success
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              result.data?.message ||
              "Gagal mengambil negara.",
          },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.data.data || [],
      });
    }

    // =========================
    // SERVICES
    // =========================

    if (action === "services") {
      if (!countryId) {
        return NextResponse.json(
          {
            success: false,
            error: "country_id wajib diisi.",
          },
          { status: 400 }
        );
      }

      const result = await smsGet(
        `/catalog/services?country_id=${encodeURIComponent(
          countryId
        )}`
      );

      if (
        !result.response.ok ||
        !result.data?.success
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              result.data?.message ||
              "Gagal mengambil service.",
          },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.data.data || [],
      });
    }

    // =========================
    // OPERATORS
    // =========================

    if (action === "operators") {
      if (!countryId || !platformId) {
        return NextResponse.json(
          {
            success: false,
            error:
              "country_id dan platform_id wajib diisi.",
          },
          { status: 400 }
        );
      }

      const result = await smsGet(
        `/catalog/operators?country_id=${encodeURIComponent(
          countryId
        )}&platform_id=${encodeURIComponent(
          platformId
        )}`
      );

      if (
        !result.response.ok ||
        !result.data?.success
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              result.data?.message ||
              "Gagal mengambil operator.",
          },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.data.data || [],
      });
    }

    // =========================
    // PRODUCTS
    // =========================

    if (action === "products") {
      if (!countryId || !platformId) {
        return NextResponse.json(
          {
            success: false,
            error:
              "country_id dan platform_id wajib diisi.",
          },
          { status: 400 }
        );
      }

      const params = new URLSearchParams();

      params.set("country_id", countryId);
      params.set("platform_id", platformId);

      /*
       * PENTING:
       * operator_id hanya dikirim kalau
       * user memang memilih operator tertentu.
       */
      if (
        operatorId &&
        operatorId !== "all" &&
        operatorId !== "any"
      ) {
        params.set("operator_id", operatorId);
      }

      params.set("sort", "price_asc");
      params.set("limit", "10000");
      params.set("page", "1");

      const result = await smsGet(
        `/catalog/products?${params.toString()}`
      );

      if (
        !result.response.ok ||
        !result.data?.success
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              result.data?.message ||
              "Gagal mengambil produk.",
          },
          { status: 502 }
        );
      }

      const products =
        result.data.data || [];

      const markup = await getMarkup();

      /*
       * Tambahkan informasi operator
       * langsung berdasarkan operator_id.
       */
      const operatorResult =
        await smsGet(
          `/catalog/operators?country_id=${encodeURIComponent(
            countryId
          )}&platform_id=${encodeURIComponent(
            platformId
          )}`
        );

      const operators =
        operatorResult.data?.data || [];

      const operatorMap = new Map();

      for (const operator of operators) {
        if (
          operator.operator_id != null
        ) {
          operatorMap.set(
            String(operator.operator_id),
            operator
          );
        }
      }

      const enriched =
        products.map((product) => {
          const supplierPrice =
            parsePrice(product.price);

          const sellingPrice =
            supplierPrice + markup;

          const operator =
            product.operator_id != null
              ? operatorMap.get(
                  String(product.operator_id)
                )
              : null;

          return {
            ...product,

            supplier_price:
              supplierPrice,

            selling_price:
              sellingPrice,

            operator_name:
              operator?.display_name ||
              operator?.name ||
              operator?.local_name ||
              product.operator_name ||
              "Semua Operator",
          };
        });

      return NextResponse.json({
        success: true,
        data: enriched,
        markup,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Action tidak dikenal.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error(
      "CATALOG ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Gagal mengambil katalog SMSCode.",
      },
      { status: 500 }
    );
  }
}
