"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Place } from "@/types/database";

function buildGoogleSearchUrl(name: string, address: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(name + " " + address)}`;
}

function buildGoogleMapsUrl(name: string, address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + address)}`;
}

export function PlaceInfoWindow({
  place,
  markerAddress,
}: {
  place: Place;
  markerAddress?: string;
}) {
  const t = useTranslations("PlaceDetail");
  const locale = useLocale();
  const note = locale === "ko" ? (place.note_ko || place.note_en) : place.note_en;
  const displayAddress = markerAddress ?? place.addresses?.[0]?.address ?? "";

  return (
    <div className="flex flex-col gap-1.5 p-1 max-w-[260px] font-sans">
      {/* Photo */}
      {place.image_url && (
        <img
          src={place.image_url}
          alt={place.name}
          className="w-full h-32 object-cover rounded-md"
        />
      )}

      {/* Name */}
      <h3 className="text-sm font-semibold leading-tight">{place.name}</h3>

      {/* Address */}
      <p className="text-[11px] text-gray-600 leading-snug">{displayAddress}</p>

      {/* Multiple locations note */}
      {place.addresses && place.addresses.length > 1 && (
        <p className="text-[10px] text-gray-600">
          {t("plusLocations", { count: place.addresses.length - 1 })}
        </p>
      )}

      {/* Coffee by */}
      {place.coffee_by && (
        <p className="text-[11px] font-semibold text-gray-600">
          {t("coffeeBy", { roaster: place.coffee_by })}
        </p>
      )}

      {/* Tags */}
      {place.tags && place.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {place.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Note */}
      {note && (
        <p className="text-[11px] text-gray-600 italic leading-snug line-clamp-2">
          {note}
        </p>
      )}

      {/* Link buttons */}
      <div className="flex gap-1.5 pt-0.5">
        <a
          href={buildGoogleSearchUrl(place.name, displayAddress)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-md bg-gray-800 px-1.5 py-1 text-center text-[10px] font-medium text-white hover:bg-gray-700 transition-colors"
        >
          {t("google")}
        </a>
        <a
          href={buildGoogleMapsUrl(place.name, displayAddress)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-md bg-gray-800 px-1.5 py-1 text-center text-[10px] font-medium text-white hover:bg-gray-700 transition-colors"
        >
          {t("maps")}
        </a>
        {place.instagram_url && (
          <a
            href={place.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-md bg-gray-800 px-1.5 py-1 text-center text-[10px] font-medium text-white hover:bg-gray-700 transition-colors"
          >
            {t("instagram")}
          </a>
        )}
        {place.reels_url && (
          <a
            href={place.reels_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-md bg-gray-800 px-1.5 py-1 text-center text-[10px] font-medium text-white hover:bg-gray-700 transition-colors"
          >
            {t("reels")}
          </a>
        )}
        {place.tiktok_url && (
          <a
            href={place.tiktok_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-md bg-gray-800 px-1.5 py-1 text-center text-[10px] font-medium text-white hover:bg-gray-700 transition-colors"
          >
            {t("tiktok")}
          </a>
        )}
      </div>
    </div>
  );
}
