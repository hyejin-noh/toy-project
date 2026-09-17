import { describe, expect, test } from "vitest";

import { daysOpen, groupItemsForDisplay, sortOpenItems } from "@/lib/today-list/ordering";
import type { WorkItem } from "@/lib/today-list/types";

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

describe("sortOpenItems", () => {
  test("priority가 높은 항목이 위로 온다", () => {
    const low = item({ id: "low", priority: "low" });
    const high = item({ id: "high", priority: "high" });
    const medium = item({ id: "medium", priority: "medium" });

    const sorted = sortOpenItems([low, medium, high]);

    expect(sorted.map((i) => i.id)).toEqual(["high", "medium", "low"]);
  });

  test("같은 priority끼리는 먼저 올라온(오래된) 항목이 위로 온다", () => {
    const older = item({ id: "older", priority: "medium", createdAt: "2026-01-01T00:00:00.000Z" });
    const newer = item({ id: "newer", priority: "medium", createdAt: "2026-01-05T00:00:00.000Z" });

    const sorted = sortOpenItems([newer, older]);

    expect(sorted.map((i) => i.id)).toEqual(["older", "newer"]);
  });
});

describe("daysOpen", () => {
  test("오늘 올라온 항목은 0일째다", () => {
    const today = new Date(2026, 8, 17);
    const createdToday = item({ createdAt: new Date(2026, 8, 17, 9).toISOString() });

    expect(daysOpen(createdToday, today)).toBe(0);
  });

  test("어제 올라온 항목은 오늘 기준 1일째다", () => {
    const today = new Date(2026, 8, 17);
    const createdYesterday = item({ createdAt: new Date(2026, 8, 16, 9).toISOString() });

    expect(daysOpen(createdYesterday, today)).toBe(1);
  });
});

describe("groupItemsForDisplay", () => {
  test("완료 표시하면 열린 목록에서 빠지고, 오늘 완료 목록에 들어간다", () => {
    const today = new Date(2026, 8, 17);
    const completedNow = item({
      id: "done-today",
      completedAt: new Date(2026, 8, 17, 10).toISOString(),
    });
    const open = item({ id: "open" });

    const grouped = groupItemsForDisplay([open, completedNow], today);

    expect(grouped.open.map((i) => i.id)).toEqual(["open"]);
    expect(grouped.completedToday.map((i) => i.id)).toEqual(["done-today"]);
  });

  test("어제 완료한 항목은 오늘 화면에 보이지 않는다", () => {
    const today = new Date(2026, 8, 17);
    const completedYesterday = item({
      id: "done-yesterday",
      completedAt: new Date(2026, 8, 16, 18).toISOString(),
    });

    const grouped = groupItemsForDisplay([completedYesterday], today);

    expect(grouped.open).toHaveLength(0);
    expect(grouped.completedToday).toHaveLength(0);
  });

  test("날짜가 바뀐 뒤에는 열린 항목의 며칠째 표시가 하루 늘어난다", () => {
    const createdAt = new Date(2026, 8, 15, 9).toISOString();
    const openItem = item({ id: "carryover", createdAt });

    const beforeDayChange = groupItemsForDisplay([openItem], new Date(2026, 8, 16));
    const afterDayChange = groupItemsForDisplay([openItem], new Date(2026, 8, 17));

    expect(afterDayChange.open).toHaveLength(1);
    expect(daysOpen(afterDayChange.open[0], new Date(2026, 8, 17))).toBe(
      daysOpen(beforeDayChange.open[0], new Date(2026, 8, 16)) + 1
    );
  });
});
