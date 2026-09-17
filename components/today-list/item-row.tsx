"use client";

import { useState } from "react";
import { PencilIcon, Trash2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { IssueBadge } from "@/components/today-list/issue-badge";
import { TimeStepper } from "@/components/weekly/time-stepper";
import { daysOpen, nextPriority } from "@/lib/today-list/ordering";
import { dateKey } from "@/lib/today-list/time";
import { hoursOn, totalHoursForDates } from "@/lib/today-list/time-entries";
import type { Priority, WorkItem } from "@/lib/today-list/types";

const PRIORITY_LABEL: Record<Priority, string> = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

const PRIORITY_PILL_CLASS: Record<Priority, string> = {
  high: "border-destructive/40 bg-destructive/10 text-destructive",
  medium: "border-priority-mid/40 bg-priority-mid/10 text-priority-mid",
  low: "border-border text-muted-foreground",
};

export function ItemRow({
  item,
  today,
  thisWeekKeys,
  jiraBaseUrl,
  timeOpen,
  onOpenTime,
  onCloseTime,
  onToggleComplete,
  onCyclePriority,
  onUpdate,
  onRemove,
  onTimeChange,
}: {
  item: WorkItem;
  today: Date;
  thisWeekKeys: string[];
  jiraBaseUrl: string | undefined;
  timeOpen: boolean;
  onOpenTime: (id: string) => void;
  onCloseTime: () => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onCyclePriority: (id: string, next: Priority) => void;
  onUpdate: (id: string, patch: { title: string; priority: Priority }) => void;
  onRemove: (id: string) => void;
  onTimeChange: (id: string, hours: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(item.title);
  const [draftPriority, setDraftPriority] = useState<Priority>(item.priority);

  const completed = item.completedAt !== null;
  const opened = daysOpen(item, today);
  const todayKey = dateKey(today);
  const todayHours = hoursOn(item, todayKey);
  const weekTotal = totalHoursForDates(item, thisWeekKeys);

  function startEditing() {
    setDraftTitle(item.title);
    setDraftPriority(item.priority);
    setEditing(true);
  }

  function saveEdit() {
    const trimmed = draftTitle.trim();
    if (!trimmed) return;
    onUpdate(item.id, { title: trimmed, priority: draftPriority });
    setEditing(false);
  }

  function handleRemove() {
    if (typeof window !== "undefined" && !window.confirm("이 항목을 삭제할까요?")) {
      return;
    }
    onRemove(item.id);
  }

  if (editing) {
    return (
      <li className="flex flex-col gap-3 border border-border p-3">
        <FieldGroup>
          <Field>
            <Input
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              aria-label="할 일 수정"
            />
          </Field>
        </FieldGroup>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1">
            {(Object.keys(PRIORITY_LABEL) as Priority[]).map((value) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={draftPriority === value ? "secondary" : "outline"}
                onClick={() => setDraftPriority(value)}
              >
                {PRIORITY_LABEL[value]}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)}>
              취소
            </Button>
            <Button type="button" size="sm" disabled={!draftTitle.trim()} onClick={saveEdit}>
              저장
            </Button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-center gap-3 border border-border p-3">
      <Checkbox
        checked={completed}
        onCheckedChange={(checked) => onToggleComplete(item.id, checked === true)}
        aria-label={completed ? "완료 되돌리기" : "완료 표시"}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className={completed ? "text-muted-foreground line-through" : ""}>
          {item.title}
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {!completed && (
            <button
              type="button"
              onClick={() => onCyclePriority(item.id, nextPriority(item.priority))}
              className={`inline-flex h-5 items-center border px-2 text-xs font-medium ${PRIORITY_PILL_CLASS[item.priority]}`}
              aria-label={`priority: ${PRIORITY_LABEL[item.priority]} (눌러서 변경)`}
            >
              {PRIORITY_LABEL[item.priority]}
            </button>
          )}
          <IssueBadge item={item} jiraBaseUrl={jiraBaseUrl} />
          {!completed &&
            (opened <= 0 ? (
              <Badge variant="outline">오늘 올림</Badge>
            ) : (
              <Badge variant="outline">{opened}일째</Badge>
            ))}
          {completed && <Badge variant="outline">오늘 끝냄</Badge>}
          {weekTotal > 0 && (
            <span className="text-xs font-semibold tabular-nums text-foreground">
              이번 주 {weekTotal % 1 === 0 ? weekTotal : weekTotal.toFixed(1)}h
            </span>
          )}
        </div>
      </div>
      {!completed &&
        (timeOpen ? (
          <TimeStepper
            hours={todayHours}
            onChange={(hours) => onTimeChange(item.id, hours)}
          />
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenTime(item.id)}
          >
            {todayHours > 0
              ? `오늘 ${todayHours % 1 === 0 ? todayHours : todayHours.toFixed(1)}h`
              : "+ 오늘 시간"}
          </Button>
        ))}
      {!completed && timeOpen && (
        <Button type="button" size="sm" onClick={onCloseTime}>
          완료
        </Button>
      )}
      <div className="flex gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={startEditing}
          aria-label="수정"
        >
          <PencilIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleRemove}
          aria-label="삭제"
        >
          <Trash2Icon />
        </Button>
      </div>
    </li>
  );
}
