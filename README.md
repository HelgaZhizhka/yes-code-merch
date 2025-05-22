# 🦝 Yes Code Merch Store SPA

A modern, single-page e-commerce application built with React TypeScript and Vite, designed for the Yes Code team. This project serves as a practical exercise in clean architecture, full-cycle development, and collaboration using modern tools and practices.  

This pet project is designed to help the team practice clean FSD architecture, full-cycle development, and collaboration using modern tools and practices.

## Deploy 
[Yes Code Merch Store](https://yes-code-merch.netlify.app/)

## Design 
Figma design: [Yes Code Merch Store](https://www.figma.com/design/a5X7CFN20TD3ToUE415Z6N/Ecommerce-app?node-id=90-816)

## Key Features
- **Feature-Sliced Design**: A modular architecture that promotes separation of concerns and reusability.
- **Responsive Design**: A mobile-first approach to ensure a seamless experience across devices.
- **Authentication**: User authentication and authorization using Supabase.
- **State Management**: Efficient state management using Redux Toolkit or Zustand.
- **Testing**: Comprehensive testing using Vitest and Playwright for end-to-end testing.
- **CI/CD**: Automated deployment and testing using GitHub Actions.
- **Code Quality**: Linting and formatting using ESLint and Prettier.
- **Styling**: Utility-first CSS styling using Tailwind CSS for rapid UI development.
- **Routing**: Client-side routing using React Router for a smooth navigation experience.
- **Accessibility**: Ensuring the application is accessible to all users.
- **Performance**: Optimized for performance with lazy loading and code splitting.
- **SEO**: Basic SEO optimizations for better visibility in search engines.


## Technologies
- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A superset of JavaScript that adds static types.
- **Vite**: A fast build tool that provides a modern development experience.
- **Zustand**: A small, fast, and scalable bearbones state-management solution.
- **Supabase**: An open-source Firebase alternative for authentication and database.
- **Vitest**: A fast unit test framework powered by Vite.
- **Playwright**: A framework for end-to-end testing.
- **GitHub Actions**: A CI/CD tool for automating workflows.
- **ESLint**: A tool for identifying and fixing problems in JavaScript code.
- **Prettier**: An opinionated code formatter.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **React Router**: A library for routing in React applications.




## Getting Started
### Prerequisites
- Node.js (v22.15 or later)
- pnpm
- Git
- A Supabase account for authentication and database
### Installation
1. Clone the repository:
   ```bash
    git clone
   ```
2. Navigate to the project directory:
    ```bash
    cd yes-code-merch-store
    ```
3. Install dependencies:
    ```bash
    pnpm install
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
### Deployment
To deploy the application, you can use services like Netlify, Vercel, or GitHub Pages. Follow the instructions provided by your chosen service to deploy the contents of the `dist` directory.
## Contributing
We welcome contributions to this project! If you have suggestions or improvements, please open an issue or submit a pull request. Please ensure that your code adheres to the project's coding standards and includes appropriate tests.
## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
