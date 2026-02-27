"use client";

import { useEffect, useState, useCallback } from "react";
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

const MELBOURNE_CENTER = { lat: -37.8136, lng: 144.9631 };

export function CafeMap() {
  const searchParams = useSearchParams();
  const focusId = searchParams.get("focus");

  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

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
            setPinnedId(focusId);
          }
        }
      });
  }, [focusId]);

  const handleFilter = useCallback((filtered: Place[]) => {
    setFilteredPlaces(filtered);
  }, []);

  const activeId = pinnedId ?? hoveredId;
  const focusedPlace = focusId ? places.find((p) => p.id === focusId) : null;
  const mapCenter = focusedPlace
    ? { lat: focusedPlace.latitude, lng: focusedPlace.longitude }
    : MELBOURNE_CENTER;

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        defaultCenter={mapCenter}
        defaultZoom={focusedPlace ? 16 : 13}
        mapId="melbourne-cafe-map"
        className="h-full w-full"
        gestureHandling="greedy"
        disableDefaultUI={false}
        onClick={() => setPinnedId(null)}
      >
        {filteredPlaces.map((place) => (
          <PlaceMarker
            key={place.id}
            place={place}
            isActive={place.id === activeId}
            onHover={() => setHoveredId(place.id)}
            onHoverEnd={() => setHoveredId(null)}
            onClick={() =>
              setPinnedId((prev) => (prev === place.id ? null : place.id))
            }
            onClose={() => setPinnedId(null)}
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

      {/* Search & Filter overlay */}
      {filterOpen && (
        <div className="absolute top-26 left-4 right-4 sm:right-auto sm:w-[380px] z-10">
          <div className="rounded-lg border bg-background/90 backdrop-blur-sm p-3 shadow-lg">
            <SearchFilterBar places={places} onFilter={handleFilter} />
          </div>
        </div>
      )}

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
  place,
  isActive,
  onHover,
  onHoverEnd,
  onClick,
  onClose,
}: {
  place: Place;
  isActive: boolean;
  onHover: () => void;
  onHoverEnd: () => void;
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
        position={{ lat: place.latitude, lng: place.longitude }}
        onClick={handleClick}
        onMouseEnter={onHover}
        onMouseLeave={onHoverEnd}
        title={place.name}
      />

      {isActive && marker && (
        <InfoWindow anchor={marker} onClose={onClose} maxWidth={320}>
          <PlaceInfoWindow place={place} />
        </InfoWindow>
      )}
    </>
  );
}
