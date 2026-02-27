export type PlaceAddress = {
  address: string;
  latitude: number;
  longitude: number;
};

export type Place = {
  id: string;
  category: string;
  city: string;
  name: string;
  addresses: PlaceAddress[];
  image_url: string | null;
  instagram_url: string | null;
  reels_url: string | null;
  tiktok_url: string | null;
  coffee_by: string | null;
  tags: string[];
  note_en: string | null;
  note_ko: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type PlaceInsert = Omit<Place, "id" | "created_at" | "updated_at">;
export type PlaceUpdate = Partial<PlaceInsert>;
