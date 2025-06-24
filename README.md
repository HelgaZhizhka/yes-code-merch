# 🦝 Yes Code Merch Store SPA

A modern, single-page e-commerce application built with React TanStack TypeScript and Vite. This project is a collaborative effort by the Yes Code team, showcasing our skills in clean architecture, full-stack development, and modern web practices.

## Deploy

[Yes Code Merch Store](https://yes-code.netlify.app/)

## Design

Figma design: [Yes Code Merch Store](https://www.figma.com/design/a5X7CFN20TD3ToUE415Z6N/Ecommerce-app?node-id=90-816)

## Technologies

- **Feature-Sliced Design**: A modular architecture that promotes separation of concerns and reusability.
- **Responsive Design**: A mobile-first approach to ensure a seamless experience across devices.
- **Accessibility**: Adherence to WCAG 2.1 standards for improved accessibility.
- **SEO Optimization**: Server-side rendering (SSR) for better search engine visibility.
- **React**: A JavaScript library for building user interfaces.
- **Tan Stack**: A set of libraries for building data-rich applications with React with SSR and SSG capabilities.
- **Zustand**: A small, fast, and scalable bearbones state-management solution.
- **Supabase**: An open-source Firebase alternative for authentication and database.
- **TypeScript**: A superset of JavaScript that adds static types.
- **Vite**: A fast build tool that provides a modern development experience.
- **Vitest**: A fast unit test framework powered by Vite.
- **Playwright**: A framework for end-to-end testing.
- **ESLint**: A tool for identifying and fixing problems in JavaScript code.
- **Prettier**: An opinionated code formatter.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.


## Getting Started

### Prerequisites

- Node.js (use v22.15 or later)
- pnpm (v8.6 or later)

### Installation

1. Clone the repository:
   ```bash
    git clone https://github.com/YesCode/yes-code-merch-store.git
   ```
2. Navigate to the project directory:
   ```bash
   cd yes-code-merch-store
   ```
3. Install dependencies:
   ```bash
   pnpm install
   pnpm start
   ```
4. Create a `.env` file in the root directory and add your Supabase credentials:
   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
5. Start the development server:
   ```bash
   pnpm dev
   ```
6. Open your browser and navigate to `http://localhost:5173` to view the application.

### Running Tests

- Unit Tests:
  ```bash
  pnpm test
  ```
- E2E Tests:
  ```bash
  pnpm test:e2e
  ```
- Linting:
  ```bash
  pnpm lint
  ```
- Formatting:
  ```bash
  pnpm format
  ```

### Building for Production

To build the application for production, run:

```bash
pnpm build
```

This will create a `dist` directory with the production-ready files. You can then deploy these files to your preferred hosting service.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
