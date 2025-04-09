# 10. MaterialM Template Structure (`packages/main/`)

This document outlines the directory structure and purpose of key files within the `materialm-react-admin-v1-0-2/packages/main/` template, which serves as the foundation for the RISE project frontend.

## Top-Level Structure

```
materialm-react-admin-v1-0-2/
└── packages/
    └── main/
        ├── public/             # Static assets served directly by the web server
        ├── src/                # Main application source code
        ├── components.json     # Configuration for Shadcn UI component additions
        ├── index.html          # Main HTML entry point for the Vite application
        ├── netlify.toml        # Netlify deployment configuration (may be removed/adapted)
        ├── package.json        # Project dependencies and scripts
        ├── package-lock.json   # Exact dependency versions
        ├── postcss.config.js   # PostCSS configuration (used by Tailwind)
        ├── README.md           # Template README
        ├── tailwind.config.ts  # Tailwind CSS configuration
        ├── tsconfig.json       # TypeScript compiler configuration for the project
        ├── tsconfig.node.json  # TypeScript configuration for Node.js environment (e.g., Vite config)
        ├── vite.config.ts      # Vite build tool configuration
        ├── .eslintrc.cjs       # ESLint configuration file
        ├── .gitignore          # Specifies intentionally untracked files for Git
        ├── .npmrc              # npm configuration file
        └── .prettierrc         # Prettier code formatter configuration
```

## `src/` Directory Structure

This directory contains the core React application code.

```
src/
├── App.tsx             # Root React component: Sets up routing (RouterProvider), Flowbite theme, global Toaster.
├── main.tsx            # App entry point: Renders App, sets up Context providers (Customizer, Dashboard), Suspense, i18n, MSW mock API (dev).
├── vite-env.d.ts       # TypeScript definitions for Vite environment variables
|
├── api/                # Modules for interacting with backend APIs (data fetching logic)
├── assets/             # Static assets like images, fonts bundled with the app
├── components/         # Reusable UI components (see breakdown below)
├── context/            # React Context providers for global/shared state
├── css/                # Global CSS styles, fonts, or CSS modules
├── hooks/              # Custom React hooks for reusable logic
├── layouts/            # Components defining overall page layouts (see breakdown below)
├── lib/                # Utility functions, library configurations, helper modules
├── routes/             # Application routing configuration (see breakdown below)
├── types/              # TypeScript type definitions and interfaces
├── utils/              # General utility functions not specific to hooks or libs
└── views/              # Page-level components representing application screens (see breakdown below)
```

### `src/components/` Breakdown

Contains highly modular UI components, grouped by feature or library.

*   `apps/`: Components for specific pre-built applications (Mail, Chat, Contacts, Calendar, Notes, Blog, eCommerce).
*   `charts/`: Chart components (likely wrappers for ApexCharts based on `Customer.tsx` example).
*   `dashboards/`: Components specifically used within dashboard views. Grouped by dashboard type (e.g., `analytics/`, `ecommerce/`).
    *   *Example:* `dashboards/analytics/Customer.tsx` - Renders a card widget displaying customer count, percentage change, and a small trend chart.
*   `form-components/`: Components related to forms.
    *   `Form-Elements/`: Individual input controls (Autocomplete, Button, Checkbox, Radio, Date/Time, Slider, Switch).
    *   `Form-Layouts/`: Structures for organizing forms (Horizontal, Vertical, Multi-column).
    *   `Form-Validation/`: Examples of form validation integration.
    *   `FormsCustom.tsx`: Examples of custom-styled form elements.
*   `front-pages/`: Components for non-authenticated pages (common elements for landing/auth views).
*   `headless-form/`, `headless-ui/`: Components built using Headless UI library.
*   `landingpage/`: Specific components designed for the example landing page view.
*   `react-tables/`: Components for implementing tables using `react-table` (or a similar library).
*   `shadcn-form/`, `shadcn-table/`, `shadcn-ui/`: Components built using or integrating with Shadcn UI library.
*   `shared/`: Generic components reusable across the application (e.g., `CardBox.tsx`, `Logo.tsx`, `ScrollToTop.tsx`).
*   `tables/`: Other general table components or examples.
*   `theme-pages/`: Components related to theme documentation/example pages.
*   `ui-components/`: Demonstration components for base UI elements (Alerts, Badges, Modals, Tooltips, etc.).
*   `widgets/`: Small, self-contained UI modules often used on dashboards.
    *   `banners/`: Banner-style widgets.
    *   `cards/`: Various info/stat card widgets.
    *   `charts/`: Widgets primarily displaying a chart.

### `src/layouts/` Breakdown

Defines the overall structure of pages.

*   `blank/`: Minimal layout, typically used for auth pages (Login, Register) or error pages. Contains `BlankLayout.tsx`.
*   `full/`: Main application layout structure. Orchestrated by `FullLayout.tsx`.
    *   `FullLayout.tsx`: Main component determining vertical/horizontal layout via `CustomizerContext`. Renders Sidebar, Header, and the main content area via `<Outlet />`. Also includes `Customizer` panel.
    *   `vertical/`: Components for the vertical layout.
        *   `sidebar/`: Contains `Sidebar.tsx`, navigation item configurations (`Sidebaritems.ts`, `MiniSidebar.ts`), navigation components (`NavCollapse/`, `NavItems/`), `SideProfile/` component.
        *   `header/`: Contains `Header.tsx` and its child components (Search, Notifications, Profile dropdown, Language switcher, etc.).
    *   `horizontal/`: Components specific to a horizontal navigation layout (not detailed further here).
    *   `shared/`: Components shared between layout variations (e.g., `customizer/`).

### `src/views/` Breakdown

Represents the main content for different application pages/routes, assembling layouts and components.

*   `apps/`: Views for pre-built applications (Mail, Chat, etc.).
*   `authentication/`: Pages related to user authentication and status.
    *   `auth1/`, `auth2/`: Different visual styles for auth pages (Boxed, Side Layout). Contain `Login.tsx`, `Register.tsx`, `ForgotPassword.tsx`, `TwoSteps.tsx`, `CheckMail.tsx`.
        *   *Example:* `authentication/auth1/Login.tsx` - Renders the login page using the 'auth1' style (boxed layout), typically includes `authforms/AuthLogin.tsx`.
    *   `authforms/`: Reusable form logic/layout components for auth actions (`AuthLogin.tsx`, `AuthRegister.tsx`, etc.).
    *   `Error.tsx`: View for the 404 Not Found page.
    *   `Maintainance.tsx`: View for the maintenance mode page.
*   `charts/`: Pages demonstrating chart components (e.g., Area, Column, Pie charts).
*   `dashboards/`: Example dashboard pages.
*   `forms/`: Pages demonstrating form layouts.
*   `headless-form/`, `headless-ui/`: Views demonstrating Headless UI components.
*   `icons/`: Icon library demonstration page.
*   `pages/`: Miscellaneous pages (Pricing, FAQ, Account Settings, etc.).
*   `sample-page/`: A blank starter page.
*   `react-tables/`, `shadcn-tables/`, `tables/`: Pages demonstrating table components.
*   `shadcn-form/`, `shadcn-ui/`: Views demonstrating Shadcn UI components.
*   `spinner/`: View demonstrating spinners.
*   `ui-components/`: Pages demonstrating base UI components.
*   `widgets/`: Pages demonstrating widget components.

### `src/routes/` Breakdown

Contains the central routing logic.

*   `Router.tsx`: Defines application paths, maps them to specific `views` components, and assigns the appropriate `layouts`.

</rewritten_file> 