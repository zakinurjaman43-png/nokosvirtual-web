import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const countryId = searchParams.get("country_id");
    const platformId = searchParams.get("platform_id");
    const operatorId = searchParams.get("operator_id");

    const params = new URLSearchParams();

    if (countryId) params.set("country_id", countryId);
    if (platformId) params.set("platform_id", platformId);
    if (operatorId) params.set("operator_id", operatorId);

    params.set("limit", "10000");
    params.set("page", "1");

    const response = await fetch(
      `https://api.smscode.gg/v1/catalog/products?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SMSCODE_TOKEN}`,
        },
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
          message: "Gagal mengambil katalog SMSCode",
        },
      },
      { status: 500 }
    );
  }
}
