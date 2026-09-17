import { describe, expect, test } from "vitest";

import {
  clampStep,
  hoursLabel,
  hoursOn,
  totalHoursForDates,
  withEntryHours,
} from "@/lib/today-list/time-entries";
import type { WorkItem } from "@/lib/today-list/types";

function item(timeEntries: Record<string, number>): WorkItem {
  return {
    id: "1",
    title: "제목",
    priority: "medium",
    createdAt: new Date().toISOString(),
    completedAt: null,
    timeEntries,
  };
}

describe("withEntryHours", () => {
  test("시간을 올리면 그 날짜 기록이 생긴다", () => {
    const next = withEntryHours(item({}), "2026-09-17", 1.5);
    expect(next.timeEntries["2026-09-17"]).toBe(1.5);
  });

  test("0으로 내리면 그 날짜 기록이 없어진다", () => {
    const next = withEntryHours(item({ "2026-09-17": 1 }), "2026-09-17", 0);
    expect(next.timeEntries["2026-09-17"]).toBeUndefined();
  });

  test("12시간을 넘기지 않는다", () => {
    const next = withEntryHours(item({}), "2026-09-17", 20);
    expect(next.timeEntries["2026-09-17"]).toBe(12);
  });
});

describe("clampStep", () => {
  test("0.5 단위로 늘고 줄되 0 밑으로 내려가지 않는다", () => {
    expect(clampStep(0, 1)).toBe(0.5);
    expect(clampStep(0, -1)).toBe(0);
    expect(clampStep(0.5, -1)).toBe(0);
  });
});

describe("totalHoursForDates / hoursOn", () => {
  test("주어진 날짜들만 합산한다", () => {
    const target = item({ "2026-09-15": 1, "2026-09-16": 2, "2026-09-20": 5 });
    expect(totalHoursForDates(target, ["2026-09-15", "2026-09-16"])).toBe(3);
    expect(hoursOn(target, "2026-09-20")).toBe(5);
    expect(hoursOn(target, "2026-09-17")).toBe(0);
  });
});

describe("hoursLabel", () => {
  test("정수는 소수점 없이, 아니면 한 자리까지 보여준다", () => {
    expect(hoursLabel(2)).toBe("2h");
    expect(hoursLabel(1.5)).toBe("1.5h");
    expect(hoursLabel(0)).toBe("0h");
  });
});
