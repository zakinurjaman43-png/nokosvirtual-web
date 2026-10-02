import { NextResponse } from "next/server";
import crypto from "crypto";

import { createSupabaseServerClient } from "../../../lib/supabaseServer";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
export const dynamic = "force-dynamic";

const SMSCODE_BASE_URL = "https://api.smscode.gg/v1";

async function smsRequest(path, options = {}) {
  if (!process.env.SMSCODE_TOKEN) {
    throw new Error("Integrasi SMSCode belum dikonfigurasi.");
  }
  const response = await fetch(
    `${SMSCODE_BASE_URL}${path}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${process.env.SMSCODE_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options.headers || {}),
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
      message:
        text || "Response SMSCode tidak valid.",
    };
  }

  return {
    response,
    data,
  };
}

function parsePrice(price) {
  if (
    typeof price === "number" &&
    Number.isFinite(price)
  ) {
    return price;
  }

  if (typeof price === "string") {
    const value = Number(price);

    if (Number.isFinite(value)) {
      return value;
    }
  }

  if (
    price &&
    typeof price === "object"
  ) {
    const candidates = [
      price.canonical_amount,
      price.amount,
      price.value,
    ];

    for (const candidate of candidates) {
      const value = Number(candidate);

      if (Number.isFinite(value)) {
        return value;
      }
    }
  }

  return NaN;
}

function getOperatorId(product) {
  if (
    product?.operator_id === null ||
    product?.operator_id === undefined ||
    product?.operator_id === ""
  ) {
    return null;
  }

  const value = Number(
    product.operator_id
  );

  return Number.isInteger(value)
    ? value
    : null;
}

export async function POST(request) {
  let reservationId = null;
  let supplierOrderCreated = false;

  try {
    // ================================
    // AUTH
    // ================================

    const supabase =
      await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } =
      await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // ================================
    // INPUT
    // ================================

    const body =
      await request.json();

    const productId =
      Number(body.product_id);

    const countryId =
      body.country_id != null
        ? String(body.country_id)
        : null;

    const platformId =
      body.platform_id != null
        ? String(body.platform_id)
        : null;

    const operatorId =
      body.operator_id != null &&
      body.operator_id !== "" &&
      body.operator_id !== "all" &&
      body.operator_id !== "any"
        ? String(body.operator_id)
        : null;

    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "product_id tidak valid.",
        },
        { status: 400 }
      );
    }

    if (!countryId || !platformId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Country dan service wajib dipilih.",
        },
        { status: 400 }
      );
    }

    // ================================
    // USER
    // ================================

    const {
      data: dbUser,
      error: userError,
    } =
      await supabaseAdmin
        .from("users")
        .select(
          "id, auth_user_id, balance, is_active"
        )
        .eq(
          "auth_user_id",
          user.id
        )
        .maybeSingle();

    if (userError) {
      throw userError;
    }

    if (!dbUser) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Akun belum tersinkronisasi.",
        },
        { status: 404 }
      );
    }

    if (dbUser.is_active === false) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Akun tidak aktif.",
        },
        { status: 403 }
      );
    }

    // ================================
    // CEK PRODUCT SMSCODE
    // ================================

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

    if (operatorId) {
      params.set(
        "operator_id",
        operatorId
      );
    }

    params.set("limit", "10000");
    params.set("page", "1");

    const productResult =
      await smsRequest(
        `/catalog/products?${params.toString()}`
      );

    if (
      !productResult.response.ok ||
      !productResult.data?.success
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            productResult.data?.message ||
            "Gagal mengecek produk SMSCode.",
        },
        { status: 502 }
      );
    }

    const products =
      productResult.data.data || [];

    const product =
      products.find(
        (item) =>
          String(item.id) ===
          String(productId)
      );

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Produk sudah tidak tersedia.",
        },
        { status: 409 }
      );
    }

    if (product.active === false) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Produk sudah tidak aktif.",
        },
        { status: 409 }
      );
    }

    // ================================
    // VALIDASI COUNTRY
    // ================================

    if (
      String(product.country_id) !==
      countryId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Country produk tidak sesuai.",
        },
        { status: 409 }
      );
    }

    // ================================
    // VALIDASI SERVICE
    // ================================

    if (
      String(product.platform_id) !==
      platformId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Service produk tidak sesuai.",
        },
        { status: 409 }
      );
    }

    // ================================
    // VALIDASI OPERATOR
    // ================================

    if (operatorId) {
      const productOperatorId =
        getOperatorId(product);

      if (
        productOperatorId === null ||
        String(productOperatorId) !==
          operatorId
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Operator produk tidak sesuai.",
          },
          { status: 409 }
        );
      }
    }

    // ================================
    // STOCK
    // ================================

    const available =
      Number(
        product.available ??
          product.stock ??
          0
      );

    if (
      Number.isFinite(available) &&
      available <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Stock nomor sedang habis.",
        },
        { status: 409 }
      );
    }

    // ================================
    // HARGA SUPPLIER
    // ================================

    const supplierPrice =
      parsePrice(product.price);

    if (
      !Number.isFinite(
        supplierPrice
      ) ||
      supplierPrice < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Harga supplier SMSCode tidak valid.",
        },
        { status: 502 }
      );
    }

    // ================================
    // MARKUP
    // ================================

    const {
      data: pricing,
      error: pricingError,
    } =
      await supabaseAdmin
        .from("pricing_settings")
        .select("markup")
        .eq("id", 1)
        .maybeSingle();

    if (pricingError) {
      throw pricingError;
    }

    if (!pricing) {
      return NextResponse.json(
        {
          success: false,
          error: "Markup belum dikonfigurasi oleh administrator.",
        },
        { status: 503 }
      );
    }

    const markup = Number(pricing.markup);

    if (
      !Number.isInteger(markup) ||
      markup < 0
    ) {
      throw new Error(
        "Markup pricing tidak valid."
      );
    }

    const sellingPrice =
      Math.round(
        supplierPrice + markup
      );

    // ================================
    // IDEMPOTENCY
    // ================================

    const suppliedIdempotencyKey = body.idempotency_key;
    const idempotencyKey =
      typeof suppliedIdempotencyKey === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(suppliedIdempotencyKey)
        ? suppliedIdempotencyKey
        : crypto.randomUUID();

    // ================================
    // POTONG SALDO
    // ================================

    const {
      data: reservation,
      error: reserveError,
    } =
      await supabaseAdmin.rpc(
        "reserve_purchase",
        {
          p_auth_user_id:
            user.id,

          p_user_id:
            dbUser.id,

          p_telegram_id:
            `web:${user.id}`,

          p_service_id:
            String(
              product.platform_id
            ),

          p_country_id:
            String(
              product.country_id
            ),

          p_product_id:
            String(product.id),

          p_supplier_price:
            Math.round(
              supplierPrice
            ),

          p_price:
            sellingPrice,

          p_idempotency_key:
            idempotencyKey,
        }
      );

    if (reserveError) {
      const message =
        reserveError.message || "";

      if (
        message
          .toLowerCase()
          .includes(
            "saldo tidak cukup"
          )
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Saldo tidak cukup.",
          },
          { status: 400 }
        );
      }

      throw reserveError;
    }

    reservationId =
      reservation?.id;

    if (!reservationId) {
      throw new Error(
        "Reservasi pembelian gagal dibuat."
      );
    }

    // ================================
    // CREATE ORDER SMSCODE
    // ================================

    const supplier =
      await smsRequest(
        "/orders/create",
        {
          method: "POST",

          headers: {
            "Idempotency-Key":
              idempotencyKey,
          },

          body: JSON.stringify({
            product_id:
              productId,

            quantity: 1,
          }),
        }
      );

    // ================================
    // SMSCODE GAGAL
    // ================================

    if (
      !supplier.response.ok ||
      !supplier.data?.success
    ) {
      const refund =
        await supabaseAdmin.rpc(
          "refund_purchase",
          {
            p_order_id:
              reservationId,

            p_reason:
              supplier.data?.message ||
              supplier.data?.error
                ?.message ||
              "SMSCode menolak order.",
          }
        );

      if (refund.error) {
        console.error(
          "REFUND ERROR:",
          refund.error
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "SMSCode menolak order dan refund gagal. Hubungi admin.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error:
            supplier.data?.message ||
            supplier.data?.error
              ?.message ||
            "SMSCode menolak order. Saldo dikembalikan.",
        },
        { status: 409 }
      );
    }

    // ================================
    // AMBIL ORDER SMSCODE
    // ================================

    const supplierOrder =
      supplier.data?.data
        ?.orders?.[0] ||
      supplier.data?.data;

    if (
      !supplierOrder ||
      !supplierOrder.id
    ) {
      const refund =
        await supabaseAdmin.rpc(
          "refund_purchase",
          {
            p_order_id:
              reservationId,

            p_reason:
              "Response SMSCode tidak berisi order ID.",
          }
        );

      if (refund.error) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Response SMSCode tidak valid dan refund gagal. Hubungi admin.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error:
            "Response SMSCode tidak valid. Saldo dikembalikan.",
        },
        { status: 502 }
      );
    }

    supplierOrderCreated = true;

    // ================================
    // SIMPAN ORDER
    // ================================

    const {
      data: updatedOrder,
      error: updateError,
    } =
      await supabaseAdmin
        .from("orders")
        .update({
          supplier_order_id:
            String(
              supplierOrder.id
            ),

          phone_number:
            supplierOrder.phone_number ||
            null,

          otp_code:
            supplierOrder.otp_code ||
            null,

          status:
            supplierOrder.status ||
            "ACTIVE",
        })
        .eq(
          "id",
          reservationId
        )
        .select("*")
        .single();

    /*
     * Supplier sudah membuat nomor.
     * Jangan refund jika database gagal.
     */

    if (updateError) {
      console.error(
        "ORDER UPDATE ERROR:",
        updateError
      );

      return NextResponse.json(
        {
          success: true,

          warning:
            "Nomor berhasil dibeli di SMSCode tetapi database gagal sinkron.",

          order: {
            id: reservationId,

            supplier_order_id:
              String(
                supplierOrder.id
              ),

            phone_number:
              supplierOrder.phone_number ||
              null,

            otp_code:
              supplierOrder.otp_code ||
              null,

            status:
              supplierOrder.status ||
              "ACTIVE",

            price:
              sellingPrice,
          },

          balance:
            Number(
              reservation.balance_after
            ),
        }
      );
    }

    // ================================
    // SUCCESS
    // ================================

    return NextResponse.json({
      success: true,

      order:
        updatedOrder,

      balance:
        Number(
          reservation.balance_after
        ),

      pricing: {
        supplier_price:
          Math.round(
            supplierPrice
          ),

        markup,

        selling_price:
          sellingPrice,
      },
    });
  } catch (error) {
    console.error(
      "REAL PURCHASE ERROR:",
      error
    );

    /*
     * Kalau SMSCode belum membuat nomor,
     * kembalikan saldo.
     */

    if (
      reservationId &&
      !supplierOrderCreated
    ) {
      try {
        await supabaseAdmin.rpc(
          "refund_purchase",
          {
            p_order_id:
              reservationId,

            p_reason:
              error?.message ||
              "Purchase error",
          }
        );
      } catch (refundError) {
        console.error(
          "REFUND ERROR:",
          refundError
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Gagal membuat order.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase =
      await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } =
      await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from("orders")
        .select("*")
        .eq(
          "telegram_id",
          `web:${user.id}`
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      orders: data || [],
    });
  } catch (error) {
    console.error(
      "GET ORDERS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Gagal mengambil pesanan.",
      },
      { status: 500 }
    );
  }
}
