# 👑 Kings Choice Fan Site

![Angular](https://img.shields.io/badge/Angular-22.0.0-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.0-3178C6?logo=typescript&logoColor=white)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-222?logo=githubpages&logoColor=white)

A fan site for the game **Kings Choice**, featuring interactive event content and gameplay tools.

## 📖 Overview

Kings Choice Fan Site is an Angular-based web application that provides an interactive experience for Kings Choice fans. The site includes event management and specific event gameplay features like the **Uncharted Waters** city selection tool.

## ✨ Features

- 🎯 **Event System**: Browse and interact with game events
- 🗺️ **Uncharted Waters Event**: Interactive city selection tool for event participation
- 📱 **Responsive UI**: Modern Angular components with shared UI library
- 🚀 **GitHub Pages Deployment**: Automatically deployed via CI/CD

## 🛠️ Tech Stack

- **Framework**: [Angular](https://angular.dev/) 22.0.0
- **Language**: [TypeScript](https://www.typescriptlang.org/) 6.0.0
- **Backend**: [Supabase](https://supabase.com/)
- **Testing**: Karma/Jasmine
- **Build Tool**: Angular CLI 22.0.0
- **Code Formatting**: Prettier
- **Package Manager**: npm

## 📂 Project Structure

```
src/
├── app/
│   ├── features/
│   │   ├── home/          # Home page
│   │   └── events/        # Events management
│   │       └── uncharted-waters/  # Uncharted Waters event with city tool
│   ├── shared/            # Shared UI components
│   │   ├── app-header/
│   │   ├── app-tabs/
│   │   └── app-drop/
│   ├── core/              # Constants and enums
│   │   ├── constants/     # Events data, city data
│   │   └── enums/         # Event and continent enums
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── app.ts
└── main.ts
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v9+)

### Installation

```bash
npm install
```

### Development Server

Start the development server:

```bash
npm start
```

Open your browser and navigate to `http://localhost:4200/`. The application will automatically reload when you modify any source files.

### Building

Build the project for production:

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

### Running Tests

Execute unit tests with [Karma](https://karma-runner.github.io):

```bash
npm test
```

### Code Formatting

Format all code using Prettier:

```bash
npm run format
```

## 🌐 Deployment

This project is deployed to GitHub Pages. The deployment is managed via the Angular CLI GitHub Pages plugin (`angular-cli-ghpages`).

## 🤝 Contributing

When adding new features or components:

1. Use Angular CLI scaffolding for consistency:
   ```bash
   ng generate component feature-name
   ```
2. Follow the existing folder structure
3. Run tests and formatting before committing:
   ```bash
   npm test
   npm run format
   ```
4. Use conventional commit messages

## 📚 Resources

- [Angular Documentation](https://angular.dev/)
- [Angular CLI Guide](https://angular.dev/tools/cli)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Kings Choice Game](https://www.kingschoice.com/)

---

<p align="center">Made with ❤️ for the Kings Choice community</p>
