import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Script from "next/script";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const host = (await headers()).get("host") || "";

  if (!host.startsWith("localhost")) {
    notFound();
  }

  const t = await getTranslations("Admin");

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="beforeInteractive"
      />
      <nav className="border-b">
        <div className="container mx-auto flex h-14 items-center gap-6 px-4">
          <Link href="/admin" className="font-semibold">
            {t("title")}
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("viewSite")}
          </Link>
          <div className="ml-auto">
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}
