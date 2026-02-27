import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPlace } from "@/actions/places";
import { PlaceForm } from "@/components/admin/place-form";

export default async function EditPlacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("AdminEdit");
  const place = await getPlace(id);

  if (!place) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
      <PlaceForm place={place} />
    </div>
  );
}
