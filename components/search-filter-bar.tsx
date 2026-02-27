"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUGGESTED_TAGS, COFFEE_ROASTERS } from "@/lib/constants";
import type { Place } from "@/types/database";

type SearchFilterBarProps = {
  places: Place[];
  onFilter: (filtered: Place[]) => void;
  className?: string;
};

export function SearchFilterBar({
  places,
  onFilter,
  className = "",
}: SearchFilterBarProps) {
  const t = useTranslations("Search");

  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [coffeeBy, setCoffeeBy] = useState("all");
  const [category, setCategory] = useState("all");

  const filterPlaces = useCallback(() => {
    let filtered = places;

    // Search by name + address
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
      );
    }

    // Filter by tags (OR — any selected tag matches)
    if (selectedTags.length > 0) {
      filtered = filtered.filter((p) =>
        selectedTags.some((tag) => p.tags?.includes(tag))
      );
    }

    // Filter by coffee_by
    if (coffeeBy !== "all") {
      filtered = filtered.filter((p) => p.coffee_by === coffeeBy);
    }

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }

    onFilter(filtered);
  }, [places, query, selectedTags, coffeeBy, category, onFilter]);

  useEffect(() => {
    filterPlaces();
  }, [filterPlaces]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const hasActiveFilters =
    query.trim() !== "" ||
    selectedTags.length > 0 ||
    coffeeBy !== "all" ||
    category !== "all";

  const clearAll = () => {
    setQuery("");
    setSelectedTags([]);
    setCoffeeBy("all");
    setCategory("all");
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search input */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("placeholder")}
          className="pl-9"
        />
      </div>

      {/* Dropdowns row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Tags multi-select dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-8 text-xs gap-1">
              {t("tags")}
              {selectedTags.length > 0 && (
                <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {selectedTags.length}
                </span>
              )}
              <svg
                className="h-3 w-3 opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-2" align="start">
            <div className="space-y-1">
              {SUGGESTED_TAGS.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent cursor-pointer"
                >
                  <Checkbox
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => toggleTag(tag)}
                  />
                  {tag}
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Coffee by */}
        <Select value={coffeeBy} onValueChange={setCoffeeBy}>
          <SelectTrigger className="w-[160px] h-8 text-xs">
            <SelectValue placeholder={t("coffeeBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("coffeeBy")}: {t("all")}</SelectItem>
            {COFFEE_ROASTERS.map((roaster) => (
              <SelectItem key={roaster} value={roaster}>
                {roaster}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category */}
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[150px] h-8 text-xs">
            <SelectValue placeholder={t("category")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("category")}: {t("all")}</SelectItem>
            <SelectItem value="cafe">{t("cafe")}</SelectItem>
            <SelectItem value="restaurant">{t("restaurant")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-8 text-xs text-muted-foreground"
          >
            {t("clear")}
          </Button>
        )}
      </div>
    </div>
  );
}
