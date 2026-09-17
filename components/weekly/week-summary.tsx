import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AiSummaryPanel } from "@/components/weekly/ai-summary-panel";
import { hoursLabel } from "@/lib/today-list/time-entries";
import { summaryLabel, type WeekSummaryData } from "@/lib/today-list/week-summary";

export function WeekSummary({ data }: { data: WeekSummaryData }) {
  const totalHoursLabel = hoursLabel(data.totalHours);
  const signature = [
    totalHoursLabel,
    data.doneItems.map((i) => i.id).join(","),
    data.openItems.map((i) => `${i.id}:${i.priority}`).join(","),
  ].join("|");

  return (
    <Card>
      <CardHeader>
        <CardTitle>이번 주 summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-3">
          <Stat label="기록한 시간" value={totalHoursLabel} />
          <Stat label="완료 표시한 이슈" value={`${data.doneItems.length}건`} />
          <Stat label="아직 진행 중" value={`${data.openItems.length}건`} />
        </div>

        <SummaryList title="이번 주에 한 일" items={data.doneItems} emptyText="이번 주에 완료 표시한 일이 아직 없습니다." />
        <SummaryList title="진행 중인 일" items={data.openItems} emptyText="진행 중인 일이 없습니다." />

        <AiSummaryPanel key={signature} data={data} totalHoursLabel={totalHoursLabel} />

        <p className="border border-dashed border-border p-2.5 text-xs text-muted-foreground">
          프로젝트별 MM 비율은 이슈 키 접두사와 플랫폼 프로젝트를 잇는 규칙이 정해지는 다음 단위에서
          추가됩니다. 지금은 시간·건수 요약까지만 보여줍니다.
        </p>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border border-border p-2.5">
      <span className="text-lg font-bold tabular-nums">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function SummaryList({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: WeekSummaryData["doneItems"];
  emptyText: string;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {items.map((item) => (
            <li key={item.id} className="flex items-baseline gap-2 text-sm">
              <span aria-hidden className="size-1 shrink-0 self-center rounded-full bg-muted-foreground" />
              <span className="min-w-0 flex-1">{summaryLabel(item)}</span>
              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                {hoursLabel(totalHoursOf(item))}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function totalHoursOf(item: WeekSummaryData["doneItems"][number]): number {
  return Object.values(item.timeEntries ?? {}).reduce((sum, hours) => sum + hours, 0);
}
