"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { deletePlace } from "@/actions/places";

export function DeleteButton({ id }: { id: string }) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(t("confirmDelete"))) return;

    setLoading(true);
    const result = await deletePlace(id);
    setLoading(false);

    if (result.error) {
      alert(result.error);
      return;
    }

    router.refresh();
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? t("deleting") : t("delete")}
    </Button>
  );
}
