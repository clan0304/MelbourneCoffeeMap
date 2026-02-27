"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Place } from "@/types/database";
import { PlaceCard } from "@/components/place-card";
import { PlaceDetailModal } from "@/components/place-detail-modal";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SearchFilterBar } from "@/components/search-filter-bar";

export default function Home() {
  const t = useTranslations("Home");
  const tSearch = useTranslations("Search");
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsLocalhost(window.location.hostname === "localhost");

    const supabase = createClient();
    supabase
      .from("places")
      .select("*")
      .eq("is_public", true)
      .then(({ data }) => {
        if (data) setPlaces(data);
        setLoading(false);
      });
  }, []);

  const handleFilter = useCallback((filtered: Place[]) => {
    setFilteredPlaces(filtered);
  }, []);

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">{t("title")}</h1>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link
              href="/map"
              className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              {t("viewMap")}
            </Link>
            {isLocalhost && (
              <Link
                href="/admin"
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {t("admin")}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Search & Filter */}
      <div className="mx-auto max-w-5xl px-4 pt-4">
        <SearchFilterBar places={places} onFilter={handleFilter} />
      </div>

      {/* Card Grid */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <svg
              className="h-8 w-8 animate-spin text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : filteredPlaces.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">
            {tSearch("noResults")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {filteredPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onClick={() => setSelectedPlace(place)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <PlaceDetailModal
        place={selectedPlace}
        open={!!selectedPlace}
        onOpenChange={(open) => {
          if (!open) setSelectedPlace(null);
        }}
      />
    </div>
  );
}
