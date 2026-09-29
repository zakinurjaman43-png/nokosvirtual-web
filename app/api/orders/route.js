import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(
      "https://api.smscode.gg/v1/orders/create",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SMSCODE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: body.product_id,
          quantity: body.quantity || 1,
        }),
        cache: "no-store",
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Gagal membuat order",
        },
      },
      { status: 500 }
    );
  }
}
