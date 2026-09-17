"use client";

import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useJiraSettings } from "@/hooks/use-jira-settings";
import type { JiraFailureReason, JiraSettings } from "@/lib/today-list/jira-settings";

function failureMessage(reason: JiraFailureReason | undefined): string {
  switch (reason) {
    case "unauthorized":
      return "토큰이 거부되었습니다. 개인 액세스 토큰을 확인해 주세요.";
    case "unreachable":
      return "주소를 찾을 수 없습니다. JIRA 주소를 확인해 주세요.";
    default:
      return "연결을 확인하지 못했습니다.";
  }
}

export function JiraSettingsForm() {
  const { settings, save, clear } = useJiraSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>JIRA 연결</CardTitle>
        <CardDescription>
          사내에 설치된 Jira의 개인 액세스 토큰으로 연결합니다. JIRA에는 아무것도 쓰지 않습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/*
          key는 저장된 baseUrl/token이 바뀔 때만 이 폼을 다시 마운트한다.
          연결 확인 중(status만 바뀌는 경우)에는 사용자가 입력 중인 값을 그대로 유지한다.
        */}
        <JiraSettingsFields
          key={`${settings.baseUrl}|${settings.token}`}
          settings={settings}
          onSave={save}
          onClear={clear}
        />
      </CardContent>
    </Card>
  );
}

function JiraSettingsFields({
  settings,
  onSave,
  onClear,
}: {
  settings: JiraSettings;
  onSave: (baseUrl: string, token: string) => Promise<void>;
  onClear: () => void;
}) {
  const [baseUrl, setBaseUrl] = useState(settings.baseUrl);
  const [token, setToken] = useState(settings.token);
  const checking = settings.status === "checking";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedBaseUrl = baseUrl.trim();
    const trimmedToken = token.trim();
    if (!trimmedBaseUrl || !trimmedToken) return;
    await onSave(trimmedBaseUrl, trimmedToken);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="jira-base-url">JIRA 주소</FieldLabel>
          <Input
            id="jira-base-url"
            placeholder="http://jira.lge.com/"
            value={baseUrl}
            onChange={(event) => setBaseUrl(event.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="jira-token">개인 액세스 토큰</FieldLabel>
          <Input
            id="jira-token"
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
          />
        </Field>
      </FieldGroup>

      {settings.status === "checking" && (
        <Alert>
          <AlertTitle>연결을 확인하는 중입니다...</AlertTitle>
        </Alert>
      )}
      {settings.status === "connected" && (
        <Alert>
          <AlertTitle>연결됨</AlertTitle>
          <AlertDescription>
            {settings.accountName
              ? `${settings.accountName} 계정으로 연결되었습니다.`
              : "연결되었습니다."}
          </AlertDescription>
        </Alert>
      )}
      {settings.status === "failed" && (
        <Alert variant="destructive">
          <AlertTitle>연결 실패</AlertTitle>
          <AlertDescription>{failureMessage(settings.failureReason)}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={!baseUrl.trim() || !token.trim() || checking}>
          저장하고 연결 확인
        </Button>
        <Button type="button" variant="outline" onClick={onClear}>
          연결 끊기
        </Button>
      </div>
    </form>
  );
}
