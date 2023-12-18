# Contributing

Thank you for your interest in contributing to KnightHacks! We are always looking for new contributors to help us improve our projects and make KnightHacks an even greater experience for everyone!

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved!

If you need any help or have any questions, please contact Mirage on the KnightHacks Discord server!

## About this repository

This repository is a monorepo.

- We use [pnpm](https://pnpm.io) and [`workspaces`](https://pnpm.io/workspaces) for development.
- We use [Turborepo](https://turbo.build/repo) as our build system.
- We use [Vercel](https://vercel.com) for hosting.
- We use [Prettier](https://prettier.io) for code formatting.
- We use [ESLint](https://eslint.org) for linting.
  This repository is structured as follows:

```
apps
└── admin
packages
├── api
└── db
```

| Path           | Description                |
| -------------- | -------------------------- |
| `apps/admin`   | React admin dashboard      |
| `packages/api` | Hono tRPC server           |
| `packages/db`  | Database schema and config |

## Development

### Clone on your local machine

```bash
git clone https://github.com/KnightHacks/knighthacks.git
```

### Navigate to project directory

```bash
cd knighthacks
```

### Create a new Branch

```bash
git checkout -b my-new-branch
```

### Install dependencies

```bash
pnpm install
```

### Run a workspace

You can use the `pnpm --filter=[WORKSPACE]` command to start the development process for a workspace.

#### Examples

1. To run the admin dashboard:

```bash
pnpm --filter=admin dev
```

2. To run the `api` package:

```bash
pnpm --filter=api dev
```

## Commit Convention

All lowercase with no period at the end. Use present tense. Something like the following is good:

```bash
git commit -m "add new feature"
```
