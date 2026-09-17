"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { NewWorkItemInput, Priority } from "@/lib/today-list/types";

const PRIORITY_LABEL: Record<Priority, string> = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

export function AddItemForm({ onAdd }: { onAdd: (input: NewWorkItemInput) => void }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd({ title: trimmed, priority });
    setText("");
    setPriority("medium");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="new-item-title" className="sr-only">
            할 일
          </FieldLabel>
          <Input
            id="new-item-title"
            placeholder="무슨 일인지 적어주세요. 이슈 키나 URL을 함께 붙여넣을 수 있습니다."
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </Field>
      </FieldGroup>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ToggleGroup
          value={[priority]}
          onValueChange={(value) => {
            if (value[0]) setPriority(value[0] as Priority);
          }}
          variant="outline"
          size="sm"
          aria-label="priority"
        >
          {(Object.keys(PRIORITY_LABEL) as Priority[]).map((value) => (
            <ToggleGroupItem key={value} value={value}>
              {PRIORITY_LABEL[value]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Button type="submit" size="sm" disabled={!text.trim()}>
          추가
        </Button>
      </div>
    </form>
  );
}
