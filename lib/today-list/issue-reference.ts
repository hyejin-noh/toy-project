const ISSUE_KEY_PATTERN = /\b[A-Z][A-Z0-9]{1,9}-\d+\b/;
const URL_PATTERN = /https?:\/\/\S+/;

export type IssueReference = {
  issueKey?: string;
  issueUrl?: string;
};

/**
 * 붙여넣은 한 줄 텍스트에서 JIRA URL이나 이슈 키를 찾아낸다.
 * URL이 있으면 그 URL을 그대로 쓰고, 그 안에서 이슈 키도 함께 찾는다.
 * URL이 없으면 텍스트 전체에서 이슈 키만 찾는다.
 */
export function extractIssueReference(text: string): IssueReference {
  const urlMatch = text.match(URL_PATTERN);
  if (urlMatch) {
    const issueUrl = urlMatch[0];
    const keyMatch = issueUrl.match(ISSUE_KEY_PATTERN);
    return keyMatch ? { issueUrl, issueKey: keyMatch[0] } : { issueUrl };
  }

  const keyMatch = text.match(ISSUE_KEY_PATTERN);
  return keyMatch ? { issueKey: keyMatch[0] } : {};
}

/**
 * 항목에서 이슈로 열 수 있는 주소를 만든다.
 * 붙여넣은 URL이 있으면 그대로 쓰고, 이슈 키만 있으면 저장된 JIRA 주소로 조합한다.
 * 둘 다 없으면 열 수 있는 주소가 없다.
 */
export function buildIssueHref(
  item: IssueReference,
  jiraBaseUrl: string | undefined
): string | undefined {
  if (item.issueUrl) return item.issueUrl;
  if (item.issueKey && jiraBaseUrl) {
    return `${jiraBaseUrl.replace(/\/+$/, "")}/browse/${item.issueKey}`;
  }
  return undefined;
}
