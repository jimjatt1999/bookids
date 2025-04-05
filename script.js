// script.js - Full Version

// Global variables to store user inputs
let userResponses = {
    childInfo: {
        name: '',
        gender: 'Boy',
        age: 5,
        interests: []
    },
    avatar: {
        base: 0, // Index of selected avatar OR null if uploaded
        skinTone: '#e2b38f',
        customization: '',
        source: 'select', // 'select' or 'upload'
        uploadedImage: null // Base64 data URL or null
    },
    cognitiveAreas: [],
    storyStyle: '', // Added to store illustration style
    storyTheme: '',
    readingLevel: 'intermediate',
    // Stores ALL available characters (main avatar + added ones)
    additionalCharacters: [], // Format: { id: string, name: string, description: string, imageData: string | null }
    // Stores IDs of characters selected for the CURRENT story generation
    storyCharacters: [], // Format: string[] (character IDs)
    customPrompt: ''
};

let currentStepId = 'step-1-landing'; // Keep track of current step
const totalWorkflowSteps = 6; // Adjusted: Steps before login (0-6)
let currentCharacterImage = null; // Temp storage for modal image data

// ---------- Initialization ----------
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired - Full script loaded");
    document.body.classList.add('on-step-1'); // Add initial class
    
    // Set up landing page start button
    const startButton = document.getElementById('start-story-button');
    if (startButton) {
        startButton.addEventListener('click', () => {
            navigateToStep('step-2-child-info');
        });
    }

    // Set up navigation buttons
    setupNavigationButtons();
    
    // Setup form interactions
    setupFormInteractions();
    
    // Make sure step 1 is initially active
    const firstStep = document.getElementById('step-1-landing');
    if (firstStep && !firstStep.classList.contains('active')) {
        firstStep.classList.add('active');
    }

    setupPromptEditing(); 
    setupCharacterModal();
});

// ---------- Navigation ----------
function navigateToStep(stepId) {
    console.log(`Navigating from ${currentStepId} to ${stepId}`);
    
    // Validate inputs before proceeding (if needed)
    if (!validateCurrentStep(currentStepId, stepId)) {
        return false;
    }
    
    // Hide current step
    const currentElement = document.getElementById(currentStepId);
    if (currentElement) {
        currentElement.style.display = 'none';
        currentElement.classList.remove('active');
    }
    
    // Show next step
    const nextElement = document.getElementById(stepId);
    if (nextElement) {
        nextElement.style.display = 'flex';
        nextElement.classList.add('active');
        currentStepId = stepId;
        window.scrollTo(0, 0);

        // Update progress bar
        updateProgressBar(stepId);

        // Populate character selection when navigating to step 6
        if (stepId === 'step-6-customize') {
            populateCharacterSelection();
        }
        // Populate confirmation details when navigating to step 6b
        if (stepId === 'step-6b-confirmation') {
            populateConfirmationDetails();
        }

        return true;
    } else {
        console.error(`Element with ID ${stepId} not found.`);
        return false;
    }
}

function updateProgressBar(stepId) {
    const progressBar = document.getElementById('global-progress-bar');
    if (!progressBar) return;

    // Map step IDs to a numerical order (adjust if steps change)
    const stepOrder = {
        'step-1-landing': 0,
        'step-2-child-info': 1,
        'step-3-avatar': 2,
        'step-4-cognitive': 3,
        'step-5-illustration': 4, // Changed step 5 to illustration
        'step-6-customize': 5,
        'step-6b-confirmation': 6 
        // Removed login and subsequent steps from progress tracking
        // 'step-7-login': 7, 
        // 'step-8-preview': 8,
        // 'step-9-purchase': 9
    };

    const currentStepNumber = stepOrder[stepId];
    // Only update progress if the step is part of the main workflow
    if (currentStepNumber !== undefined) {
        const progressPercentage = (currentStepNumber / totalWorkflowSteps) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    } else {
        // If step not in order (e.g., login, preview), potentially hide or reset?
        // For now, just don't update it further.
         // If moving *to* login or later, ensure it's 100%
        if (stepOrder[currentStepId] === totalWorkflowSteps) { 
             progressBar.style.width = `100%`;
        }
    }

    // Toggle body class for initial visibility
    if (stepId === 'step-1-landing') {
        document.body.classList.add('on-step-1');
    } else {
        document.body.classList.remove('on-step-1');
    }
}

function setupNavigationButtons() {
    // Set up all back and next buttons with data-navigate attributes
    document.querySelectorAll('.back-button, .next-button').forEach(button => {
        if (button.getAttribute('onclick')) return; // Skip if onclick already set
        
        button.addEventListener('click', (e) => {
            const stepId = e.target.getAttribute('data-navigate-to');
            if (stepId) {
                navigateToStep(stepId);
            }
        });
    });
}

// ---------- Validation ----------
function validateCurrentStep(currentStepId, nextStepId) {
    // Implement validation logic for each step as needed
    switch(currentStepId) {
        case 'step-2-child-info':
            // Check if name is provided
            const nameInput = document.getElementById('child-name');
            if (nameInput && nameInput.value.trim() === '') {
                showErrorModal("Please enter your child's name before proceeding.");
                return false;
            }
            // Save child info
            userResponses.childInfo.name = nameInput.value.trim();
            // Get gender selection
            userResponses.childInfo.gender = document.querySelector('.toggle-option.active')?.textContent || 'Boy';
            // Get age
            userResponses.childInfo.age = parseInt(document.querySelector('.slider-value')?.textContent || 5);
            // Get interests
            userResponses.childInfo.interests = Array.from(document.querySelectorAll('.interest-option.selected')).map(el => el.textContent);
            break;
            
        case 'step-3-avatar':
            // Save avatar settings
            const customization = document.getElementById('avatar-customization');
            if (customization) {
                userResponses.avatar.customization = customization.value.trim();
            }
            
            // Save source type and relevant data
            userResponses.avatar.source = document.querySelector('.avatar-source-toggle .toggle-option.active')?.getAttribute('data-source') || 'select';
            if (userResponses.avatar.source === 'select') {
                const selectedAvatar = document.querySelector('.avatar-option.selected');
                userResponses.avatar.base = selectedAvatar ? parseInt(selectedAvatar.getAttribute('data-avatar-index') || 0) : 0;
                const selectedTone = document.querySelector('.skin-tone-swatch.selected');
                userResponses.avatar.skinTone = selectedTone ? selectedTone.getAttribute('data-color') : '#e2b38f';
                userResponses.avatar.uploadedImage = null; // Clear uploaded image if switching back to select
            } else {
                // uploadedImage is already set by the file input handler
                userResponses.avatar.base = null;
                userResponses.avatar.skinTone = null; // Skin tone not applicable for upload
            }

            console.log("Saved avatar data:", userResponses.avatar);
            break;
            
        case 'step-4-cognitive':
            // Save cognitive areas
            userResponses.cognitiveAreas = Array.from(document.querySelectorAll('.cognitive-card.selected')).map(el => el.getAttribute('data-area'));
            if (userResponses.cognitiveAreas.length === 0 && nextStepId !== 'step-3-avatar') {
                showErrorModal("Please select at least one cognitive area to focus on.");
                return false;
            }
            break;
            
        case 'step-5-theme':
            // Save theme
            const selectedTheme = document.querySelector('.theme-option.selected');
            if (!selectedTheme && nextStepId !== 'step-4-cognitive') {
                showErrorModal("Please select a theme for the story.");
                return false;
            }
            if (selectedTheme) {
                userResponses.storyTheme = selectedTheme.getAttribute('data-theme');
            }
            // Get reading level
            userResponses.readingLevel = document.querySelector('input[name="reading-level"]:checked')?.value || 'intermediate';
            break;
            
        case 'step-6-characters':
            // Additional characters already saved through addCharacter() function
            // Nothing to do here for validation
            break;
            
        case 'step-8-custom':
            // Save custom prompt
            const customPromptInput = document.getElementById('custom-prompt');
            if (customPromptInput) {
                userResponses.customPrompt = customPromptInput.value.trim();
            }
            break;
    }
    
    console.log("Validated step data:", userResponses);
    return true;
}

// ---------- Form Interactions ----------
function setupFormInteractions() {
    // Set up child name input
    const childNameInput = document.getElementById('child-name');
    if (childNameInput) {
        childNameInput.addEventListener('input', () => {
            userResponses.childInfo.name = childNameInput.value.trim();
        });
    }

    // Set up gender toggle
    const genderOptions = document.querySelectorAll('.toggle-option');
    genderOptions.forEach(option => {
        option.addEventListener('click', () => {
            genderOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            userResponses.childInfo.gender = option.textContent.trim();
            // Update avatar display based on gender
            updateAvatarGender(option.textContent.trim());
        });
    });

    // Set up age slider if it exists
    const ageSlider = document.getElementById('age-slider');
    if (ageSlider) {
        const sliderValue = ageSlider.parentElement.querySelector('.slider-value');
        ageSlider.addEventListener('input', () => {
            sliderValue.textContent = ageSlider.value;
            userResponses.childInfo.age = parseInt(ageSlider.value);
        });
    }
    
    // Set up interest selection
    const interestOptions = document.querySelectorAll('.interest-option');
    interestOptions.forEach(option => {
        option.addEventListener('click', () => {
            if (option.classList.contains('selected')) {
                option.classList.remove('selected');
            } else {
                // Check if we already have 3 interests selected
                const selectedInterests = document.querySelectorAll('.interest-option.selected');
                if (selectedInterests.length < 3) {
                    option.classList.add('selected');
                }
            }
            // Update stored interests
            userResponses.childInfo.interests = Array.from(document.querySelectorAll('.interest-option.selected')).map(el => el.textContent);
        });
    });
    
    // Set up avatar source toggle
    const avatarSourceOptions = document.querySelectorAll('.avatar-source-toggle .toggle-option');
    const selectSection = document.getElementById('avatar-select-section');
    const uploadSection = document.getElementById('avatar-upload-section');

    avatarSourceOptions.forEach(option => {
        option.addEventListener('click', () => {
            avatarSourceOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            const source = option.getAttribute('data-source');
            userResponses.avatar.source = source; // Update source immediately
            if (source === 'upload') {
                selectSection.style.display = 'none';
                uploadSection.style.display = 'block';
            } else {
                selectSection.style.display = 'block';
                uploadSection.style.display = 'none';
            }
        });
    });

    // Set up avatar upload input
    const avatarUploadInput = document.getElementById('avatar-upload-input');
    const previewImage = document.getElementById('avatar-preview-image');
    const previewPlaceholder = document.getElementById('avatar-preview-placeholder');

    if (avatarUploadInput && previewImage && previewPlaceholder) {
        avatarUploadInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                // Basic validation (size)
                if (file.size > 2 * 1024 * 1024) { // 2MB limit
                    showErrorModal('Image size exceeds 2MB limit.');
                    avatarUploadInput.value = ''; // Clear the input
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                    previewPlaceholder.style.display = 'none';
                    userResponses.avatar.uploadedImage = e.target.result; // Store base64 data
                    console.log("Avatar image uploaded and stored.");
                }
                reader.onerror = function() {
                    showErrorModal('Error reading uploaded file.');
                    userResponses.avatar.uploadedImage = null;
                }
                reader.readAsDataURL(file); // Read as base64
            } else {
                // No file selected or selection cancelled
                previewImage.src = '#';
                previewImage.style.display = 'none';
                previewPlaceholder.style.display = 'block';
                userResponses.avatar.uploadedImage = null;
            }
        });
    }

    // Set up avatar selection (Preset)
    const avatarOptions = document.querySelectorAll('.avatar-option');
    avatarOptions.forEach((option, index) => {
        option.addEventListener('click', () => {
            avatarOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            userResponses.avatar.base = index;
        });
    });
    
    // Set up skin tone selection
    const skinToneOptions = document.querySelectorAll('.skin-tone-swatch');
    skinToneOptions.forEach(option => {
        option.addEventListener('click', () => {
            skinToneOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            const newColor = option.getAttribute('data-color'); // Get color from data attribute
            userResponses.avatar.skinTone = newColor;
            // Update avatar face color
            updateAvatarSkinTone(newColor);
        });
    });
    
    // Set up cognitive area selection
    const cognitiveCards = document.querySelectorAll('.cognitive-card');
    cognitiveCards.forEach(card => {
        card.addEventListener('click', () => {
            if (card.classList.contains('selected')) {
                card.classList.remove('selected');
            } else {
                // Check if we already have 2 areas selected
                const selectedAreas = document.querySelectorAll('.cognitive-card.selected');
                if (selectedAreas.length < 2) {
                    card.classList.add('selected');
                }
            }
            // Update stored cognitive areas immediately
            userResponses.cognitiveAreas = Array.from(document.querySelectorAll('.cognitive-card.selected')).map(el => el.getAttribute('data-area'));
        });
    });
    
    // Set up illustration style selection
    const styleCards = document.querySelectorAll('.art-style-card');
    styleCards.forEach(card => {
        card.addEventListener('click', () => {
            styleCards.forEach(opt => opt.classList.remove('selected'));
            card.classList.add('selected');
            userResponses.storyStyle = card.getAttribute('data-style');
            console.log('Selected style:', userResponses.storyStyle); // Debug log
        });
    });
    
    // Set up theme selection if it exists
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            themeOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            userResponses.storyTheme = option.getAttribute('data-theme');
        });
    });
    
    // Set up "Add Character" button if it exists
    // const addCharBtn = document.getElementById('add-character-btn');
    // if (addCharBtn) { ... }
}

// ---------- Character Modal & Management ----------

let characterToEdit = null; // Used if we implement editing later

function setupCharacterModal() {
    const modal = document.getElementById('add-character-modal');
    const saveBtn = document.getElementById('save-new-character-btn');
    const sourceToggleOptions = modal.querySelectorAll('#new-char-source-toggle .toggle-option');
    const uploadSection = document.getElementById('new-char-upload-section');
    const uploadInput = document.getElementById('new-char-upload-input');
    const previewImage = document.getElementById('new-char-preview-image');
    const previewPlaceholder = document.getElementById('new-char-preview-placeholder');

    // Source Toggle (No Image / Upload)
    sourceToggleOptions.forEach(option => {
        option.addEventListener('click', () => {
            sourceToggleOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            const source = option.getAttribute('data-source');
            uploadSection.style.display = (source === 'upload') ? 'block' : 'none';
            if (source !== 'upload') {
                currentCharacterImage = null; // Clear temp image if switching off upload
                resetCharacterUploadPreview();
            }
        });
    });

    // Image Upload Input Handling
    if (uploadInput && previewImage && previewPlaceholder) {
        uploadInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) { // 2MB limit
                    showErrorModal('Image size exceeds 2MB limit.');
                    uploadInput.value = ''; 
                    resetCharacterUploadPreview();
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                    previewPlaceholder.style.display = 'none';
                    currentCharacterImage = e.target.result; // Store base64 in temp var
                }
                reader.onerror = () => {
                    showErrorModal('Error reading uploaded file.');
                    currentCharacterImage = null;
                    resetCharacterUploadPreview();
                }
                reader.readAsDataURL(file);
            } else {
                resetCharacterUploadPreview();
            }
        });
    }

    // Save Button
    if (saveBtn) {
        saveBtn.addEventListener('click', saveCharacter);
    }
}

function openAddCharacterModal() {
    characterToEdit = null; // Reset edit state
    document.getElementById('add-character-modal').style.display = 'flex';
    // Reset form fields
    document.getElementById('new-char-name').value = '';
    document.getElementById('new-char-desc').value = '';
    document.getElementById('new-char-source-toggle').querySelectorAll('.toggle-option').forEach((opt, index) => {
        opt.classList.toggle('active', index === 0); // Default to 'No Image'
    });
    document.getElementById('new-char-upload-section').style.display = 'none';
    resetCharacterUploadPreview();
    currentCharacterImage = null;
}

function closeAddCharacterModal() {
    document.getElementById('add-character-modal').style.display = 'none';
}

function resetCharacterUploadPreview() {
    const uploadInput = document.getElementById('new-char-upload-input');
    const previewImage = document.getElementById('new-char-preview-image');
    const previewPlaceholder = document.getElementById('new-char-preview-placeholder');
    if (uploadInput) uploadInput.value = '';
    if (previewImage) {
        previewImage.src = '#';
        previewImage.style.display = 'none';
    }
    if (previewPlaceholder) previewPlaceholder.style.display = 'flex'; // Use flex if that's how it's centered
}

function saveCharacter() {
    const nameInput = document.getElementById('new-char-name');
    const descInput = document.getElementById('new-char-desc');
    const name = nameInput.value.trim();
    const description = descInput.value.trim();

    if (!name) {
        showErrorModal('Please enter a character name.');
        nameInput.focus();
        return;
    }
    if (!description) {
        showErrorModal('Please enter a character description or relationship.');
        descInput.focus();
        return;
    }

    const newCharacter = {
        id: `char-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, // Unique ID
        name: name,
        description: description,
        imageData: currentCharacterImage // Use the temp stored image data
    };

    // Add to the global list
    userResponses.additionalCharacters.push(newCharacter);
    console.log('Character saved:', newCharacter);
    console.log('Updated additionalCharacters:', userResponses.additionalCharacters);

    closeAddCharacterModal();
    populateCharacterSelection(); // Refresh the grid in Step 6
}

function removeCharacter(characterId, event) {
    event.stopPropagation(); // Prevent card selection when clicking remove button
    console.log(`Attempting to remove character: ${characterId}`);
    
    // Filter out the character
    userResponses.additionalCharacters = userResponses.additionalCharacters.filter(char => char.id !== characterId);
    
    // Also remove from the current story selection if present
    userResponses.storyCharacters = userResponses.storyCharacters.filter(id => id !== characterId);

    console.log('Updated additionalCharacters after removal:', userResponses.additionalCharacters);
    populateCharacterSelection(); // Refresh the grid
}

// ---------- Populate Dynamic Content ----------
function populateCharacterSelection() {
    console.log("Populating character selection...");
    const grid = document.getElementById('story-character-selection-grid');
    const addButtonTemplate = grid.querySelector('.add-new-char-card'); // Keep the template
    grid.innerHTML = ''; // Clear previous content

    // --- Ensure Main Avatar exists in additionalCharacters ---
    const mainAvatarId = 'main-avatar';
    let mainAvatarExists = userResponses.additionalCharacters.some(char => char.id === mainAvatarId);

    if (!mainAvatarExists && userResponses.childInfo.name) { // Only add if child name is set
        const mainAvatarCharacter = {
            id: mainAvatarId,
            name: userResponses.childInfo.name,
            description: 'Main Character',
            imageData: userResponses.avatar.source === 'upload' ? userResponses.avatar.uploadedImage : null, // Use uploaded if available
            // Store preset info if needed later for regeneration
            presetBase: userResponses.avatar.source === 'select' ? userResponses.avatar.base : null,
            presetSkin: userResponses.avatar.source === 'select' ? userResponses.avatar.skinTone : null
        };
        userResponses.additionalCharacters.unshift(mainAvatarCharacter); // Add to beginning
        // Automatically select the main avatar for the story initially
        if (!userResponses.storyCharacters.includes(mainAvatarId)) {
            userResponses.storyCharacters.push(mainAvatarId);
        }
        console.log("Main avatar added/updated in additionalCharacters.");
    } else if (mainAvatarExists) {
         // Ensure main avatar is selected if it exists
         if (!userResponses.storyCharacters.includes(mainAvatarId)) {
            userResponses.storyCharacters.push(mainAvatarId);
        }
    }

    // --- Populate Grid from additionalCharacters ---
    userResponses.additionalCharacters.forEach(char => {
        const card = document.createElement('div');
        card.classList.add('character-select-card');
        card.setAttribute('data-char-id', char.id);
        if (userResponses.storyCharacters.includes(char.id)) {
            card.classList.add('active'); // Mark as active if selected for story
        }

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('char-select-img-container');
        if (char.imageData) {
            imgContainer.innerHTML = `<img src="${char.imageData}" alt="${char.name}" class="char-select-img">`;
        } else if (char.id === mainAvatarId && char.presetSkin) {
             // Placeholder for main avatar using preset skin tone if no image
             imgContainer.innerHTML = `<div class="char-select-img placeholder-avatar" style="background-color: ${char.presetSkin};">(Avatar)</div>`;
        } else {
            // Generic placeholder
             imgContainer.innerHTML = `<div class="char-select-img placeholder-avatar">?</div>`;
        }

        const infoContainer = document.createElement('div');
        infoContainer.classList.add('char-select-info');
        infoContainer.innerHTML = `<span class="char-select-name">${char.name}</span><span class="char-select-desc">${char.description}</span>`;

        card.appendChild(imgContainer);
        card.appendChild(infoContainer);

        // Add Remove Button (except for main avatar)
        if (char.id !== mainAvatarId) {
            const removeBtn = document.createElement('button');
            removeBtn.classList.add('remove-char-btn-grid');
            removeBtn.innerHTML = '&times;'; // 'x' symbol
            removeBtn.onclick = (event) => removeCharacter(char.id, event);
            card.appendChild(removeBtn);
        }

        // Add click listener for selection/deselection
        card.addEventListener('click', () => {
            card.classList.toggle('active');
            updateSelectedStoryCharacters(); // Update the list based on .active class
        });

        grid.appendChild(card);
    });
    
    // --- Re-append the Add Button --- 
    if (addButtonTemplate) {
        const addButton = addButtonTemplate.cloneNode(true); // Clone the template
        addButton.style.display = 'flex'; // Ensure it's visible
        addButton.addEventListener('click', openAddCharacterModal); // Attach listener
        grid.appendChild(addButton);
    }

    console.log("Character selection grid populated.");
    updateSelectedStoryCharacters(); // Initial update based on potentially added main avatar
}

function updateSelectedStoryCharacters() {
    userResponses.storyCharacters = [];
    document.querySelectorAll('#story-character-selection-grid .character-select-card.active').forEach(card => {
        const id = card.getAttribute('data-char-id');
        if (id) { 
            userResponses.storyCharacters.push(id);
        }
    });
    console.log("Updated storyCharacters (IDs):", userResponses.storyCharacters);
}

function populateConfirmationDetails() {
    console.log("Populating confirmation details with:", userResponses);
    
    // Helper function to safely set text content
    const setText = (id, text) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text || 'Not specified'; // Use 'Not specified' if empty
        } else {
            console.warn(`Element with ID ${id} not found for confirmation.`);
        }
    };

    // --- Child Information ---
    setText('confirm-name', userResponses.childInfo.name);
    setText('confirm-age', userResponses.childInfo.age);
    setText('confirm-gender', userResponses.childInfo.gender);
    setText('confirm-interests', userResponses.childInfo.interests.join(', ') || 'None');

    // --- Story Elements ---
    setText('confirm-cognitive', userResponses.cognitiveAreas.join(', ').replace(/-/g, ' ') || 'None'); // Replace hyphens for display
    setText('confirm-style', userResponses.storyStyle.replace(/-/g, ' ') || 'Not selected'); // Replace hyphens
    // setText('confirm-length', userResponses.storyLength); // Assuming storyLength exists later
    // setText('confirm-type', userResponses.storyType); // Assuming storyType exists later
    setText('confirm-length', 'Default'); // Placeholder
    setText('confirm-type', 'Standard');   // Placeholder

    // --- Avatar/Character Info ---
    const selectedChars = userResponses.additionalCharacters.filter(char => 
        userResponses.storyCharacters.includes(char.id)
    );
    const charactersText = selectedChars.map(c => c.name).join(', ');
    setText('confirm-characters', charactersText || 'None selected'); 

    // --- Custom Prompt --- 
    // We will now generate and display the structured prompt
    setText('confirm-custom-prompt', userResponses.customPrompt || 'None'); // Need an element with id="confirm-custom-prompt"

    // --- Generate and Display Structured Prompt ---
    const structuredPromptText = generateStructuredPrompt();
    const promptBox = document.getElementById('structured-prompt');
    if (promptBox) {
        promptBox.textContent = structuredPromptText; // Use textContent to preserve formatting like newlines
    } else {
        console.warn("Element with ID structured-prompt not found.");
    }

    // --- Display Avatar Preview? (More complex) ---
    // Could potentially display the selected skin tone or base avatar index
    // Example: setText('confirm-avatar-skin', userResponses.avatar.skinTone);
}

// ---------- Generate Structured Prompt ----------
function generateStructuredPrompt() {
    console.log("Generating structured prompt from:", userResponses);
    let prompt = `Generate a personalized, engaging children's story suitable for a ${userResponses.childInfo.age}-year-old child. \n\n`;

    // Main Character (Find from additionalCharacters using ID)
    const mainAvatar = userResponses.additionalCharacters.find(char => char.id === 'main-avatar');
    if (mainAvatar) {
        prompt += `**Main Character:**\n`;
        prompt += `- Name: ${mainAvatar.name}\n`;
        prompt += `- Age: ${userResponses.childInfo.age}\n`; // Age is separate
        prompt += `- Gender: ${userResponses.childInfo.gender}\n`; // Gender is separate
        prompt += `- Description: ${mainAvatar.description}\n`;
        if (mainAvatar.imageData) {
             prompt += `- Appearance: Based on provided image.\n`;
        } else if (userResponses.avatar.customization) { // Use customization text if no image
             prompt += `- Appearance Notes: ${userResponses.avatar.customization}\n`;
        }
        prompt += `\n`;
    }

    // Other Characters (Filter from additionalCharacters based on storyCharacters, excluding main)
    const otherStoryChars = userResponses.additionalCharacters.filter(char => 
        userResponses.storyCharacters.includes(char.id) && char.id !== 'main-avatar'
    );
    if (otherStoryChars.length > 0) {
        prompt += `**Other Characters Included:**\n`;
        prompt += `Ensure these characters play a meaningful role in the story, interacting with the main character.\n`;
        otherStoryChars.forEach(char => {
             prompt += `- ${char.name}: ${char.description}`;
             if (char.imageData) prompt += ` (Appearance based on image)`;
             prompt += `\n`;
        });
         prompt += `\n`;
    }

    // Interests
    if (userResponses.childInfo.interests && userResponses.childInfo.interests.length > 0) {
        prompt += `**Incorporate Child's Interests:**\n`;
        prompt += `- Themes or elements related to: ${userResponses.childInfo.interests.join(', ')}\n`;
        prompt += `\n`;
    }

    // Cognitive Focus - Make this detailed
    prompt += `**Cognitive Development Focus (Integrate Naturally):**\n`;
    if (userResponses.cognitiveAreas && userResponses.cognitiveAreas.length > 0) {
        userResponses.cognitiveAreas.forEach(area => {
            prompt += `- ${area.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: `; // Capitalize words
            switch (area) {
                case 'executive-function':
                    prompt += `Include scenarios requiring planning, organization, or task initiation. Maybe ${userResponses.childInfo.name} needs to plan a small event or organize toys before playing.`;
                    break;
                case 'attention-focus':
                    prompt += `Create moments where sustained attention is needed or distractions must be ignored. Perhaps ${userResponses.childInfo.name} needs to focus on finding something specific or listening carefully to instructions.`;
                    break;
                case 'memory':
                    prompt += `Weave in details early in the story that ${userResponses.childInfo.name} needs to recall later. This could be remembering a path, a sequence of events, or where an item was placed.`;
                    break;
                case 'language': // Updated name from HTML
                    prompt += `Use rich vocabulary and descriptive language suitable for the age. Encourage communication between characters. Perhaps include a simple rhyme or song.`;
                    break;
                case 'problem-solving': // Updated name from HTML
                    prompt += `Introduce a simple problem or challenge that the characters need to think through and solve together using logic or creativity.`;
                    break;
                case 'conceptual':
                    prompt += `Introduce basic concepts like shapes, colors, numbers, or simple cause-and-effect relationships within the narrative.`;
                    break;
                 case 'emotional-regulation': // Example if added later
                     prompt += `Present situations where ${userResponses.childInfo.name} experiences mild frustration or excitement and learns simple coping strategies or ways to express feelings appropriately.`;
                     break;
                 case 'social-skills': // Example if added later
                     prompt += `Include interactions that model sharing, taking turns, empathy, or understanding others' perspectives.`;
                     break;
                default:
                    prompt += `Focus on this cognitive area throughout the story.`;
            }
            prompt += `\n`;
        });
    } else {
        prompt += `- General cognitive engagement suitable for the age group.\n`;
    }
    prompt += `\n`;

    // Illustration Style
    if (userResponses.storyStyle) {
        prompt += `**Visual Style:**\n`;
        prompt += `- The story should be suitable for illustration in a **${userResponses.storyStyle.replace(/-/g, ' ')}** style. Evoke the appropriate mood (e.g., whimsical, vibrant, detailed).\n`;
        prompt += `\n`;
    }

    // Custom Prompt / Notes
    if (userResponses.customPrompt) {
        prompt += `**Additional User Notes:**\n`;
        prompt += `- Please incorporate the following: ${userResponses.customPrompt}\n`;
        prompt += `\n`;
    }
    
    prompt += `**Tone:** Make the story positive, age-appropriate, and engaging, ending on a satisfying note. Avoid complex sentences or overly abstract ideas unless directly related to the 'conceptual' cognitive goal.`

    return prompt;
}

// ---------- Setup Edit/Save Prompt Buttons ----------
function setupPromptEditing() {
    const editButton = document.getElementById('edit-prompt-button');
    const saveButton = document.getElementById('save-prompt-button');
    const promptBox = document.getElementById('structured-prompt');
    const promptEditArea = document.getElementById('prompt-edit-textarea');

    if (editButton && saveButton && promptBox && promptEditArea) {
        editButton.addEventListener('click', () => {
            promptBox.style.display = 'none';
            editButton.style.display = 'none';
            promptEditArea.style.display = 'block';
            saveButton.style.display = 'inline-block';
            promptEditArea.value = promptBox.textContent; // Ensure textarea has latest content
            promptEditArea.focus();
        });

        saveButton.addEventListener('click', () => {
            const editedPrompt = promptEditArea.value;
            promptBox.textContent = editedPrompt;
            userResponses.customPrompt = editedPrompt; // Save the *entire* edited prompt
            
            promptBox.style.display = 'block';
            editButton.style.display = 'inline-block';
            promptEditArea.style.display = 'none';
            saveButton.style.display = 'none';
            console.log("Custom prompt saved.");
        });
    }
}

// ---------- Helper Functions ----------
function updateAvatarGender(gender) {
    // Toggle display of boy/girl hair styles in SVG avatars
    const avatarSvgs = document.querySelectorAll('.avatar-svg');
    avatarSvgs.forEach(svg => {
        const boyHair = svg.querySelector('.boy-hair');
        const girlHair = svg.querySelector('.girl-hair');
        
        if (gender === 'Boy') {
            if (boyHair) boyHair.style.display = 'block';
            if (girlHair) girlHair.style.display = 'none';
        } else {
            if (boyHair) boyHair.style.display = 'none';
            if (girlHair) girlHair.style.display = 'block';
        }
    });
}

function updateAvatarSkinTone(color) {
    // Update face color in all SVG avatars
    const faceElements = document.querySelectorAll('.avatar-face');
    faceElements.forEach(face => {
        face.setAttribute('fill', color);
    });
}

// ---------- Error Handling ----------
function showErrorModal(message) {
    const errorModal = document.getElementById('error-modal');
    const errorContent = document.getElementById('error-content');
    const closeBtn = errorModal?.querySelector('.close-button'); // Get close button inside modal
    
    if (errorModal && errorContent) {
        errorContent.textContent = message;
        errorModal.style.display = 'flex';
        // Add listener to close button *inside* the error modal if needed
        // closeBtn?.addEventListener('click', closeErrorModal); 
    } else {
        alert(message); // Fallback
    }
}

// Add function to close error modal if not already present
function closeErrorModal() {
    const errorModal = document.getElementById('error-modal');
    if (errorModal) {
        errorModal.style.display = 'none';
    }
} 