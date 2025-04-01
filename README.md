# Bookids

Bookids is an interactive web application that creates personalized children's stories based on a child's interests. 

## Features

- Simple onboarding that collects information about the child
- Generation of personalized stories using LLM technology
- Clean, kid-friendly UI with animations
- Book preview with page navigation
- Responsive design for tablet devices

## Technical Overview

This demo uses:
- HTML5/CSS3/JavaScript for the frontend
- Node.js Express server for the backend
- Integration with Ollama's gemma3:4b model for story generation
- No frontend dependencies - pure vanilla frontend code

## Setup

### Prerequisites

1. Node.js (v14 or higher)
2. Ollama installed with the gemma3:4b model

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Ensure Ollama is running with gemma3:4b model:
   ```
   ollama run gemma3:4b
   ```

3. To run the application:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Using the LLM

By default, the application uses a simulated story generator to avoid requiring Ollama. To enable the actual LLM:

1. Make sure Ollama is running with the gemma3:4b model
2. Edit `script.js` and change `USE_REAL_LLM` to `true`
3. Refresh the page and try creating a story

## Future Enhancements

- Actual integration with LLM (Ollama/gemma3:4b)
- Image generation for story illustrations
- User accounts and saved stories
- Payment processing
- PDF export for generated books

## Project Structure

- `index.html` - Main application HTML
- `styles.css` - Styling and animations
- `script.js` - Application logic and story generation
- `server.js` - Express server for Ollama integration
- `package.json` - Node.js dependencies 