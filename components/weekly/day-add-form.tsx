"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TimeStepper } from "@/components/weekly/time-stepper";
import { useOutsideDismiss } from "@/hooks/use-outside-dismiss";
import type { WorkItem } from "@/lib/today-list/types";

const NEW_ITEM_VALUE = "__new__";

export function DayAddForm({
  openItems,
  onCreateNew,
  onAddToExisting,
  onCancel,
}: {
  openItems: WorkItem[];
  onCreateNew: (title: string, hours: number) => void;
  onAddToExisting: (id: string, hours: number) => void;
  onCancel: () => void;
}) {
  const [pick, setPick] = useState<string>(NEW_ITEM_VALUE);
  const [newText, setNewText] = useState("");
  const [hours, setHours] = useState(0.5);
  const containerRef = useOutsideDismiss<HTMLDivElement>(true, onCancel);

  function handleSave() {
    if (pick === NEW_ITEM_VALUE) {
      const trimmed = newText.trim();
      if (!trimmed) return;
      onCreateNew(trimmed, hours);
    } else {
      onAddToExisting(pick, hours);
    }
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-2 border border-ring p-2">
      <select
        aria-label="항목 선택"
        value={pick}
        onChange={(event) => setPick(event.target.value)}
        className="h-8 w-full border border-input bg-transparent px-2 text-xs"
      >
        <option value={NEW_ITEM_VALUE}>+ 새 항목 만들기</option>
        {openItems.map((item) => (
          <option key={item.id} value={item.id}>
            {item.title.slice(0, 26)}
            {item.issueKey ? ` · ${item.issueKey}` : ""}
          </option>
        ))}
      </select>
      {pick === NEW_ITEM_VALUE && (
        <Input
          autoFocus
          placeholder="새 항목 이름 (이슈 키 포함 가능)"
          value={newText}
          onChange={(event) => setNewText(event.target.value)}
        />
      )}
      <div className="flex items-center justify-center">
        <TimeStepper hours={hours} min={0.5} onChange={setHours} />
      </div>
      <div className="flex justify-end gap-1.5">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          취소
        </Button>
        <Button type="button" size="sm" onClick={handleSave}>
          저장
        </Button>
      </div>
    </div>
  );
}
