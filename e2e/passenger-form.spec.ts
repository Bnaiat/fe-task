import { test, expect } from "@playwright/test";

test.describe("PassengerForm E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should render passenger form fields correctly", async ({ page }) => {
    // Check that passenger #1 form is rendered
    await expect(page.getByText("Passenger #1")).toBeVisible();

    // Check all passenger form fields are present
    await expect(page.getByLabel("Full Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Phone Number")).toBeVisible();
    await expect(page.getByLabel("Birth Date")).toBeVisible();
    await expect(page.getByLabel("Passport Number")).toBeVisible();
    await expect(page.getByLabel("Passport Expiration Date")).toBeVisible();
  });

  test("should allow filling out passenger information", async ({ page }) => {
    // Fill out passenger information
    await page.getByLabel("Full Name").fill("John Doe");
    await page.getByLabel("Email").fill("john@example.com");
    await page.getByLabel("Phone Number").fill("+66-8-1234567");
    await page.getByLabel("Birth Date").fill("1990-01-15");
    await page.getByLabel("Passport Number").fill("AB123456");
    await page.getByLabel("Passport Expiration Date").fill("2030-12-31");

    // Verify the values are filled
    await expect(page.getByLabel("Full Name")).toHaveValue("John Doe");
    await expect(page.getByLabel("Email")).toHaveValue("john@example.com");
    await expect(page.getByLabel("Phone Number")).toHaveValue("+66-8-1234567");
    await expect(page.getByLabel("Birth Date")).toHaveValue("1990-01-15");
    await expect(page.getByLabel("Passport Number")).toHaveValue("AB123456");
    await expect(page.getByLabel("Passport Expiration Date")).toHaveValue(
      "2030-12-31"
    );
  });

  test("should handle multiple passengers correctly", async ({ page }) => {
    // Add a second passenger
    await page.getByTestId("AddIcon").click();

    // Check both passengers are visible
    await expect(page.getByText("Passenger #1")).toBeVisible();
    await expect(page.getByText("Passenger #2")).toBeVisible();
    await expect(page.getByText("2 Passengers")).toBeVisible();

    // Fill out first passenger
    const firstPassengerSection = page
      .locator("text=Passenger #1")
      .locator("..");
    await firstPassengerSection.getByLabel("Full Name").fill("John Doe");
    await firstPassengerSection.getByLabel("Email").fill("john@example.com");

    // Fill out second passenger
    const secondPassengerSection = page
      .locator("text=Passenger #2")
      .locator("..");
    await secondPassengerSection.getByLabel("Full Name").fill("Jane Smith");
    await secondPassengerSection.getByLabel("Email").fill("jane@example.com");

    // Verify both passengers have their data
    await expect(firstPassengerSection.getByLabel("Full Name")).toHaveValue(
      "John Doe"
    );
    await expect(firstPassengerSection.getByLabel("Email")).toHaveValue(
      "john@example.com"
    );
    await expect(secondPassengerSection.getByLabel("Full Name")).toHaveValue(
      "Jane Smith"
    );
    await expect(secondPassengerSection.getByLabel("Email")).toHaveValue(
      "jane@example.com"
    );
  });

  test("should preserve passenger data when adding/removing passengers", async ({
    page,
  }) => {
    // Fill first passenger
    await page.getByLabel("Full Name").fill("John Doe");
    await page.getByLabel("Email").fill("john@example.com");

    // Add second passenger
    await page.locator('button:has(svg[data-testid="AddIcon"])').click();

    // Fill second passenger
    const secondPassengerSection = page
      .locator("text=Passenger #2")
      .locator("..");
    await secondPassengerSection.getByLabel("Full Name").fill("Jane Smith");

    // Add third passenger
    await page.locator('button:has(svg[data-testid="AddIcon"])').click();

    // Remove the last passenger (3rd)
    await page.locator('button:has(svg[data-testid="RemoveIcon"])').click();

    // Verify first two passengers still have their data
    const firstPassengerSection = page
      .locator("text=Passenger #1")
      .locator("..");
    await expect(firstPassengerSection.getByLabel("Full Name")).toHaveValue(
      "John Doe"
    );
    await expect(firstPassengerSection.getByLabel("Email")).toHaveValue(
      "john@example.com"
    );

    await expect(secondPassengerSection.getByLabel("Full Name")).toHaveValue(
      "Jane Smith"
    );

    // Third passenger should be gone
    await expect(page.getByText("Passenger #3")).not.toBeVisible();
  });

  test("should handle date inputs correctly", async ({ page }) => {
    // Fill date fields
    await page.getByLabel("Birth Date").fill("1990-01-15");
    await page.getByLabel("Passport Expiration Date").fill("2030-12-31");

    // Verify date values
    await expect(page.getByLabel("Birth Date")).toHaveValue("1990-01-15");
    await expect(page.getByLabel("Passport Expiration Date")).toHaveValue(
      "2030-12-31"
    );
  });

  test("should complete full passenger form workflow", async ({ page }) => {
    // Fill stations
    await page.getByTestId("departure-station").click();
    await page.getByRole("option", { name: "Bangkok Central Station" }).click();

    await page.getByTestId("arrival-station").click();
    await page.getByRole("option", { name: "Pattaya Station" }).click();

    // Fill complete passenger information
    await page.getByLabel("Full Name").fill("John Doe");
    await page.getByLabel("Email").fill("john@example.com");
    await page.getByLabel("Phone Number").fill("+66-8-1234567");
    await page.getByLabel("Birth Date").fill("1990-01-15");
    await page.getByLabel("Passport Number").fill("AB123456");
    await page.getByLabel("Passport Expiration Date").fill("2030-12-31");

    // Submit the form
    await page.getByRole("button", { name: /submit/i }).click();

    // Verify no validation errors are shown
    await expect(page.getByText("Full name is required")).not.toBeVisible();
    await expect(page.getByText("Email is required")).not.toBeVisible();
    await expect(page.getByText("Phone number is required")).not.toBeVisible();
  });
});
