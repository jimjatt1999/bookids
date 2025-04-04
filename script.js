// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Age slider
    const ageSlider = document.getElementById('age-slider');
    const ageValue = document.querySelector('.slider-value');
    
    if (ageSlider) {
        ageSlider.addEventListener('input', () => {
            ageValue.textContent = ageSlider.value;
        });
    }
    
    // Interest options
    const interestOptions = document.querySelectorAll('.interest-option');
    interestOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Limit to 3 selections
            const selectedCount = document.querySelectorAll('.interest-option.selected').length;
            
            if (option.classList.contains('selected')) {
                option.classList.remove('selected');
            } else if (selectedCount < 3) {
                option.classList.add('selected');
            }
        });
    });
    
    // Gender toggle
    const genderOptions = document.querySelectorAll('.toggle-option');
    genderOptions.forEach(option => {
        option.addEventListener('click', () => {
            genderOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });
    
    // Story length options
    const lengthOptions = document.querySelectorAll('.length-option');
    lengthOptions.forEach(option => {
        option.addEventListener('click', () => {
            lengthOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });
    
    // Cognitive card selection
    const cognitiveCards = document.querySelectorAll('.cognitive-card');
    cognitiveCards.forEach(card => {
        card.addEventListener('click', () => {
            // Limit to 2 selections
            const selectedCount = document.querySelectorAll('.cognitive-card.selected').length;
            
            if (card.classList.contains('selected')) {
                card.classList.remove('selected');
            } else if (selectedCount < 2) {
                card.classList.add('selected');
            }
        });
    });
    
    // Art style selection
    const artStyleCards = document.querySelectorAll('.art-style-card');
    artStyleCards.forEach(card => {
        card.addEventListener('click', () => {
            artStyleCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
    });
    
    // Initialize character manager
    initializeCharacterManager();
    
    // Initialize library
    loadLibrary();
    
    // Apply saved user preferences
    applyUserPreferences();
    
    // Create New Story button in result view
    const createNewButton = document.getElementById('create-new-story');
    if (createNewButton) {
        createNewButton.addEventListener('click', () => {
            showBasicInfoForm();
        });
    }
});

// Navigation Functions
function showSetupForm() {
    document.getElementById('cognitive-areas').style.display = 'none';
    document.getElementById('library-view').style.display = 'none';
    document.getElementById('setup-form').style.display = 'block';
}

function showCognitiveAreas() {
    document.getElementById('story-details-form').style.display = 'none';
    document.getElementById('basic-info-form').style.display = 'none';
    document.getElementById('art-styles').style.display = 'none';
    document.getElementById('cognitive-areas').style.display = 'block';
}

function showArtStyles() {
    document.getElementById('cognitive-areas').style.display = 'none';
    document.getElementById('story-result').style.display = 'none';
    document.getElementById('basic-info-form').style.display = 'none';
    document.getElementById('story-details-form').style.display = 'none';
    document.getElementById('art-styles').style.display = 'block';
}

function showStoryResult() {
    document.getElementById('art-styles').style.display = 'none';
    document.getElementById('story-result').style.display = 'block';
}

function showMainPage() {
    document.getElementById('library-view').style.display = 'none';
    document.getElementById('story-result').style.display = 'none';
    document.getElementById('cognitive-areas').style.display = 'none';
    document.getElementById('art-styles').style.display = 'none';
    document.getElementById('story-details-form').style.display = 'none';
    document.getElementById('basic-info-form').style.display = 'block';
    
    // Reset menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector('.menu-item:first-child').classList.add('active');
}

function showLibrary() {
    document.getElementById('basic-info-form').style.display = 'none';
    document.getElementById('story-details-form').style.display = 'none';
    document.getElementById('story-result').style.display = 'none';
    document.getElementById('cognitive-areas').style.display = 'none';
    document.getElementById('art-styles').style.display = 'none';
    document.getElementById('library-view').style.display = 'block';
    
    // Reset menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector('.menu-item:nth-child(2)').classList.add('active');
    
    // Refresh library
    updateLibraryView();
}

// Navigation Functions for multi-page form
function showBasicInfoForm() {
    document.getElementById('story-details-form').style.display = 'none';
    document.getElementById('cognitive-areas').style.display = 'none';
    document.getElementById('basic-info-form').style.display = 'block';
}

function showStoryDetailsForm() {
    document.getElementById('basic-info-form').style.display = 'none';
    document.getElementById('cognitive-areas').style.display = 'none';
    document.getElementById('story-details-form').style.display = 'block';
}

// Character management
function initializeCharacterManager() {
    const addCharacterBtn = document.getElementById('add-character-btn');
    const charactersContainer = document.getElementById('characters-container');
    
    // Add click event to the add character button
    if (addCharacterBtn) {
        addCharacterBtn.addEventListener('click', () => {
            addCharacterInput();
        });
    }
    
    // Function to add a new character input
    function addCharacterInput() {
        const characterId = Date.now(); // Unique ID for each character
        const characterDiv = document.createElement('div');
        characterDiv.className = 'character-input-group';
        characterDiv.dataset.id = characterId;
        
        characterDiv.innerHTML = `
            <input type="text" class="text-input character-input" placeholder="Character name and description, e.g., 'Sister Emma'">
            <button type="button" class="remove-character-btn" onclick="removeCharacter(${characterId})">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        
        charactersContainer.appendChild(characterDiv);
    }
}

// Remove a character input
function removeCharacter(characterId) {
    const characterElement = document.querySelector(`.character-input-group[data-id="${characterId}"]`);
    if (characterElement) {
        characterElement.remove();
    }
}

// Collect all character inputs
function collectCharacters() {
    const characters = [];
    const characterInputs = document.querySelectorAll('.character-input');
    
    characterInputs.forEach(input => {
        const value = input.value.trim();
        if (value) {
            characters.push(value);
        }
    });
    
    return characters;
}

// Validate API key format
function validateApiKey(apiKey) {
    if (!apiKey) {
        return { valid: false, message: 'Please enter your OpenAI API key' };
    }
    
    apiKey = apiKey.trim();
    
    if (!apiKey.startsWith('sk-')) {
        return { 
            valid: false, 
            message: 'Invalid API key format. OpenAI API keys should start with "sk-"' 
        };
    }
    
    if (apiKey.length < 20) {
        return { 
            valid: false, 
            message: 'Invalid API key length. OpenAI API keys are typically at least 20 characters long' 
        };
    }
    
    return { valid: true };
}

// Generate story function
async function generateStory() {
    // Show loading spinner
    document.getElementById('loading').style.display = 'flex';
    
    // Gather user inputs
    const apiKey = document.getElementById('openai-key').value;
    const childName = document.getElementById('child-name').value || 'Alex';
    const childGender = document.querySelector('.toggle-option.active').textContent;
    const childAge = document.getElementById('age-slider').value;
    const storyLength = document.querySelector('.length-option.active').getAttribute('data-length') || 'short';
    const customPrompt = document.getElementById('custom-prompt').value || '';
    
    // Get characters from the new interface
    const characters = collectCharacters();
    
    const selectedInterests = [];
    document.querySelectorAll('.interest-option.selected').forEach(interest => {
        selectedInterests.push(interest.textContent);
    });
    
    const selectedCognitiveAreas = [];
    document.querySelectorAll('.cognitive-card.selected').forEach(area => {
        selectedCognitiveAreas.push({
            name: area.querySelector('h3').textContent,
            description: area.querySelector('p').textContent
        });
    });
    
    const selectedArtStyle = document.querySelector('.art-style-card.selected') ? 
        document.querySelector('.art-style-card.selected').getAttribute('data-style') : 
        'watercolor';
    
    // Validate API key
    const keyValidation = validateApiKey(apiKey);
    if (!keyValidation.valid) {
        showErrorMessage(`❌ API Key Error\n\n${keyValidation.message}\n\nPlease check your API key and try again. You can find your API keys at https://platform.openai.com/api-keys`);
        document.getElementById('loading').style.display = 'none';
        return;
    }
    
    try {
        // Generate story with GPT-3.5
        const storyPrompt = generateStoryPrompt(childName, childGender, childAge, selectedInterests, selectedCognitiveAreas, storyLength, customPrompt, characters);
        console.log('Story prompt:', storyPrompt); // Debug - log the prompt
        
        const storyResponse = await callChatGPT(apiKey, storyPrompt);
        console.log('Story response:', storyResponse); // Debug - log the raw response
        
        // Parse story content
        const storyData = parseStoryResponse(storyResponse, childName, selectedInterests);
        
        // Generate illustration with DALL-E
        const imagePrompt = generateImagePrompt(childName, childGender, storyData.title, selectedArtStyle);
        console.log('Image prompt:', imagePrompt); // Debug - log the image prompt
        
        const imageUrl = await generateImageWithDALLE(apiKey, imagePrompt);
        
        // Save the current story data for library saving
        window.currentStoryData = {
            title: storyData.title,
            content: storyData.content,
            imageUrl: imageUrl,
            meta: {
                childName: childName,
                childAge: childAge,
                childGender: childGender,
                interests: selectedInterests,
                cognitiveAreas: selectedCognitiveAreas.map(area => area.name),
                artStyle: selectedArtStyle,
                storyLength: storyLength,
                customPrompt: customPrompt,
                characters: characters,
                dateCreated: new Date().toISOString()
            }
        };
        
        // Save user preferences to localStorage for future sessions
        saveUserPreferences({
            childName,
            childGender,
            childAge,
            selectedInterests,
            customPrompt,
            characters
        });
        
        // Display the story and image
        displayStory(storyData, imageUrl, selectedCognitiveAreas);
        
        // Hide loading and show result
        document.getElementById('loading').style.display = 'none';
        showStoryResult();
    } catch (error) {
        console.error('Error generating story:', error);
        
        // Create a more user-friendly and verbose error message
        let errorMessage = 'There was an error generating your story.';
        let errorDetails = '';
        let errorSolution = '';
        
        // Extract error message
        const errorText = error.message || '';
        
        // Check for common error patterns
        if (errorText.includes('401') || errorText.includes('Authentication') || errorText.includes('Unauthorized')) {
            errorMessage = '❌ Authentication Error';
            errorDetails = 'Your OpenAI API key is invalid, expired, or was entered incorrectly.';
            errorSolution = 'Please check that you\'ve entered your API key correctly. You can find or create new API keys at https://platform.openai.com/api-keys';
        } else if (errorText.includes('quota') || errorText.includes('billing')) {
            errorMessage = '❌ API Quota Exceeded';
            errorDetails = 'Your OpenAI account has reached its usage limit.';
            errorSolution = 'Please check your OpenAI billing settings at https://platform.openai.com/account/billing to add payment information or upgrade your plan.';
        } else if (errorText.includes('invalid_api_key') || errorText.includes('api key')) {
            errorMessage = '❌ Invalid API Key';
            errorDetails = 'The OpenAI API key you provided is invalid or has been revoked.';
            errorSolution = 'Please check your API key and try again. You can find your API keys at https://platform.openai.com/api-keys';
        } else if (errorText.includes('rate limit') || errorText.includes('rate_limit')) {
            errorMessage = '❌ Rate Limit Exceeded';
            errorDetails = 'You\'ve made too many requests in a short time period.';
            errorSolution = 'Please wait a few minutes before trying again.';
        } else if (errorText.toLowerCase().includes('connectivity') || errorText.includes('network')) {
            errorMessage = '❌ Network Error';
            errorDetails = 'Unable to connect to OpenAI servers.';
            errorSolution = 'Please check your internet connection and try again.';
        } else {
            // Generic error
            errorDetails = errorText;
            errorSolution = 'Please try again. If this issue persists, check the console for more details.';
        }
        
        // Show error in console for debugging
        console.log('Full error details:', {
            error: error,
            stack: error.stack,
            message: errorText
        });
        
        // Create a formatted error message
        const formattedError = `${errorMessage}\n\n${errorDetails}\n\n${errorSolution}`;
        
        // Show error to user
        showErrorMessage(formattedError);
        document.getElementById('loading').style.display = 'none';
    }
}

// Generate prompt for the story
function generateStoryPrompt(name, gender, age, interests, cognitiveAreas, storyLength, customPrompt, characters = []) {
    // Set pronouns based on gender
    const pronoun = gender === 'Boy' ? 'he' : 'she';
    const possessive = gender === 'Boy' ? 'his' : 'her';
    
    // Build interest string
    const interestsStr = interests.length > 0 
        ? interests.join(', ') 
        : 'exploration and learning';
    
    // Build cognitive areas string
    const cognitiveAreasStr = cognitiveAreas.map(area => area.name).join(', ');
    
    // Build characters string
    const charactersStr = characters.length > 0
        ? `Include these additional characters in the story: ${characters.join(', ')}. `
        : '';
    
    // Set word count based on length
    let wordCount = 200;
    if (storyLength === 'medium') wordCount = 400;
    if (storyLength === 'long') wordCount = 600;
    
    // Create the prompt
    let prompt = `Create a ${storyLength} children's story (around ${wordCount} words) about a ${age}-year-old ${gender.toLowerCase()} named ${name} who loves ${interestsStr}. ${charactersStr}`;
    
    if (cognitiveAreas.length > 0) {
        prompt += `The story should focus on developing these cognitive areas: ${cognitiveAreasStr}. `;
        
        // Add specific instructions for each cognitive area
        cognitiveAreas.forEach(area => {
            if (area.name.includes('Emotional')) {
                prompt += `For emotional recognition, include scenarios where ${name} identifies and names feelings. `;
            }
            
            if (area.name.includes('Problem Solving')) {
                prompt += `For problem solving, include a challenge that ${name} solves through logical thinking. `;
            }
            
            if (area.name.includes('Attention')) {
                prompt += `For attention and focus, include a scenario where ${name} needs to concentrate despite distractions. `;
            }
            
            if (area.name.includes('Memory')) {
                prompt += `For memory development, include opportunities for ${name} to recall and use information. `;
            }
            
            if (area.name.includes('Language')) {
                prompt += `For language development, include rich vocabulary and dialogue. `;
            }
            
            if (area.name.includes('Executive Function')) {
                prompt += `For executive function, include planning, self-control, and decision-making. `;
            }
            
            if (area.name.includes('Conceptual')) {
                prompt += `For conceptual understanding, include connections between ideas and categorization. `;
            }
        });
    }
    
    // Add custom prompt if provided
    if (customPrompt && customPrompt.trim() !== '') {
        prompt += `\nAdditional story elements: ${customPrompt.trim()} `;
    }
    
    prompt += `
    The story should be appropriate for a ${age}-year-old child and be around ${wordCount} words.
    
    Format your response as JSON with the following structure:
    {
      "title": "A creative title for the story",
      "content": "The full story content"
    }`;
    
    return prompt;
}

// Generate prompt for DALL-E image
function generateImagePrompt(name, gender, title, artStyle) {
    const pronoun = gender === 'Boy' ? 'boy' : 'girl';
    
    let styleDescription = '';
    switch(artStyle) {
        case 'watercolor':
            styleDescription = 'watercolor illustration style, soft pastel colors';
            break;
        case 'digital':
            styleDescription = 'digital vector illustration style, bright colors';
            break;
        case 'pen-ink':
            styleDescription = 'pen and ink illustration with color washes, detailed linework';
            break;
        case 'collage':
            styleDescription = 'mixed media collage style, textured and colorful';
            break;
        case '3d':
            styleDescription = '3D rendered illustration, friendly and colorful';
            break;
        default:
            styleDescription = 'children\'s book illustration style';
    }
    
    return `A child-friendly illustration for a children's book titled "${title}". 
    Show a ${pronoun} named ${name} as the main character. 
    The illustration should be in ${styleDescription}. 
    The image should be appealing to young children, with no text.
    Make it colorful, friendly, and suitable for a children's book.`;
}

// Parse the GPT response 
function parseStoryResponse(response, childName, interests) {
    try {
        const jsonData = JSON.parse(response);
        return {
            title: jsonData.title || `${childName}'s ${interests.length > 0 ? interests[0] : 'Adventure'} Day`,
            content: jsonData.content || response
        };
    } catch (error) {
        console.error('Error parsing story JSON:', error);
        // If JSON parsing fails, return the raw text
        return {
            title: `${childName}'s ${interests.length > 0 ? interests[0] : 'Adventure'} Day`,
            content: response
        };
    }
}

// Display the story and image
function displayStory(storyData, imageUrl, cognitiveAreas) {
    // Set title
    document.getElementById('story-title').textContent = storyData.title;
    
    // Split the content into paragraphs
    const paragraphs = storyData.content.split('\n\n').filter(para => para.trim());
    
    // Store paragraphs and current page in window object for pagination
    window.storyPagination = {
        paragraphs: paragraphs,
        currentPage: 0,
        totalPages: paragraphs.length
    };
    
    // Display the first page
    displayStoryPage(0);
    
    // Set image
    document.getElementById('story-illustration').src = imageUrl;
    
    // Add cognitive details
    const cognitiveDetailsContainer = document.getElementById('cognitive-details');
    cognitiveDetailsContainer.innerHTML = '';
    
    cognitiveAreas.forEach(area => {
        const detailCard = document.createElement('div');
        detailCard.className = 'cognitive-detail-card';
        detailCard.innerHTML = `
            <h4>${area.name}</h4>
            <p>${area.description}</p>
        `;
        cognitiveDetailsContainer.appendChild(detailCard);
    });
    
    // Setup pagination controls
    setupPaginationControls();
}

// Display a specific page of the story
function displayStoryPage(pageIndex) {
    if (!window.storyPagination) return;
    
    const { paragraphs, totalPages } = window.storyPagination;
    
    // Validate page index
    if (pageIndex < 0) pageIndex = 0;
    if (pageIndex >= totalPages) pageIndex = totalPages - 1;
    
    // Update current page
    window.storyPagination.currentPage = pageIndex;
    
    // Get the paragraph for this page
    const paragraph = paragraphs[pageIndex];
    
    // Format the paragraph with proper HTML
    const formattedParagraph = `<p>${paragraph}</p>`;
    
    // Get elements, checking if they exist
    const storyTextEl = document.getElementById('story-text');
    const pageNumberEl = document.getElementById('page-number');
    
    // Update the page content if element exists
    if (storyTextEl) {
        storyTextEl.innerHTML = formattedParagraph;
    }
    
    // Update page number if element exists
    if (pageNumberEl) {
        pageNumberEl.textContent = (pageIndex + 1);
    }
    
    // Update pagination controls visibility
    updatePaginationControls();
}

// Setup pagination controls
function setupPaginationControls() {
    // Make sure pagination data exists
    if (!window.storyPagination) return;
    
    // Create pagination controls if they don't exist
    if (!document.getElementById('pagination-controls')) {
        const paginationControls = document.createElement('div');
        paginationControls.id = 'pagination-controls';
        paginationControls.className = 'pagination-controls';
        paginationControls.innerHTML = `
            <button id="prev-page" class="page-nav-btn prev-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5"></path>
                    <path d="M12 19l-7-7 7-7"></path>
                </svg>
            </button>
            <div class="page-indicator">
                Page <span id="current-page">1</span> of <span id="total-pages">1</span>
            </div>
            <button id="next-page" class="page-nav-btn next-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                </svg>
            </button>
        `;
        
        // Get the book container
        const bookContainer = document.querySelector('.book-pages');
        if (bookContainer) {
            // Add controls after the book container
            bookContainer.insertAdjacentElement('afterend', paginationControls);
            
            // Add event listeners
            const prevPage = document.getElementById('prev-page');
            const nextPage = document.getElementById('next-page');
            
            if (prevPage) prevPage.addEventListener('click', navigateToPrevPage);
            if (nextPage) nextPage.addEventListener('click', navigateToNextPage);
        }
    }
    
    // Update the pagination info if elements exist
    const totalPagesEl = document.getElementById('total-pages');
    const currentPageEl = document.getElementById('current-page');
    
    if (totalPagesEl) {
        totalPagesEl.textContent = window.storyPagination.totalPages;
    }
    
    if (currentPageEl) {
        currentPageEl.textContent = window.storyPagination.currentPage + 1;
    }
    
    // Show/hide buttons based on current page
    updatePaginationControls();
}

// Update visibility of pagination controls
function updatePaginationControls() {
    if (!window.storyPagination) return;
    
    const { currentPage, totalPages } = window.storyPagination;
    
    // Check if elements exist before trying to update them
    const currentPageEl = document.getElementById('current-page');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    // If any of these elements don't exist, exit early
    if (!currentPageEl || !prevBtn || !nextBtn) return;
    
    // Update page indicator
    currentPageEl.textContent = currentPage + 1;
    
    // Update button states
    prevBtn.disabled = currentPage === 0;
    prevBtn.style.opacity = currentPage === 0 ? 0.5 : 1;
    
    nextBtn.disabled = currentPage === totalPages - 1;
    nextBtn.style.opacity = currentPage === totalPages - 1 ? 0.5 : 1;
}

// Navigate to the previous page
function navigateToPrevPage() {
    if (!window.storyPagination) return;
    
    const newPage = window.storyPagination.currentPage - 1;
    if (newPage >= 0) {
        displayStoryPage(newPage);
    }
}

// Navigate to the next page
function navigateToNextPage() {
    if (!window.storyPagination) return;
    
    const newPage = window.storyPagination.currentPage + 1;
    if (newPage < window.storyPagination.totalPages) {
        displayStoryPage(newPage);
    }
}

// Call OpenAI's Chat API (GPT-3.5)
async function callChatGPT(apiKey, prompt) {
    try {
        console.log('Making API call to OpenAI...');
        
        // Basic validation of API key format
        if (!apiKey || !apiKey.trim().startsWith('sk-') || apiKey.trim().length < 20) {
            throw new Error('Invalid API key format. OpenAI API keys should start with "sk-" and be at least 20 characters long.');
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey.trim()}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo-0125',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a children\'s story author specializing in educational stories that support cognitive development.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7
            })
        });
        
        console.log('API response received, status:', response.status);
        
        // Check for HTTP errors
        if (!response.ok) {
            // Try to get error details from the response
            try {
                // Special case for 401 errors
                if (response.status === 401) {
                    throw new Error('Authentication error (401): Your API key is invalid or has expired. Please check your OpenAI API key and try again.');
                }
                
                const errorData = await response.json();
                if (errorData.error) {
                    throw new Error(`OpenAI API error: ${errorData.error.message || errorData.error.type || 'Unknown error'}`);
                } else {
                    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
                }
            } catch (jsonError) {
                // If we can't parse JSON, use the status text
                // If it's a 401 error, provide a specific message
                if (response.status === 401) {
                    throw new Error('Authentication error (401): Your API key is invalid or has expired. Please check your OpenAI API key and try again.');
                }
                throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
            }
        }
        
        const data = await response.json();
        console.log('API response data:', data);
        
        if (data.error) {
            throw new Error(`OpenAI API error: ${data.error.message || data.error.type || 'Unknown error'}`);
        }
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response from OpenAI API: No message content found');
        }
        
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        throw error; // Rethrow to be handled by the main try/catch block
    }
}

// Generate image with DALL-E
async function generateImageWithDALLE(apiKey, prompt) {
    try {
        console.log('Making API call to DALL-E...');
        
        // Basic validation of API key format
        if (!apiKey || !apiKey.trim().startsWith('sk-') || apiKey.trim().length < 20) {
            throw new Error('Invalid API key format. OpenAI API keys should start with "sk-" and be at least 20 characters long.');
        }
        
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey.trim()}`
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: '1024x1024'
            })
        });
        
        console.log('DALL-E API response received, status:', response.status);
        
        // Check for HTTP errors
        if (!response.ok) {
            // Try to get error details from the response
            try {
                // Special case for 401 errors
                if (response.status === 401) {
                    throw new Error('Authentication error (401): Your API key is invalid or has expired. Please check your OpenAI API key and try again.');
                }
                
                const errorData = await response.json();
                if (errorData.error) {
                    throw new Error(`DALL-E API error: ${errorData.error.message || errorData.error.type || 'Unknown error'}`);
                } else {
                    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
                }
            } catch (jsonError) {
                // If we can't parse JSON, use the status text
                // If it's a 401 error, provide a specific message
                if (response.status === 401) {
                    throw new Error('Authentication error (401): Your API key is invalid or has expired. Please check your OpenAI API key and try again.');
                }
                throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
            }
        }
        
        const data = await response.json();
        console.log('DALL-E API response data:', data);
        
        if (data.error) {
            throw new Error(`DALL-E API error: ${data.error.message || data.error.type || 'Unknown error'}`);
        }
        
        if (!data.data || !data.data[0] || !data.data[0].url) {
            throw new Error('Invalid response from DALL-E API: No image URL found');
        }
        
        return data.data[0].url;
    } catch (error) {
        console.error('Error generating image:', error);
        console.log('Falling back to placeholder image');
        // For image generation, we can use a fallback and not throw an error
        return 'https://placeholder.pics/svg/500x300/DEDEDE/555555/Image%20Generation%20Error';
    }
}

// Library Functions
function saveToLibrary() {
    if (!window.currentStoryData) {
        alert('No story data to save!');
        return;
    }
    
    // Get current library or initialize new one
    let library = JSON.parse(localStorage.getItem('bookids_library') || '[]');
    
    // Add the current story
    library.push(window.currentStoryData);
    
    // Save back to localStorage
    localStorage.setItem('bookids_library', JSON.stringify(library));
    
    alert('Story saved to your library!');
    
    // Update library view if it's visible
    if (document.getElementById('library-view').style.display !== 'none') {
        updateLibraryView();
    }
}

function loadLibrary() {
    const library = JSON.parse(localStorage.getItem('bookids_library') || '[]');
    return library;
}

function updateLibraryView() {
    const library = loadLibrary();
    const libraryGrid = document.getElementById('library-grid');
    const libraryEmpty = document.getElementById('library-empty');
    
    if (library.length === 0) {
        libraryGrid.style.display = 'none';
        libraryEmpty.style.display = 'block';
        return;
    }
    
    libraryGrid.style.display = 'grid';
    libraryEmpty.style.display = 'none';
    
    // Clear current library grid
    libraryGrid.innerHTML = '';
    
    // Add each book to the grid
    library.forEach((book, index) => {
        const card = document.createElement('div');
        card.className = 'library-card';
        card.onclick = () => openBook(index);
        
        card.innerHTML = `
            <div class="library-card-cover">
                <img src="${book.imageUrl}" alt="${book.title}" />
                <button class="delete-book-btn" onclick="deleteBook(${index}, event)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
            <div class="library-card-info">
                <h3 class="library-card-title">${book.title}</h3>
                <div class="library-card-meta">
                    <span>For: ${book.meta.childName}</span>
                    <span>Age: ${book.meta.childAge}</span>
                </div>
            </div>
        `;
        
        libraryGrid.appendChild(card);
    });
}

function openBook(index) {
    const library = loadLibrary();
    if (!library[index]) return;
    
    const book = library[index];
    
    // First show the story result view to ensure DOM elements are available
    document.getElementById('library-view').style.display = 'none';
    document.getElementById('story-result').style.display = 'block';
    
    // Set the current story data
    window.currentStoryData = book;
    
    // Display the story title
    document.getElementById('story-title').textContent = book.title;
    
    // Split the content into paragraphs for pagination
    const paragraphs = book.content.split('\n\n').filter(para => para.trim());
    
    // Store paragraphs and current page
    window.storyPagination = {
        paragraphs: paragraphs,
        currentPage: 0,
        totalPages: paragraphs.length
    };
    
    // Set the illustration first
    document.getElementById('story-illustration').src = book.imageUrl;
    
    // Add cognitive details
    const cognitiveDetailsContainer = document.getElementById('cognitive-details');
    if (cognitiveDetailsContainer) {
        cognitiveDetailsContainer.innerHTML = '';
        
        // Cognitive areas might be just names in saved stories
        if (book.meta.cognitiveAreas) {
            book.meta.cognitiveAreas.forEach(areaName => {
                const detailCard = document.createElement('div');
                detailCard.className = 'cognitive-detail-card';
                detailCard.innerHTML = `<h4>${areaName}</h4>`;
                cognitiveDetailsContainer.appendChild(detailCard);
            });
        }
    }
    
    // Setup pagination controls
    setupPaginationControls();
    
    // Display the first page - do this last after controls are setup
    displayStoryPage(0);
}

// New function to display error messages in a more user-friendly way
function showErrorMessage(message) {
    // If we have a modal element for errors, use it
    const errorModal = document.getElementById('error-modal');
    
    if (errorModal) {
        const errorContent = document.getElementById('error-content');
        if (errorContent) {
            // Format the message with HTML
            const formattedMessage = message.replace(/\n/g, '<br>');
            errorContent.innerHTML = formattedMessage;
        }
        errorModal.style.display = 'flex';
    } else {
        // Fallback to alert if no modal is available
        alert(message);
    }
}

// Save user preferences for future story generation
function saveUserPreferences(preferences) {
    localStorage.setItem('bookids_preferences', JSON.stringify(preferences));
}

// Load user preferences
function loadUserPreferences() {
    const preferences = JSON.parse(localStorage.getItem('bookids_preferences') || '{}');
    return preferences;
}

// Apply saved preferences to form fields
function applyUserPreferences() {
    const preferences = loadUserPreferences();
    if (Object.keys(preferences).length === 0) return;
    
    // Apply preferences to form fields
    if (preferences.childName) {
        document.getElementById('child-name').value = preferences.childName;
    }
    
    if (preferences.childGender) {
        document.querySelectorAll('.toggle-option').forEach(option => {
            if (option.textContent === preferences.childGender) {
                document.querySelectorAll('.toggle-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            }
        });
    }
    
    if (preferences.childAge) {
        const ageSlider = document.getElementById('age-slider');
        if (ageSlider) {
            ageSlider.value = preferences.childAge;
            document.querySelector('.slider-value').textContent = preferences.childAge;
        }
    }
    
    if (preferences.selectedInterests && preferences.selectedInterests.length) {
        document.querySelectorAll('.interest-option').forEach(option => {
            if (preferences.selectedInterests.includes(option.textContent)) {
                option.classList.add('selected');
            }
        });
    }
    
    if (preferences.customPrompt) {
        document.getElementById('custom-prompt').value = preferences.customPrompt;
    }
    
    // Add saved characters to the UI
    if (preferences.characters && preferences.characters.length) {
        const charactersContainer = document.getElementById('characters-container');
        if (charactersContainer) {
            // Clear any existing character inputs first
            charactersContainer.innerHTML = '';
            
            // Add each saved character
            preferences.characters.forEach(character => {
                const characterId = Date.now() + Math.floor(Math.random() * 1000); // Unique ID
                const characterDiv = document.createElement('div');
                characterDiv.className = 'character-input-group';
                characterDiv.dataset.id = characterId;
                
                characterDiv.innerHTML = `
                    <input type="text" class="text-input character-input" placeholder="Character name and description" value="${character}">
                    <button type="button" class="remove-character-btn" onclick="removeCharacter(${characterId})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                `;
                
                charactersContainer.appendChild(characterDiv);
            });
        }
    }
}

// Delete a book from the library
function deleteBook(index, event) {
    // Stop the click event from bubbling up to parent elements
    event.stopPropagation();
    
    // Confirm deletion
    if (confirm('Are you sure you want to delete this book from your library?')) {
        // Get current library
        let library = loadLibrary();
        
        // Remove the book at the specified index
        library.splice(index, 1);
        
        // Save the updated library
        localStorage.setItem('bookids_library', JSON.stringify(library));
        
        // Update the library view
        updateLibraryView();
    }
} 