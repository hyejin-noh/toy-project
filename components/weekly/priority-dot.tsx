import { cn } from "@/lib/utils";
import type { Priority } from "@/lib/today-list/types";

const DOT_CLASS: Record<Priority, string> = {
  high: "bg-destructive border-destructive",
  medium: "bg-priority-mid border-priority-mid",
  low: "bg-transparent border-border",
};

export function PriorityDot({ priority }: { priority: Priority }) {
  return (
    <span
      aria-hidden
      className={cn("mt-1.5 size-2 shrink-0 rounded-full border", DOT_CLASS[priority])}
    />
  );
}
