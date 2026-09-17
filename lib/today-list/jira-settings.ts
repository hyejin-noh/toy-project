import { createLocalStore } from "@/lib/local-store";

export type JiraConnectionStatus = "unset" | "checking" | "connected" | "failed";

export type JiraFailureReason = "unreachable" | "unauthorized" | "unknown";

export type JiraSettings = {
  baseUrl: string;
  token: string;
  status: JiraConnectionStatus;
  accountName?: string;
  failureReason?: JiraFailureReason;
};

export const EMPTY_JIRA_SETTINGS: JiraSettings = {
  baseUrl: "http://jira.lge.com/",
  token: "",
  status: "unset",
};

const STORAGE_KEY = "today-list:jira:v1";

export const jiraSettingsStore = createLocalStore<JiraSettings>(
  STORAGE_KEY,
  EMPTY_JIRA_SETTINGS
);
