import { getTranslations } from "next-intl/server";
import { PlaceForm } from "@/components/admin/place-form";

export default async function NewPlacePage() {
  const t = await getTranslations("AdminNew");

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
      <PlaceForm />
    </div>
  );
}
