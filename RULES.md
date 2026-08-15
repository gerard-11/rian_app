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

## UI Direction

Use red and royal blue as the primary brand colors. Keep the interface balanced: red should be used for emphasis, destructive states, and key accents; royal blue should be used for primary actions, navigation, and focus states.

Avoid one-color themes. Neutral surfaces, white space, and readable contrast should support the red and royal blue palette.

## UI Components And Icons

Use shadcn/ui as the preferred component foundation when adding reusable UI primitives.

Use `lucide-react` for icons, including icons used inside shadcn/ui-style buttons, menus, and inputs.

## Forms

Use React Hook Form for form state and submission handling.

Use Zod for form schemas and validation. Connect React Hook Form and Zod with `@hookform/resolvers` when building forms.
