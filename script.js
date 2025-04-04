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
            showMainPage();
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
    // Hide all content panels
    const contentPanels = document.querySelectorAll('.content-panel');
    contentPanels.forEach(panel => {
        panel.style.display = 'none';
    });
    
    document.getElementById('cognitive-areas').style.display = 'block';
}

function showArtStyles() {
    // Hide all content panels
    const contentPanels = document.querySelectorAll('.content-panel');
    contentPanels.forEach(panel => {
        panel.style.display = 'none';
    });
    
    document.getElementById('art-styles').style.display = 'block';
}

function showStoryResult() {
    // Hide all content panels
    const contentPanels = document.querySelectorAll('.content-panel');
    contentPanels.forEach(panel => {
        panel.style.display = 'none';
    });
    
    document.getElementById('story-result').style.display = 'block';
}

function showMainPage() {
    // Hide all content panels
    const contentPanels = document.querySelectorAll('.content-panel');
    contentPanels.forEach(panel => {
        panel.style.display = 'none';
    });
    
    document.getElementById('basic-info-form').style.display = 'block';
    
    // Reset menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector('.menu-item:first-child').classList.add('active');
}

function showLibrary() {
    // Hide all content panels
    const contentPanels = document.querySelectorAll('.content-panel');
    contentPanels.forEach(panel => {
        panel.style.display = 'none';
    });
    
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
    // Hide all content panels
    const contentPanels = document.querySelectorAll('.content-panel');
    contentPanels.forEach(panel => {
        panel.style.display = 'none';
    });
    
    document.getElementById('basic-info-form').style.display = 'block';
}

function showStoryDetailsForm() {
    // Hide all content panels
    const contentPanels = document.querySelectorAll('.content-panel');
    contentPanels.forEach(panel => {
        panel.style.display = 'none';
    });
    
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
            <input type="text" class="character-input" placeholder="Character name and description, e.g., 'Sister Emma'">
            <button type="button" class="remove-character-btn" onclick="removeCharacter(${characterId})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        
        charactersContainer.appendChild(characterDiv);
        
        // Focus the new input
        const newInput = characterDiv.querySelector('input');
        if (newInput) {
            newInput.focus();
        }
        
        // Add subtle animation
        characterDiv.style.opacity = '0';
        characterDiv.style.transform = 'translateY(10px)';
        
        // Trigger animation
        setTimeout(() => {
            characterDiv.style.transition = 'all 0.3s ease';
            characterDiv.style.opacity = '1';
            characterDiv.style.transform = 'translateY(0)';
        }, 10);
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
    
    // Get characters from current story data
    const characters = window.currentStoryData?.meta?.characters || [];
    const childName = window.currentStoryData?.meta?.childName || '';
    
    // Add characters to the character-profiles section
    const characterProfilesContainer = document.getElementById('character-profiles');
    if (characterProfilesContainer) {
        characterProfilesContainer.innerHTML = renderCharacters(characters, childName);
    }
    
    // Add cognitive details
    const cognitiveDetailsContainer = document.getElementById('cognitive-details');
    if (cognitiveDetailsContainer) {
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
    }
    
    // Setup pagination controls
    setupPaginationControls();
}

// Render character profiles
function renderCharacters(characters, mainCharacterName) {
    // Always include the main character
    const allCharacters = [
        { name: mainCharacterName, isMain: true }
    ];
    
    // Add additional characters
    if (characters && characters.length > 0) {
        characters.forEach(character => {
            // Parse character name and description if available
            let name = character;
            let description = '';
            
            if (character.includes(',')) {
                const parts = character.split(',');
                name = parts[0].trim();
                description = parts.slice(1).join(',').trim();
            }
            
            allCharacters.push({ name, description, isMain: false });
        });
    }
    
    // Generate HTML for each character
    return allCharacters
        .filter(character => character.name) // Filter out empty names
        .map(character => {
            const initial = character.name.charAt(0).toUpperCase();
            const description = character.description || (character.isMain ? 'Main character' : '');
            
            return `
                <div class="character-profile">
                    <div class="character-avatar">${initial}</div>
                    <div class="character-info">
                        <h4 class="character-name">${character.name}${character.isMain ? ' ★' : ''}</h4>
                        <p class="character-desc">${description}</p>
                    </div>
                </div>
            `;
        }).join('');
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
    
    // Stop any playing audio when changing pages
    const audioPlayer = document.getElementById('tts-audio-player');
    if (audioPlayer && !audioPlayer.paused) {
        audioPlayer.pause();
        updateAudioButtonState();
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
    
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    // If buttons don't exist, exit early
    if (!prevBtn || !nextBtn) return;
    
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
    
    // Update dashboard if it's visible
    if (document.getElementById('dashboard-view').style.display !== 'none') {
        updateDashboard();
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
    
    // Clear grid
    libraryGrid.innerHTML = '';
    
    // Show/hide empty state
    if (!library || library.length === 0) {
        libraryEmpty.style.display = 'block';
        libraryGrid.style.display = 'none';
        return;
    } else {
        libraryEmpty.style.display = 'none';
        libraryGrid.style.display = 'grid';
    }
    
    // Create a card for each story
    library.forEach((book, index) => {
        // Only display the first 50 characters of content in the preview
        const contentPreview = book.content.substring(0, 50) + '...';
        
        // Format cognitive areas
        const cognitiveAreasText = book.cognitiveAreas && book.cognitiveAreas.length > 0 
            ? book.cognitiveAreas.join(', ') 
            : 'General Development';
        
        // Format date
        let dateDisplay = '';
        if (book.dateCreated) {
            const date = new Date(book.dateCreated);
            dateDisplay = date.toLocaleDateString();
        }
        
        // Create character tags
        let characterTags = '';
        if (book.characters && book.characters.length > 0) {
            characterTags = book.characters
                .map(char => `<span class="meta-tag">${char.name}</span>`)
                .join('');
        } else if (book.childName) {
            characterTags = `<span class="meta-tag">${book.childName}</span>`;
        }
        
        // Create card element
        const card = document.createElement('div');
        card.className = 'library-card';
        card.dataset.index = index;
        card.onclick = function(e) {
            // Make sure we're not clicking the action buttons
            if (!e.target.closest('.library-card-actions') && !e.target.closest('.library-card-play-btn')) {
                openBook(index);
            }
        };
        
        card.innerHTML = `
            <div class="library-card-cover">
                <img src="${book.imageUrl || 'placeholder.jpg'}" alt="${book.title}">
                <div class="library-card-actions">
                    <button class="delete-book-btn" onclick="deleteBook(${index}, event)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <button class="library-card-play-btn" onclick="playBookPreview(${index}, event)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </button>
            </div>
            <div class="library-card-info">
                <h3 class="library-card-title">${book.title}</h3>
                <div class="library-card-meta">
                    ${characterTags}
                </div>
                <div class="library-card-cognitive">
                    <span class="cognitive-tag">${cognitiveAreasText}</span>
                    ${dateDisplay ? `<span class="date-info">${dateDisplay}</span>` : ''}
                </div>
            </div>
        `;
        
        libraryGrid.appendChild(card);
    });
}

// Play a preview of the book's first paragraph
function playBookPreview(bookIndex, event) {
    // Prevent triggering card click
    if (event) {
        event.stopPropagation();
    }
    
    const library = loadLibrary();
    if (!library || !library[bookIndex]) return;
    
    const book = library[bookIndex];
    const firstParagraph = book.content.split('\n\n')[0].trim();
    const apiKey = document.getElementById('openai-key')?.value;
    
    if (firstParagraph && apiKey) {
        playStoryAudio(firstParagraph, apiKey);
    } else {
        showErrorMessage('❌ Error\n\nAPI key not found. Please make sure you entered your OpenAI API key.');
    }
}

function openBook(index) {
    const library = loadLibrary();
    if (!library[index]) return;
    
    const book = library[index];
    
    // Hide all content panels
    const contentPanels = document.querySelectorAll('.content-panel');
    contentPanels.forEach(panel => {
        panel.style.display = 'none';
    });
    
    // Show story result view to ensure DOM elements are available
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
    
    // Get characters from the book
    const characters = book.meta.characters || [];
    const childName = book.meta.childName || '';
    
    // Add characters to the character-profiles section
    const characterProfilesContainer = document.getElementById('character-profiles');
    if (characterProfilesContainer) {
        characterProfilesContainer.innerHTML = renderCharacters(characters, childName);
    }
    
    // Add cognitive details
    const cognitiveDetailsContainer = document.getElementById('cognitive-details');
    if (cognitiveDetailsContainer) {
        cognitiveDetailsContainer.innerHTML = '';
        
        // Cognitive areas might be just names in saved stories
        if (book.meta.cognitiveAreas && book.meta.cognitiveAreas.length > 0) {
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

// Function to export the current story to PDF
function exportToPDF() {
    // Make sure we have story data
    if (!window.currentStoryData) {
        console.error('No story data available to export');
        showErrorMessage('❌ Error\n\nNo story data available to export. Please generate or open a story first.');
        return;
    }
    
    // Show loading indicator
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('loading').querySelector('p').textContent = 'Preparing PDF...';
    
    try {
        setTimeout(() => {
            const storyTitle = window.currentStoryData.title || 'My Story';
            const storyContent = window.currentStoryData.content || '';
            const imageUrl = window.currentStoryData.imageUrl || '';
            
            // Create a new document for printing
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                showErrorMessage('❌ Error\n\nPop-up blocked. Please allow pop-ups to export your story to PDF.');
                document.getElementById('loading').style.display = 'none';
                return;
            }
            
            // Process paragraphs exactly like in the fullscreen reader
            const paragraphs = storyContent.split('\n\n').filter(para => para.trim());
            
            // Format each paragraph with colors
            let formattedParagraphs = '';
            
            paragraphs.forEach((paragraph, index) => {
                // Split paragraph into sentences
                const sentences = paragraph.split(/(?<=[.!?])\s+/);
                
                // Process paragraphs like in the reader view
                if (sentences.length > 3) {
                    for (let i = 0; i < sentences.length; i += 2) {
                        const sentenceGroup = sentences.slice(i, i + 2).join(' ');
                        const colorClass = `color-${(index + i) % 5 + 1}`;
                        formattedParagraphs += `<p class="${colorClass}">${sentenceGroup}</p>`;
                    }
                } else {
                    const colorClass = `color-${index % 5 + 1}`;
                    formattedParagraphs += `<p class="${colorClass}">${paragraph}</p>`;
                }
            });
            
            // Create a kid-friendly printable layout
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${storyTitle} - Bookids</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');
                        
                        body {
                            font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #fff;
                        }
                        
                        /* Printable book cover */
                        .book-cover {
                            text-align: center;
                            margin-bottom: 30px;
                            page-break-after: always;
                        }
                        
                        .book-cover h1 {
                            font-size: 32px;
                            margin-bottom: 20px;
                            color: #5a6acf;
                        }
                        
                        .book-cover img {
                            max-width: 100%;
                            max-height: 500px;
                            border-radius: 16px;
                            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                        }
                        
                        /* Story content with colored paragraphs */
                        .story-content {
                            padding: 0 15px;
                        }
                        
                        .story-content p {
                            margin-bottom: 24px;
                            font-size: 18px;
                            border-radius: 10px;
                            padding: 12px 15px;
                            page-break-inside: avoid;
                        }
                        
                        .story-content p::first-letter {
                            font-size: 220%;
                            font-weight: bold;
                        }
                        
                        /* Paragraph colors */
                        .color-1 {
                            color: #E53935;
                            border-left: 3px solid #E53935;
                            background-color: rgba(229, 57, 53, 0.03);
                        }
                        
                        .color-2 {
                            color: #5E35B1;
                            border-left: 3px solid #5E35B1;
                            background-color: rgba(94, 53, 177, 0.03);
                        }
                        
                        .color-3 {
                            color: #00897B;
                            border-left: 3px solid #00897B;
                            background-color: rgba(0, 137, 123, 0.03);
                        }
                        
                        .color-4 {
                            color: #F57C00;
                            border-left: 3px solid #F57C00;
                            background-color: rgba(245, 124, 0, 0.03);
                        }
                        
                        .color-5 {
                            color: #3949AB;
                            border-left: 3px solid #3949AB;
                            background-color: rgba(57, 73, 171, 0.03);
                        }
                        
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            font-size: 12px;
                            color: #999;
                        }
                        
                        .print-button {
                            display: inline-block;
                            padding: 12px 24px;
                            background: #5a6acf;
                            color: white;
                            border: none;
                            border-radius: 50px;
                            cursor: pointer;
                            font-size: 16px;
                            font-family: inherit;
                            box-shadow: 0 4px 10px rgba(90, 106, 207, 0.2);
                            margin: 20px 0 30px;
                        }
                        
                        .print-button:hover {
                            background: #4a5ab9;
                        }
                        
                        /* Print-specific styles */
                        @media print {
                            .no-print {
                                display: none;
                            }
                            
                            body {
                                padding: 0;
                            }
                            
                            .story-content p {
                                break-inside: avoid;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="no-print" style="text-align: center;">
                        <button class="print-button" onclick="window.print()">Print Story</button>
                    </div>
                    
                    <div class="book-cover">
                        <h1>${storyTitle}</h1>
                        <img src="${imageUrl}" alt="${storyTitle}" onerror="this.src='https://via.placeholder.com/600x400?text=Story+Illustration'" crossorigin="anonymous">
                    </div>
                    
                    <div class="story-content">
                        ${formattedParagraphs}
                    </div>
                    
                    <div class="footer">
                        <p>Created with Bookids | ${new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <script>
                        // Auto trigger print dialog when content is loaded
                        window.addEventListener('load', function() {
                            // Focus the window to make print dialog appear on top
                            window.focus();
                            
                            // Update the document title
                            document.title = "${storyTitle} - Ready for Print";
                            
                            // Check all images are loaded
                            const images = document.querySelectorAll('img');
                            let allLoaded = true;
                            
                            for (let img of images) {
                                if (!img.complete) {
                                    allLoaded = false;
                                    img.addEventListener('load', function() {
                                        // Try again when image loads
                                        if (document.querySelectorAll('img:not([complete])').length === 0) {
                                            setTimeout(() => window.print(), 500);
                                        }
                                    });
                                }
                            }
                            
                            // If all images already loaded, print after a small delay
                            if (allLoaded) {
                                setTimeout(() => window.print(), 1000);
                            }
                        });
                    </script>
                </body>
                </html>
            `);
            
            // Hide loading indicator
            document.getElementById('loading').style.display = 'none';
        }, 500);
    } catch (error) {
        console.error('Error exporting PDF:', error);
        showErrorMessage(`❌ PDF Export Error\n\n${error.message}\n\nPlease try again.`);
        document.getElementById('loading').style.display = 'none';
    }
}

// Update fullscreen reader initialization to include PDF export and audio playback
function initializeFullscreenReader() {
    // Create the fullscreen reader container if it doesn't exist
    if (!document.getElementById('fullscreen-reader')) {
        const fullscreenReader = document.createElement('div');
        fullscreenReader.id = 'fullscreen-reader';
        fullscreenReader.className = 'fullscreen-reader';
        
        // Add close button
        const closeButton = document.createElement('div');
        closeButton.className = 'close-fullscreen';
        closeButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;
        closeButton.addEventListener('click', closeFullscreenReader);
        
        // Create action buttons container
        const actionButtons = document.createElement('div');
        actionButtons.className = 'book-action-buttons';
        
        // Add audio button
        const audioButton = document.createElement('button');
        audioButton.className = 'book-action-btn listen';
        audioButton.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Listen
        `;
        audioButton.addEventListener('click', toggleAudio);
        
        // Add PDF export button
        const exportButton = document.createElement('button');
        exportButton.className = 'book-action-btn export';
        exportButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path>
                <path d="M12 17v-6"></path>
                <path d="M9 14l3 3 3-3"></path>
            </svg>
            Export
        `;
        exportButton.addEventListener('click', exportToPDF);
        
        // Add buttons to container
        actionButtons.appendChild(audioButton);
        actionButtons.appendChild(exportButton);
        
        // Add content container
        const readerContent = document.createElement('div');
        readerContent.className = 'fullscreen-reader-content';
        
        // Add text and image sections
        readerContent.innerHTML = `
            <div class="fullscreen-text" id="fullscreen-text"></div>
            <div class="fullscreen-image">
                <img id="fullscreen-image" src="" alt="Story illustration">
            </div>
        `;
        
        // Add navigation controls
        const controls = document.createElement('div');
        controls.className = 'fullscreen-controls';
        controls.innerHTML = `
            <button id="fullscreen-prev" class="fullscreen-nav-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5"></path>
                    <path d="M12 19l-7-7 7-7"></path>
                </svg>
            </button>
            <button id="fullscreen-next" class="fullscreen-nav-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                </svg>
            </button>
        `;
        
        // Add page indicator
        const pageIndicator = document.createElement('div');
        pageIndicator.className = 'fullscreen-page-indicator';
        pageIndicator.innerHTML = 'Page <span id="fullscreen-current-page">1</span> of <span id="fullscreen-total-pages">1</span>';
        
        // Assemble and add to document
        fullscreenReader.appendChild(closeButton);
        fullscreenReader.appendChild(actionButtons);
        fullscreenReader.appendChild(readerContent);
        fullscreenReader.appendChild(controls);
        fullscreenReader.appendChild(pageIndicator);
        document.body.appendChild(fullscreenReader);
        
        // Add event listeners for navigation buttons
        document.getElementById('fullscreen-prev').addEventListener('click', () => {
            navigateFullscreenPage(-1);
        });
        
        document.getElementById('fullscreen-next').addEventListener('click', () => {
            navigateFullscreenPage(1);
        });
    }
}

// Open fullscreen reader
function openFullscreenReader() {
    // Initialize the reader UI
    initializeFullscreenReader();
    
    // Make sure we have pagination data
    if (!window.storyPagination) return;
    
    // Set the current page to view
    const currentPage = window.storyPagination.currentPage || 0;
    
    // Update image
    const imageUrl = window.currentStoryData?.imageUrl || '';
    document.getElementById('fullscreen-image').src = imageUrl;
    
    // Update text content with enhanced styling for kids
    const paragraph = window.storyPagination.paragraphs[currentPage];
    
    // Split the paragraph into sentences for more dynamic styling
    let sentences = paragraph.split(/(?<=[.!?])\s+/);
    
    // Create multiple paragraph elements for better visual appeal
    let formattedContent = '';
    
    // If we have many sentences, group them into paragraphs of 1-3 sentences
    if (sentences.length > 3) {
        // Group sentences into paragraphs
        for (let i = 0; i < sentences.length; i += 2) {
            const sentenceGroup = sentences.slice(i, i + 2).join(' ');
            formattedContent += `<p>${sentenceGroup}</p>`;
        }
    } else {
        // For shorter content, keep it as one paragraph
        formattedContent = `<p>${paragraph}</p>`;
    }
    
    document.getElementById('fullscreen-text').innerHTML = formattedContent;
    
    // Update pagination info
    document.getElementById('fullscreen-current-page').textContent = currentPage + 1;
    document.getElementById('fullscreen-total-pages').textContent = window.storyPagination.totalPages;
    
    // Update button states
    updateFullscreenButtons();
    
    // Show the reader
    const reader = document.getElementById('fullscreen-reader');
    reader.classList.add('active');
    
    // Prevent scrolling of the background
    document.body.style.overflow = 'hidden';
}

// Close fullscreen reader
function closeFullscreenReader() {
    const reader = document.getElementById('fullscreen-reader');
    if (reader) {
        reader.classList.remove('active');
    }
    
    // Re-enable scrolling
    document.body.style.overflow = '';
}

// Navigate to a different page in fullscreen mode
function navigateFullscreenPage(direction) {
    if (!window.storyPagination) return;
    
    const { currentPage, totalPages, paragraphs } = window.storyPagination;
    const newPage = currentPage + direction;
    
    // Check if the new page is valid
    if (newPage >= 0 && newPage < totalPages) {
        // Stop current audio if playing
        const audioPlayer = document.getElementById('tts-audio-player');
        if (audioPlayer && !audioPlayer.paused) {
            audioPlayer.pause();
            updateAudioButtonState();
        }
        
        // Update pagination data
        window.storyPagination.currentPage = newPage;
        
        // Update page content with enhanced styling for kids
        const paragraph = paragraphs[newPage];
        
        // Split the paragraph into sentences for more dynamic styling
        let sentences = paragraph.split(/(?<=[.!?])\s+/);
        
        // Create multiple paragraph elements for better visual appeal
        let formattedContent = '';
        
        // If we have many sentences, group them into paragraphs of 1-3 sentences
        if (sentences.length > 3) {
            // Group sentences into paragraphs
            for (let i = 0; i < sentences.length; i += 2) {
                const sentenceGroup = sentences.slice(i, i + 2).join(' ');
                formattedContent += `<p>${sentenceGroup}</p>`;
            }
        } else {
            // For shorter content, keep it as one paragraph
            formattedContent = `<p>${paragraph}</p>`;
        }
        
        document.getElementById('fullscreen-text').innerHTML = formattedContent;
        
        // Update page number
        document.getElementById('fullscreen-current-page').textContent = newPage + 1;
        
        // Also update the main view page
        displayStoryPage(newPage);
        
        // Update button states
        updateFullscreenButtons();
    }
}

// Update navigation button states
function updateFullscreenButtons() {
    if (!window.storyPagination) return;
    
    const { currentPage, totalPages } = window.storyPagination;
    
    const prevBtn = document.getElementById('fullscreen-prev');
    const nextBtn = document.getElementById('fullscreen-next');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 0;
        prevBtn.style.opacity = currentPage === 0 ? 0.5 : 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages - 1;
        nextBtn.style.opacity = currentPage === totalPages - 1 ? 0.5 : 1;
    }
}

// Add event listener to Read Now button
document.addEventListener('DOMContentLoaded', function() {
    // Initialize existing event listeners
    
    // Add read now button listener
    const readNowBtn = document.querySelector('.read-now-button');
    if (readNowBtn) {
        readNowBtn.addEventListener('click', openFullscreenReader);
    }
});

// Display the dashboard
function showDashboard() {
    // Hide all other content panels
    const contentPanels = document.querySelectorAll('.content-panel');
    contentPanels.forEach(panel => {
        panel.style.display = 'none';
    });
    
    // Show only dashboard
    document.getElementById('dashboard-view').style.display = 'block';
    
    // Reset menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector('.menu-item:nth-child(3)').classList.add('active');
    
    // Update dashboard data
    updateDashboard();
}

// Update the dashboard with current stats and data
function updateDashboard() {
    // Get library data
    const library = loadLibrary();
    
    // Update basic stats
    updateStats(library);
    
    // Update cognitive progress
    updateCognitiveProgress(library);
    
    // Update recent activity
    updateRecentActivity(library);
}

// Update basic stats on dashboard
function updateStats(library) {
    // Update total books count
    const totalBooksEl = document.getElementById('total-books');
    if (totalBooksEl) {
        totalBooksEl.textContent = library.length;
    }
    
    // Count total unique characters
    const charactersEl = document.getElementById('characters-created');
    if (charactersEl) {
        const uniqueCharacters = new Set();
        
        // Get main characters (child names)
        library.forEach(book => {
            if (book.meta && book.meta.childName) {
                uniqueCharacters.add(book.meta.childName);
            }
            
            // Get additional characters
            if (book.meta && book.meta.characters) {
                book.meta.characters.forEach(character => {
                    // Extract just the name part if it includes a description
                    const charName = character.split(',')[0].trim();
                    if (charName) {
                        uniqueCharacters.add(charName);
                    }
                });
            }
        });
        
        charactersEl.textContent = uniqueCharacters.size;
    }
    
    // Find favorite art style
    const favoriteStyleEl = document.getElementById('favorite-style');
    if (favoriteStyleEl && library.length > 0) {
        const styles = {};
        
        library.forEach(book => {
            if (book.meta && book.meta.artStyle) {
                const style = book.meta.artStyle;
                styles[style] = (styles[style] || 0) + 1;
            }
        });
        
        let favoriteStyle = null;
        let maxCount = 0;
        
        for (const style in styles) {
            if (styles[style] > maxCount) {
                maxCount = styles[style];
                favoriteStyle = style;
            }
        }
        
        if (favoriteStyle) {
            // Convert style ID to display name
            let styleName = '';
            switch (favoriteStyle) {
                case 'watercolor':
                    styleName = 'Watercolor';
                    break;
                case 'digital':
                    styleName = 'Digital';
                    break;
                case 'pen-ink':
                    styleName = 'Pen & Ink';
                    break;
                case 'collage':
                    styleName = 'Collage';
                    break;
                case '3d':
                    styleName = '3D';
                    break;
                default:
                    styleName = favoriteStyle;
            }
            
            favoriteStyleEl.textContent = styleName;
        } else {
            favoriteStyleEl.textContent = '-';
        }
    }
}

// Update cognitive progress section
function updateCognitiveProgress(library) {
    const cognitiveProgressEl = document.getElementById('cognitive-progress');
    if (!cognitiveProgressEl) return;
    
    // If no books, show empty state
    if (library.length === 0) {
        cognitiveProgressEl.innerHTML = `
            <div class="empty-state">
                <p>No cognitive data available yet</p>
            </div>
        `;
        return;
    }
    
    // Count cognitive areas
    const cognitiveAreaCounts = {};
    let totalAreas = 0;
    
    library.forEach(book => {
        if (book.meta && book.meta.cognitiveAreas) {
            book.meta.cognitiveAreas.forEach(area => {
                cognitiveAreaCounts[area] = (cognitiveAreaCounts[area] || 0) + 1;
                totalAreas++;
            });
        }
    });
    
    // Sort by frequency
    const sortedAreas = Object.keys(cognitiveAreaCounts).sort((a, b) => 
        cognitiveAreaCounts[b] - cognitiveAreaCounts[a]
    );
    
    // Generate progress bars HTML
    let progressHTML = '';
    
    sortedAreas.forEach(area => {
        const count = cognitiveAreaCounts[area];
        const percentage = Math.round((count / library.length) * 100);
        
        progressHTML += `
            <div class="progress-item">
                <div class="progress-label">
                    <span>${area}</span>
                    <span>${count} ${count === 1 ? 'book' : 'books'}</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    });
    
    cognitiveProgressEl.innerHTML = progressHTML;
}

// Update recent activity section
function updateRecentActivity(library) {
    const recentActivityEl = document.getElementById('recent-activity');
    if (!recentActivityEl) return;
    
    // If no books, keep the empty state that's already there
    if (library.length === 0) return;
    
    // Sort books by date created (most recent first)
    const sortedBooks = [...library].sort((a, b) => {
        const dateA = a.meta?.dateCreated ? new Date(a.meta.dateCreated) : new Date(0);
        const dateB = b.meta?.dateCreated ? new Date(b.meta.dateCreated) : new Date(0);
        return dateB - dateA;
    });
    
    // Get up to 3 most recent books
    const recentBooks = sortedBooks.slice(0, 3);
    
    // Generate activity HTML
    let activityHTML = '';
    
    recentBooks.forEach(book => {
        const date = book.meta?.dateCreated ? new Date(book.meta.dateCreated) : null;
        const timeDisplay = date ? formatTimeAgo(date) : 'Unknown date';
        
        // Get cognitive areas as a comma-separated string
        const cognitiveAreas = book.meta?.cognitiveAreas || [];
        const cognitiveAreasText = cognitiveAreas.length > 0 
            ? cognitiveAreas.join(', ') 
            : 'General Learning';
        
        activityHTML += `
            <div class="activity-item">
                <div class="activity-icon">📚</div>
                <div class="activity-content">
                    <h4>${book.title}</h4>
                    <p>Focus: ${cognitiveAreasText}</p>
                </div>
                <div class="activity-time">${timeDisplay}</div>
            </div>
        `;
    });
    
    recentActivityEl.innerHTML = activityHTML;
}

// Helper function to format time ago (e.g., "2 days ago")
function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
        return diffDay === 1 ? 'Yesterday' : `${diffDay} days ago`;
    }
    
    if (diffHour > 0) {
        return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
    }
    
    if (diffMin > 0) {
        return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    return 'Just now';
}

// Generate speech from text using OpenAI TTS
async function generateSpeech(apiKey, text, voice = 'alloy') {
    if (!apiKey) {
        console.error('No API key provided for TTS');
        return null;
    }

    try {
        // First check if we have this audio cached
        const cacheKey = `tts_cache_${voice}_${text.substring(0, 100)}`;
        const cachedAudio = localStorage.getItem(cacheKey);
        
        if (cachedAudio) {
            console.log('Using cached audio');
            return cachedAudio;
        }
        
        console.log('Generating TTS with OpenAI...');
        
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey.trim()}`
            },
            body: JSON.stringify({
                model: 'tts-1-1106',
                voice: voice,
                input: text,
                response_format: 'mp3'
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`TTS API error: ${errorData.error?.message || response.statusText}`);
        }
        
        // Convert the audio blob to a base64 string for caching
        const audioBlob = await response.blob();
        const reader = new FileReader();
        
        return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                // This is the base64 string
                const base64Audio = reader.result;
                
                // Cache the audio for future use
                try {
                    localStorage.setItem(cacheKey, base64Audio);
                } catch (e) {
                    console.warn('Failed to cache audio, probably due to size constraints:', e);
                }
                
                resolve(base64Audio);
            };
            
            reader.onerror = reject;
            reader.readAsDataURL(audioBlob);
        });
    } catch (error) {
        console.error('Error generating speech:', error);
        return null;
    }
}

// Play TTS audio for a story paragraph
async function playStoryAudio(paragraph, apiKey) {
    // Show loading state
    const audioButton = document.querySelector('.audio-play-btn') || document.querySelector('.fullscreen-audio-btn');
    if (audioButton) {
        audioButton.innerHTML = `
            <svg class="loading-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" opacity="0.25"></circle>
                <path d="M12 2a10 10 0 0 1 10 10" opacity="1" class="loading-circle"></path>
            </svg>
            Loading...
        `;
        audioButton.disabled = true;
    }
    
    try {
        // Generate the audio
        const audioData = await generateSpeech(apiKey, paragraph);
        
        if (!audioData) {
            throw new Error('Failed to generate audio');
        }
        
        // Create audio element if it doesn't exist
        let audioPlayer = document.getElementById('tts-audio-player');
        if (!audioPlayer) {
            audioPlayer = document.createElement('audio');
            audioPlayer.id = 'tts-audio-player';
            audioPlayer.controls = false;
            document.body.appendChild(audioPlayer);
            
            // Add event listeners for audio state
            audioPlayer.addEventListener('play', updateAudioButtonState);
            audioPlayer.addEventListener('pause', updateAudioButtonState);
            audioPlayer.addEventListener('ended', updateAudioButtonState);
        }
        
        // Set source and play
        audioPlayer.src = audioData;
        audioPlayer.play();
        
        // Update button state
        updateAudioButtonState();
        
    } catch (error) {
        console.error('Error playing audio:', error);
        showErrorMessage(`❌ Audio Generation Error\n\nFailed to generate audio: ${error.message}\n\nPlease check your API key and try again.`);
    }
    
    // Reset button state
    if (audioButton) {
        updateAudioButtonState();
    }
}

// Update the audio button state based on player status
function updateAudioButtonState() {
    const audioPlayer = document.getElementById('tts-audio-player');
    const audioButtons = document.querySelectorAll('.audio-play-btn, .fullscreen-audio-btn');
    
    audioButtons.forEach(btn => {
        if (!audioPlayer || audioPlayer.paused) {
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Listen
            `;
            btn.disabled = false;
            btn.setAttribute('data-playing', 'false');
        } else {
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
                Pause
            `;
            btn.disabled = false;
            btn.setAttribute('data-playing', 'true');
        }
    });
}

// Play audio for the standard view
function playCurrentPageAudio() {
    // Make sure we have story pagination data
    if (!window.storyPagination) return;
    
    const currentPage = window.storyPagination.currentPage;
    const paragraph = window.storyPagination.paragraphs[currentPage];
    const apiKey = document.getElementById('openai-key')?.value;
    
    if (paragraph && apiKey) {
        playStoryAudio(paragraph, apiKey);
    } else {
        showErrorMessage('❌ Error\n\nAPI key not found. Please make sure you entered your OpenAI API key.');
    }
}

// Function to toggle audio playback
function toggleAudio() {
    const audioPlayer = document.getElementById('tts-audio-player');
    
    // If player is playing, pause it
    if (audioPlayer && !audioPlayer.paused) {
        audioPlayer.pause();
        updateAudioButtonState();
        return;
    }
    
    // If we're in the fullscreen reader, use the current page's text
    if (document.querySelector('.fullscreen-reader.active')) {
        // Use the fullscreen reader's current page
        if (window.storyPagination) {
            const currentPage = window.storyPagination.currentPage;
            const paragraph = window.storyPagination.paragraphs[currentPage];
            const apiKey = document.getElementById('openai-key')?.value;
            
            if (paragraph && apiKey) {
                playStoryAudio(paragraph, apiKey);
            } else {
                showErrorMessage('❌ Error\n\nAPI key not found. Please make sure you entered your OpenAI API key.');
            }
        }
    } else {
        // Standard view - play the current page's audio
        playCurrentPageAudio();
    }
} 