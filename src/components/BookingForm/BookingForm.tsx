import { useMemo, type FC } from "react";
import { useFieldArray, useForm, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add, Remove } from "@mui/icons-material";
import { PassengerForm } from "..";
import {
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import {
  bookingFormSchema,
  type BookingFormSchema,
} from "./BookingForm.schema";
import { stations } from "./BookingForm.config";

const BookingForm: FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormSchema>({
    resolver: zodResolver(bookingFormSchema),
    reValidateMode: "onChange",
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

  const { fields, append, remove } = useFieldArray<BookingFormSchema>({
    control,
    name: "passengers",
  });

  const { field: departureStationField } = useController({
    name: "departureStation",
    control,
  });

  const { field: arrivalStationField } = useController({
    name: "arrivalStation",
    control,
  });

  const passengerCount = fields.length;

  const decrementPassengers = () => {
    if (passengerCount > 1) {
      remove(passengerCount - 1);
    }
  };

  const incrementPassengers = () => {
    append({
      fullName: "",
      phoneNumber: "",
      email: "",
      birthDate: "",
      passportNumber: "",
      passportExpirationDate: "",
    });
  };

  //For child component memoization to avoid re-rendering when parent component re-renders
  const passengerForms = useMemo(() => {
    return fields.map((field, index) => (
      <PassengerForm key={field.id} index={index} control={control} />
    ));
  }, [fields, control]);

  const onSubmit = async (data: BookingFormSchema) => {
    //submit logic here
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" align="center" gutterBottom>
        Booking Form
      </Typography>
      <Box display="flex" flexDirection="column" gap={1.5} marginX="auto">
        <Typography variant="h6" gutterBottom>
          Destination Details
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1.5} mb={2}>
          <Box flex={1}>
            <FormControl fullWidth error={!!errors.departureStation}>
              <InputLabel>Departure Station *</InputLabel>
              <Select
                data-testid="departure-station"
                label="Departure Station *"
                {...departureStationField}
                error={!!errors.departureStation}
              >
                {stations.map((station) => (
                  <MenuItem key={station} value={station} data-testid={station}>
                    {station}
                  </MenuItem>
                ))}
              </Select>
              {errors.departureStation && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.departureStation.message}
                </Typography>
              )}
            </FormControl>
          </Box>
          <Box flex={1}>
            <FormControl fullWidth error={!!errors.arrivalStation}>
              <InputLabel>Arrival Station *</InputLabel>
              <Select
                data-testid="arrival-station"
                label="Arrival Station *"
                {...arrivalStationField}
                error={!!errors.arrivalStation}
              >
                {stations.map((station) => (
                  <MenuItem key={station} value={station} data-testid={station}>
                    {station}
                  </MenuItem>
                ))}
              </Select>

              {errors.arrivalStation && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.arrivalStation.message}
                </Typography>
              )}
            </FormControl>
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">Passengers Details</Typography>

          <Box display="flex" alignItems="center" gap={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                onClick={decrementPassengers}
                disabled={passengerCount <= 1}
                color="primary"
              >
                <Remove />
              </IconButton>

              <Chip
                label={`${passengerCount} Passengers`}
                color="primary"
                variant="outlined"
                sx={{ minWidth: "40px" }}
              />

              <IconButton onClick={incrementPassengers} color="primary">
                <Add />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {passengerForms}

        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default BookingForm;
