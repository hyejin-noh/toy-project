import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { JiraSettingsForm } from "@/components/jira-settings/jira-settings-form";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/" />}
          nativeButton={false}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          오늘 목록
        </Button>
      </header>

      <div>
        <h1 className="text-xl font-semibold">설정</h1>
        <p className="text-sm text-muted-foreground">
          상단에서 들어온 설정 화면입니다. 지금은 JIRA 연결 하나뿐입니다.
        </p>
      </div>

      <JiraSettingsForm />
    </div>
  );
}
