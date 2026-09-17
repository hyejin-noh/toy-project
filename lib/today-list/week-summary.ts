import { priorityRank } from "@/lib/today-list/ordering";
import { dateKey } from "@/lib/today-list/time";
import { totalHoursForDates } from "@/lib/today-list/time-entries";
import type { WorkItem } from "@/lib/today-list/types";

export type WeekSummaryData = {
  totalHours: number;
  doneItems: WorkItem[];
  openItems: WorkItem[];
};

function hasKeyRank(item: WorkItem): number {
  return item.issueKey ? 0 : 1;
}

function completedWithin(item: WorkItem, weekKeys: string[]): boolean {
  if (!item.completedAt) return false;
  return weekKeys.includes(dateKey(new Date(item.completedAt)));
}

/** 지정한 주(월~금 날짜 키)를 기준으로 summary 데이터를 계산한다. */
export function computeWeekSummary(items: WorkItem[], weekKeys: string[]): WeekSummaryData {
  const totalHours = items.reduce(
    (sum, item) => sum + totalHoursForDates(item, weekKeys),
    0
  );

  const doneItems = items
    .filter((item) => completedWithin(item, weekKeys))
    .sort(
      (a, b) =>
        hasKeyRank(a) - hasKeyRank(b) ||
        new Date(b.completedAt as string).getTime() - new Date(a.completedAt as string).getTime()
    );

  const openItems = items
    .filter((item) => item.completedAt === null)
    .sort((a, b) => hasKeyRank(a) - hasKeyRank(b) || priorityRank(a.priority) - priorityRank(b.priority));

  return { totalHours, doneItems, openItems };
}

export function summaryLabel(item: Pick<WorkItem, "title" | "issueKey">): string {
  return item.issueKey ? `[${item.issueKey}] ${item.title}` : item.title;
}

function plainLabel(item: Pick<WorkItem, "title" | "issueKey">): string {
  return item.issueKey ? `${item.title}(${item.issueKey})` : item.title;
}

function joinNames(list: WorkItem[], max: number): string {
  const names = list.slice(0, max).map(plainLabel);
  const rest = list.length;
  let joined = names.join("과 ");
  if (list.length > max) joined += ` 등 ${rest}건`;
  return joined;
}

/** AI 요약 문단을 만든다. 실제 LLM 호출 없이 같은 데이터로 조합한다(이번 단위의 잠정 동작). */
export function generateWeeklySummaryText(
  data: WeekSummaryData,
  totalHoursLabel: string
): string {
  const parts: string[] = [];
  if (data.doneItems.length > 0) {
    parts.push(`이번 주에는 ${joinNames(data.doneItems, 2)}를 완료했습니다.`);
  } else {
    parts.push("이번 주에 완료 표시한 일은 아직 없습니다.");
  }
  if (data.openItems.length > 0) {
    parts.push(`진행 중인 일로는 ${joinNames(data.openItems, 2)}이 남아 있습니다.`);
  }
  parts.push(`이번 주 총 ${totalHoursLabel}을 기록했습니다.`);
  return parts.join(" ");
}
