## Introduction

Hi there! 👋 Welcome to the FedEx QA assignment. We're thrilled to have you here
and can't wait to see what you come up with for the assignment. Make sure to
carefully read the requirements, and if you need any assistance, feel free to
reach out to us at any time. We're here to help!

## Pre-requisites

Before running the project, please ensure you have the following installed:

- Node.js: Version v18.x or v20.x (LTS recommended).
- NPM: Version v9.x or higher.
- Chrome Browser: Required for running Unit Tests via Karma/Jasmine.

## Installation

- Run `npm i` to install all the project dependencies.
  **IMPORTANT**
  It is highly recommended to use `npm ci` instead of `npm install`.
  This ensures that you install the exact versions of dependencies locked in the package-lock.json file, guaranteeing environment consistency across different machines.

## Available Scripts

| Command                    | Description                                                         |
| -------------------------- | ------------------------------------------------------------------- |
| `npm start`                | Starts the local dev server. Navigate to http://localhost:4200/     |
| `npm run build`            | Builds the application for production in the dist/ folder           |
| `npm run clean`            | Reset workspace by removing build artifacts, tests reports          |
| `npm test`                 | Runs Unit Tests using Jasmine and Karma                             |
| `npm run test:coverage`    | Runs Unit Tests using Jasmine and Karma with code coverage          |
| `npm run test:coverage:ci` | Runs Unit Tests using Jasmine and Karma with code coverage on CI/CD |
| `npm run test:e2e`         | Run all E2E tests                                                   |
| `npm run test:e2e:install` | Run to install Playwright Browsers                                  |
| `npm run test:e2e:update`  | Run on CI/CD to update Playwright baseline screenshots              |
| `npm run lint`             | Runs ESLint to check for code quality and style consistency         |
| `npm run lint:fix`         | Runs ESLint and automatically fixes repairable code style issues    |
| `npm run format`           | Checks if project files follow formatting rules using Prettier      |
| `npm run format:fix`       | Automatically formats the entire codebase using Prettier            |
| `npm run tsc:check`        | Runs the TypeScript compiler to verify type safety                  |
| `npm run pre-commit`       | A sequence command that formats, lints, and type-checks code        |

### Playwright Execution Guide

To ensure high maintainability and cost-effective execution, the E2E suite is designed to be highly selective. You can combine **Tags** and **Projects** to run exactly what you need.

- `npm run test:e2e:install` - Run to install Playwright Browsers
- `npm run test:e2e` - Run all tests
- `npx playwright test --grep "@functional"` - Run tests by tag
- `npx playwright test --project="Desktop Safari"` - Run tests by project
- `npx playwright test --grep "@functional|@visual" --project="Google Chrome" --project="Mobile Galaxy S24"` - Run tests by tags and projects
- `npx playwright test --ui` - Run in UI mode
- `npx playwright show-report` - View last report

## The Assessment

Feel free to showcase your impressive skills by thoroughly testing the app.
You have the freedom to automate test cases at **any** appropriate level.
Be prepared though to motivate why you made the choices you made.

Detailed information is located in the [QA Engineer Assessment](./ASSESSMENT.MD)

## Strategy & Technical Decisions

### 1. Handling External Dependency (SWAPI)

The assessment requires tests to be independent of external resources.

- **Solution**: I implemented **Network Request Mocking** using Playwright's `page.route()`.
- **Benefit**: Tests are 100% deterministic, faster, and can run in isolated CI/CD environments without hitting the live SWAPI, which avoids flakiness due to 3rd party downtime.

### 2. Testing Strategy: The "Diamond" Approach

Instead of a traditional pyramid, I focused on a "Quality Diamond" to balance speed and confidence:

- **Unit Tests (Jasmine/Karma)**: Achieved **100% code coverage** for core logic.
- **Component Tests**: Integrated within Angular to verify UI logic in isolation.
- **E2E / Integration (Playwright)**: Focused on high-value user journeys (Search, Enter key, Empty states).
- **Accessibility (a11y)**: Automated WCAG 2.1 compliance checks using `@axe-core/playwright`.

### 3. Balancing Rapid Deployment vs. E2E

In a microservices environment, full E2E tests are often too slow.

- **Strategy**: I shifted testing to the left. By mocking the API, we can test the Frontend independently of the Backend status.
- **Recommendation**: For a real production environment, I would propose **Contract Testing (e.g., Pact)** to ensure that the FE and BE remain compatible without needing full E2E suites for every deployment.

### 4. Observability & Reporting

- **Playwright HTML Report**: Includes traces and screenshots for failed tests.
- **Trace Viewer**: Configured to capture full execution traces on CI to minimize "Mean Time To Repair" (MTTR).

### 5. Code Quality Gates

- **Pre-commit hooks**: Enforced via `npm run pre-commit` (Linting, Formatting, Type-checking).
- **TypeScript**: Strict typing used throughout the test suite to ensure maintainability.

### 6. Component & Integration Testing (The Core)

This project implements a **Shift-Left** strategy by moving complex logic verification from E2E to the component level:

- **SearchFormComponent**: Verified DOM interactions (radio clicks, 'Enter' key) and Router navigation to ensure the UI-to-URL bridge is unbreakable.
- **Data Rendering**: Tested as **Pure Components** to ensure complex models are mapped correctly and edge cases are handled gracefully.
- **State & Routing**: Verified that `AppComponent` reacts correctly to URL changes and manages the loading spinner.

**Why this approach?**
By catching 100% of logic errors in **Karma/Jasmine**, the **Playwright E2E** suite remains lean, stable, and focused exclusively on high-level browser behaviors.

## Important notes

- For e2e/integration testing, utilize **Playwright** with TypeScript as the automation tool.
- Maintainability and scalability are important.
- Design your test keeping the 'shift left' mindset.
- Undertaking this assignment obliges you to adhere to our confidentiality and data protection policies.s
  Disclosing any information to third parties (individuals, companies, or publicly on the internet) is strictly prohibited.

## Thank you

Thank you for taking our assignment.
We are looking forward to discuss your solution.
