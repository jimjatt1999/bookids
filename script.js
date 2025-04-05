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
    additionalCharacters: [],
    storyCharacters: [], // Added: Characters selected specifically for THIS story
    customPrompt: ''
};

let currentStepId = 'step-1-landing'; // Keep track of current step
const totalWorkflowSteps = 9; // Define total number of steps (adjust if needed)

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
        'step-5-illustration': 4, // Assuming theme is removed/combined
        'step-6-customize': 5,
        'step-6b-confirmation': 6, 
        'step-7-login': 7, 
        'step-8-preview': 8,
        'step-9-purchase': 9
        // Omitting step 10 (library) as it's outside the creation flow
    };

    const currentStepNumber = stepOrder[stepId] || 0;
    const progressPercentage = (currentStepNumber / totalWorkflowSteps) * 100;

    progressBar.style.width = `${progressPercentage}%`;

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
    const addCharBtn = document.getElementById('add-character-btn');
    if (addCharBtn) {
        addCharBtn.addEventListener('click', addCharacter);
    }
}

// ---------- Populate Dynamic Content ----------
function populateCharacterSelection() {
    console.log("Populating character selection...");
    const grid = document.getElementById('story-character-selection-grid');
    const addButton = grid.querySelector('.add-new-char-card'); // Keep the add button
    grid.innerHTML = ''; // Clear previous characters (except add button)

    // Add the main avatar first (assuming it's always included initially)
    const mainAvatarData = userResponses.avatar;
    const childName = userResponses.childInfo.name || "Child"; // Use placeholder if no name
    
    // --- Create Main Avatar Card ---
    const mainAvatarCard = document.createElement('div');
    mainAvatarCard.classList.add('character-select-card', 'active'); // Assume main avatar is active by default
    mainAvatarCard.setAttribute('data-char-id', 'main-avatar');
    
    // Use uploaded image if available, otherwise use placeholder/preset logic
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('char-select-img-container'); // Use consistent class
    
    if (mainAvatarData.source === 'upload' && mainAvatarData.uploadedImage) {
        imgContainer.innerHTML = `<img src="${mainAvatarData.uploadedImage}" alt="${childName}" class="char-select-img">`;
    } else {
        // Placeholder or logic to generate SVG based on selection (base, skinTone, gender)
        const bgColor = mainAvatarData.skinTone || '#e2b38f'; // Fallback skin tone
        imgContainer.innerHTML = `<div class="char-select-img placeholder-avatar" style="background-color: ${bgColor};">(Avatar)</div>`; 
    }
    
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('char-select-info');
    infoContainer.innerHTML = `<span class="char-select-name">${childName}</span><span class="char-select-desc">Main Character</span>`;
    
    mainAvatarCard.appendChild(imgContainer);
    mainAvatarCard.appendChild(infoContainer);
    grid.appendChild(mainAvatarCard);
    
    // Add main avatar to story characters by default
    userResponses.storyCharacters = [{ id: 'main-avatar', name: childName, type: 'Main Character' }];

    // Add event listener for selection (including main avatar)
    mainAvatarCard.addEventListener('click', () => {
        mainAvatarCard.classList.toggle('active');
        updateSelectedStoryCharacters(); // Update the list based on .active class
    });

    // Re-append the add button
    if (addButton) {
        grid.appendChild(addButton);
        // TODO: Add event listener to the 'add' button to handle adding new characters
        addButton.addEventListener('click', () => {
            alert("Functionality to add new characters here is not yet implemented.");
            // This could open a modal or navigate to another step
        });
    }
    
    // TODO: Add logic here to populate with *additional* characters if they exist 
    // in userResponses.additionalCharacters and add event listeners to them.

    console.log("Initial story characters:", userResponses.storyCharacters);
}

function updateSelectedStoryCharacters() {
    userResponses.storyCharacters = [];
    document.querySelectorAll('#story-character-selection-grid .character-select-card.active').forEach(card => {
        const id = card.getAttribute('data-char-id');
        if (id !== null && id !== 'add-new-story-character-btn') { // Exclude the add button itself
             const name = card.querySelector('.char-select-name')?.textContent || 'Unknown';
             const desc = card.querySelector('.char-select-desc')?.textContent || 'Character';
            userResponses.storyCharacters.push({ id: id, name: name, type: desc });
        }
    });
    console.log("Updated story characters:", userResponses.storyCharacters);
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
    // Example: Display selected characters 
    const charactersText = userResponses.storyCharacters.map(c => c.name).join(', ');
    setText('confirm-characters', charactersText || 'None selected'); // Need an element with id="confirm-characters"

    // --- Custom Prompt --- 
    // We will now generate and display the structured prompt
    // setText('confirm-custom-prompt', userResponses.customPrompt || 'None'); // Keep this for raw input if needed elsewhere
    const structuredPrompt = generateStructuredPrompt();
    const promptBox = document.getElementById('structured-prompt');
    const promptEditArea = document.getElementById('prompt-edit-textarea');
    if (promptBox) {
        promptBox.textContent = structuredPrompt;
    }
    if (promptEditArea) {
        promptEditArea.value = structuredPrompt; // Pre-fill textarea
    }
    // Clear the old separate custom prompt display if it exists
    setText('confirm-custom-prompt', '-'); 

    // --- Display Avatar Preview? (More complex) ---
    // Could potentially display the selected skin tone or base avatar index
    // Example: setText('confirm-avatar-skin', userResponses.avatar.skinTone);
}

// ---------- Generate Structured Prompt ----------
function generateStructuredPrompt() {
    let prompt = `Generate a children's story with the following characteristics:\n\n`;

    // Child Info
    prompt += `**Child:**\n`;
    prompt += `  - Name: ${userResponses.childInfo.name || 'The Child'}\n`;
    prompt += `  - Age: ${userResponses.childInfo.age || 'Unknown'}\n`;
    prompt += `  - Gender: ${userResponses.childInfo.gender || 'Unknown'}\n`;
    if (userResponses.childInfo.interests.length > 0) {
        prompt += `  - Interests: ${userResponses.childInfo.interests.join(', ')}\n`;
    }
    prompt += `\n`;

    // Avatar/Character Info
    prompt += `**Main Character Appearance:**\n`;
    if (userResponses.avatar.source === 'upload') {
        prompt += `  - Based on uploaded image.\n`;
    } else {
        prompt += `  - Preset Avatar Index: ${userResponses.avatar.base}\n`;
        prompt += `  - Skin Tone: ${userResponses.avatar.skinTone || 'Default'}\n`;
    }
    if (userResponses.avatar.customization) {
        prompt += `  - Custom details: ${userResponses.avatar.customization}\n`;
    }
    prompt += `\n`;
    
    if (userResponses.storyCharacters.length > 1) {
         prompt += `**Other Characters:**\n`;
         userResponses.storyCharacters.forEach(char => {
             if (char.id !== 'main-avatar') { // Don't list main avatar again
                 prompt += `  - ${char.name} (${char.type || 'Character'})\n`;
             }
         });
         prompt += `\n`;
    }

    // Story Elements
    prompt += `**Story Elements:**\n`;
    if (userResponses.cognitiveAreas.length > 0) {
        prompt += `  - Cognitive Focus: ${userResponses.cognitiveAreas.join(', ').replace(/-/g, ' ')}\n`;
    }
    if (userResponses.storyStyle) {
        prompt += `  - Illustration Style: ${userResponses.storyStyle.replace(/-/g, ' ')}\n`;
    }
    // Add theme, reading level, length, type later if they exist
    // prompt += `  - Theme: ${userResponses.storyTheme || 'General'}\n`;
    // prompt += `  - Reading Level: ${userResponses.readingLevel || 'Intermediate'}\n`;
    prompt += `\n`;

    // Custom Notes/Prompt
    const customNotes = document.getElementById('custom-prompt')?.value.trim(); // Get latest value from step 6 textarea
    if (customNotes) {
        prompt += `**Additional Notes/Requests:**\n${customNotes}\n`;
    } else if (userResponses.customPrompt) {
         // Use value saved if navigating back and forth
         prompt += `**Additional Notes/Requests:**\n${userResponses.customPrompt}\n`;
    }

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

function addCharacter() {
    const characterName = document.getElementById('character-name').value.trim();
    const characterRelation = document.getElementById('character-relation').value.trim();
    
    if (!characterName || !characterRelation) {
        showErrorModal("Please enter both a name and relationship for the character.");
        return;
    }
    
    // Add to stored data
    userResponses.additionalCharacters.push({
        name: characterName,
        relation: characterRelation
    });
    
    // Add to visual list
    const charactersList = document.getElementById('characters-list');
    const emptyMessage = document.querySelector('.empty-char-list');
    
    if (emptyMessage) {
        emptyMessage.remove();
    }
    
    const charEntry = document.createElement('div');
    charEntry.classList.add('character-entry');
    charEntry.innerHTML = `
        <div class="character-info">
            <strong>${characterName}</strong>
            <span>(${characterRelation})</span>
        </div>
        <button class="remove-char-btn" data-index="${userResponses.additionalCharacters.length - 1}">×</button>
    `;
    
    // Add event listener to remove button
    charEntry.querySelector('.remove-char-btn').addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        userResponses.additionalCharacters.splice(index, 1);
        charEntry.remove();
        
        // Re-index remaining buttons
        document.querySelectorAll('.remove-char-btn').forEach((btn, i) => {
            btn.setAttribute('data-index', i);
        });
        
        // Show empty message if needed
        if (userResponses.additionalCharacters.length === 0) {
            charactersList.innerHTML = '<div class="empty-char-list">No additional characters added yet.</div>';
        }
    });
    
    charactersList.appendChild(charEntry);
    
    // Clear inputs
    document.getElementById('character-name').value = '';
    document.getElementById('character-relation').value = '';
}

// ---------- Error Handling ----------
function showErrorModal(message) {
    const errorModal = document.getElementById('error-modal');
    const errorContent = document.getElementById('error-content');
    
    if (errorModal && errorContent) {
        errorContent.textContent = message;
        errorModal.style.display = 'flex';
    } else {
        // Fallback to alert if modal not available
        alert(message);
    }
} 