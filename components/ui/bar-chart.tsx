"use client";

import { useState } from "react";
import { cn } from "cn";

type BarChartDatum = {
  label: string;
  value: number;
};

type BarChartProps = {
  title: string;
  data: BarChartDatum[];
  className?: string;
};

const CHART_HEIGHT = 200;
const BAR_MAX_WIDTH = 24;

function niceMax(value: number) {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return step * magnitude;
}

export function BarChart({ title, data, className }: BarChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const max = niceMax(Math.max(...data.map((d) => d.value)));
  const ticks = [0, max * 0.25, max * 0.5, max * 0.75, max];

  return (
    <div className={cn("w-full", className)}>
      <p className="mb-4 text-sm font-medium text-foreground">{title}</p>
      <div className="flex gap-3">
        <div
          className="flex flex-col justify-between text-xs text-muted-foreground"
          style={{ height: CHART_HEIGHT }}
        >
          {[...ticks].reverse().map((tick) => (
            <span key={tick} className="tabular-nums">
              {Math.round(tick).toLocaleString()}
            </span>
          ))}
        </div>
        <div
          className="relative flex flex-1 items-end justify-between gap-2 border-l border-border"
          style={{ height: CHART_HEIGHT }}
        >
          {ticks.map((tick) => (
            <div
              key={tick}
              className="absolute left-0 right-0 border-t border-border"
              style={{ bottom: `${(tick / max) * 100}%` }}
              aria-hidden
            />
          ))}
          {data.map((d, i) => {
            const heightPct = Math.max((d.value / max) * 100, 2);
            const isActive = activeIndex === i;
            return (
              <div
                key={d.label}
                className="relative z-10 flex h-full flex-1 flex-col items-center justify-end"
              >
                {isActive && (
                  <div
                    role="tooltip"
                    className="absolute -top-9 z-20 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs shadow-sm"
                  >
                    <span className="font-medium tabular-nums text-popover-foreground">
                      {d.value.toLocaleString()}
                    </span>{" "}
                    <span className="text-muted-foreground">{d.label}</span>
                  </div>
                )}
                <button
                  type="button"
                  aria-label={`${d.label}: ${d.value.toLocaleString()}`}
                  className={cn(
                    "rounded-t-[4px] bg-primary outline-none transition-colors",
                    isActive && "bg-primary/80"
                  )}
                  style={{
                    height: `${heightPct}%`,
                    width: BAR_MAX_WIDTH,
                  }}
                  onPointerEnter={() => setActiveIndex(i)}
                  onPointerLeave={() => setActiveIndex(null)}
                  onFocus={() => setActiveIndex(i)}
                  onBlur={() => setActiveIndex(null)}
                />
                <span className="mt-2 text-xs text-muted-foreground">{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
