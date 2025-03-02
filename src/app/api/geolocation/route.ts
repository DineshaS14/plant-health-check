import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city || typeof city !== 'string') {
    return NextResponse.json({ error: "City parameter is missing or invalid" }, { status: 400 });
  }

  const BIGDATACLOUD_BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
  
  try {
    const response = await fetch(`${BIGDATACLOUD_BASE_URL}?localityLanguage=en&city=${encodeURIComponent(city)}`);

    if (!response.ok) {
      throw new Error("Failed to fetch geolocation data");
    }

    const data = await response.json();

    if (!data.city || !data.latitude || !data.longitude) {
      return NextResponse.json({ error: "Invalid geolocation data" }, { status: 400 });
    }

    return NextResponse.json({
      city: data.city,
      country: data.countryName,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
    });
  } catch (error) {
    console.error("Error in geolocation API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
