import { expect, test } from "@playwright/test";

test("app loads and shows the canvas toolbar", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Whiteboard/);

  // Toolbar renders after client-side hydration
  const toolbar = page.getByRole("button", { name: "Draw" });
  await expect(toolbar).toBeVisible({ timeout: 10000 });

  // Canvas stage is present
  const canvas = page.locator("canvas").first();
  await expect(canvas).toBeVisible();
});
