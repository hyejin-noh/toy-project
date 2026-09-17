import { expect, test } from "@playwright/test";

test("홈 화면이 열리고 오늘 목록 제목이 보인다", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("오늘 목록");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "오늘 목록"
  );
});
