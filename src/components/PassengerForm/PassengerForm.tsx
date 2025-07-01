import { memo, type FC } from "react";
import { useController } from "react-hook-form";
import type { PassengerFormProps } from "./PassengerForm.types";
import { Box, TextField, Typography } from "@mui/material";

const PassengerForm: FC<PassengerFormProps> = memo(({ index, control }) => {
  const {
    field: fullNameField,
    fieldState: { error: fullNameError },
  } = useController({
    name: `passengers.${index}.fullName`,
    control,
  });

  const {
    field: phoneNumberField,
    fieldState: { error: phoneNumberError },
  } = useController({
    name: `passengers.${index}.phoneNumber`,
    control,
  });

  const {
    field: emailField,
    fieldState: { error: emailError },
  } = useController({
    name: `passengers.${index}.email`,
    control,
  });

  const {
    field: birthDateField,
    fieldState: { error: birthDateError },
  } = useController({
    name: `passengers.${index}.birthDate`,
    control,
  });

  const {
    field: passportNumberField,
    fieldState: { error: passportNumberError },
  } = useController({
    name: `passengers.${index}.passportNumber`,
    control,
  });

  const {
    field: passportExpirationDateField,
    fieldState: { error: passportExpirationDateError },
  } = useController({
    name: `passengers.${index}.passportExpirationDate`,
    control,
  });

  return (
    <Box mb={5}>
      <Typography variant="body1" align="center" mb={1}>
        Passenger #{index + 1}
      </Typography>
      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
        <TextField
          label="Full Name"
          {...fullNameField}
          error={!!fullNameError}
          helperText={fullNameError?.message}
        />
        <TextField
          label="Email"
          type="email"
          {...emailField}
          error={!!emailError}
          helperText={emailError?.message}
        />
        <TextField
          label="Phone Number"
          {...phoneNumberField}
          error={!!phoneNumberError}
          helperText={phoneNumberError?.message}
        />

        <TextField
          label="Birth Date"
          slotProps={{ inputLabel: { shrink: true } }}
          type="date"
          {...birthDateField}
          error={!!birthDateError}
          helperText={birthDateError?.message}
        />
        <TextField
          label="Passport Number"
          {...passportNumberField}
          error={!!passportNumberError}
          helperText={passportNumberError?.message}
        />
        <TextField
          label="Passport Expiration Date"
          slotProps={{ inputLabel: { shrink: true } }}
          type="date"
          {...passportExpirationDateField}
          error={!!passportExpirationDateError}
          helperText={passportExpirationDateError?.message}
        />
      </Box>
    </Box>
  );
});

export default PassengerForm;
