import { Button } from "@/components/ui/button";
import { DayAddForm } from "@/components/weekly/day-add-form";
import { DayItemCard } from "@/components/weekly/day-item-card";
import { dateKey, weekdayLabel } from "@/lib/today-list/time";
import { hoursLabel, hoursOn } from "@/lib/today-list/time-entries";
import type { WorkItem } from "@/lib/today-list/types";

export function DayColumn({
  date,
  index,
  isToday,
  items,
  openItems,
  jiraBaseUrl,
  isAddFormOpen,
  onOpenAddForm,
  onCancelAddForm,
  onCreateNew,
  onAddToExisting,
  onToggleComplete,
  onSaveEdit,
  onRemove,
}: {
  date: Date;
  index: number;
  isToday: boolean;
  items: WorkItem[];
  openItems: WorkItem[];
  jiraBaseUrl: string | undefined;
  isAddFormOpen: boolean;
  onOpenAddForm: () => void;
  onCancelAddForm: () => void;
  onCreateNew: (title: string, hours: number) => void;
  onAddToExisting: (id: string, hours: number) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onSaveEdit: (id: string, patch: { title: string; hours: number }) => void;
  onRemove: (id: string) => void;
}) {
  const key = dateKey(date);
  const dayItems = items.filter((item) => hoursOn(item, key) > 0);
  const total = dayItems.reduce((sum, item) => sum + hoursOn(item, key), 0);

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className={`flex items-baseline justify-between gap-1 px-0.5 ${isToday ? "text-primary" : ""}`}>
        <span className="text-xs font-bold">
          {weekdayLabel(index)}{" "}
          <span className="font-normal text-muted-foreground">
            {date.getMonth() + 1}/{date.getDate()}
          </span>
        </span>
        <span className={`text-xs font-bold tabular-nums ${total > 0 ? "" : "text-muted-foreground"}`}>
          {hoursLabel(total)}
        </span>
      </div>

      {dayItems.map((item) => (
        <DayItemCard
          key={item.id}
          item={item}
          dateKey={key}
          jiraBaseUrl={jiraBaseUrl}
          onToggleComplete={onToggleComplete}
          onSaveEdit={onSaveEdit}
          onRemove={onRemove}
        />
      ))}

      {isAddFormOpen ? (
        <DayAddForm
          openItems={openItems}
          onCreateNew={onCreateNew}
          onAddToExisting={onAddToExisting}
          onCancel={onCancelAddForm}
        />
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-dashed text-muted-foreground"
          onClick={onOpenAddForm}
        >
          + 항목·시간 추가
        </Button>
      )}
    </div>
  );
}
