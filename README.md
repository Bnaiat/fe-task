## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd front-task
```

### 2. Install Dependencies

```bash
npm install
```

## Available Scripts

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## Testing

### Unit Tests

Run unit tests with Vitest:

```bash
# Run tests in watch mode
npm run test:unit

# Run tests with coverage report
npm run test:unit:report
```

### End-to-End Tests

Run end-to-end tests with Playwright:

```bash
# Run e2e tests
npm run test:e2e

# Run e2e tests with UI
npm run test:e2e:ui

# View test report
npm run test:e2e:report
```

## Project Structure

```
front-task/
├── src/
│   ├── components/
│   │   ├── BookingForm/
│   │   │   ├── BookingForm.tsx           # Main booking form component
│   │   │   ├── BookingForm.schema.ts     # Zod validation schema
│   │   │   ├── BookingForm.config.ts     # Station configuration
│   │   │   └── BookingForm.test.tsx      # Unit tests
│   │   ├── PassengerForm/
│   │   │   ├── PassengerForm.tsx         # Passenger form component
│   │   │   ├── PassengerForm.types.ts    # TypeScript types
│   │   │   └── PassengerForm.test.tsx    # Unit tests
│   │   └── index.ts                      # Component exports
│   ├── test/
│   │   └── setup.ts                      # Test configuration
│   ├── App.tsx                           # Main app component
│   └── main.tsx                          # Application entry point
├── e2e/
│   ├── booking-form.spec.ts              # E2E tests for booking form
│   └── passenger-form.spec.ts            # E2E tests for passenger form
├── public/                               # Static assets
├── playwright.config.ts                  # Playwright configuration
├── vite.config.ts                        # Vite configuration
├── tsconfig.json                         # TypeScript configuration
└── package.json                          # Dependencies and scripts
```
