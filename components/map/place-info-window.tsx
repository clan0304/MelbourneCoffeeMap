"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Place } from "@/types/database";

function buildGoogleSearchUrl(name: string, address: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(name + " " + address)}`;
}

function buildGoogleMapsUrl(name: string, address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + address)}`;
}

export function PlaceInfoWindow({ place }: { place: Place }) {
  const t = useTranslations("PlaceDetail");
  const locale = useLocale();
  const note = locale === "ko" ? (place.note_ko || place.note_en) : place.note_en;

  return (
    <div className="flex flex-col gap-2 p-1 max-w-[280px] font-sans">
      {/* Photo */}
      {place.image_url && (
        <img
          src={place.image_url}
          alt={place.name}
          className="w-full h-40 object-cover rounded-md"
        />
      )}

      {/* Name */}
      <h3 className="text-base font-semibold leading-tight">{place.name}</h3>

      {/* Address */}
      <p className="text-xs text-gray-500 leading-snug">{place.address}</p>

      {/* Coffee by */}
      {place.coffee_by && (
        <p className="text-xs text-gray-500">
          {t("coffeeBy", { roaster: place.coffee_by })}
        </p>
      )}

      {/* Tags */}
      {place.tags && place.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {place.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Note */}
      {note && (
        <p className="text-xs text-gray-600 italic leading-snug">
          {note}
        </p>
      )}

      {/* Link buttons */}
      <div className="flex gap-2 pt-1">
        <a
          href={buildGoogleSearchUrl(place.name, place.address)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-md bg-gray-100 px-2 py-1.5 text-center text-[11px] font-medium text-gray-700 hover:bg-gray-200 transition-colors"
        >
          {t("google")}
        </a>
        <a
          href={buildGoogleMapsUrl(place.name, place.address)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-md bg-gray-100 px-2 py-1.5 text-center text-[11px] font-medium text-gray-700 hover:bg-gray-200 transition-colors"
        >
          {t("maps")}
        </a>
        {place.instagram_url && (
          <a
            href={place.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-md bg-gray-100 px-2 py-1.5 text-center text-[11px] font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            {t("instagram")}
          </a>
        )}
        {place.reels_url && (
          <a
            href={place.reels_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-md bg-gray-100 px-2 py-1.5 text-center text-[11px] font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            {t("reels")}
          </a>
        )}
        {place.tiktok_url && (
          <a
            href={place.tiktok_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-md bg-gray-100 px-2 py-1.5 text-center text-[11px] font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            {t("tiktok")}
          </a>
        )}
      </div>
    </div>
  );
}
