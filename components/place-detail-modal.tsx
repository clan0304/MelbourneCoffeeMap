"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Place } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

function buildGoogleSearchUrl(name: string, address: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(name + " " + address)}`;
}

function buildGoogleMapsUrl(name: string, address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + address)}`;
}

export function PlaceDetailModal({
  place,
  open,
  onOpenChange,
}: {
  place: Place | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("PlaceDetail");
  const locale = useLocale();

  if (!place) return null;

  const note = locale === "ko" ? (place.note_ko || place.note_en) : place.note_en;
  const primaryAddress = place.addresses?.[0]?.address;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto p-0 gap-0 sm:max-w-md">
        {/* Image */}
        {place.image_url && (
          <div className="relative aspect-[16/9] sm:aspect-[4/3] w-full">
            <Image
              src={place.image_url}
              alt={place.name}
              fill
              className="object-cover rounded-t-lg"
              sizes="(max-width: 640px) 100vw, 448px"
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5 p-3 sm:gap-3 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-sm sm:text-lg">{place.name}</DialogTitle>
            <DialogDescription className="text-[10px] sm:text-sm">{primaryAddress}</DialogDescription>
          </DialogHeader>

          {/* Category */}
          <Badge variant="outline" className="w-fit capitalize text-[9px] sm:text-xs px-1.5 py-0">
            {place.category}
          </Badge>

          {/* All addresses */}
          {place.addresses && place.addresses.length > 1 && (
            <div className="space-y-0.5">
              <p className="text-[9px] sm:text-xs font-medium text-muted-foreground">
                {t("allLocations")}
              </p>
              {place.addresses.map((addr, i) => (
                <div key={i} className="flex items-center gap-1 text-[10px] sm:text-sm">
                  <span className="shrink-0 text-muted-foreground">{i + 1}.</span>
                  <a
                    href={buildGoogleMapsUrl(place.name, addr.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate"
                  >
                    {addr.address}
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Coffee by */}
          {place.coffee_by && (
            <p className="text-[11px] sm:text-sm font-semibold text-muted-foreground">
              {t("coffeeBy", { roaster: place.coffee_by })}
            </p>
          )}

          {/* Tags */}
          {place.tags && place.tags.length > 0 && (
            <div className="flex flex-wrap gap-0.5 sm:gap-1">
              {place.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[9px] sm:text-xs px-1.5 py-0 sm:px-2 sm:py-0.5">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Note */}
          {note && (
            <p className="text-[11px] sm:text-sm text-muted-foreground italic leading-snug">
              {note}
            </p>
          )}

          {/* Links */}
          <div className="flex gap-1 sm:gap-2 pt-0.5">
            <a
              href={buildGoogleSearchUrl(place.name, primaryAddress ?? "")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-md bg-primary px-1.5 py-1 sm:px-3 sm:py-2 text-center text-[10px] sm:text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t("google")}
            </a>
            <a
              href={buildGoogleMapsUrl(place.name, primaryAddress ?? "")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-md bg-primary px-1.5 py-1 sm:px-3 sm:py-2 text-center text-[10px] sm:text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t("maps")}
            </a>
            {place.instagram_url && (
              <a
                href={place.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-md bg-primary px-1.5 py-1 sm:px-3 sm:py-2 text-center text-[10px] sm:text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {t("instagram")}
              </a>
            )}
            {place.reels_url && (
              <a
                href={place.reels_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-md bg-primary px-1.5 py-1 sm:px-3 sm:py-2 text-center text-[10px] sm:text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {t("reels")}
              </a>
            )}
            {place.tiktok_url && (
              <a
                href={place.tiktok_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-md bg-primary px-1.5 py-1 sm:px-3 sm:py-2 text-center text-[10px] sm:text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {t("tiktok")}
              </a>
            )}
          </div>

          {/* View on Map */}
          <Link
            href={`/map?focus=${place.id}`}
            className="rounded-md bg-primary px-1.5 py-1 sm:px-3 sm:py-2 text-center text-[10px] sm:text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {t("viewOnMap")}
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
