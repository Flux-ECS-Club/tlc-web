# Flux ECS Club 

This repository contains a React-based web application built with a modern tech stack.

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Backend / API Services**: Express (Node.js) integrating with `@google/genai`

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository and navigate into the project directory.
2. Install dependencies:

```bash
npm install
```

3. Configure Environment Variables:
   Rename `.env.example` to `.env` or `.env.local` and add your specific keys (e.g., your Gemini API key):
   
```env
GEMINI_API_KEY=your_api_key_here
```

### Running the Development Server

To start the development server:

```bash
npm run dev
```

This will run the Vite development server (accessible at `http://localhost:3000`).

### Build for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

- `src/`: Main source code containing React components, contexts, types, utility functions, and stylesheets.
- `package.json`: Contains project metadata, npm scripts, and dependencies.
- `vite.config.ts`: Configuration for the Vite bundler.
