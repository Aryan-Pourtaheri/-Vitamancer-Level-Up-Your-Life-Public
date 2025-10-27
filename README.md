
# Vitamancer — Level Up Your Life

*A life RPG and gamified habit-tracker that turns your daily goals into epic quests. Build habits, earn XP, and become the hero of your own story.*

Vitamancer is a web application that transforms self-improvement into a captivating role-playing game. Instead of a boring to-do list, you get a quest log. Instead of just checking boxes, you gain experience points (XP), level up your custom character, and improve your stats. The app leverages the Google Gemini API to provide intelligent, personalized habit suggestions, acting as your personal "Quest Master."

## Core Features

-   **Deep Character Customization**: Forge a unique hero in the Vitamancer Forge. Design your own pixel-art-style avatar from scratch and distribute stat points to create a build that perfectly matches your playstyle.
-   **Gamified Habit Tracking**: Convert your habits into "Daily Quests." Each completed quest rewards you with XP, helping you level up.
-   **AI Quest Forge**: Powered by the Google Gemini API, this feature generates personalized, actionable quests based on your larger goals (e.g., "get fit," "learn to code").
-   **Point-Buy Stat System**: Your character has core RPG stats (Strength, Intelligence, Defense, Speed) that you allocate yourself. These stats grow as you level up, and can influence gameplay.
-   **Authentication Required**: User accounts are required to save progress. Vitamancer uses Supabase for secure authentication and data storage.
-   **Modern UI/UX**: A clean, responsive interface built with Tailwind CSS and Framer Motion, complete with beautiful light and dark themes.

## Tech Stack

-   **Frontend**: [React](https://reactjs.org/) with TypeScript
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **AI**: [Google Gemini API](https://ai.google.dev/)
-   **Backend & DB**: [Supabase](https://supabase.io/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) (or yarn) installed on your machine.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/vitamancer.git
    cd vitamancer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a file named `.env` in the root of your project. You will need to add the following environment variables:

    ```env
    # For Google Gemini API (AI Quest Forge feature)
    # Get your key from Google AI Studio: https://aistudio.google.com/
    API_KEY="YOUR_GEMINI_API_KEY"

    # For Supabase (saving user data)
    # Get these from your Supabase project settings
    SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```

    **Important Notes:**
    -   `SUPABASE_URL` and `SUPABASE_ANON_KEY` **must** be provided for the application to function. Without them, authentication will be disabled.
    -   If `API_KEY` is not provided, the "AI Quest Forge" feature will be disabled, but the rest of the app will function normally.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open your browser to view the application.

## Project Structure

The project follows a standard React application structure:

-   `/components`: Contains all the React components, organized by feature (e.g., `dashboard`).
-   `/lib`: Core utility functions, including the Supabase client configuration (`supabaseClient.ts`).
-   `/services`: Houses modules that interact with external APIs, like the `geminiService.ts`.
-   `/types.ts`: Defines all the core TypeScript types and interfaces used throughout the application.
-   `/App.tsx`: The main application component that handles state management and routing.
-   `/index.tsx`: The entry point of the React application.
