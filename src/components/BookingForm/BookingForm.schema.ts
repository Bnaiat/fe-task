import { z } from "zod";

export const passengerSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(3, "This field must be at least 3 characters long"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^\+66-\d{1}-\d{7}$/,
      "Phone number must be in format +66-X-XXXXXXX"
    ),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  birthDate: z
    .string()
    .min(1, "Birth date is required")
    .refine((dateString) => {
      const birthDate = new Date(dateString);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return birthDate <= today;
    }, "Birth date cannot be in the future"),
  passportNumber: z
    .string()
    .min(1, "Passport number is required")
    .min(3, "Passport number must be at least 3 characters long"),
  passportExpirationDate: z
    .string()
    .min(1, "Passport expiration date is required")
    .refine((dateString) => {
      const expiryDate = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      return expiryDate > today;
    }, "Passport expiration date must be in the future"),
});

export const bookingFormSchema = z
  .object({
    departureStation: z.string().min(1, "Please select a departure station"),
    arrivalStation: z.string().min(1, "Please select an arrival station"),
    passengers: z.array(passengerSchema),
  })
  .refine((data) => data.departureStation !== data.arrivalStation, {
    message: "Departure and arrival stations must be different",
    path: ["arrivalStation"],
  });

export type BookingFormSchema = z.infer<typeof bookingFormSchema>;
