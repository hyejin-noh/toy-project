"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EMPTY_JIRA_SETTINGS } from "@/lib/today-list/jira-settings";

/**
 * 목업 화면이다. 실제 저장·연결 확인 API를 호출하지 않는다.
 * 실제 JIRA 연결은 이 도구를 사내망 안(클라우드 PC)에서 로컬로 띄웠을 때만 의미가 있고,
 * 그 경우에는 코드에 이미 들어 있는 기본 JIRA 주소가 그대로 적용된다.
 */
export function JiraSettingsForm() {
  const [baseUrl, setBaseUrl] = useState(EMPTY_JIRA_SETTINGS.baseUrl);
  const [token, setToken] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>JIRA 연결</CardTitle>
        <CardDescription>
          사내에 설치된 Jira의 개인 액세스 토큰으로 연결합니다. JIRA에는 아무것도 쓰지 않습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={(event) => event.preventDefault()}>
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

          <p className="text-xs text-muted-foreground">
            이 화면은 모양만 보여주는 목업입니다. 사내망 안에서 이 도구를 직접 띄웠을 때는
            위 JIRA 주소가 자동으로 적용되어 있어 토큰만 넣으면 됩니다.
          </p>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled>
              저장하고 연결 확인
            </Button>
            <Button type="button" variant="outline" disabled>
              연결 끊기
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
