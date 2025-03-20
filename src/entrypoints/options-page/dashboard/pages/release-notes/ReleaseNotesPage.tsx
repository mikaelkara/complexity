import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LuChevronRight, LuChevronLeft, LuLoaderCircle } from "react-icons/lu";

import ChangelogRenderer from "@/components/ChangelogRenderer";
import { Button } from "@/components/ui/button";
import { useVersionPagination } from "@/entrypoints/options-page/dashboard/pages/release-notes/hooks/useVersionPagination";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";

export default function ReleaseNotesPage() {
  const { data: versions } = useQuery({
    ...cplxApiQueries.versions,
  });

  const { currentVersion, hasNext, hasPrev, goToNext, goToPrev } =
    useVersionPagination(versions);

  const {
    data: changelog,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    ...cplxApiQueries.changelog({
      version: currentVersion,
    }),
    enabled: !!currentVersion,
    placeholderData: keepPreviousData,
  });

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <div className="x:flex x:flex-col x:gap-2">
        <h1 className="x:text-2xl x:font-bold">Release Notes</h1>
        <p className="x:text-sm x:text-muted-foreground">
          Stay up to date with the latest changes and features.
        </p>
      </div>
      <div className="x:flex x:items-center x:gap-4">
        {hasPrev && (
          <Button variant="outline" size="sm" onClick={goToPrev}>
            <LuChevronLeft className="x:size-4" />
          </Button>
        )}
        <div className="x:text-2xl x:font-semibold">{currentVersion}</div>
        {hasNext && (
          <Button variant="outline" size="sm" onClick={goToNext}>
            <LuChevronRight className="x:size-4" />
          </Button>
        )}
      </div>
      <div
        className={cn(
          "x:flex x:max-w-screen-xl x:flex-col x:flex-wrap x:gap-4",
          isPlaceholderData && "x:opacity-50",
        )}
      >
        {isLoading && (
          <div className="x:flex x:items-center x:gap-2">
            <LuLoaderCircle className="x:size-4 x:animate-spin" />
            <span>Loading...</span>
          </div>
        )}
        {changelog && <ChangelogRenderer changelog={changelog} />}
      </div>
    </div>
  );
}
