import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

const SMSCODE_BASE_URL = "https://api.smscode.gg/v1";

async function smsGet(path) {
  const response = await fetch(
    `${SMSCODE_BASE_URL}${path}`,
    {
      method: "GET",
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

  return {
    response,
    data,
  };
}

function parsePrice(price) {
  /*
   * SMSCode bisa mengembalikan price sebagai:
   *
   * 1. number
   * 2. object money
   *
   * Kita support keduanya.
   */

  if (typeof price === "number") {
    return price;
  }

  if (typeof price === "string") {
    const number = Number(price);

    if (Number.isFinite(number)) {
      return number;
    }
  }

  if (price && typeof price === "object") {
    const candidates = [
      price.canonical_amount,
      price.amount,
      price.value,
    ];

    for (const value of candidates) {
      const number = Number(value);

      if (Number.isFinite(number)) {
        return number;
      }
    }
  }

  return 0;
}

function getOperatorName(operator) {
  return (
    operator?.display_name ||
    operator?.name ||
    operator?.operator_name ||
    operator?.title ||
    "Semua Operator"
  );
}

function enrichProducts(
  products,
  countries,
  services,
  operators,
  markup
) {
  const countryMap = new Map(
    countries.map((country) => [
      String(country.id),
      country,
    ])
  );

  const serviceMap = new Map(
    services.map((service) => [
      String(service.id),
      service,
    ])
  );

  const operatorMap = new Map(
    operators.map((operator) => [
      String(operator.id),
      operator,
    ])
  );

  return products.map((product) => {
    const country = countryMap.get(
      String(product.country_id)
    );

    const service = serviceMap.get(
      String(product.platform_id)
    );

    const operator =
      product.operator_id != null
        ? operatorMap.get(
            String(product.operator_id)
          )
        : null;

    const supplierPrice = parsePrice(
      product.price
    );

    const sellingPrice =
      supplierPrice + markup;

    return {
      ...product,

      supplier_price: supplierPrice,

      selling_price: sellingPrice,

      country_name:
        country?.name ||
        `Negara ${product.country_id}`,

      country_code:
        country?.code || "",

      country_emoji:
        country?.emoji || "",

      service_name:
        service?.name ||
        `Platform ${product.platform_id}`,

      operator_name:
        operator
          ? getOperatorName(operator)
          : product.operator_name ||
            product.operator_display ||
            "Semua Operator",

      operator_display:
        operator
          ? getOperatorName(operator)
          : product.operator_name ||
            product.operator_display ||
            "Semua Operator",
    };
  });
}

async function getMarkup() {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from("pricing_settings")
    .select("markup")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  const markup = Number(
    data?.markup ?? 1000
  );

  if (
    !Number.isInteger(markup) ||
    markup < 0
  ) {
    throw new Error(
      "Markup pricing tidak valid."
    );
  }

  return markup;
}

export async function GET(request) {
  try {
    const { searchParams } =
      new URL(request.url);

    const action =
      searchParams.get("action") ||
      "countries";

    const countryId =
      searchParams.get("country_id");

    const platformId =
      searchParams.get("platform_id");

    const operatorId =
      searchParams.get("operator_id");

    /*
     * ==================================================
     * COUNTRIES
     * ==================================================
     */

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
              "Gagal mengambil negara SMSCode.",
          },
          {
            status:
              result.response.status || 502,
          }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.data.data || [],
      });
    }

    /*
     * ==================================================
     * SERVICES BERDASARKAN COUNTRY
     * ==================================================
     */

    if (action === "services") {
      if (!countryId) {
        return NextResponse.json(
          {
            success: false,
            error:
              "country_id wajib diisi.",
          },
          {
            status: 400,
          }
        );
      }

      const params =
        new URLSearchParams();

      params.set(
        "country_id",
        countryId
      );

      const result = await smsGet(
        `/catalog/services?${params.toString()}`
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
              "Gagal mengambil service SMSCode.",
          },
          {
            status:
              result.response.status || 502,
          }
        );
      }

      return NextResponse.json({
        success: true,
        country_id: countryId,
        data: result.data.data || [],
      });
    }

    /*
     * ==================================================
     * OPERATORS BERDASARKAN COUNTRY + SERVICE
     * ==================================================
     */

    if (action === "operators") {
      if (!countryId) {
        return NextResponse.json(
          {
            success: false,
            error:
              "country_id wajib diisi.",
          },
          {
            status: 400,
          }
        );
      }

      if (!platformId) {
        return NextResponse.json(
          {
            success: false,
            error:
              "platform_id wajib diisi.",
          },
          {
            status: 400,
          }
        );
      }

      const params =
        new URLSearchParams();

      params.set(
        "country_id",
        countryId
      );

      params.set(
        "platform_id",
        platformId
      );

      const result = await smsGet(
        `/catalog/operators?${params.toString()}`
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
              "Gagal mengambil operator SMSCode.",
          },
          {
            status:
              result.response.status || 502,
          }
        );
      }

      return NextResponse.json({
        success: true,
        country_id: countryId,
        platform_id: platformId,
        data: result.data.data || [],
      });
    }

    /*
     * ==================================================
     * PRODUCTS BERDASARKAN COUNTRY + SERVICE + OPERATOR
     * ==================================================
     */

    if (action === "products") {
      if (!countryId) {
        return NextResponse.json(
          {
            success: false,
            error:
              "country_id wajib diisi.",
          },
          {
            status: 400,
          }
        );
      }

      if (!platformId) {
        return NextResponse.json(
          {
            success: false,
            error:
              "platform_id wajib diisi.",
          },
          {
            status: 400,
          }
        );
      }

      const params =
        new URLSearchParams();

      params.set(
        "country_id",
        countryId
      );

      params.set(
        "platform_id",
        platformId
      );

      /*
       * operator_id hanya dikirim kalau
       * user memilih operator tertentu.
       *
       * Kalau "all", jangan kirim operator_id.
       * SMSCode akan memberikan produk Any/semua
       * operator sesuai catalog mereka.
       */

      if (
        operatorId &&
        operatorId !== "all" &&
        operatorId !== "any"
      ) {
        params.set(
          "operator_id",
          operatorId
        );
      }

      params.set(
        "sort",
        "price_asc"
      );

      params.set(
        "limit",
        "10000"
      );

      params.set(
        "page",
        "1"
      );

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
              "Gagal mengambil produk SMSCode.",
          },
          {
            status:
              result.response.status || 502,
          }
        );
      }

      /*
       * Ambil metadata untuk enrichment.
       */

      const [
        countriesResult,
        servicesResult,
        operatorsResult,
        markup,
      ] = await Promise.all([
        smsGet(
          "/catalog/countries"
        ),

        smsGet(
          `/catalog/services?country_id=${encodeURIComponent(
            countryId
          )}`
        ),

        smsGet(
          `/catalog/operators?country_id=${encodeURIComponent(
            countryId
          )}&platform_id=${encodeURIComponent(
            platformId
          )}`
        ),

        getMarkup(),
      ]);

      const countries =
        countriesResult.data?.data ||
        [];

      const services =
        servicesResult.data?.data ||
        [];

      const operators =
        operatorsResult.data?.data ||
        [];

      const products =
        result.data.data || [];

      const enrichedProducts =
        enrichProducts(
          products,
          countries,
          services,
          operators,
          markup
        );

      return NextResponse.json({
        success: true,

        country_id:
          countryId,

        platform_id:
          platformId,

        operator_id:
          operatorId || "all",

        markup,

        data: enrichedProducts,
      });
    }

    /*
     * ==================================================
     * ACTION TIDAK DIKENAL
     * ==================================================
     */

    return NextResponse.json(
      {
        success: false,
        error:
          "Action catalog tidak dikenal.",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error(
      "CATALOG ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message:
            error?.message ||
            "Gagal mengambil katalog SMSCode.",
        },
      },
      {
        status: 500,
      }
    );
  }
}
