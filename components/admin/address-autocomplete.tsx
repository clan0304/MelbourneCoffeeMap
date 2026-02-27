"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Input } from "@/components/ui/input";

type AddressAutocompleteProps = {
  defaultValue?: string;
  onPlaceSelect: (place: {
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
};

export function AddressAutocomplete(props: AddressAutocompleteProps) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <AutocompleteInput {...props} />
    </APIProvider>
  );
}

function AutocompleteInput({
  defaultValue,
  onPlaceSelect,
}: AddressAutocompleteProps) {
  const t = useTranslations("PlaceForm");
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLib || !inputRef.current || autocompleteRef.current) return;

    const autocomplete = new placesLib.Autocomplete(inputRef.current, {
      types: ["establishment", "geocode"],
      componentRestrictions: { country: "au" },
      fields: ["formatted_address", "geometry", "name"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry?.location) return;

      const address = place.formatted_address || "";
      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();

      if (inputRef.current) {
        inputRef.current.value = address;
      }

      onPlaceSelect({ address, latitude, longitude });
    });

    autocompleteRef.current = autocomplete;
  }, [placesLib, onPlaceSelect]);

  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder={t("addressPlaceholder")}
      defaultValue={defaultValue}
    />
  );
}
