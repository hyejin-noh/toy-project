"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SettingsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { jiraSettingsStore, type JiraConnectionStatus } from "@/lib/today-list/jira-settings";

const CONNECTION_LABEL: Record<JiraConnectionStatus, string> = {
  unset: "연결 안 됨",
  checking: "확인 중",
  connected: "연결됨",
  failed: "연결 실패",
};

const TABS = [
  { href: "/", label: "오늘" },
  { href: "/week", label: "주간" },
] as const;

export function AppHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const jiraSettings = useSyncExternalStore(
    jiraSettingsStore.subscribe,
    jiraSettingsStore.getSnapshot,
    jiraSettingsStore.getServerSnapshot
  );

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border pb-3.5">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <nav className="flex items-center gap-1">
          {TABS.map((tab) => (
            <Button
              key={tab.href}
              size="sm"
              variant={pathname === tab.href ? "secondary" : "ghost"}
              render={<Link href={tab.href} />}
              nativeButton={false}
            >
              {tab.label}
            </Button>
          ))}
        </nav>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" size="icon-sm" aria-label="설정" />}
          >
            <SettingsIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>설정</DropdownMenuLabel>
            <DropdownMenuItem render={<Link href="/settings" />}>
              <span className="flex-1">JIRA 연결</span>
              <span className="text-muted-foreground">
                {CONNECTION_LABEL[jiraSettings.status]}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
