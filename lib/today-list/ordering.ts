import type { Priority, WorkItem } from "@/lib/today-list/types";

const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const PRIORITY_CYCLE: Record<Priority, Priority> = {
  high: "medium",
  medium: "low",
  low: "high",
};

/** priority 표시를 한 번 누르면 다음 단계로 돈다: 높음 → 보통 → 낮음 → 높음. */
export function nextPriority(priority: Priority): Priority {
  return PRIORITY_CYCLE[priority];
}

export function priorityRank(priority: Priority): number {
  return PRIORITY_ORDER[priority];
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return startOfLocalDay(a).getTime() === startOfLocalDay(b).getTime();
}

export function isCompletedToday(item: WorkItem, today: Date): boolean {
  if (!item.completedAt) return false;
  return isSameLocalDay(new Date(item.completedAt), today);
}

/** 항목이 오늘 기준으로 며칠째 열려 있는지. 오늘 올라온 항목은 0이다. */
export function daysOpen(item: WorkItem, today: Date): number {
  const created = startOfLocalDay(new Date(item.createdAt)).getTime();
  const current = startOfLocalDay(today).getTime();
  const diffDays = Math.round((current - created) / (24 * 60 * 60 * 1000));
  return Math.max(diffDays, 0);
}

/** priority가 높은 순서로, 같은 priority끼리는 오래 남은(먼저 올라온) 항목이 위로 오도록 정렬한다. */
export function sortOpenItems(items: WorkItem[]): WorkItem[] {
  return [...items].sort((a, b) => {
    const byPriority = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (byPriority !== 0) return byPriority;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

export type GroupedItems = {
  open: WorkItem[];
  completedToday: WorkItem[];
};

/**
 * 화면에 보일 항목만 골라 묶는다. 열린 항목은 priority 순으로,
 * 완료 항목은 오늘 완료한 것만 최근 순으로 보여준다.
 * 오늘이 아닌 날 완료한 항목은 기록에는 남지만 화면에는 나타나지 않는다.
 */
export function groupItemsForDisplay(
  items: WorkItem[],
  today: Date
): GroupedItems {
  const open = items.filter((item) => item.completedAt === null);
  const completedToday = items.filter(
    (item) => item.completedAt !== null && isCompletedToday(item, today)
  );

  return {
    open: sortOpenItems(open),
    completedToday: completedToday.sort(
      (a, b) =>
        new Date(b.completedAt as string).getTime() -
        new Date(a.completedAt as string).getTime()
    ),
  };
}
