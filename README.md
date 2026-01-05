# UCL Web Development (LAIT)

Bachelor project by Isabella & Mai.

This project is a **course management web application prototype (v1.0)** developed as part of the Web Development Bachelor programme at UCL.  
The application focuses on managing courses and related data and serves as a **functional prototype**, not a production-ready system.

## Tech stack

- Frontend: Vue 3 + Vite
- Language: TypeScript
- Styling: Tailwind CSS
- Backend / Database: Supabase
- Linting & formatting: ESLint, Prettier
- Testing: Vitest

## Prerequisites

Node.js and npm must be installed on the system.
While these specific versions may not be required exactly, the project has been developed and is stable with these versions:

- Node.js v22 or newer
- npm v11 or newer

## Installation

Create a `.env` file in the root of the project.

The required environment variables are shown below.  
The actual Supabase URL and key are provided in a **separate document included with the project delivery**.

```sh
VITE_SUPABASE_URL=https://<insert_id>.supabase.co
VITE_SUPABASE_KEY=abc...xyz
VITE_HOST_URL=http://localhost:5173
```

Run this command to install all dependencies:

```sh
npm install
```

## Run the project

### Compile and hot-reload for development

```sh
npm run dev
```

### Compile and minify for production

```sh
npm run build
```

## Useful commands

The following commands are available for development and quality assurance:

### Run unit tests

```sh
npm run test:unit
```

### Run prettier format check

```sh
npm run format:check
```

Auto-fix prettier format complaints

```sh
npm run format
```

### Run ESLint check

```sh
npm run lint
```

### Run typescript type check

```sh
npm run type-check
```
