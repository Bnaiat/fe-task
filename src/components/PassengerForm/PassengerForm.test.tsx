import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, it, expect } from "vitest";
import PassengerForm from "./PassengerForm";
import type { BookingFormSchema } from "../BookingForm/BookingForm.schema";

const TestWrapper = ({ index = 0 }: { index?: number }) => {
  const { control } = useForm<BookingFormSchema>({
    defaultValues: {
      departureStation: "",
      arrivalStation: "",
      passengers: [
        {
          fullName: "",
          phoneNumber: "",
          email: "",
          birthDate: "",
          passportNumber: "",
          passportExpirationDate: "",
        },
      ],
    },
  });

  return <PassengerForm control={control} index={index} />;
};

describe("PassengerForm", () => {
  it("renders passenger form with correct index display", () => {
    render(<TestWrapper index={0} />);
    expect(screen.getByText("Passenger #1")).toBeInTheDocument();

    // Test different index
    render(<TestWrapper index={2} />);
    expect(screen.getByText("Passenger #3")).toBeInTheDocument();
  });

  it("renders all required form fields", () => {
    render(<TestWrapper />);

    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Birth Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Passport Number")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Passport Expiration Date")
    ).toBeInTheDocument();
  });

  it("has correct input types for fields", () => {
    render(<TestWrapper />);

    const emailInput = screen.getByLabelText("Email");
    const birthDateInput = screen.getByLabelText("Birth Date");
    const passportExpiryInput = screen.getByLabelText(
      "Passport Expiration Date"
    );

    expect(emailInput).toHaveAttribute("type", "email");
    expect(birthDateInput).toHaveAttribute("type", "date");
    expect(passportExpiryInput).toHaveAttribute("type", "date");
  });

  it("allows user to type in text fields", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const fullNameInput = screen.getByLabelText(
      "Full Name"
    ) as HTMLInputElement;
    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    const phoneInput = screen.getByLabelText(
      "Phone Number"
    ) as HTMLInputElement;
    const passportInput = screen.getByLabelText(
      "Passport Number"
    ) as HTMLInputElement;

    await user.type(fullNameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(phoneInput, "+66-8-1234567");
    await user.type(passportInput, "AB123456");

    expect(fullNameInput.value).toBe("John Doe");
    expect(emailInput.value).toBe("john@example.com");
    expect(phoneInput.value).toBe("+66-8-1234567");
    expect(passportInput.value).toBe("AB123456");
  });

  it("allows user to select dates", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const birthDateInput = screen.getByLabelText(
      "Birth Date"
    ) as HTMLInputElement;
    const passportExpiryInput = screen.getByLabelText(
      "Passport Expiration Date"
    ) as HTMLInputElement;

    await user.type(birthDateInput, "1990-01-15");
    await user.type(passportExpiryInput, "2030-12-31");

    expect(birthDateInput.value).toBe("1990-01-15");
    expect(passportExpiryInput.value).toBe("2030-12-31");
  });


});
