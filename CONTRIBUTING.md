# Contributing

Thank you for your interest in contributing to Knight Hacks! We are always looking for new contributors to help us improve our projects and make Knight Hacks an even greater experience for everyone!

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved!

If you need any help or have any questions, please contact Mirage on the Knight Hacks Discord server!

## About this repository

This repository is a monorepo.

- We use [pnpm](https://pnpm.io) and [`workspaces`](https://pnpm.io/workspaces) for development.
- We use [Turborepo](https://turbo.build/repo) as our build system.
- We use [Cloudflare](https://cloudflare.com) for hosting.
- We use [Prettier](https://prettier.io) for code formatting.
- We use [ESLint](https://eslint.org) for linting.
- We use [Turso](https://turso.tech) for our database.
- We use [Clerk](https://clerk.dev) for authentication.

This repository is structured as follows:

```
apps
├── admin
├── club-site
├── hackathon-site
└── socials-bot
packages
├── api
└── db
tooling
├── eslint
├── github
├── prettier
├── tailwind
└── typescript
```

| Path                  | Description                        |
| --------------------- | ---------------------------------- |
| `apps/admin`          | React admin dashboard              |
| `apps/club-site`      | Knight Hacks club website          |
| `apps/hackathon-site` | Fall 2024 hackathon website        |
| `apps/socials-bot`    | Discord bot for social events      |
| `packages/api`        | Knight Hacks API                   |
| `packages/db`         | Database schema and config         |
| `tooling/eslint`      | Eslint configuration files         |
| `tooling/github`      | GitHub Actions scripts             |
| `tooling/prettier`    | Prettier configuration files       |
| `tooling/tailwind`    | Shared Tailwind configuration file |
| `tooling/typescript`  | TypeScript configuration files     |

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
git checkout -b <project-name>/<branch-name>
```

### Install dependencies

```bash
pnpm install
```

### Run a workspace

You can use the `pnpm dev --filter=<WORKSPACE>` or `pnpm dev -F <WORKSPACE>` to run a particular workspace.

#### Examples

To run the admin dashboard:

```bash
pnpm --filter=admin dev
```

To run the api:

```bash
pnpm --filter=api dev
```

## Commit Convention

All lowercase with no period at the end. Use present tense. Something like the following is good:

```bash
git commit -m "add new feature"
```
