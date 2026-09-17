"use client";

import { useSyncExternalStore } from "react";

import {
  EMPTY_JIRA_SETTINGS,
  jiraSettingsStore,
  type JiraFailureReason,
  type JiraSettings,
} from "@/lib/today-list/jira-settings";

type VerifyResponse =
  | { ok: true; accountName?: string }
  | { ok: false; reason?: JiraFailureReason };

export function useJiraSettings() {
  const settings = useSyncExternalStore(
    jiraSettingsStore.subscribe,
    jiraSettingsStore.getSnapshot,
    jiraSettingsStore.getServerSnapshot
  );

  async function save(baseUrl: string, token: string) {
    jiraSettingsStore.set({ baseUrl, token, status: "checking" });

    let next: JiraSettings;
    try {
      const res = await fetch("/api/jira/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl, token }),
      });
      const data = (await res.json()) as VerifyResponse;
      next = data.ok
        ? { baseUrl, token, status: "connected", accountName: data.accountName }
        : { baseUrl, token, status: "failed", failureReason: data.reason ?? "unknown" };
    } catch {
      next = { baseUrl, token, status: "failed", failureReason: "unreachable" };
    }

    jiraSettingsStore.set(next);
  }

  function clear() {
    jiraSettingsStore.set(EMPTY_JIRA_SETTINGS);
  }

  return { settings, save, clear };
}
