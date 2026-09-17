import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, test } from "vitest";

import Home from "@/app/page";
import { itemsStore } from "@/lib/today-list/items-store";

beforeEach(() => {
  window.localStorage.clear();
  // itemsStore는 모듈 스코프 싱글턴이라 테스트 사이에도 메모리 캐시가 남는다.
  itemsStore.set([]);
});

test("목록이 비어 있으면 무엇을 하면 되는지 안내한다", () => {
  render(<Home />);

  expect(screen.getByText("아직 할 일이 없습니다")).toBeInTheDocument();
});

test("한 줄 설명을 적어 추가하면 목록에 즉시 나타난다", async () => {
  render(<Home />);

  fireEvent.change(screen.getByPlaceholderText(/무슨 일인지 적어주세요/), {
    target: { value: "GENSIX-1 로그인 버그 수정" },
  });
  fireEvent.click(screen.getByRole("button", { name: "추가" }));

  expect(await screen.findByText("GENSIX-1 로그인 버그 수정")).toBeInTheDocument();
  expect(screen.getByText("GENSIX-1")).toBeInTheDocument();
});

test("완료 표시하면 열린 항목에서 빠지고 오늘 완료 구역에 나타난다", async () => {
  render(<Home />);

  fireEvent.change(screen.getByPlaceholderText(/무슨 일인지 적어주세요/), {
    target: { value: "점심 약속 잡기" },
  });
  fireEvent.click(screen.getByRole("button", { name: "추가" }));

  const checkbox = await screen.findByRole("checkbox", { name: "완료 표시" });
  fireEvent.click(checkbox);

  expect(screen.getByText("오늘 완료")).toBeInTheDocument();
  expect(screen.getByRole("checkbox", { name: "완료 되돌리기" })).toBeInTheDocument();
});
