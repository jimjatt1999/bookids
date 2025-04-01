const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Route to generate story using Ollama
app.post('/api/generate-story', async (req, res) => {
    try {
        const { name, age, interests, type } = req.body;
        
        // Create prompt for Ollama
        const prompt = `Create a children's story for a ${age} year old named ${name} who loves ${interests}. 
                      Make it a ${type} story with 5 short pages. 
                      Format the response as a JSON object with a 'title' field and a 'pages' array, 
                      where each page is an object with 'text' content.`;
        
        // Call Ollama API
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'gemma3:4b',
            prompt: prompt,
            stream: false,
            format: 'json'
        });
        
        // Parse the response
        let storyData;
        try {
            // Try to parse the response as JSON
            const generatedText = response.data.response;
            storyData = JSON.parse(generatedText);
        } catch (error) {
            console.error('Error parsing Ollama response:', error);
            
            // Fallback to a simple story format if JSON parsing fails
            storyData = {
                title: `${name}'s Story`,
                pages: [
                    { text: response.data.response }
                ]
            };
        }
        
        res.json(storyData);
    } catch (error) {
        console.error('Error generating story:', error);
        res.status(500).json({ error: 'Failed to generate story' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 