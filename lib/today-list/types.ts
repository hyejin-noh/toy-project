export type Priority = "high" | "medium" | "low";

/** "YYYY-MM-DD"(로컬 날짜) -> 그 날짜에 쓴 시간(0.5 단위) */
export type TimeEntries = Record<string, number>;

export type WorkItem = {
  id: string;
  title: string;
  issueKey?: string;
  issueUrl?: string;
  priority: Priority;
  createdAt: string;
  completedAt: string | null;
  timeEntries: TimeEntries;
};

export type NewWorkItemInput = {
  title: string;
  priority: Priority;
};
