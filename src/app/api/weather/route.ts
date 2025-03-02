import { NextResponse } from "next/server";

// Fetch the access key from the environment variables
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEATHERSTACK_ACCESS_KEY;
const WEATHERSTACK_API = "http://api.weatherstack.com/current";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: "City parameter is required" }, { status: 400 });
  }

  try {
    // Make the API request to WeatherStack
    const response = await fetch(`${WEATHERSTACK_API}?access_key=${ACCESS_KEY}&query=${encodeURIComponent(city)}&units=m`);

    if (!response.ok) {
      throw new Error("Failed to fetch weather data from WeatherStack");
    }

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.info }, { status: 400 });
    }

    // Extract temperature and humidity from the API response
    const temperature = data.current.temperature;
    const humidity = data.current.humidity;
    const weatherDescriptions = data.current.weather_descriptions;
    const weatherIcon = data.current.weather_icons[0];

    // Return the relevant weather data
    return NextResponse.json({
      temperature,
      humidity,
      weatherDescriptions,
      weatherIcon,
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
