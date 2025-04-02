# SheLearns

## Overview
SheLearns is a web application focused on empowering women in tech by providing structured career roadmaps and educational paths. The application offers a chat-based interface where users can explore various tech career options and download personalized roadmaps for their chosen career path.

## Features
- Browse all available tech career paths
- Search for specific career paths
- Generate and download personalized career roadmaps in PDF format
- User-friendly chat interface

## Tech Stack
- **Frontend**: React.js with Vite
- **Styling**: Custom CSS
- **API Communication**: Axios
- **Notifications**: React-Toastify

## Project Structure
```
shelearns/
├── public/
│   └── vite.svg
├── src/
│   ├── App.jsx         # Main application component with all the functionality
│   ├── App.css         # Styling for the application
│   ├── main.jsx        # Entry point for the React application
│   └── index.css       # Global styles
└── index.html          # HTML template
```

## How It Works
The application provides a conversational interface where users can:
1. View all available career paths
2. Search for specific career paths
3. Select a career path to generate a personalized roadmap
4. Download the generated roadmap as a PDF

## Installation and Setup
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with:
   ```
   VITE_BACKEND_URL=https://shelearns-backend.onrender.com
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## API Integration
The application connects to a backend service to:
- Fetch available career paths
- Generate career roadmaps

## Development
This project uses:
- React with hooks for state management
- Vite as the build tool
- Environmental variables for configuration
