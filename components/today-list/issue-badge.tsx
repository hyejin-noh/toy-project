import { Badge } from "@/components/ui/badge";
import { buildIssueHref } from "@/lib/today-list/issue-reference";
import type { WorkItem } from "@/lib/today-list/types";

export function IssueBadge({
  item,
  jiraBaseUrl,
}: {
  item: Pick<WorkItem, "issueKey" | "issueUrl">;
  jiraBaseUrl: string | undefined;
}) {
  const issueHref = buildIssueHref(item, jiraBaseUrl);
  if (!item.issueKey && !issueHref) return null;

  if (issueHref) {
    return (
      <Badge variant="secondary" render={<a href={issueHref} target="_blank" rel="noreferrer" />}>
        {item.issueKey ?? "이슈 링크"}
      </Badge>
    );
  }
  return <Badge variant="secondary">{item.issueKey}</Badge>;
}
