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

## Available scripts

| Command                 | Description                                                      |
| ----------------------- | ---------------------------------------------------------------- |
| `npm start`             | Starts the local dev server. Navigate to http://localhost:4200/  |
| `npm run build`         | Builds the application for production in the dist/ folder        |
| `npm run clean`         | Clean up dist, coverage and .angular directories                 |
| `npm test`              | Runs Unit Tests using Jasmine and Karma                          |
| `npm run test:coverage` | Runs Unit Tests using Jasmine and Karma with code coverage       |
| `npm run lint`          | Runs ESLint to check for code quality and style consistency      |
| `npm run lint:fix`      | Runs ESLint and automatically fixes repairable code style issues |
| `npm run format`        | Checks if project files follow formatting rules using Prettier   |
| `npm run format:fix`    | Automatically formats the entire codebase using Prettier         |
| `npm run tsc:check`     | Runs the TypeScript compiler to verify type safety               |
| `npm run pre-commit`    | A sequence command that formats, lints, and type-checks code     |

## The Assessment

Feel free to showcase your impressive skills by thoroughly testing the app.
You have the freedom to automate test cases at **any** appropriate level.
Be prepared though to motivate why you made the choices you made.

Detailed information is located in the [QA Engineer Assessment](./ASSESSMENT.MD)

## Important notes

- For e2e/integration testing, utilize **Playwright** with TypeScript as the automation tool.
- Maintainability and scalability are important.
- Design your test keeping the 'shift left' mindset.
- Undertaking this assignment obliges you to adhere to our confidentiality and data protection policies.s
  Disclosing any information to third parties (individuals, companies, or publicly on the internet) is strictly prohibited.

## Thank you

Thank you for taking our assignment.
We are looking forward to discuss your solution.
