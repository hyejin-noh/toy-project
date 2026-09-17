import type { TimeEntries, WorkItem } from "@/lib/today-list/types";

const MAX_HOURS_PER_DAY = 12;
const STEP_HOURS = 0.5;

export function getEntries(item: WorkItem): TimeEntries {
  return item.timeEntries ?? {};
}

export function hoursOn(item: WorkItem, key: string): number {
  return getEntries(item)[key] ?? 0;
}

export function totalHoursForDates(item: WorkItem, keys: string[]): number {
  return keys.reduce((sum, key) => sum + hoursOn(item, key), 0);
}

/** 항목 하나에 특정 날짜의 시간을 반영한 새 항목을 돌려준다. 0 이하면 그 날짜 기록을 지운다. */
export function withEntryHours(item: WorkItem, key: string, hours: number): WorkItem {
  const clamped = Math.max(0, Math.min(MAX_HOURS_PER_DAY, hours));
  const entries = { ...getEntries(item) };
  if (clamped <= 0) {
    delete entries[key];
  } else {
    entries[key] = clamped;
  }
  return { ...item, timeEntries: entries };
}

export function clampStep(hours: number, direction: 1 | -1): number {
  const next = hours + direction * STEP_HOURS;
  return Math.max(0, Math.min(MAX_HOURS_PER_DAY, next));
}

export function hoursLabel(hours: number): string {
  const rounded = Math.round(hours * 100) / 100;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `${text}h`;
}
