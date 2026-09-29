import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const countryId = searchParams.get("country_id");
    const platformId = searchParams.get("platform_id");
    const operatorId = searchParams.get("operator_id");

    const productParams = new URLSearchParams();

    if (countryId) productParams.set("country_id", countryId);
    if (platformId) productParams.set("platform_id", platformId);
    if (operatorId) productParams.set("operator_id", operatorId);

    productParams.set("limit", "10000");
    productParams.set("page", "1");

    const headers = {
      Authorization: `Bearer ${process.env.SMSCODE_TOKEN}`,
    };

    const [productsResponse, countriesResponse, servicesResponse] =
      await Promise.all([
        fetch(
          `https://api.smscode.gg/v1/catalog/products?${productParams.toString()}`,
          {
            headers,
            cache: "no-store",
          }
        ),

        fetch("https://api.smscode.gg/v1/catalog/countries", {
          headers,
          cache: "no-store",
        }),

        fetch("https://api.smscode.gg/v1/catalog/services", {
          headers,
          cache: "no-store",
        }),
      ]);

    const productsData = await productsResponse.json();
    const countriesData = await countriesResponse.json();
    const servicesData = await servicesResponse.json();

    if (!productsResponse.ok) {
      return NextResponse.json(productsData, {
        status: productsResponse.status,
      });
    }

    const countries = countriesData.data || [];
    const services = servicesData.data || [];
    const products = productsData.data || [];

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

    const enrichedProducts = products.map((product) => {
      const country = countryMap.get(
        String(product.country_id)
      );

      const service = serviceMap.get(
        String(product.platform_id)
      );

      return {
        ...product,

        country_name: country?.name || `Negara ${product.country_id}`,
        country_code: country?.code || "",
        country_emoji: country?.emoji || "",

        service_name:
          service?.name ||
          `Platform ${product.platform_id}`,

        operator_name:
          product.operator_name ||
          "Semua Operator",
      };
    });

    return NextResponse.json({
      success: true,
      data: enrichedProducts,
      countries,
      services,
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
