import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatWeekRange } from "@/lib/today-list/time";

export function WeekNav({
  weekStart,
  onPrev,
  onNext,
  onToday,
}: {
  weekStart: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="outline" size="icon-sm" aria-label="이전 주" onClick={onPrev}>
        <ChevronLeftIcon />
      </Button>
      <span className="mr-auto text-sm font-semibold">{formatWeekRange(weekStart)}</span>
      <Button type="button" variant="outline" size="sm" onClick={onToday}>
        이번 주
      </Button>
      <Button type="button" variant="outline" size="icon-sm" aria-label="다음 주" onClick={onNext}>
        <ChevronRightIcon />
      </Button>
    </div>
  );
}
