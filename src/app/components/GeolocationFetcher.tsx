// GeolocationFetcher.tsx
import { useState, useEffect } from "react";

const BIGDATACLOUD_BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

interface GeolocationFetcherProps {
  city: string;
}

export default function GeolocationFetcher({ city }: GeolocationFetcherProps) {
  const [locationData, setLocationData] = useState<{
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
  } | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!city) return;

    const resolveGeolocation = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const response = await fetch(
          `${BIGDATACLOUD_BASE_URL}?localityLanguage=en&city=${encodeURIComponent(city)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch geolocation data");
        }

        const data = await response.json();
        if (!data.city || !data.latitude || !data.longitude) {
          throw new Error("Invalid geolocation data");
        }

        setLocationData({
          city: data.city,
          country: data.countryName,
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone,
        });

        setIsLoading(false);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
        alert(error instanceof Error ? error.message : "An error occurred");
      }
    };

    resolveGeolocation();
  }, [city]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className="text-red-600">Error fetching location</p>
      ) : locationData ? (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p><strong>City:</strong> {locationData.city}</p>
          <p><strong>Country:</strong> {locationData.country}</p>
          <p><strong>Latitude:</strong> {locationData.latitude}</p>
          <p><strong>Longitude:</strong> {locationData.longitude}</p>
          <p><strong>Timezone:</strong> {locationData.timezone}</p>
        </div>
      ) : (
        <p>No location data available</p>
      )}
    </div>
  );
}
