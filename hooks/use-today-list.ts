"use client";

import { useSyncExternalStore } from "react";

import { extractIssueReference } from "@/lib/today-list/issue-reference";
import { itemsStore } from "@/lib/today-list/items-store";
import { groupItemsForDisplay } from "@/lib/today-list/ordering";
import { dateKey } from "@/lib/today-list/time";
import { withEntryHours } from "@/lib/today-list/time-entries";
import type { NewWorkItemInput, Priority, WorkItem } from "@/lib/today-list/types";

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * 항상 store의 최신 스냅샷을 기준으로 갱신한다. 한 이벤트 핸들러 안에서
 * updateItem과 setTimeEntry처럼 여러 변경을 연달아 호출해도, 뒤의 호출이
 * 앞의 호출 결과를 스냅샷으로 이어받아 서로 덮어쓰지 않는다.
 */
function updateItems(updater: (items: WorkItem[]) => WorkItem[]) {
  itemsStore.set(updater(itemsStore.getSnapshot()));
}

export function useTodayList() {
  const items = useSyncExternalStore(
    itemsStore.subscribe,
    itemsStore.getSnapshot,
    itemsStore.getServerSnapshot
  );

  function addItem(input: NewWorkItemInput) {
    const item: WorkItem = {
      id: createId(),
      title: input.title,
      priority: input.priority,
      createdAt: new Date().toISOString(),
      completedAt: null,
      timeEntries: {},
      ...extractIssueReference(input.title),
    };
    updateItems((current) => [...current, item]);
  }

  /** 주간 화면의 특정 요일 칸에서 새 항목을 만들 때 쓴다. 그 날짜가 항목의 시작일이 된다. */
  function addItemForDate(input: NewWorkItemInput & { date: Date; hours: number }) {
    const item: WorkItem = {
      id: createId(),
      title: input.title,
      priority: input.priority,
      createdAt: input.date.toISOString(),
      completedAt: null,
      timeEntries: { [dateKey(input.date)]: input.hours },
      ...extractIssueReference(input.title),
    };
    updateItems((current) => [...current, item]);
  }

  function updateItem(id: string, patch: { title: string; priority: Priority }) {
    updateItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  }

  function removeItem(id: string) {
    updateItems((current) => current.filter((item) => item.id !== id));
  }

  function completeItem(id: string) {
    updateItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, completedAt: new Date().toISOString() } : item
      )
    );
  }

  function reopenItem(id: string) {
    updateItems((current) =>
      current.map((item) => (item.id === id ? { ...item, completedAt: null } : item))
    );
  }

  /** 항목 하나의 특정 날짜 소요시간을 바꾼다. 오늘 목록과 주간 화면이 같은 자리를 쓴다. */
  function setTimeEntry(id: string, date: Date, hours: number) {
    updateItems((current) =>
      current.map((item) => (item.id === id ? withEntryHours(item, dateKey(date), hours) : item))
    );
  }

  const today = new Date();

  return {
    items,
    today,
    grouped: groupItemsForDisplay(items, today),
    addItem,
    addItemForDate,
    updateItem,
    removeItem,
    completeItem,
    reopenItem,
    setTimeEntry,
  };
}
