# Bookids - Kids Story Generator

A demo application that generates personalized children's stories focused on cognitive development.

## Overview

This is a proof-of-concept web application that demonstrates how AI can be used to create personalized children's stories that target specific cognitive development areas. Parents can input their child's details, select areas of cognitive development to focus on, and choose an art style for illustrations.

## Features

- Input child's information (name, gender, age)
- Select child's interests from predefined options
- Choose cognitive development areas to focus on (e.g., emotional recognition, problem-solving)
- Select preferred art style for illustrations
- Generate a personalized story with illustrations

## Demo Usage

This demo uses a mock implementation instead of making actual API calls to OpenAI. In a full implementation, it would use:
- OpenAI's GPT models for story generation
- DALL-E for image generation

## Setup Instructions

1. Clone this repository
2. Open the `index.html` file in your browser
3. Try out the demo by entering information and clicking through the workflow

## Files in this Project

- `index.html` - Main HTML file with the application structure
- `styles.css` - CSS styling for the application
- `script.js` - JavaScript code that handles the application logic
- `icons/` - Directory containing SVG icons for the sidebar

## Implementation Notes

- This is a frontend-only implementation
- In a production environment, API calls would be made server-side
- The OpenAI key input is included for demonstration but would be handled more securely in a real application
- The story generation logic currently uses mock data instead of actual API calls

## Future Enhancements

- Server-side implementation for secure API key handling
- More cognitive development areas
- Customizable characters and settings
- Audio narration option
- Progress tracking for cognitive development areas

## License

This project is created for demonstration purposes only. 