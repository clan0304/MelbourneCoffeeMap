"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Place, PlaceAddress } from "@/types/database";

function parseAddresses(raw: string): PlaceAddress[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    for (const addr of parsed) {
      if (
        typeof addr.address !== "string" ||
        !addr.address ||
        typeof addr.latitude !== "number" ||
        isNaN(addr.latitude) ||
        typeof addr.longitude !== "number" ||
        isNaN(addr.longitude)
      ) {
        return null;
      }
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function getPlaces(): Promise<Place[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPlace(id: string): Promise<Place | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function createPlace(formData: FormData): Promise<{ error?: string }> {
  const supabase = createAdminClient();

  const name = formData.get("name") as string;
  const addressesRaw = formData.get("addresses") as string;
  const addresses = parseAddresses(addressesRaw);
  const city = (formData.get("city") as string) || "melbourne";
  const category = (formData.get("category") as string) || "cafe";
  const instagram_url = (formData.get("instagram_url") as string) || null;
  const reels_url = (formData.get("reels_url") as string) || null;
  const tiktok_url = (formData.get("tiktok_url") as string) || null;
  const coffee_by = (formData.get("coffee_by") as string) || null;
  const tagsRaw = formData.get("tags") as string;
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const note_en = (formData.get("note_en") as string) || null;
  const note_ko = (formData.get("note_ko") as string) || null;

  if (!name || !addresses) {
    return { error: "nameAddressRequired" };
  }

  // Handle image upload
  let image_url: string | null = null;
  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("places")
      .upload(fileName, imageFile);

    if (uploadError) {
      return { error: `imageUploadFailed` };
    }

    const { data: urlData } = supabase.storage
      .from("places")
      .getPublicUrl(fileName);
    image_url = urlData.publicUrl;
  }

  const { error } = await supabase.from("places").insert({
    name,
    addresses,
    city,
    category,
    instagram_url,
    reels_url,
    tiktok_url,
    coffee_by,
    tags,
    note_en,
    note_ko,
    image_url,
    is_public: true,
  });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return {};
}

export async function updatePlace(id: string, formData: FormData): Promise<{ error?: string }> {
  const supabase = createAdminClient();

  const name = formData.get("name") as string;
  const addressesRaw = formData.get("addresses") as string;
  const addresses = parseAddresses(addressesRaw);
  const city = (formData.get("city") as string) || "melbourne";
  const category = (formData.get("category") as string) || "cafe";
  const instagram_url = (formData.get("instagram_url") as string) || null;
  const reels_url = (formData.get("reels_url") as string) || null;
  const tiktok_url = (formData.get("tiktok_url") as string) || null;
  const coffee_by = (formData.get("coffee_by") as string) || null;
  const tagsRaw = formData.get("tags") as string;
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const note_en = (formData.get("note_en") as string) || null;
  const note_ko = (formData.get("note_ko") as string) || null;

  if (!name || !addresses) {
    return { error: "nameAddressRequired" };
  }

  // Handle image upload (only if new image provided)
  let image_url: string | undefined;
  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("places")
      .upload(fileName, imageFile);

    if (uploadError) {
      return { error: `imageUploadFailed` };
    }

    const { data: urlData } = supabase.storage
      .from("places")
      .getPublicUrl(fileName);
    image_url = urlData.publicUrl;
  }

  const updateData: Record<string, unknown> = {
    name,
    addresses,
    city,
    category,
    instagram_url,
    reels_url,
    tiktok_url,
    coffee_by,
    tags,
    note_en,
    note_ko,
    updated_at: new Date().toISOString(),
  };

  if (image_url !== undefined) {
    updateData.image_url = image_url;
  }

  const { error } = await supabase
    .from("places")
    .update(updateData)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return {};
}

export async function deletePlace(id: string): Promise<{ error?: string }> {
  const supabase = createAdminClient();

  const { error } = await supabase.from("places").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return {};
}
