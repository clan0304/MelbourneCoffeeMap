import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CafeMap } from "@/components/map/cafe-map";
import { LanguageSwitcher } from "@/components/language-switcher";

export default async function MapPage() {
  const t = await getTranslations("Map");

  return (
    <div className="relative h-dvh w-full">
      <CafeMap />

      {/* Back to list */}
      <Link
        href="/"
        className="absolute top-4 left-4 z-10 rounded-md bg-background/90 backdrop-blur px-3 py-2 text-sm font-medium shadow-md hover:bg-background transition-colors"
      >
        &larr; {t("backToList")}
      </Link>

      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
    </div>
  );
}
