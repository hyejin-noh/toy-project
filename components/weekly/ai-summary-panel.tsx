"use client";

import { useState } from "react";
import { SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { generateWeeklySummaryText, type WeekSummaryData } from "@/lib/today-list/week-summary";

const GENERATE_DELAY_MS = 900;

export function AiSummaryPanel({
  data,
  totalHoursLabel,
}: {
  data: WeekSummaryData;
  totalHoursLabel: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    setStatus("loading");
    setCopied(false);
    setTimeout(() => {
      setText(generateWeeklySummaryText(data, totalHoursLabel));
      setStatus("done");
    }, GENERATE_DELAY_MS);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // 클립보드 접근이 막힌 환경에서는 복사만 조용히 건너뛴다.
    }
    setCopied(true);
  }

  return (
    <div className="border border-border bg-primary/5 p-3.5">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        주간보고 요약
      </h3>
      {status === "idle" && (
        <div className="mt-2 flex flex-col gap-2">
          <Button type="button" variant="outline" size="sm" className="w-fit" onClick={generate}>
            <SparklesIcon data-icon="inline-start" />
            AI로 요약 문장 만들기
          </Button>
          <p className="text-xs text-muted-foreground">
            완료·진행 중인 일과 소요시간을 바탕으로 주간보고에 바로 붙여넣을 문단을 만듭니다.
          </p>
        </div>
      )}
      {status === "loading" && (
        <p className="mt-2 text-sm text-muted-foreground">요약을 만드는 중...</p>
      )}
      {status === "done" && (
        <div className="mt-2 flex flex-col gap-2.5">
          <p className="text-sm leading-relaxed">{text}</p>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="xs" onClick={copy}>
              복사
            </Button>
            <Button type="button" variant="ghost" size="xs" onClick={generate}>
              다시 만들기
            </Button>
            {copied && <span className="text-xs font-semibold text-primary">복사했습니다</span>}
          </div>
        </div>
      )}
    </div>
  );
}
