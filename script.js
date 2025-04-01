// Config options
const USE_REAL_LLM = false;  // Set to true to use real LLM API requests

// State management
let currentState = {
    loggedIn: false,
    user: null,
    childData: {
        name: '',
        age: '',
        gender: '',
        interests: '',
        appearance: '',
        food: '',
        photo: null,
        additionalCharacters: {
            sibling: { included: false, name: '', relation: '' },
            pet: { included: false, name: '', type: '' },
            friend: { included: false, name: '' }
        }
    },
    story: {
        title: '',
        type: '',
        content: [],
        currentPage: 0
    },
    order: {
        bookTitle: '',
        format: 'digital',
        price: 14.99,
        shipping: 0.00,
        merchandise: []
    },
    library: []
};

// DOM Elements
const pages = {
    login: document.getElementById('login'),
    landing: document.getElementById('landing'),
    library: document.getElementById('library'),
    onboarding: document.getElementById('onboarding'),
    loading: document.getElementById('loading'),
    preview: document.getElementById('preview'),
    checkout: document.getElementById('checkout'),
    confirmation: document.getElementById('confirmation')
};

// Navigation
function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
}

// Initialize app
function initApp() {
    setupEventListeners();
    setupCustomSelects();
    navigateTo('login');
}

// Set up custom select dropdowns
function setupCustomSelects() {
    document.querySelectorAll('.custom-select').forEach(select => {
        select.addEventListener('change', function() {
            // Update the selected option text if needed
        });
    });
}

// Set up all event listeners
function setupEventListeners() {
    // Login form submit
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (email && password) {
            currentState.loggedIn = true;
            currentState.user = { email };
            navigateTo('landing');
            updateLogoutButton();
        }
    });
    
    // Dev pass button
    document.getElementById('devPassBtn').addEventListener('click', function() {
        currentState.loggedIn = true;
        currentState.user = { email: 'dev@example.com' };
        navigateTo('landing');
        updateLogoutButton();
    });
    
    // Signup toggle
    document.getElementById('showSignupLink').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('loginFormContainer').classList.add('hidden');
        document.getElementById('signupFormContainer').classList.remove('hidden');
    });
    
    // Login toggle
    document.getElementById('showLoginLink').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('signupFormContainer').classList.add('hidden');
        document.getElementById('loginFormContainer').classList.remove('hidden');
    });
    
    // Signup form submit
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        
        if (email && password) {
            currentState.loggedIn = true;
            currentState.user = { email };
            navigateTo('landing');
            updateLogoutButton();
        }
    });
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function() {
        currentState.loggedIn = false;
        currentState.user = null;
        navigateTo('login');
    });

    // Get Started / Create a Story button
    document.getElementById('getStartedBtn').addEventListener('click', function() {
        if (!currentState.loggedIn) {
            navigateTo('login');
        } else {
            navigateTo('onboarding');
        }
    });
    
    // Library nav link
    document.querySelector('a[href="#library"]').addEventListener('click', function(e) {
        e.preventDefault();
        if (!currentState.loggedIn) {
            navigateTo('login');
        } else {
            navigateTo('library');
        }
    });
    
    // Create New Story button in library
    if (document.querySelector('.library-header .btn')) {
        document.querySelector('.library-header .btn').addEventListener('click', function() {
            navigateTo('onboarding');
        });
    }
    
    // Book cards in library
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('click', function() {
            // In a real app, this would load the selected book
            // For demo, we'll just go to the preview page
            navigateTo('preview');
        });
    });

    // File upload preview
    if (document.getElementById('childPhoto')) {
        document.getElementById('childPhoto').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const preview = document.getElementById('photoPreview');
                    preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
                currentState.childData.photo = file;
            }
        });
    }
    
    // Additional character checkboxes
    document.querySelectorAll('.character-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const detailsId = this.id.replace('include', '') + 'Details';
            const detailsDiv = document.getElementById(detailsId);
            
            if (this.checked) {
                detailsDiv.classList.add('active');
                
                // Update state
                const characterType = this.id.replace('include', '').toLowerCase();
                currentState.childData.additionalCharacters[characterType].included = true;
            } else {
                detailsDiv.classList.remove('active');
                
                // Update state
                const characterType = this.id.replace('include', '').toLowerCase();
                currentState.childData.additionalCharacters[characterType].included = false;
            }
        });
    });
    
    // Additional character inputs
    document.getElementById('siblingName')?.addEventListener('input', function() {
        currentState.childData.additionalCharacters.sibling.name = this.value;
    });
    
    document.getElementById('siblingRelation')?.addEventListener('change', function() {
        currentState.childData.additionalCharacters.sibling.relation = this.value;
    });
    
    document.getElementById('petName')?.addEventListener('input', function() {
        currentState.childData.additionalCharacters.pet.name = this.value;
    });
    
    document.getElementById('petType')?.addEventListener('change', function() {
        currentState.childData.additionalCharacters.pet.type = this.value;
    });
    
    document.getElementById('friendName')?.addEventListener('input', function() {
        currentState.childData.additionalCharacters.friend.name = this.value;
    });
    
    // Favorite food input
    document.getElementById('childFood')?.addEventListener('input', function() {
        currentState.childData.food = this.value;
    });

    // Continue to merchandise button
    document.getElementById('continueToMerchBtn')?.addEventListener('click', function() {
        // Switch to the merchandise tab
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        document.querySelector('.tab[data-tab="merchandise"]').classList.add('active');
        document.getElementById('merchandise-tab').classList.add('active');
    });
    
    // Merchandise quantity buttons
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            const currentValue = parseInt(input.value);
            if (currentValue < parseInt(input.max)) {
                input.value = currentValue + 1;
                updateMerchandiseOrder(input);
            }
        });
    });
    
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            const currentValue = parseInt(input.value);
            if (currentValue > parseInt(input.min)) {
                input.value = currentValue - 1;
                updateMerchandiseOrder(input);
            }
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            updateMerchandiseOrder(this);
        });
    });
    
    // Add bundle button
    document.getElementById('addBundleBtn')?.addEventListener('click', function() {
        // Set all merchandise items to 1
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.value = 1;
            updateMerchandiseOrder(input);
        });
        
        // Apply bundle discount
        currentState.order.merchandise = currentState.order.merchandise.map(item => {
            return { ...item, price: item.price * 0.8 }; // 20% discount
        });
        
        updateOrderSummary();
    });

    // Onboarding form
    document.getElementById('onboardingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get child data
        currentState.childData = {
            name: document.getElementById('childName').value,
            age: document.getElementById('childAge').value,
            gender: document.getElementById('childGender').value,
            interests: document.getElementById('childInterests').value,
            appearance: document.getElementById('childAppearance').value,
            food: document.getElementById('childFood').value,
            photo: currentState.childData.photo,
            additionalCharacters: {
                sibling: {
                    included: document.getElementById('includeSibling')?.checked || false,
                    name: document.getElementById('siblingName')?.value || '',
                    relation: document.getElementById('siblingRelation')?.value || ''
                },
                pet: {
                    included: document.getElementById('includePet')?.checked || false,
                    name: document.getElementById('petName')?.value || '',
                    type: document.getElementById('petType')?.value || ''
                },
                friend: {
                    included: document.getElementById('includeFriend')?.checked || false,
                    name: document.getElementById('friendName')?.value || ''
                }
            }
        };
        
        // Get story type
        const storyTypeSelect = document.getElementById('storyType');
        const storyType = storyTypeSelect.value;
        const storyTypeText = storyTypeSelect.options[storyTypeSelect.selectedIndex].text;
        
        // Update story state
        currentState.story.type = storyType;
        currentState.story.title = `${currentState.childData.name}'s ${storyTypeText}`;
        
        // Update order information
        currentState.order.bookTitle = currentState.story.title;
        
        // Go to loading screen
        navigateTo('loading');
        
        // Generate story
        generateStory();
    });

    // Book navigation
    document.getElementById('prevPageBtn').addEventListener('click', function() {
        if (currentState.story.currentPage > 0) {
            const bookPages = document.querySelector('.book-pages');
            bookPages.classList.add('page-turning');
            
            setTimeout(() => {
                currentState.story.currentPage--;
                updateStoryPage();
                bookPages.classList.remove('page-turning');
            }, 500);
        }
    });
    
    document.getElementById('nextPageBtn').addEventListener('click', function() {
        if (currentState.story.currentPage < currentState.story.content.length - 1) {
            const bookPages = document.querySelector('.book-pages');
            bookPages.classList.add('page-turning');
            
            setTimeout(() => {
                currentState.story.currentPage++;
                updateStoryPage();
                bookPages.classList.remove('page-turning');
            }, 500);
        }
    });

    // Checkout button
    document.getElementById('checkoutBtn').addEventListener('click', function() {
        prepareCheckout();
        navigateTo('checkout');
    });
    
    // Pricing option selection
    if (document.querySelectorAll('.pricing-option')) {
        document.querySelectorAll('.pricing-option').forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected class from all options
                document.querySelectorAll('.pricing-option').forEach(opt => {
                    opt.classList.remove('selected');
                    opt.querySelector('button').textContent = 'Select';
                    opt.querySelector('button').className = 'btn primary';
                });
                
                // Add selected class to clicked option
                this.classList.add('selected');
                this.querySelector('button').textContent = 'Selected';
                this.querySelector('button').className = 'btn outline';
                
                // Update order information based on selection
                const format = this.querySelector('.pricing-title').textContent.toLowerCase();
                const price = parseFloat(this.querySelector('.pricing-price').textContent.replace('$', ''));
                
                currentState.order.format = format;
                currentState.order.price = price;
                
                // Update shipping cost based on format
                if (format.includes('digital') && !format.includes('bundle')) {
                    currentState.order.shipping = 0;
                } else {
                    currentState.order.shipping = 4.99;
                }
                
                updateOrderSummary();
            });
        });
    }
    
    // Tab switching in checkout
    if (document.querySelectorAll('.tab')) {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs and content
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
    }
    
    // Continue to payment button
    if (document.getElementById('continueToPaymentBtn')) {
        document.getElementById('continueToPaymentBtn').addEventListener('click', function() {
            // Switch to the payment tab
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            document.querySelector('.tab[data-tab="payment"]').classList.add('active');
            document.getElementById('payment-tab').classList.add('active');
        });
    }

    // Payment form
    document.getElementById('paymentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        processPayment();
    });

    // View Library button
    if (document.getElementById('viewLibraryBtn')) {
        document.getElementById('viewLibraryBtn').addEventListener('click', function() {
            navigateTo('library');
        });
    }

    // Create another book button
    document.getElementById('createAnotherBtn').addEventListener('click', function() {
        resetStoryState();
        navigateTo('onboarding');
    });
}

// Update logout button based on login state
function updateLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (currentState.loggedIn) {
        logoutBtn.style.display = 'block';
    } else {
        logoutBtn.style.display = 'none';
    }
}

// Update merchandise order
function updateMerchandiseOrder(input) {
    const quantity = parseInt(input.value);
    const item = input.dataset.item;
    const price = parseFloat(input.dataset.price);
    
    // Remove existing item from order
    currentState.order.merchandise = currentState.order.merchandise.filter(
        merchItem => merchItem.item !== item
    );
    
    // Add item if quantity > 0
    if (quantity > 0) {
        currentState.order.merchandise.push({
            item: item,
            quantity: quantity,
            price: price * quantity,
            unitPrice: price
        });
    }
    
    updateOrderSummary();
}

// Update order summary
function updateOrderSummary() {
    const orderTitle = document.getElementById('orderTitle');
    const orderPrice = document.getElementById('orderPrice');
    const orderShipping = document.getElementById('orderShipping');
    const orderTotal = document.getElementById('orderTotal');
    const merchandiseItems = document.getElementById('merchandiseItems');
    
    // Book title and price
    orderTitle.textContent = `${currentState.order.format}: ${currentState.order.bookTitle}`;
    orderPrice.textContent = `$${currentState.order.price.toFixed(2)}`;
    
    // Calculate shipping based on format and merchandise
    let shipping = 0;
    if (currentState.order.format.includes('digital') && !currentState.order.format.includes('bundle')) {
        shipping = 0;
    } else {
        shipping = 4.99;
    }
    
    // Add extra shipping for physical merchandise
    if (currentState.order.merchandise.length > 0) {
        shipping = Math.max(shipping, 4.99);
    }
    
    currentState.order.shipping = shipping;
    orderShipping.textContent = `$${shipping.toFixed(2)}`;
    
    // Merchandise items
    merchandiseItems.innerHTML = '';
    let merchandiseTotal = 0;
    
    currentState.order.merchandise.forEach(item => {
        const merchItem = document.createElement('div');
        merchItem.className = 'order-item';
        
        const itemName = item.item.charAt(0).toUpperCase() + item.item.slice(1);
        merchItem.innerHTML = `
            <span>${itemName} (${item.quantity})</span>
            <span>$${item.price.toFixed(2)}</span>
        `;
        
        merchandiseItems.appendChild(merchItem);
        merchandiseTotal += item.price;
    });
    
    // Calculate total
    const total = currentState.order.price + currentState.order.shipping + merchandiseTotal;
    orderTotal.textContent = `$${total.toFixed(2)}`;
}

// Generate story content
async function generateStory() {
    try {
        // Mock content for demo
        if (!USE_REAL_LLM) {
            setTimeout(() => {
                const mockStoryContent = generateMockStory();
                currentState.story.content = mockStoryContent;
                currentState.story.currentPage = 0;
                preparePreview();
                navigateTo('preview');
            }, 3000);
            return;
        }
        
        // For real LLM implementation (future)
        const prompt = buildStoryPrompt();
        const response = await callLLMApi(prompt);
        
        if (response && response.story) {
            currentState.story.content = parseStoryContent(response.story);
            currentState.story.currentPage = 0;
            preparePreview();
            navigateTo('preview');
        } else {
            throw new Error('Failed to generate story');
        }
    } catch (error) {
        console.error('Error generating story:', error);
        alert('Sorry, there was an error generating your story. Please try again.');
        navigateTo('onboarding');
    }
}

// Build story prompt for LLM with additional characters and food
function buildStoryPrompt() {
    let prompt = `Create an illustrated children's story for a ${currentState.childData.age}-year-old ${currentState.childData.gender} named ${currentState.childData.name} who is interested in ${currentState.childData.interests}. 
    ${currentState.childData.appearance ? `The child looks like: ${currentState.childData.appearance}.` : ''}
    ${currentState.childData.food ? `The child's favorite food is ${currentState.childData.food}.` : ''}`;
    
    // Add additional characters
    if (currentState.childData.additionalCharacters.sibling.included) {
        prompt += ` Include the child's ${currentState.childData.additionalCharacters.sibling.relation} named ${currentState.childData.additionalCharacters.sibling.name} as a supporting character.`;
    }
    
    if (currentState.childData.additionalCharacters.pet.included) {
        prompt += ` Include the child's pet ${currentState.childData.additionalCharacters.pet.type} named ${currentState.childData.additionalCharacters.pet.name} in the story.`;
    }
    
    if (currentState.childData.additionalCharacters.friend.included) {
        prompt += ` Include the child's friend named ${currentState.childData.additionalCharacters.friend.name} as part of the adventure.`;
    }
    
    prompt += `
    The story should be a ${currentState.story.type} story. 
    Divide the story into 10-12 pages, with each page having text that would fit on a single page of a children's book.
    Include text with varying styles, sizes, and emphasis to make it engaging for children.
    Start with "Once upon a time..." and end with a moral lesson.`;
    
    return prompt;
}

// Call to LLM API (placeholder for future implementation)
async function callLLMApi(prompt) {
    // This would be replaced with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                story: generateMockStory()
            });
        }, 3000);
    });
}

// Parse story content from LLM response
function parseStoryContent(storyText) {
    // This function would parse the LLM response into pages
    // For now, we'll just return the mock story
    return storyText;
}

// Generate mock story for demo purposes
function generateMockStory() {
    const name = currentState.childData.name || 'Alex';
    const interests = currentState.childData.interests || 'space and dinosaurs';
    const storyType = currentState.story.type || 'adventure';
    
    let pages = [];
    
    if (storyType === 'adventure') {
        pages = [
            `<p><span class="story-text highlight-yellow">Once upon a time,</span> there was a brave child named <span class="story-text highlight-blue">${name}</span> who loved ${interests}. Every night before bed, <span class="story-text highlight-green">${name}</span> would dream of exciting adventures.</p>`,
            
            `<p>One night, as <span class="story-text highlight-pink">${name}</span> was fast asleep, a <span class="story-text highlight-yellow">magical shooting star</span> streaked across the sky and stopped right outside the bedroom window. It sparkled with all the colors of the rainbow.</p>`,
            
            `<p>The star spoke in a gentle voice, <span class="story-text highlight-green">"Hello, ${name}! I've heard that you love ${interests}. Would you like to join me on an adventure through the cosmos?"</span></p>`,
            
            `<p><span class="story-text highlight-blue">${name}</span> couldn't believe it! <span class="story-text highlight-pink">"Yes, yes, yes!"</span> ${name} exclaimed, quickly putting on slippers. The star created a bridge of light connecting to the windowsill.</p>`,
            
            `<p>As <span class="story-text highlight-blue">${name}</span> stepped onto the bridge, it felt solid yet bouncy, like walking on a cloud. They zoomed up into the night sky, leaving the neighborhood behind.</p>`,
            
            `<p>Their first stop was the <span class="story-text highlight-yellow">Moon</span>, where they met a family of friendly Moon Bunnies who were making moon cakes. <span class="story-text highlight-green">"Would you like to learn how to make moon cakes?"</span> they asked.</p>`,
            
            `<p><span class="story-text highlight-blue">${name}</span> spent time with the Moon Bunnies, learning their special recipe. <span class="story-text highlight-pink">"The secret ingredient,"</span> they whispered, <span class="story-text highlight-green">"is believing in yourself."</span></p>`,
            
            `<p>Next, they visited <span class="story-text highlight-yellow">Mars</span>, where dinosaurs still roamed! The Martian dinosaurs were friendly and smaller than Earth dinosaurs. A baby Triceratops named <span class="story-text highlight-pink">Topsy</span> became ${name}'s friend.</p>`,
            
            `<p><span class="story-text highlight-pink">Topsy</span> showed <span class="story-text highlight-blue">${name}</span> a cave filled with glowing crystals that told stories of ancient times. <span class="story-text highlight-green">"These crystals hold the wisdom of the universe,"</span> Topsy explained.</p>`,
            
            `<p>As the night was ending, the star brought <span class="story-text highlight-blue">${name}</span> back home. <span class="story-text highlight-green">"Remember,"</span> the star said, <span class="story-text highlight-green">"adventures are all around you, even in small everyday things."</span></p>`,
            
            `<p><span class="story-text highlight-blue">${name}</span> woke up the next morning, wondering if it was all a dream. But there on the bedside table was a tiny glowing crystal and a moon cake.</p>`,
            
            `<p>From that day on, <span class="story-text highlight-blue">${name}</span> looked at the world differently, finding adventure and magic in everyday life. And every night, <span class="story-text highlight-blue">${name}</span> would wave to the stars, ready for the next dream adventure.</p>`
        ];
    } else if (storyType === 'educational') {
        pages = [
            `<p><span class="story-text highlight-yellow">Once upon a time,</span> there was a curious child named <span class="story-text highlight-blue">${name}</span> who loved learning about ${interests}. Every day was a new opportunity to discover something amazing.</p>`,
            
            `<p>One day, <span class="story-text highlight-blue">${name}</span> found a <span class="story-text highlight-yellow">special book</span> in the library. It was glowing slightly, and when <span class="story-text highlight-blue">${name}</span> opened it, the pages seemed to come alive!</p>`,
            
            `<p><span class="story-text highlight-green">"Hello there!"</span> said a friendly voice from the book. <span class="story-text highlight-green">"I'm Professor Pagely, and I can teach you all about ${interests}. Would you like to learn with me?"</span></p>`,
            
            `<p><span class="story-text highlight-pink">"Yes, please!"</span> said <span class="story-text highlight-blue">${name}</span> excitedly. Suddenly, the book began to grow larger and larger until it was as big as a door. Professor Pagely gestured for <span class="story-text highlight-blue">${name}</span> to step inside.</p>`,
            
            `<p>Inside the book was a <span class="story-text highlight-yellow">magical classroom</span> with windows looking out to different times and places. <span class="story-text highlight-green">"Today,"</span> said Professor Pagely, <span class="story-text highlight-green">"we'll learn through adventure!"</span></p>`,
            
            `<p>Their first lesson was about space. <span class="story-text highlight-pink">Did you know that stars are huge balls of gas that produce their own light and heat? The Sun is our closest star and it's 93 million miles away!</span></p>`,
            
            `<p>Next, they learned about dinosaurs. <span class="story-text highlight-pink">Tyrannosaurus Rex had teeth as big as bananas! Triceratops had three horns and a giant frill to protect itself. Dinosaurs lived on Earth for 165 million years!</span></p>`,
            
            `<p>For their third lesson, they explored oceans. <span class="story-text highlight-pink">The deepest part of the ocean is called the Mariana Trench, and it's almost 7 miles deep! More people have been to the moon than have visited the deepest part of the ocean.</span></p>`,
            
            `<p><span class="story-text highlight-green">"Knowledge is like a treasure,"</span> Professor Pagely explained. <span class="story-text highlight-green">"The more you discover, the richer your world becomes. And the wonderful thing is, there's always more to learn!"</span></p>`,
            
            `<p>As their adventure came to an end, Professor Pagely gave <span class="story-text highlight-blue">${name}</span> a special bookmark. <span class="story-text highlight-green">"Place this in any book,"</span> he said, <span class="story-text highlight-green">"and you'll be able to learn in this special way again."</span></p>`,
            
            `<p><span class="story-text highlight-blue">${name}</span> returned home, filled with excitement about all the new things learned. From that day on, <span class="story-text highlight-blue">${name}</span> saw books not just as pages with words, but doorways to adventure.</p>`,
            
            `<p>And the most important lesson <span class="story-text highlight-blue">${name}</span> learned was that curiosity and a love of learning make every day an adventure. With books and imagination, you can go anywhere and be anything you dream of.</p>`
        ];
    } else {
        pages = [
            `<p><span class="story-text highlight-yellow">Once upon a time,</span> there was a kind-hearted child named <span class="story-text highlight-blue">${name}</span> who loved ${interests}. <span class="story-text highlight-blue">${name}</span> lived in a cozy house with a beautiful garden filled with colorful flowers.</p>`,
            
            `<p>Every morning, <span class="story-text highlight-blue">${name}</span> would wake up early to help water the garden and feed the birds that visited. The birds loved <span class="story-text highlight-blue">${name}</span> and would sing happy songs whenever <span class="story-text highlight-blue">${name}</span> was around.</p>`,
            
            `<p>One rainy day, <span class="story-text highlight-blue">${name}</span> found a <span class="story-text highlight-yellow">tiny kitten</span> huddled under a bush in the garden. The poor kitten was wet, cold, and scared. Its fur was matted, and it looked very hungry.</p>`,
            
            `<p><span class="story-text highlight-green">"Don't worry, little one,"</span> <span class="story-text highlight-blue">${name}</span> said gently. <span class="story-text highlight-green">"I'll take care of you."</span> <span class="story-text highlight-blue">${name}</span> carefully picked up the kitten and brought it inside the warm house.</p>`,
            
            `<p><span class="story-text highlight-blue">${name}</span> dried the kitten with a soft towel, gave it some warm milk, and made a cozy bed from a basket and a blanket. The kitten purred happily, feeling safe for the first time in days.</p>`,
            
            `<p><span class="story-text highlight-green">"I'll call you Raindrop,"</span> <span class="story-text highlight-blue">${name}</span> decided, stroking the kitten's soft fur. Raindrop looked up at <span class="story-text highlight-blue">${name}</span> with big, grateful eyes and snuggled closer.</p>`,
            
            `<p>As days passed, <span class="story-text highlight-blue">${name}</span> took wonderful care of Raindrop. They would play together in the garden when it was sunny, and cuddle together when it rained.</p>`,
            
            `<p>Word spread about <span class="story-text highlight-blue">${name}</span>'s kindness to animals. Soon, neighbors started bringing injured birds and lost pets to <span class="story-text highlight-blue">${name}</span> for help, knowing they would be cared for with love.</p>`,
            
            `<p>With the help of parents and neighbors, <span class="story-text highlight-blue">${name}</span> created a small animal sanctuary in the backyard. There were comfortable shelters for strays and bird feeders for feathered friends.</p>`,
            
            `<p>The garden became a <span class="story-text highlight-yellow">magical place</span> where all creatures felt welcome and safe. Even shy animals like rabbits and squirrels would visit to play with <span class="story-text highlight-blue">${name}</span> and Raindrop.</p>`,
            
            `<p><span class="story-text highlight-green">"You have the gentlest heart,"</span> <span class="story-text highlight-blue">${name}</span>'s mother said proudly. <span class="story-text highlight-green">"Your kindness has created a haven for so many creatures who needed help."</span></p>`,
            
            `<p><span class="story-text highlight-blue">${name}</span> learned that one small act of kindness can grow into something wonderful. By helping one little kitten on a rainy day, <span class="story-text highlight-blue">${name}</span> had started a ripple of compassion that touched many lives, both animal and human.</p>`
        ];
    }
    
    return pages;
}

// Prepare preview page
function preparePreview() {
    document.getElementById('storyTitle').innerHTML = `<i class="fa-solid fa-book-open"></i> ${currentState.story.title}`;
    updateStoryPage();
}

// Update current story page in preview
function updateStoryPage() {
    const pageContent = document.getElementById('pageContent');
    const pageIndicator = document.getElementById('pageIndicator');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    
    // Update page content
    const currentPage = currentState.story.currentPage;
    const totalPages = currentState.story.content.length;
    
    pageContent.innerHTML = currentState.story.content[currentPage];
    pageIndicator.textContent = `Page ${currentPage + 1} of ${totalPages}`;
    
    // Update button states
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === totalPages - 1;
}

// Prepare checkout page
function prepareCheckout() {
    // Set the default pricing option
    document.getElementById('orderTitle').textContent = `Digital Book: ${currentState.order.bookTitle}`;
    document.getElementById('orderPrice').textContent = `$${currentState.order.price.toFixed(2)}`;
    document.getElementById('orderShipping').textContent = `$${currentState.order.shipping.toFixed(2)}`;
    
    // Clear any previous merchandise selections
    currentState.order.merchandise = [];
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.value = 0;
    });
    
    const total = currentState.order.price + currentState.order.shipping;
    document.getElementById('orderTotal').textContent = `$${total.toFixed(2)}`;
    
    // Reset tabs to pricing tab
    if (document.querySelectorAll('.tab')) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        document.querySelector('.tab[data-tab="pricing"]').classList.add('active');
        document.getElementById('pricing-tab').classList.add('active');
    }
    
    // Clear merchandise items display
    const merchandiseItems = document.getElementById('merchandiseItems');
    if (merchandiseItems) {
        merchandiseItems.innerHTML = '';
    }
}

// Process payment
function processPayment() {
    // In a real app, this would call a payment API
    setTimeout(() => {
        // Add the book to the library
        addBookToLibrary();
        
        // Update order confirmation
        document.getElementById('confirmationName').textContent = currentState.childData.name;
        document.getElementById('confirmationTitle').textContent = currentState.order.bookTitle;
        document.getElementById('confirmationFormat').textContent = currentState.order.format;
        
        // Display merchandise items
        const confirmationMerchandise = document.getElementById('confirmationMerchandise');
        if (confirmationMerchandise) {
            confirmationMerchandise.innerHTML = '';
            
            if (currentState.order.merchandise.length > 0) {
                currentState.order.merchandise.forEach(item => {
                    const merchItem = document.createElement('div');
                    merchItem.className = 'order-item';
                    
                    const itemName = item.item.charAt(0).toUpperCase() + item.item.slice(1);
                    merchItem.textContent = `${itemName} (${item.quantity}) - $${item.price.toFixed(2)}`;
                    
                    confirmationMerchandise.appendChild(merchItem);
                });
            } else {
                confirmationMerchandise.innerHTML = '<p><em>No merchandise items selected</em></p>';
            }
        }
        
        const total = currentState.order.price + currentState.order.shipping + 
            currentState.order.merchandise.reduce((sum, item) => sum + item.price, 0);
        document.getElementById('confirmationTotal').textContent = `$${total.toFixed(2)}`;
        
        // Navigate to confirmation page
        navigateTo('confirmation');
    }, 1500);
}

// Add book to library
function addBookToLibrary() {
    const newBook = {
        title: currentState.story.title,
        type: currentState.story.type,
        childName: currentState.childData.name,
        date: new Date(),
        format: currentState.order.format,
        content: currentState.story.content
    };
    
    currentState.library.push(newBook);
    
    // In a real app, this would update the library UI
    console.log('Book added to library:', newBook);
}

// Reset story state
function resetStoryState() {
    currentState.story = {
        title: '',
        type: '',
        content: [],
        currentPage: 0
    };
    
    // Reset order to default values
    currentState.order = {
        bookTitle: '',
        format: 'digital',
        price: 14.99,
        shipping: 0.00,
        merchandise: []
    };
    
    // Reset additional characters
    currentState.childData.additionalCharacters = {
        sibling: { included: false, name: '', relation: '' },
        pet: { included: false, name: '', type: '' },
        friend: { included: false, name: '' }
    };
}

// Start the app when document is ready
document.addEventListener('DOMContentLoaded', initApp); 