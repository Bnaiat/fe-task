import type { Control } from "react-hook-form";
import type { BookingFormSchema } from "../BookingForm/BookingForm.schema";

export interface PassengerFormProps {
  index: number;
  control: Control<BookingFormSchema>;
}
