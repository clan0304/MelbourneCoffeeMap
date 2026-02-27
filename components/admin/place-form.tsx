"use client";

import { useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddressAutocomplete } from "./address-autocomplete";
import { createPlace, updatePlace } from "@/actions/places";
import { COFFEE_ROASTERS, SUGGESTED_TAGS, CITIES, CITY_LABELS, type City } from "@/lib/constants";
import type { Place, PlaceAddress } from "@/types/database";

type PlaceFormProps = {
  place?: Place;
};

const emptyAddress = (): PlaceAddress => ({
  address: "",
  latitude: 0,
  longitude: 0,
});

export function PlaceForm({ place }: PlaceFormProps) {
  const t = useTranslations("PlaceForm");
  const tErrors = useTranslations("Errors");
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<PlaceAddress[]>(
    place?.addresses?.length ? place.addresses : [emptyAddress()]
  );
  const [city, setCity] = useState<City>((place?.city as City) ?? "melbourne");
  const [category, setCategory] = useState(place?.category ?? "cafe");
  const [coffeeBy, setCoffeeBy] = useState(place?.coffee_by ?? "none");
  const [tags, setTags] = useState<string[]>(place?.tags ?? []);
  const [imagePreview, setImagePreview] = useState<string | null>(
    place?.image_url ?? null
  );

  const handlePlaceSelect = useCallback(
    (index: number, selected: { address: string; latitude: number; longitude: number }) => {
      setAddresses((prev) => {
        const next = [...prev];
        next[index] = selected;
        return next;
      });
    },
    []
  );

  const addAddress = () => {
    setAddresses((prev) => [...prev, emptyAddress()]);
  };

  const removeAddress = (index: number) => {
    if (addresses.length <= 1) return;
    setAddresses((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const validAddresses = addresses.filter(
      (a) => a.address && a.latitude && a.longitude
    );
    if (validAddresses.length === 0) {
      setError("nameAddressRequired");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("addresses", JSON.stringify(validAddresses));
    formData.set("city", city);
    formData.set("category", category);
    formData.set("coffee_by", coffeeBy === "none" ? "" : coffeeBy);
    formData.set("tags", tags.join(","));

    const result = place
      ? await updatePlace(place.id, formData)
      : await createPlace(formData);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  const displayError = error
    ? tErrors.has(error) ? tErrors(error) : error
    : null;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {displayError && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {displayError}
        </div>
      )}

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">{t("name")} *</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={place?.name}
          placeholder={t("namePlaceholder")}
        />
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label>{t("city")}</Label>
        <Select value={city} onValueChange={(v) => setCity(v as City)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CITIES.map((c) => (
              <SelectItem key={c} value={c}>
                {CITY_LABELS[c]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Addresses (multiple) */}
      <div className="space-y-3">
        <Label>{t("address")} *</Label>
        {addresses.map((addr, index) => (
          <div key={index} className="space-y-1 rounded-md border p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {t("location", { n: index + 1 })}
              </span>
              {addresses.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-destructive hover:text-destructive"
                  onClick={() => removeAddress(index)}
                >
                  {t("removeLocation")}
                </Button>
              )}
            </div>
            <AddressAutocomplete
              defaultValue={addr.address}
              onPlaceSelect={(selected) => handlePlaceSelect(index, selected)}
            />
            {addr.latitude !== 0 && addr.longitude !== 0 && (
              <p className="text-xs text-muted-foreground">
                {t("coordinates", {
                  lat: addr.latitude.toString(),
                  lng: addr.longitude.toString(),
                })}
              </p>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addAddress}
          className="text-xs"
        >
          {t("addLocation")}
        </Button>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>{t("category")}</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cafe">{t("categoryCafe")}</SelectItem>
            <SelectItem value="restaurant">{t("categoryRestaurant")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reels URL */}
      <div className="space-y-2">
        <Label htmlFor="reels_url">{t("reelsUrl")}</Label>
        <Input
          id="reels_url"
          name="reels_url"
          type="url"
          defaultValue={place?.reels_url ?? ""}
          placeholder={t("reelsPlaceholder")}
        />
      </div>

      {/* TikTok URL */}
      <div className="space-y-2">
        <Label htmlFor="tiktok_url">{t("tiktokUrl")}</Label>
        <Input
          id="tiktok_url"
          name="tiktok_url"
          type="url"
          defaultValue={place?.tiktok_url ?? ""}
          placeholder={t("tiktokPlaceholder")}
        />
      </div>

      {/* Coffee by */}
      <div className="space-y-2">
        <Label>{t("coffeeBy")}</Label>
        <Select value={coffeeBy} onValueChange={setCoffeeBy}>
          <SelectTrigger>
            <SelectValue placeholder={t("coffeeByPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">—</SelectItem>
            {COFFEE_ROASTERS.map((roaster) => (
              <SelectItem key={roaster} value={roaster}>
                {roaster}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Image */}
      <div className="space-y-2">
        <Label htmlFor="image">{t("photo")}</Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 h-40 w-auto rounded-md object-cover"
          />
        )}
      </div>

      {/* Instagram URL */}
      <div className="space-y-2">
        <Label htmlFor="instagram_url">{t("instagramUrl")}</Label>
        <Input
          id="instagram_url"
          name="instagram_url"
          type="url"
          defaultValue={place?.instagram_url ?? ""}
          placeholder={t("instagramPlaceholder")}
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>{t("tags")}</Label>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                tags.includes(tag)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-accent"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Note (English) */}
      <div className="space-y-2">
        <Label htmlFor="note_en">{t("noteEn")}</Label>
        <Textarea
          id="note_en"
          name="note_en"
          defaultValue={place?.note_en ?? ""}
          placeholder={t("notePlaceholderEn")}
          rows={3}
        />
      </div>

      {/* Note (Korean) */}
      <div className="space-y-2">
        <Label htmlFor="note_ko">{t("noteKo")}</Label>
        <Textarea
          id="note_ko"
          name="note_ko"
          defaultValue={place?.note_ko ?? ""}
          placeholder={t("notePlaceholderKo")}
          rows={3}
        />
      </div>

      {/* Hidden fields */}
      <input type="hidden" name="city" value={city} />
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="coffee_by" value={coffeeBy === "none" ? "" : coffeeBy} />
      <input type="hidden" name="tags" value={tags.join(",")} />

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? t("saving") : place ? t("update") : t("create")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin")}
        >
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}
