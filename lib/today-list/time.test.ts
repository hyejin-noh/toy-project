import { describe, expect, test } from "vitest";

import {
  dateKey,
  formatKoreanDate,
  formatWeekRange,
  mondayOf,
  weekdayDates,
} from "@/lib/today-list/time";

describe("mondayOf / weekdayDates", () => {
  test("목요일 기준으로 그 주의 월~금 날짜를 만든다", () => {
    const thursday = new Date(2026, 8, 17); // 2026-09-17 목
    const monday = mondayOf(thursday);

    expect(dateKey(monday)).toBe("2026-09-14");
    expect(weekdayDates(monday).map(dateKey)).toEqual([
      "2026-09-14",
      "2026-09-15",
      "2026-09-16",
      "2026-09-17",
      "2026-09-18",
    ]);
  });

  test("일요일도 그 주(월요일 시작)로 올바르게 묶인다", () => {
    const sunday = new Date(2026, 8, 20); // 2026-09-20 일
    expect(dateKey(mondayOf(sunday))).toBe("2026-09-14");
  });
});

describe("formatWeekRange", () => {
  test("월~금 날짜와 주차를 하나의 문자열로 만든다", () => {
    const monday = mondayOf(new Date(2026, 8, 17));
    expect(formatWeekRange(monday)).toBe("9월 14일(월) ~ 9월 18일(금) · 2026년 38주차");
  });
});

describe("formatKoreanDate", () => {
  test("연-월-일-요일을 한글로 표시한다", () => {
    expect(formatKoreanDate(new Date(2026, 8, 17))).toBe("2026년 9월 17일 목요일");
  });
});
