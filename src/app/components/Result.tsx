'use client'
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Correct import for useSearchParams

interface LocationData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export default function Result() {
  const searchParams = useSearchParams();
  const location = searchParams.get("location");
  const soilType = searchParams.get("soilType");

  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (location) {
      const fetchLocationData = async () => {
        try {
          setIsLoading(true);
          setIsError(false);

          // The fetch URL should be relative to the root, with '/api' prefix for App Router
          const response = await fetch(`/api/geolocation?city=${encodeURIComponent(location as string)}`);
          
          // Check if the response is okay
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch location data: ${response.status} ${errorText}`);
          }

          // Parse the JSON response
          const data = await response.json();
          setLocationData(data);
        } catch (error) {
          setIsError(true);
          console.error("Error fetching location data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchLocationData();
    }
  }, [location]);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-semibold mb-4">Result</h2>

      <div className="bg-white p-4 rounded-lg shadow-md w-96">
        <p><strong>Location:</strong> {location}</p>
        <p><strong>Soil Type:</strong> {soilType}</p>
      </div>

      <div className="mt-6">
        {isError ? (
          <p className="text-red-600">Error fetching location data. Please try again.</p>
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
    </div>
  );
}
