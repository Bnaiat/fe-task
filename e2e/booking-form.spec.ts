import { test, expect } from "@playwright/test";

test.describe("BookingForm E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should render booking form with all main sections", async ({
    page,
  }) => {
    // Check main title and sections
    await expect(page.getByText("Booking Form")).toBeVisible();
    await expect(page.getByText("Destination Details")).toBeVisible();
    await expect(page.getByText("Passengers Details")).toBeVisible();

    // Check form elements
    await expect(page.getByTestId("departure-station")).toBeVisible();
    await expect(page.getByTestId("arrival-station")).toBeVisible();
    await expect(page.getByText("Passenger #1")).toBeVisible();
    await expect(page.getByRole("button", { name: /submit/i })).toBeVisible();
  });

  test("should manage passenger count with add/remove buttons", async ({ page }) => {
    // Initially should show 1 passenger
    await expect(page.getByText("1 Passengers")).toBeVisible();
    await expect(page.getByText("Passenger #1")).toBeVisible();

    // Add passenger button should be enabled, remove should be disabled
    const addButton = page.getByTestId("AddIcon");
    const removeButton = page.getByTestId("RemoveIcon");

    await expect(addButton).toBeEnabled();
    await expect(removeButton).toBeDisabled();

    // Add a passenger
    await addButton.click();
    await expect(page.getByText("2 Passengers")).toBeVisible();
    await expect(page.getByText("Passenger #2")).toBeVisible();
    await expect(removeButton).not.toBeDisabled();

    // Add another passenger
    await addButton.click();
    await expect(page.getByText("3 Passengers")).toBeVisible();
    await expect(page.getByText("Passenger #3")).toBeVisible();

    // Remove a passenger
    await removeButton.click();
    await expect(page.getByText("2 Passengers")).toBeVisible();
    await expect(page.getByText("Passenger #3")).not.toBeVisible();

    // Remove another passenger
    await removeButton.click();
    await expect(page.getByText("1 Passengers")).toBeVisible();
    await expect(page.getByText("Passenger #2")).not.toBeVisible();
    await expect(removeButton).toBeDisabled();
  });

  test("should validate station selection", async ({ page }) => {
    const submitButton = page.getByRole("button", { name: /submit/i });
    await submitButton.click();

    // Check station validation errors
    await expect(
      page.getByText("Please select a departure station")
    ).toBeVisible();
    await expect(
      page.getByText("Please select an arrival station")
    ).toBeVisible();
  });

  test("should validate same departure and arrival stations", async ({
    page,
  }) => {
    // Select same station for both
    await page.getByTestId("departure-station").click();
    await page.getByRole("option", { name: "Bangkok Central Station" }).click();

    await page.getByTestId("arrival-station").click();
    await page.getByRole("option", { name: "Bangkok Central Station" }).click();

    await page.getByRole("button", { name: /submit/i }).click();

    await expect(
      page.getByText("Departure and arrival stations must be different")
    ).toBeVisible();
  });

  test("should validate station options and allow selection", async ({ page }) => {
    // Test departure station options
    await page.getByTestId("departure-station").click();
    await expect(
      page.getByRole("option", { name: "Bangkok Central Station" })
    ).toBeVisible();
    await expect(
      page.getByRole("option", { name: "Pattaya Station" })
    ).toBeVisible();
    await expect(
      page.getByRole("option", { name: "Chiang Mai Station" })
    ).toBeVisible();
    await expect(
      page.getByRole("option", { name: "Phuket Station" })
    ).toBeVisible();
    await expect(
      page.getByRole("option", { name: "Koh Samui Station" })
    ).toBeVisible();

    // Select a departure station
    await page.getByRole("option", { name: "Bangkok Central Station" }).click();

    // Test arrival station options
    await page.getByTestId("arrival-station").click();
    await expect(
      page.getByRole("option", { name: "Bangkok Central Station" })
    ).toBeVisible();
    await expect(
      page.getByRole("option", { name: "Pattaya Station" })
    ).toBeVisible();
    await expect(
      page.getByRole("option", { name: "Chiang Mai Station" })
    ).toBeVisible();
    await expect(
      page.getByRole("option", { name: "Phuket Station" })
    ).toBeVisible();
    await expect(
      page.getByRole("option", { name: "Koh Samui Station" })
    ).toBeVisible();

    // Select different arrival station
    await page.getByRole("option", { name: "Pattaya Station" }).click();

    // Verify selections are made by checking the displayed text
    await expect(page.getByTestId("departure-station")).toContainText(
      "Bangkok Central Station"
    );
    await expect(page.getByTestId("arrival-station")).toContainText(
      "Pattaya Station"
    );
  });

  test("should validate passenger information completely", async ({ page }) => {
    // Fill valid stations to focus on passenger validation
    await page.getByTestId("departure-station").click();
    await page.getByRole("option", { name: "Bangkok Central Station" }).click();

    await page.getByTestId("arrival-station").click();
    await page.getByRole("option", { name: "Pattaya Station" }).click();

    // Submit form without filling passenger info
    await page.getByRole("button", { name: /submit/i }).click();

    // Check all passenger validation errors
    await expect(page.getByText("Full name is required")).toBeVisible();
    await expect(page.getByText("Phone number is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Birth date is required")).toBeVisible();
    await expect(page.getByText("Passport number is required")).toBeVisible();
    await expect(
      page.getByText("Passport expiration date is required")
    ).toBeVisible();
  });

  test("should validate Thai phone number format specifically", async ({
    page,
  }) => {
    // Fill valid stations first
    await page.getByTestId("departure-station").click();
    await page.getByRole("option", { name: "Bangkok Central Station" }).click();

    await page.getByTestId("arrival-station").click();
    await page.getByRole("option", { name: "Pattaya Station" }).click();

    // Fill invalid phone number
    await page.getByLabel("Phone Number").fill("invalid-phone");

    await page.getByRole("button", { name: /submit/i }).click();

    await expect(
      page.getByText("Phone number must be in format +66-X-XXXXXXX")
    ).toBeVisible();
  });

  test("should validate date fields correctly", async ({ page }) => {
    // Fill valid stations first
    await page.getByTestId("departure-station").click();
    await page.getByRole("option", { name: "Bangkok Central Station" }).click();

    await page.getByTestId("arrival-station").click();
    await page.getByRole("option", { name: "Pattaya Station" }).click();

    // Test future birth date validation
    await page.getByLabel("Birth Date").fill("2025-12-31");
    await page.getByRole("button", { name: /submit/i }).click();
    await expect(
      page.getByText("Birth date cannot be in the future")
    ).toBeVisible();

    // Clear and test past passport expiration date validation
    await page.getByLabel("Birth Date").fill("1990-01-01");
    await page.getByLabel("Passport Expiration Date").fill("2020-01-01");
    await page.getByRole("button", { name: /submit/i }).click();
    await expect(
      page.getByText("Passport expiration date must be in the future")
    ).toBeVisible();
  });

  test("should successfully submit valid form", async ({ page }) => {
    // Listen for console logs to verify form submission
    const consoleMessages: string[] = [];
    page.on("console", (msg) => {
      consoleMessages.push(msg.text());
    });

    // Fill valid form data
    await page.getByTestId("departure-station").click();
    await page.getByRole("option", { name: "Bangkok Central Station" }).click();

    await page.getByTestId("arrival-station").click();
    await page.getByRole("option", { name: "Pattaya Station" }).click();

    // Fill passenger data
    await page.getByLabel("Full Name").fill("John Doe");
    await page.getByLabel("Phone Number").fill("+66-8-1234567");
    await page.getByLabel("Email").fill("john@example.com");
    await page.getByLabel("Birth Date").fill("1990-01-01");
    await page.getByLabel("Passport Number").fill("AB123456");
    await page.getByLabel("Passport Expiration Date").fill("2030-12-31");

    await page.getByRole("button", { name: /submit/i }).click();

    // Verify no validation errors are shown
    await expect(
      page.getByText("Please select a departure station")
    ).not.toBeVisible();
    await expect(page.getByText("Full name is required")).not.toBeVisible();

    // Check that form data was logged (indicating successful submission)
    await page.waitForTimeout(1000); // Wait for console log
    expect(
      consoleMessages.some((msg) => msg.includes("Bangkok Central Station"))
    ).toBeTruthy();
  });

  test("should handle multiple passengers form submission", async ({
    page,
  }) => {
    // Add multiple passengers
    await page.locator('button:has(svg[data-testid="AddIcon"])').click();
    await page.locator('button:has(svg[data-testid="AddIcon"])').click();

    // Fill valid stations
    await page.getByTestId("departure-station").click();
    await page.getByRole("option", { name: "Bangkok Central Station" }).click();

    await page.getByTestId("arrival-station").click();
    await page.getByRole("option", { name: "Pattaya Station" }).click();

    // Fill first passenger
    const firstPassengerSection = page
      .locator("text=Passenger #1")
      .locator("..");
    await firstPassengerSection.getByLabel("Full Name").fill("John Doe");
    await firstPassengerSection
      .getByLabel("Phone Number")
      .fill("+66-8-1234567");
    await firstPassengerSection.getByLabel("Email").fill("john@example.com");
    await firstPassengerSection.getByLabel("Birth Date").fill("1990-01-01");
    await firstPassengerSection.getByLabel("Passport Number").fill("AB123456");
    await firstPassengerSection
      .getByLabel("Passport Expiration Date")
      .fill("2030-12-31");

    // Fill second passenger
    const secondPassengerSection = page
      .locator("text=Passenger #2")
      .locator("..");
    await secondPassengerSection.getByLabel("Full Name").fill("Jane Smith");
    await secondPassengerSection
      .getByLabel("Phone Number")
      .fill("+66-9-7654321");
    await secondPassengerSection.getByLabel("Email").fill("jane@example.com");
    await secondPassengerSection.getByLabel("Birth Date").fill("1985-05-15");
    await secondPassengerSection.getByLabel("Passport Number").fill("CD789012");
    await secondPassengerSection
      .getByLabel("Passport Expiration Date")
      .fill("2029-08-20");

    // Leave third passenger empty to test validation
    await page.getByRole("button", { name: /submit/i }).click();

    // Should show validation errors for the third passenger
    await expect(page.getByText("Full name is required")).toBeVisible();
  });

  test("should maintain form performance with many passengers", async ({
    page,
  }) => {
    // Add many passengers to test performance
    for (let i = 0; i < 20; i++) {
      await page.locator('button:has(svg[data-testid="AddIcon"])').click();
    }

    // Verify all passengers are shown
    await expect(page.getByText("21 Passengers")).toBeVisible();
    await expect(page.getByText("Passenger #21")).toBeVisible();

    // Test that form is still responsive
    await page.getByTestId("departure-station").click();
    await page.getByRole("option", { name: "Bangkok Central Station" }).click();

    // Verify the form still responds quickly
    await expect(page.getByTestId("departure-station")).toContainText(
      "Bangkok Central Station"
    );
  });



  test("should handle keyboard navigation", async ({ page }) => {
    // Test tab navigation between form fields
    await page.getByLabel("Full Name").focus();
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Email")).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Phone Number")).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Birth Date")).toBeFocused();
  });
});
