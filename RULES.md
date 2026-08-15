# Project Rules

## Package Manager

Use `pnpm` for every dependency operation in this project.

Do:

```bash
pnpm install
pnpm add <package>
pnpm add -D <package>
pnpm remove <package>
```

Do not use `npm install`, `npm add`, `yarn add`, or commit lockfiles from other package managers.

The only package lockfile that should be committed is `pnpm-lock.yaml`.

## Commit Convention

Use Gitmoji with Conventional Commits:

```text
<gitmoji> <type>: <short description>
```

Examples:

```text
✨ feat: add auth login service
🔧 chore: configure pnpm dependencies
```
