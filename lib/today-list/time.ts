/** 로컬 날짜를 "YYYY-MM-DD" 키로 바꾼다. */
export function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

/** 이 날짜가 속한 주의 월요일. */
export function mondayOf(date: Date): Date {
  const dayOfWeek = (date.getDay() + 6) % 7; // 월=0 ... 일=6
  return addDays(date, -dayOfWeek);
}

/** 월요일부터 금요일까지 다섯 날짜. */
export function weekdayDates(monday: Date): Date[] {
  return [0, 1, 2, 3, 4].map((n) => addDays(monday, n));
}

/** 프로토타입이 확정한 주차 계산식(연초 기준 근사치, ISO 8601 표준은 아니다). */
export function weekNumber(monday: Date): number {
  const year = monday.getFullYear();
  const jan1 = new Date(year, 0, 1);
  const daysSinceJan1 = Math.round((monday.getTime() - jan1.getTime()) / 86_400_000);
  const week = Math.ceil((daysSinceJan1 + jan1.getDay()) / 7);
  return week || 1;
}

const WEEKDAY_LABEL = ["월", "화", "수", "목", "금"];

export function weekdayLabel(index: number): string {
  return WEEKDAY_LABEL[index] ?? "";
}

const FULL_WEEKDAY_LABEL = ["일", "월", "화", "수", "목", "금", "토"];

/** "2026년 9월 17일 목요일" 형식. */
export function formatKoreanDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${FULL_WEEKDAY_LABEL[date.getDay()]}요일`;
}

/** "9월 15일(월) ~ 9월 19일(금) · 2026년 38주차" 형식. */
export function formatWeekRange(monday: Date): string {
  const days = weekdayDates(monday);
  const start = days[0];
  const end = days[4];
  const year = start.getFullYear();
  const week = weekNumber(monday);
  return (
    `${start.getMonth() + 1}월 ${start.getDate()}일(월) ~ ` +
    `${end.getMonth() + 1}월 ${end.getDate()}일(금) · ${year}년 ${week}주차`
  );
}
