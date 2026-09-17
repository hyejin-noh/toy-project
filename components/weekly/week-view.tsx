"use client";

import { useState, useSyncExternalStore } from "react";

import { AppHeader } from "@/components/app-shell/app-header";
import { useTodayList } from "@/hooks/use-today-list";
import { jiraSettingsStore } from "@/lib/today-list/jira-settings";
import { addDays, dateKey, mondayOf, weekdayDates } from "@/lib/today-list/time";
import { hoursOn } from "@/lib/today-list/time-entries";
import { computeWeekSummary } from "@/lib/today-list/week-summary";

import { DayColumn } from "@/components/weekly/day-column";
import { WeekNav } from "@/components/weekly/week-nav";
import { WeekSummary } from "@/components/weekly/week-summary";

export function WeekView() {
  const {
    today,
    items,
    addItemForDate,
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

  const [weekStart, setWeekStart] = useState(() => mondayOf(today));
  const [openAddFormKey, setOpenAddFormKey] = useState<string | null>(null);

  const days = weekdayDates(weekStart);
  const weekKeys = days.map(dateKey);
  const todayKey = dateKey(today);
  const openItems = items.filter((item) => item.completedAt === null);
  const summary = computeWeekSummary(items, weekKeys);

  function handleCreateNew(date: Date, title: string, hours: number) {
    addItemForDate({ title, priority: "medium", date, hours });
    setOpenAddFormKey(null);
  }

  function handleAddToExisting(date: Date, id: string, hours: number) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setTimeEntry(id, date, hoursOn(item, dateKey(date)) + hours);
    setOpenAddFormKey(null);
  }

  function handleSaveEdit(id: string, date: Date, patch: { title: string; hours: number }) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    updateItem(id, { title: patch.title, priority: item.priority });
    setTimeEntry(id, date, patch.hours);
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
      <AppHeader title="주간" />

      <WeekNav
        weekStart={weekStart}
        onPrev={() => {
          setWeekStart(addDays(weekStart, -7));
          setOpenAddFormKey(null);
        }}
        onNext={() => {
          setWeekStart(addDays(weekStart, 7));
          setOpenAddFormKey(null);
        }}
        onToday={() => {
          setWeekStart(mondayOf(today));
          setOpenAddFormKey(null);
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-5">
        {days.map((date, index) => {
          const key = dateKey(date);
          return (
            <div
              key={key}
              className={
                index > 0
                  ? "border-t border-border pt-3 mt-3 sm:border-t-0 sm:pt-0 sm:mt-0 sm:border-l sm:pl-4 sm:ml-4"
                  : ""
              }
            >
              <DayColumn
                date={date}
                index={index}
                isToday={key === todayKey}
                items={items}
                openItems={openItems}
                jiraBaseUrl={jiraBaseUrl}
                isAddFormOpen={openAddFormKey === key}
                onOpenAddForm={() => setOpenAddFormKey(key)}
                onCancelAddForm={() => setOpenAddFormKey(null)}
                onCreateNew={(title, hours) => handleCreateNew(date, title, hours)}
                onAddToExisting={(id, hours) => handleAddToExisting(date, id, hours)}
                onToggleComplete={(id, completed) =>
                  completed ? completeItem(id) : reopenItem(id)
                }
                onSaveEdit={(id, patch) => handleSaveEdit(id, date, patch)}
                onRemove={removeItem}
              />
            </div>
          );
        })}
      </div>

      <WeekSummary data={summary} />
    </div>
  );
}
