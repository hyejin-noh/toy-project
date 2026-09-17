"use client";

import { useState, useSyncExternalStore } from "react";

import { AppHeader } from "@/components/app-shell/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { useTodayList } from "@/hooks/use-today-list";
import { jiraSettingsStore } from "@/lib/today-list/jira-settings";
import { dateKey, formatKoreanDate, mondayOf, weekdayDates } from "@/lib/today-list/time";
import type { Priority } from "@/lib/today-list/types";

import { AddItemForm } from "@/components/today-list/add-item-form";
import { ItemRow } from "@/components/today-list/item-row";

export function TodayListView() {
  const {
    today,
    grouped,
    addItem,
    updateItem,
    removeItem,
    completeItem,
    reopenItem,
    setTimeEntry,
  } = useTodayList();
  const jiraSettings = useSyncExternalStore(
    jiraSettingsStore.subscribe,
    jiraSettingsStore.getSnapshot,
    jiraSettingsStore.getServerSnapshot
  );
  const jiraBaseUrl = jiraSettings.baseUrl || undefined;
  const [openTimeItemId, setOpenTimeItemId] = useState<string | null>(null);

  const thisWeekKeys = weekdayDates(mondayOf(today)).map(dateKey);
  const isEmpty = grouped.open.length === 0 && grouped.completedToday.length === 0;

  function cyclePriority(id: string, next: Priority) {
    const item = [...grouped.open, ...grouped.completedToday].find((i) => i.id === id);
    if (item) updateItem(id, { title: item.title, priority: next });
  }

  const rowProps = {
    today,
    thisWeekKeys,
    jiraBaseUrl,
    onToggleComplete: (id: string, completed: boolean) =>
      completed ? completeItem(id) : reopenItem(id),
    onCyclePriority: cyclePriority,
    onUpdate: updateItem,
    onRemove: removeItem,
    onOpenTime: (id: string) => setOpenTimeItemId(id),
    onCloseTime: () => setOpenTimeItemId(null),
    onTimeChange: (id: string, hours: number) => setTimeEntry(id, today, hours),
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6">
      <AppHeader title="오늘 목록" subtitle={formatKoreanDate(today)} />

      <Card>
        <CardHeader>
          <CardTitle>새 항목 추가</CardTitle>
        </CardHeader>
        <CardContent>
          <AddItemForm onAdd={addItem} />
        </CardContent>
      </Card>

      {isEmpty ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>아직 할 일이 없습니다</EmptyTitle>
            <EmptyDescription>
              위 입력창에 무슨 일인지 한 줄로 적고 추가를 눌러 시작하세요.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-muted-foreground">열린 항목</h2>
            {grouped.open.length === 0 ? (
              <p className="text-sm text-muted-foreground">열린 항목이 없습니다.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {grouped.open.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    timeOpen={openTimeItemId === item.id}
                    {...rowProps}
                  />
                ))}
              </ul>
            )}
          </section>

          {grouped.completedToday.length > 0 && (
            <section className="flex flex-col gap-2">
              <h2 className="text-sm font-medium text-muted-foreground">오늘 완료</h2>
              <ul className="flex flex-col gap-2">
                {grouped.completedToday.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    timeOpen={false}
                    {...rowProps}
                  />
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
