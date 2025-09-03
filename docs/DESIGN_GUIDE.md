# The VTE Frontend Design System: A Definitive Guide

**Version:** 2.1 (NextUI Integration Edition)
**Status:** Final - Ready for Implementation
**Philosophy:** Bring Order to Chaos through Notion-like Simplicity.

---

## **1. Core Philosophy**

**"Less is More"** - We are building a functional, data-driven application. Our design must prioritize clarity, speed, and ease of use over aesthetic flair. Every design decision should be justifiable in its ability to reduce cognitive load for our users (Admins, Mentors, and Students).

### **1.1. Design Principles**
- **One Primary Action Per Screen**: Prevent decision paralysis. Each view should have a single, obvious primary action.
- **Generous Whitespace**: Ensure readability and a calm user experience.
- **Clean Typography**: Establish a clear visual hierarchy using size and weight.
- **Subtle Interactions**: All transitions and hover states will use a `200ms` duration.
- **Semantic Colors Only**: Use our limited, purpose-driven color palette.

### **1.2. Our Foundation: NextUI**
This design system is built **on top of** the **NextUI** component library. All base components (Buttons, Cards, Modals) **must** be implemented using their NextUI equivalents. The design tokens in this document will be used to theme NextUI to match our specific, minimal aesthetic.

---

## **2. The Golden Rule: How to Work with NextUI**

To prevent style conflicts and ensure absolute uniformity, follow this hierarchy of rules. **Our design system always wins.**

#### **Rule #1: Theme via `tailwind.config.ts` First**
The vast majority of styling should be achieved by configuring the NextUI plugin in your `tailwind.config.ts` file. This is the most efficient and maintainable way to apply our design tokens globally.

**Your `tailwind.config.ts` should define:**
- **Colors**: Map our semantic colors (`primary`, `success`, `danger`, `warning`) to NextUI's color system. Map our neutrals to the `background` and `foreground` tokens.
- **Border Radius**: Set a single, global border radius using our token (`rounded-lg`).
- **Fonts**: Define `fontFamily` to use our system font stack.

**Example `tailwind.config.ts`:**
```typescript
// tailwind.config.ts
import { nextui } from "@nextui-org/react";

const config = {
  // ...
  plugins: [
    nextui({
      prefix: "nextui", // Keep the prefix
      themes: {
        light: {
          layout: {
            borderRadius: {
              medium: "0.5rem", // Our global rounded-lg
            },
            boxShadow: { // Control shadows globally
              small: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
              medium: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            }
          },
          colors: {
            background: "#f8fafc",      // Our --color-neutral-50
            foreground: "#475569",      // Our --color-neutral-600
            primary: {
              DEFAULT: "#3b82f6",      // Our --color-primary-500
              foreground: "#ffffff",
            },
            danger: {
              DEFAULT: "#ef4444",       // Our --color-error
              foreground: "#ffffff",
            },
            success: "#10b981",         // Our --color-success
            warning: "#f59e0b",         // Our --color-warning
          },
        },
      },
    }),
  ],
};
```
By doing this, a `<Button color="primary">` from NextUI will automatically use *our* primary blue, not NextUI's default.

#### **Rule #2: Use `className` for Spacing and Layout ONLY**
NextUI components do not control margins or layout positioning. This is our responsibility. Use standard Tailwind utility classes for all spacing and layout.

- **✅ DO:** `<Button className="mt-4 w-full">Submit</Button>`
- **❌ DON'T:** Create a custom CSS file to style button margins.

This keeps layout concerns separate from component styling, which is a core principle of component-based design.

#### **Rule #3: Use Component Props for Variants, Never for Style**
Use NextUI's props to control the component's **variant, state, or behavior**. Do not use them to apply one-off styles.

- **✅ DO:** `<Button color="primary" variant="bordered" isLoading={true}>` (Controlling state and appearance variant)
- **❌ DON'T:** `<Button className="bg-green-500 text-white">` (This breaks the theme. If you need a green button, it should be `<Button color="success">`).
- **❌ DON'T:** `<Card className="rounded-full">` (This breaks the global border radius. If you need a different radius, it's a sign that the design system needs a new token).

#### **Rule #4: If You Can't Theme It, Wrap It**
Occasionally, you may need a component that NextUI doesn't offer, or you may need to apply a very specific, reusable style combination that isn't covered by the theme. In this rare case, create a new custom component that **wraps** the NextUI component.

**Example: A "Stat Card"**
```tsx
// src/components/shared/StatCard.tsx
import { Card, CardBody } from "@nextui-org/react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <Card shadow="sm" className="p-4">
      <CardBody className="flex flex-row items-center gap-4">
        <div className="text-primary">{icon}</div>
        <div>
          <p className="text-sm text-neutral-400">{title}</p>
          <p className="text-2xl font-bold text-neutral-900">{value}</p>
        </div>
      </CardBody>
    </Card>
  );
};
```
This encapsulates the specific layout and typography for stat cards, ensuring they are always consistent, while still being built from the core themed `Card` component.

By following these four rules, developers have a clear mental model: **the `tailwind.config.ts` is the law, component props are for state, `className` is for layout, and custom wrappers are for exceptions.** This eliminates conflicts and ensures the entire application adheres to our minimal, consistent design system.

---

## **3. Design Tokens**

Design tokens are the atomic values of our design system. All styling **must** be derived from these tokens, which are applied via the Tailwind theme configuration.

### **3.1. Color System**
Our system is semantic and minimal to ensure consistency and accessibility.

```css
/* Values to be used in tailwind.config.ts */
:root {
  /* Primary: Used ONLY for primary actions, active navigation, and focus rings. */
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  
  /* Neutral: 90% of the interface. */
  --color-neutral-50: #f8fafc;
  --color-neutral-100: #f1f5f9;
  --color-neutral-400: #94a3b8;
  --color-neutral-600: #475569;
  --color-neutral-900: #0f172a;
  
  /* Semantic States */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}
```

### **3.2. Typography System**
We use a system font stack for performance and a native feel.

```css
/* Values to be used in tailwind.config.ts */
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}
```

**Type Scale & Usage:**

| Use Case          | Size        | Weight      | Line Height | Tailwind Classes                      |
| ----------------- | ----------- | ----------- | ----------- | ------------------------------------- |
| Page Title        | `1.875rem`  | `bold`      | `1.25`      | `text-3xl font-bold leading-tight`    |
| Section Header    | `1.5rem`    | `semibold`  | `1.25`      | `text-2xl font-semibold leading-tight`|
| Card/Modal Title  | `1.25rem`   | `medium`    | `1.5`       | `text-xl font-medium leading-normal`  |
| Body Text         | `1rem`      | `normal`    | `1.75`      | `text-base font-normal leading-relaxed` |
| Labels/Secondary  | `0.875rem`  | `medium`    | `1.5`       | `text-sm font-medium leading-normal`  |

### **3.3. Spacing & Sizing System**
All margins, padding, and gaps must use this 4px-based scale.

| Token | Px   | Rem     |
| ----- | ---- | ------- |
| `1`   | 4px  | `0.25rem` |
| `2`   | 8px  | `0.5rem`  |
| `4`   | 16px | `1rem`    |
| `6`   | 24px | `1.5rem`  |
| `8`   | 32px | `2rem`    |
| `12`  | 48px | `3rem`    |
| `16`  | 64px | `4rem`    |

### **3.4. Border Radius & Shadows**
- **Border Radius**: Use `rounded-lg` (`0.5rem`) for all major components. This is set globally in the NextUI theme config.
- **Shadows**: Also set globally in the theme config. Use `shadow="sm"` for subtle elevation and `shadow="md"` for floating elements like modals.

---

## **4. Component Design Patterns**

This section defines the implementation rules for our most common components, using NextUI as the base.

### **4.1. Button (`<Button>` from NextUI)**
- **Primary**: `color="primary"`. Used for the single most important action on a screen. **Only one per view.**
- **Secondary**: `variant="bordered"`. The default for standard actions (e.g., "Cancel", "Edit").
- **Ghost**: `variant="ghost"`. For tertiary actions that should not draw attention (e.g., "View Details").
- **Destructive**: `color="danger"`. For actions that delete data. **Must always trigger a confirmation `AlertDialog`.**
- **Usage**: Props like `isLoading`, `isDisabled`, `startContent` (for icons) should be used. Spacing is controlled via `className`.

### **4.2. Card (`<Card>` from NextUI)**
- **Structure**: All cards must use `<CardHeader>`, `<CardBody>`, and optionally `<CardFooter>`.
- **Default**: The standard `<Card>` component.
- **Interactive**: Use the `isPressable={true}` and `isHoverable={true}` props.

### **4.3. Forms (NextUI Form Elements)**
- **Validation**: Use a library like `Zod` with `react-hook-form`. Validate on blur. Use the `errorMessage` prop to show clear, helpful error messages and `isInvalid` to apply the error state.
- **Labels**: All form inputs must have a `<label>`. For required fields, use `isRequired={true}` on the NextUI component, which handles the asterisk.
- **Disabled State**: Use `isDisabled={true}` to disable the entire form `fieldset` or individual inputs while a submission is in progress.

### **4.4. Data Table (`<Table>` from NextUI)**
- **Implementation**: Must be wrapped in a custom `<DataTable />` component for consistency.
- **Loading State**: While data is fetching, the `<TableBody>` must render a series of `<Skeleton>` components matching the row structure.
- **Empty State**: If the data array is empty, the `<TableBody>` must render a single row with a cell spanning all columns, displaying a clear "Empty State" message and an optional call-to-action `Button`.
- **Pagination**: For any list that may exceed 25 items, implement server-side pagination using the NextUI `<Pagination>` component below the table.

### **4.5. Modals (`<Modal>` from NextUI)**
- **Usage**: Use for forms or displaying detailed information.
- **Structure**: Must use `<ModalHeader>`, `<ModalBody>`, and `<ModalFooter>`.
- **Actions**: The primary confirmation `Button` must be the last element in the footer.
- **Confirmation for Destructive Actions**: For any action that deletes or overwrites data, you **must** use a separate, simpler `AlertDialog` component whose only purpose is to confirm the action.

---

## **5. Layout & Navigation Patterns**

### **5.1. The App Shell**
All authenticated views are rendered inside a single `<AppShell />` component.
- **Structure**: A two-column CSS grid: `280px` for the sidebar, `1fr` for the main content.
- **Content**: The main content area contains a sticky `<Header />` and the page content with a consistent padding of `p-6` (`1.5rem`) on mobile and `p-8` (`2rem`) on desktop.

### **5.2. The Sidebar**
- **Implementation**: A single, unified `<Sidebar />` component.
- **Dynamic Navigation**: The component receives a list of navigation items based on the user's role from the `AuthContext`. It filters and renders only the links the user is permitted to see.
- **Active State**: The currently active link must use the `primary` button color or a distinct background to indicate its state.

### **5.3. The Header**
- **Structure**: A sticky header at the top of the main content area.
- **Content**: It must contain a `<Breadcrumb />` component on the left for context and a `<UserProfile />` dropdown on the right for user-specific actions like "Settings" and "Logout".

---

## **6. Accessibility Standards**

- **Focus States**: All interactive elements must have a clear and visible focus state, using the primary blue color for the focus ring. This is handled by default in NextUI and should not be disabled.
- **Keyboard Navigation**: All functionality must be accessible via keyboard only. Test all flows using the Tab, Enter, and Space keys.
- **Color Contrast**: All text must meet WCAG AA contrast ratio of 4.5:1.
- **Semantic HTML**: Use semantic elements (`<nav>`, `<main>`, `<button>`) wherever possible. For custom components, use appropriate ARIA roles.
- **Labels & Alt Text**: All form inputs must have associated labels. All meaningful images must have descriptive `alt` text.

---

## **7. Implementation & Rollout Plan**

This design system will be implemented systematically to ensure a smooth transition.

- **Phase 1: Foundation (Priority 1)**
    1.  **Configure Tailwind:** Update `tailwind.config.ts` to use all the color, spacing, and typography tokens defined in this guide. This will theme the entire NextUI library.
    2.  **Establish Layout:** Build the core `<AppShell />`, `<Sidebar />`, and `<Header />` components as defined above.

- **Phase 2: Component Migration (Priority 2)**
    1.  **Replace Atomics:** Systematically replace all existing `Button`, `Input`, `Card`, etc., components throughout the app with their new, themed NextUI equivalents.
    2.  **Consolidate Sidebars:** Delete the five old sidebar components and integrate the new, role-based `<Sidebar />` into the `<AppShell />`.

- **Phase 3: Page Refactoring (Priority 3)**
    1.  **Refactor One Page at a Time:** Start with the Admin Dashboard. Apply the `<AppShell />` layout.
    2.  **Apply Patterns:** Replace old layout and component structures with the new standardized patterns (e.g., replace custom tables with the `DataTable` pattern).
    3.  **Remove Hardcoded Values:** Diligently remove all hardcoded styles (`text-[18px]`, `mb-[23px]`) and replace them with the defined tokens (`text-lg`, `mb-6`).

---

## **8. Quality Assurance & Compliance Checklist**

All code reviews must validate against this checklist.

-   **[ ] Token Compliance:** Does the code use only the defined design tokens for colors, fonts, and spacing? (No hardcoded values).
-   **[ ] Component Compliance:** Does the code use the correct NextUI components and variants as defined in the patterns? (e.g., only one primary button).
-   **[ ] Layout Compliance:** Does the page adhere to the `AppShell` structure and spacing rules?
-   **[ ] Accessibility Compliance:** Is every interactive element keyboard-navigable? Does it have a visible focus state? Are all forms and images properly labeled?
-   **[ ] Responsive Compliance:** Does the layout adapt gracefully to mobile, tablet, and desktop screens?
-   **[ ] Feedback Compliance:** Does every asynchronous action provide user feedback via a loading state (`Spinner` or `Skeleton`) and a final status (toast from `Sonner`)?