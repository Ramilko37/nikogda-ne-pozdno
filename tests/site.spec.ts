import { test, expect } from "@playwright/test";
const programs = [
  ["pomoch", "помочь"],
  ["nachat-zanovo", "начать заново"],
  ["stat-samostoyatelnym", "стать самостоятельным"],
  ["byt-zdorovym", "быть здоровым"],
];
test("four program lights, keyboard selection, synchronization and escape", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".orb-button")).toHaveCount(4);
  for (const [, name] of programs) {
    const orb = page.getByRole("button", {
      name: "Никогда не поздно " + name,
      exact: true,
    });
    await orb.press("Enter");
    await expect(orb).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#selected-program h3")).toHaveText(
      "Никогда не поздно " + name,
    );
    await expect(
      page.locator('.program-selector [aria-pressed="true"]'),
    ).toHaveCount(1);
    await orb.press("Escape");
    await expect(page.locator("#selected-program")).toHaveCount(0);
  }
});
test("every program opens directly with project status and planned budget", async ({
  page,
}) => {
  for (const [slug, name] of programs) {
    const response = await page.goto("/programs/" + slug);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText("Никогда не поздно " + name);
    await expect(
      page.getByText("Это план расходов, не собранная сумма.", {
        exact: false,
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
});
test("reduced motion and fallback stay usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?static");
  await expect(page.locator(".earth-explorer")).toHaveAttribute(
    "data-moving",
    "false",
  );
  await expect(
    page.getByRole("button", { name: "Без анимации" }),
  ).toBeDisabled();
  await expect(page.locator(".earth-explorer")).toHaveAttribute(
    "data-renderer",
    "static",
  );
  await page
    .getByRole("button", { name: "Никогда не поздно помочь", exact: true })
    .click();
  await page
    .locator("#selected-program")
    .getByRole("link", { name: "О программе" })
    .click();
  await expect(page).toHaveURL(/\/programs\/pomoch$/);
});
test("no WebGL retains functional selection", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type.startsWith("webgl")) return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.locator(".earth-explorer")).toHaveAttribute(
    "data-renderer",
    "static",
  );
  await page
    .getByRole("button", {
      name: "Никогда не поздно быть здоровым",
      exact: true,
    })
    .click();
  await expect(page.locator("#selected-program h3")).toHaveText(
    "Никогда не поздно быть здоровым",
  );
});
test("donation remains explicitly demo and never sends a payment", async ({
  page,
}) => {
  await page.goto("/help");
  await page.getByRole("button", { name: "Разово", exact: true }).click();
  await page.getByLabel("Другая сумма, ₽").fill("750");
  await page
    .getByRole("button", { name: "Проверить выбранную сумму · демо" })
    .click();
  await expect(page.getByRole("status")).toContainText("750 ₽ разово");
  await expect(page.getByRole("status")).toContainText(
    "Пожертвование не оформлено",
  );
  await expect(page.locator("input")).toHaveCount(1);
});
test("responsive layout and 44px program targets", async ({ page }) => {
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  for (const orb of await page.locator(".orb-button").all()) {
    const bounds = await orb.boundingBox();
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
  }
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
