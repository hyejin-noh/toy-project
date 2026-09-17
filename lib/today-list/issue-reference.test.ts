import { describe, expect, test } from "vitest";

import { buildIssueHref, extractIssueReference } from "@/lib/today-list/issue-reference";

describe("extractIssueReference", () => {
  test("이슈 키만 붙여넣으면 issueKey만 뽑아낸다", () => {
    expect(extractIssueReference("GENSIX-123 로그인 버그 수정")).toEqual({
      issueKey: "GENSIX-123",
    });
  });

  test("URL을 붙여넣으면 issueUrl과 그 안의 issueKey를 함께 뽑아낸다", () => {
    expect(
      extractIssueReference("https://jira.example.com/browse/CCIC-42 확인 필요")
    ).toEqual({
      issueUrl: "https://jira.example.com/browse/CCIC-42",
      issueKey: "CCIC-42",
    });
  });

  test("이슈 키나 URL이 없으면 아무것도 뽑아내지 않는다", () => {
    expect(extractIssueReference("점심 약속 잡기")).toEqual({});
  });
});

describe("buildIssueHref", () => {
  test("issueUrl이 있으면 그대로 쓴다", () => {
    expect(
      buildIssueHref(
        { issueUrl: "https://jira.example.com/browse/CCIC-42", issueKey: "CCIC-42" },
        "https://other.example.com"
      )
    ).toBe("https://jira.example.com/browse/CCIC-42");
  });

  test("issueKey만 있고 저장된 JIRA 주소가 있으면 조합한다", () => {
    expect(
      buildIssueHref({ issueKey: "GENSIX-123" }, "https://jira.example.com")
    ).toBe("https://jira.example.com/browse/GENSIX-123");
  });

  test("issueKey만 있고 저장된 JIRA 주소가 없으면 열 수 있는 주소가 없다", () => {
    expect(buildIssueHref({ issueKey: "GENSIX-123" }, undefined)).toBeUndefined();
  });
});
