import { describe, expect, test } from "vitest";

import { computeWeekSummary, generateWeeklySummaryText } from "@/lib/today-list/week-summary";
import type { WorkItem } from "@/lib/today-list/types";

const WEEK_KEYS = ["2026-09-14", "2026-09-15", "2026-09-16", "2026-09-17", "2026-09-18"];

function item(overrides: Partial<WorkItem>): WorkItem {
  return {
    id: overrides.id ?? Math.random().toString(),
    title: overrides.title ?? "제목",
    priority: overrides.priority ?? "medium",
    createdAt: overrides.createdAt ?? new Date().toISOString(),
    completedAt: overrides.completedAt ?? null,
    timeEntries: overrides.timeEntries ?? {},
    ...overrides,
  };
}

describe("computeWeekSummary", () => {
  test("이번 주 안의 시간만 총합에 더한다", () => {
    const inWeek = item({ id: "a", timeEntries: { "2026-09-16": 2 } });
    const outOfWeek = item({ id: "b", timeEntries: { "2026-09-08": 5 } });

    const summary = computeWeekSummary([inWeek, outOfWeek], WEEK_KEYS);

    expect(summary.totalHours).toBe(2);
  });

  test("완료 시각이 이번 주 안일 때만 '한 일' 목록에 들어간다", () => {
    const doneThisWeek = item({
      id: "done-in",
      completedAt: "2026-09-16T10:00:00.000Z",
    });
    const doneLastWeek = item({
      id: "done-out",
      completedAt: "2026-09-08T10:00:00.000Z",
    });

    const summary = computeWeekSummary([doneThisWeek, doneLastWeek], WEEK_KEYS);

    expect(summary.doneItems.map((i) => i.id)).toEqual(["done-in"]);
  });

  test("이슈 키가 있는 항목이 두 목록 모두에서 위로 온다", () => {
    const noKey = item({ id: "no-key", issueKey: undefined, priority: "high" });
    const withKey = item({ id: "with-key", issueKey: "ABC-1", priority: "low" });

    const summary = computeWeekSummary([noKey, withKey], WEEK_KEYS);

    expect(summary.openItems.map((i) => i.id)).toEqual(["with-key", "no-key"]);
  });
});

describe("generateWeeklySummaryText", () => {
  test("완료·진행 중인 일과 총 시간을 한 문단에 담는다", () => {
    const done = item({ id: "done-1", title: "로그인 버그 수정", issueKey: "ABC-1" });
    const open = item({ id: "open-1", title: "리뷰 대응" });

    const text = generateWeeklySummaryText(
      { totalHours: 4.5, doneItems: [done], openItems: [open] },
      "4.5h"
    );

    expect(text).toContain("로그인 버그 수정(ABC-1)");
    expect(text).toContain("리뷰 대응");
    expect(text).toContain("4.5h");
  });

  test("완료한 일이 없으면 안내 문장을 넣는다", () => {
    const text = generateWeeklySummaryText({ totalHours: 0, doneItems: [], openItems: [] }, "0h");
    expect(text).toContain("완료 표시한 일은 아직 없습니다");
  });
});
