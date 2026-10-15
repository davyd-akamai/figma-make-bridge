# GlobalHeader

Top product bar with logo, search, create button, help/community/notification icons and account.

## When to use / when not to use

- In a full page, do NOT render it. Pass `headerProps` to `DefaultCmPageTemplate` (see composition/page-shell.md).
- Render it directly only for an isolated preview.
- Default usage covers about 99% of prototypes: `<GlobalHeader />`, or only handlers, `user` and `notificationCount`.

## Import

```tsx
import { GlobalHeader, type GlobalHeaderProps, type GlobalHeaderUser } from "@make-kits/ads-components";
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `isAuthenticated` | `boolean` | `true` | `false` shows a bare "Sign in" link, no avatar |
| `user` | `{ name: string; avatarInitial: string }` | `{ name: "CloudUserName", avatarInitial: "C" }` | Shown when authenticated |
| `showSearch` | `boolean` | `true` | Fixed product surface |
| `searchPlaceholder` | `string` | tablet "Search...", desktop "Search products, IP addresses, tags..." | |
| `onSearchChange` | `(value: string) => void` | none | |
| `onCreateClick` | `() => void` | none | Create button, hidden below 600px |
| `onSignInClick` | `() => void` | none | Used only when `isAuthenticated` is `false` |
| `onMenuClick` | `() => void` | none | Hamburger, shown below 960px |
| `notificationCount` | `number` | none | Omit or `0` hides the badge. Above 9 shows "9+" |
| `logo` | `ReactNode` | Akamai logo | |
| `className` | `string` | none | Replaces ALL default styling |

## Valid values

- `isAuthenticated`: `true`, `false`.
- Invalid or non-existent props: `type`, `variant`, `layout`, `breakpoint`, `theme`, `title`, `links`, `actions`.

## Correct

```tsx
<GlobalHeader notificationCount={3} user={{ name: "Ada Lovelace", avatarInitial: "A" }} />
```

## Incorrect

```tsx
<GlobalHeader type="tablet" className="bg-slate-900" />
```

## Known footguns

- Do not vary `showSearch` or `logo` per prototype. Change them only for an explicit non-Akamai white-label case.
- Set `isAuthenticated={false}` only for a prototype that depicts a signed-out screen. It is the exception.
- Responsive layout is automatic: mobile 320-599px, tablet 600-959px, desktop 960px+. There is no prop to pick a layout. Do not force a breakpoint at another width.
- Never pass `className`. It replaces the default classes and strips the header styling.
- Never nest a second `GlobalHeader` inside `DefaultCmPageTemplate`.
