"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Place } from "@/types/database";
import { PlaceInfoWindow } from "./place-info-window";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { CITY_CENTERS } from "@/lib/constants";

type MarkerData = {
  place: Place;
  address: string;
  lat: number;
  lng: number;
  markerId: string; // placeId-addressIndex
};

export function CafeMap() {
  const searchParams = useSearchParams();
  const focusId = searchParams.get("focus");

  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [pinnedMarkerId, setPinnedMarkerId] = useState<string | null>(null);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsLocalhost(window.location.hostname === "localhost");

    const supabase = createClient();
    supabase
      .from("places")
      .select("*")
      .eq("is_public", true)
      .then(({ data }) => {
        if (data) {
          setPlaces(data);
          if (focusId && data.some((p) => p.id === focusId)) {
            setPinnedMarkerId(`${focusId}-0`);
          }
        }
        setLoading(false);
      });
  }, [focusId]);

  const handleFilter = useCallback((filtered: Place[]) => {
    setFilteredPlaces(filtered);
  }, []);

  // Flatten places into individual markers
  const markers: MarkerData[] = useMemo(() => {
    return filteredPlaces.flatMap((place) =>
      (place.addresses ?? []).map((addr, i) => ({
        place,
        address: addr.address,
        lat: addr.latitude,
        lng: addr.longitude,
        markerId: `${place.id}-${i}`,
      }))
    );
  }, [filteredPlaces]);

  const focusedPlace = focusId ? places.find((p) => p.id === focusId) : null;
  const mapCenter = focusedPlace?.addresses?.[0]
    ? { lat: focusedPlace.addresses[0].latitude, lng: focusedPlace.addresses[0].longitude }
    : CITY_CENTERS.melbourne;

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <svg
          className="h-10 w-10 animate-spin text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        key={focusedPlace ? `focus-${focusId}` : "default"}
        defaultCenter={mapCenter}
        defaultZoom={focusedPlace ? 16 : 13}
        mapId="melbourne-cafe-map"
        className="h-full w-full"
        gestureHandling="greedy"
        disableDefaultUI={false}
        onClick={() => setPinnedMarkerId(null)}
      >
        {markers.map((m) => (
          <PlaceMarker
            key={m.markerId}
            markerData={m}
            isActive={m.markerId === pinnedMarkerId}
            onClick={() =>
              setPinnedMarkerId((prev) => (prev === m.markerId ? null : m.markerId))
            }
            onClose={() => setPinnedMarkerId(null)}
          />
        ))}
      </Map>

      {/* Search & Filter toggle button */}
      <button
        onClick={() => setFilterOpen((prev) => !prev)}
        className="absolute top-14 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-lg border bg-background/90 backdrop-blur-sm shadow-lg hover:bg-accent transition-colors"
        aria-label="Toggle filter"
      >
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          {filterOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          )}
        </svg>
      </button>

      {/* Search & Filter overlay (always mounted so filter runs) */}
      <div className={`absolute top-26 left-4 right-4 sm:right-auto sm:w-[380px] z-10 ${filterOpen ? "" : "hidden"}`}>
        <div className="rounded-lg border bg-background/90 backdrop-blur-sm p-3 shadow-lg">
          <SearchFilterBar places={places} onFilter={handleFilter} />
        </div>
      </div>

      {isLocalhost && (
        <Link
          href="/admin"
          className="absolute bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg text-2xl hover:opacity-90 transition-opacity"
        >
          +
        </Link>
      )}
    </APIProvider>
  );
}

function PlaceMarker({
  markerData,
  isActive,
  onClick,
  onClose,
}: {
  markerData: MarkerData;
  isActive: boolean;
  onClick: () => void;
  onClose: () => void;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: markerData.lat, lng: markerData.lng }}
        onClick={handleClick}
        title={markerData.place.name}
      />

      {isActive && marker && (
        <InfoWindow anchor={marker} onClose={onClose} maxWidth={320}>
          <PlaceInfoWindow
            place={markerData.place}
            markerAddress={markerData.address}
          />
        </InfoWindow>
      )}
    </>
  );
}
