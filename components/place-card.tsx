"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Place } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PlaceCard({
  place,
  onClick,
}: {
  place: Place;
  onClick: () => void;
}) {
  const t = useTranslations("PlaceDetail");
  const primaryAddress = place.addresses?.[0]?.address;
  const extraLocations = (place.addresses?.length ?? 0) - 1;

  return (
    <Card
      className="cursor-pointer overflow-hidden py-0 transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-[3/2] w-full bg-muted">
        {place.image_url ? (
          <Image
            src={place.image_url}
            alt={place.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-3xl">
            ☕
          </div>
        )}
      </div>

      {/* Info */}
      <CardContent className="flex flex-col gap-2 p-4">
        <h3 className="text-sm font-semibold leading-tight truncate">
          {place.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <p className="text-xs text-muted-foreground truncate">
            {primaryAddress}
          </p>
          {extraLocations > 0 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
              {t("plusLocations", { count: extraLocations })}
            </Badge>
          )}
        </div>
        {place.tags && place.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {place.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
