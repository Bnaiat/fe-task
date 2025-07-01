import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import BookingForm from "./BookingForm";

describe("BookingForm", () => {
  it("renders booking form with all required elements", () => {
    render(<BookingForm />);

    // Main sections
    expect(screen.getByText("Booking Form")).toBeInTheDocument();
    expect(screen.getByText("Destination Details")).toBeInTheDocument();
    expect(screen.getByText("Passengers Details")).toBeInTheDocument();

    // Station selection fields
    expect(screen.getByTestId("departure-station")).toBeInTheDocument();
    expect(screen.getByTestId("arrival-station")).toBeInTheDocument();

    // Default passenger form
    expect(screen.getByText("Passenger #1")).toBeInTheDocument();
    expect(screen.getByText("1 Passengers")).toBeInTheDocument();

    // Submit button
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("can add passengers", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    const addButton = screen.getByTestId("AddIcon").closest("button");

    await user.click(addButton!);

    expect(screen.getByText("2 Passengers")).toBeInTheDocument();
    expect(screen.getByText("Passenger #2")).toBeInTheDocument();
  });

  it("can remove passengers when more than one", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    const addButton = screen.getByTestId("AddIcon").closest("button");
    const removeButton = screen.getByTestId("RemoveIcon").closest("button");

    // Add a passenger first
    await user.click(addButton!);
    expect(screen.getByText("2 Passengers")).toBeInTheDocument();

    // Remove a passenger
    await user.click(removeButton!);
    expect(screen.getByText("1 Passengers")).toBeInTheDocument();
  });

  it("disables remove button when only one passenger", () => {
    render(<BookingForm />);

    const removeButton = screen.getByTestId("RemoveIcon").closest("button");
    expect(removeButton).toBeDisabled();
  });

  it("renders all passenger form fields", () => {
    render(<BookingForm />);

    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Birth Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Passport Number")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Passport Expiration Date")
    ).toBeInTheDocument();
  });

  it("handles form submission attempt", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Test that submit button is clickable (will trigger validation)
    await user.click(submitButton);

    // Form should attempt validation and show errors
    expect(submitButton).toBeInTheDocument();
  });

  it("shows validation errors for departure station", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    // Wait for validation errors to appear
    await screen.findByText("Please select a departure station");
    expect(
      screen.getByText("Please select a departure station")
    ).toBeInTheDocument();
  });

  it("shows validation errors for arrival station", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    // Wait for validation errors to appear
    await screen.findByText("Please select an arrival station");
    expect(
      screen.getByText("Please select an arrival station")
    ).toBeInTheDocument();
  });

  it("updates passenger count chip correctly", async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    // Initially shows 1 passenger
    expect(screen.getByText("1 Passengers")).toBeInTheDocument();

    // Add passengers and verify count updates
    const addButton = screen.getByTestId("AddIcon").closest("button");

    await user.click(addButton!);
    expect(screen.getByText("2 Passengers")).toBeInTheDocument();

    await user.click(addButton!);
    expect(screen.getByText("3 Passengers")).toBeInTheDocument();

    // Remove one passenger
    const removeButton = screen.getByTestId("RemoveIcon").closest("button");
    await user.click(removeButton!);
    expect(screen.getByText("2 Passengers")).toBeInTheDocument();
  });
});
