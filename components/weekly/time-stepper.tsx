"use client";

import { Button } from "@/components/ui/button";
import { clampStep, hoursLabel } from "@/lib/today-list/time-entries";

export function TimeStepper({
  hours,
  onChange,
  min = 0,
}: {
  hours: number;
  onChange: (hours: number) => void;
  min?: number;
}) {
  return (
    <span className="inline-flex items-center gap-1 border border-border px-1 py-0.5">
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        disabled={hours <= min}
        aria-label="시간 줄이기"
        onClick={() => onChange(Math.max(min, clampStep(hours, -1)))}
      >
        −
      </Button>
      <output className="min-w-10 text-center text-xs font-semibold tabular-nums">
        {hoursLabel(hours)}
      </output>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="시간 늘리기"
        onClick={() => onChange(clampStep(hours, 1))}
      >
        +
      </Button>
    </span>
  );
}
