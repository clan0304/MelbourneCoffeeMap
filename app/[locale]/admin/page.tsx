import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPlaces } from "@/actions/places";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminPage() {
  const t = await getTranslations("Admin");
  const places = await getPlaces();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("placesCount", { count: places.length })}</h1>
        <Button asChild>
          <Link href="/admin/new">{t("addNew")}</Link>
        </Button>
      </div>

      {places.length === 0 ? (
        <p className="text-muted-foreground">{t("noPlaces")}</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">{t("image")}</TableHead>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("category")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("address")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("tags")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {places.map((place) => (
                <TableRow key={place.id}>
                  <TableCell>
                    {place.image_url ? (
                      <img
                        src={place.image_url}
                        alt={place.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{place.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{place.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[200px] truncate">
                    {place.address}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {place.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {place.tags?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{place.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/${place.id}`}>{t("edit")}</Link>
                      </Button>
                      <DeleteButton id={place.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
