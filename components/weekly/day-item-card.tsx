"use client";

import { useState } from "react";

import { IssueBadge } from "@/components/today-list/issue-badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { PriorityDot } from "@/components/weekly/priority-dot";
import { TimeStepper } from "@/components/weekly/time-stepper";
import { hoursLabel, hoursOn } from "@/lib/today-list/time-entries";
import type { WorkItem } from "@/lib/today-list/types";

export function DayItemCard({
  item,
  dateKey,
  jiraBaseUrl,
  onToggleComplete,
  onSaveEdit,
  onRemove,
}: {
  item: WorkItem;
  dateKey: string;
  jiraBaseUrl: string | undefined;
  onToggleComplete: (id: string, completed: boolean) => void;
  onSaveEdit: (id: string, patch: { title: string; hours: number }) => void;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const completed = item.completedAt !== null;
  const hours = hoursOn(item, dateKey);

  return (
    <div className="flex flex-col gap-1.5 border border-border p-2">
      <div className="flex items-start gap-1.5">
        <Checkbox
          checked={completed}
          onCheckedChange={(checked) => onToggleComplete(item.id, checked === true)}
          aria-label={completed ? "완료 되돌리기" : "완료 표시"}
          className="mt-0.5"
        />
        {!completed && <PriorityDot priority={item.priority} />}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            className={`line-clamp-2 flex-1 text-left text-xs leading-snug ${completed ? "text-muted-foreground line-through" : ""}`}
          >
            {item.title}
          </PopoverTrigger>
          <PopoverContent align="start" className="w-64">
            {open && (
              <DayItemEditForm
                item={item}
                dateKey={dateKey}
                onSave={(patch) => {
                  onSaveEdit(item.id, patch);
                  setOpen(false);
                }}
                onDelete={() => {
                  onRemove(item.id);
                  setOpen(false);
                }}
                onCancel={() => setOpen(false)}
              />
            )}
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-wrap items-center gap-1 pl-[1.7rem] text-xs">
        <IssueBadge item={item} jiraBaseUrl={jiraBaseUrl} />
        <span className="ml-auto font-semibold tabular-nums">{hoursLabel(hours)}</span>
      </div>
    </div>
  );
}

function DayItemEditForm({
  item,
  dateKey,
  onSave,
  onDelete,
  onCancel,
}: {
  item: WorkItem;
  dateKey: string;
  onSave: (patch: { title: string; hours: number }) => void;
  onDelete: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [hours, setHours] = useState(hoursOn(item, dateKey));

  return (
    <div className="flex flex-col gap-2.5">
      <Textarea
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="min-h-14"
        aria-label="할 일 수정"
      />
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">이 날짜 소요시간</span>
        <TimeStepper hours={hours} onChange={setHours} />
      </div>
      <div className="flex items-center gap-1.5">
        <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={onDelete}>
          삭제
        </Button>
        <span className="flex-1" />
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          취소
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={!title.trim()}
          onClick={() => onSave({ title: title.trim(), hours })}
        >
          저장
        </Button>
      </div>
    </div>
  );
}
