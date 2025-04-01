import config from './config.js';
import { ImageEditor } from './imageEditor.js';

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('numImages');
    const numberDisplay = document.getElementById('numberDisplay');
    const promptInput = document.getElementById('prompt');
    const generateButton = document.getElementById('generate');
    const imageArea = document.getElementById('imageArea');
    let recognition; // Define recognition outside the scope of the if block
    let micButton;

    // Initialize the number display with the slider's initial value
    numberDisplay.value = slider.value;

    // Update the number display when the slider changes
    slider.addEventListener('input', () => {
        numberDisplay.value = slider.value;
    });

    // Check if the SpeechRecognition API is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        micButton = document.createElement('button');
        micButton.textContent = 'Start Voice Input';
        micButton.id = 'micButton';
        document.querySelector('.input-area').appendChild(micButton);

        micButton.addEventListener('click', () => {
            recognition.start();
            micButton.textContent = 'Listening...';
            micButton.classList.add('listening'); // Add class to change the button style
        });

        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;
            promptInput.value = speechResult;
            micButton.textContent = 'Start Voice Input';
            micButton.classList.remove('listening'); // Remove the listening class
        };

        recognition.onspeechend = () => {
            recognition.stop();
            micButton.textContent = 'Start Voice Input';
            micButton.classList.remove('listening'); // Remove the listening class
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            micButton.textContent = 'Start Voice Input';
            micButton.classList.remove('listening'); // Remove the listening class
        };
    } else {
        // Speech Recognition API not supported
        const notSupportedMessage = document.createElement('p');
        notSupportedMessage.textContent = 'Voice input is not supported in your browser.';
        document.querySelector('.input-area').appendChild(notSupportedMessage);
    }

    // Add aspect ratio selector
    const aspectRatioSelector = document.createElement('select');
    aspectRatioSelector.className = 'aspect-ratio-selector';
    aspectRatioSelector.innerHTML = `
        <option value="1:1">Square (1:1)</option>
        <option value="16:9">Landscape (16:9)</option>
        <option value="9:16">Portrait (9:16)</option>
        <option value="4:3">Standard (4:3)</option>
    `;
    document.querySelector('.input-area').insertBefore(aspectRatioSelector, generateButton);

    // Add prompt suggestions
    const promptContainer = document.createElement('div');
    promptContainer.className = 'prompt-container';
    promptInput.parentNode.insertBefore(promptContainer, promptInput);
    promptContainer.appendChild(promptInput);

    const suggestionBox = document.createElement('div');
    suggestionBox.className = 'suggestion-box';
    suggestionBox.style.display = 'none';
    promptContainer.appendChild(suggestionBox);

    const suggestions = [
        "A serene landscape with mountains",
        "Abstract digital art with vibrant colors",
        "Cute cartoon animals in a garden",
        "Futuristic cityscape at night",
        "Watercolor painting of flowers"
    ];

    promptInput.addEventListener('input', () => {
        const value = promptInput.value.toLowerCase();
        if (value.length > 0) {
            const matches = suggestions.filter(s => s.toLowerCase().includes(value));
            if (matches.length > 0) {
                suggestionBox.style.display = 'block';
                suggestionBox.innerHTML = matches
                    .map(s => `<div class="suggestion">${s}</div>`)
                    .join('');
            } else {
                suggestionBox.style.display = 'none';
            }
        } else {
            suggestionBox.style.display = 'none';
        }
    });

    suggestionBox.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion')) {
            promptInput.value = e.target.textContent;
            suggestionBox.style.display = 'none';
        }
    });

    // Modify the prompt controls section
    const promptControls = document.createElement('div');
    promptControls.className = 'prompt-controls';
    promptControls.innerHTML = `
        <button id="randomPrompt" class="control-button">🎲 Random Prompt</button>
        <button id="enhancePrompt" class="control-button">✨ Enhance Prompt</button>
        <div class="word-count-control">
            <label>Word Count:</label>
            <input type="number" id="wordCount" min="5" max="100" value="20" step="5">
        </div>
    `;
    document.querySelector('.prompt-container').insertBefore(promptControls, promptInput);

    // Add a container for the enhanced prompt
    const enhancedPromptContainer = document.createElement('div');
    enhancedPromptContainer.className = 'enhanced-prompt';
    enhancedPromptContainer.style.display = 'none';
    document.querySelector('.prompt-container').insertBefore(enhancedPromptContainer, promptInput);

    // Random prompt categories and templates
    const promptTemplates = {
        landscape: [
            "A serene {time} landscape with {feature} and {weather}",
            "A mystical {feature} surrounded by {element} under {weather}",
            "An ancient {feature} with {element} in the {time}"
        ],
        character: [
            "A {profession} wearing {clothing} in a {setting}",
            "A {species} character with {feature} in {style} style",
            "A {adjective} {creature} exploring a {setting}"
        ],
        abstract: [
            "An abstract composition of {element} and {element} in {style} style",
            "A {style} interpretation of {concept} using {element}",
            "A {adjective} {style} pattern inspired by {concept}"
        ]
    };

    const promptElements = {
        time: ['sunset', 'dawn', 'twilight', 'midnight', 'golden hour'],
        feature: ['mountains', 'waterfalls', 'forests', 'crystal caves', 'ancient ruins'],
        weather: ['stormy skies', 'misty atmosphere', 'clear starry night', 'rainbow', 'northern lights'],
        element: ['floating crystals', 'glowing orbs', 'sacred flames', 'magical waters', 'ethereal light'],
        profession: ['wizard', 'cyber ninja', 'space explorer', 'steampunk inventor', 'magical artist'],
        species: ['dragon', 'phoenix', 'mermaid', 'unicorn', 'griffin'],
        clothing: ['flowing robes', 'crystal armor', 'magical garments', 'tech-enhanced suit', 'nature-woven clothes'],
        setting: ['crystal palace', 'floating islands', 'underwater city', 'cosmic library', 'enchanted forest'],
        style: ['watercolor', 'digital art', 'oil painting', 'neon', 'cyberpunk'],
        adjective: ['magical', 'ethereal', 'mysterious', 'cosmic', 'enchanted'],
        creature: ['spirit animal', 'mythical beast', 'celestial being', 'nature elemental', 'cosmic entity'],
        concept: ['dreams', 'time', 'nature', 'infinity', 'harmony']
    };

    // Random prompt generator
    document.getElementById('randomPrompt').addEventListener('click', () => {
        const categories = Object.keys(promptTemplates);
        const category = categories[Math.floor(Math.random() * categories.length)];
        const template = promptTemplates[category][Math.floor(Math.random() * promptTemplates[category].length)];
        
        const generatedPrompt = template.replace(/\{(\w+)\}/g, (match, element) => {
            const options = promptElements[element];
            return options[Math.floor(Math.random() * options.length)];
        });
        
        promptInput.value = generatedPrompt;
    });

    // Modified prompt enhancer
    document.getElementById('enhancePrompt').addEventListener('click', async () => {
        const originalPrompt = promptInput.value;
        if (!originalPrompt) {
            alert("Please enter a prompt first!");
            return;
        }

        const wordCount = document.getElementById('wordCount').value;
        const enhanceButton = document.getElementById('enhancePrompt');
        
        try {
            enhanceButton.textContent = '🔄 Enhancing...';
            enhanceButton.disabled = true;
            
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a prompt enhancement expert. Take the given prompt and enhance it with vivid details, artistic style suggestions, and composition elements. Target approximately ${wordCount} words. Maintain the original concept but make it more detailed and artistic.`
                    },
                    {
                        role: "user",
                        content: originalPrompt
                    }
                ]
            });

            enhancedPromptContainer.style.display = 'block';
            enhancedPromptContainer.textContent = completion.content;
            promptInput.value = completion.content;
        } catch (error) {
            console.error('Error enhancing prompt:', error);
            alert('Failed to enhance prompt. Please try again.');
        } finally {
            enhanceButton.textContent = '✨ Enhance Prompt';
            enhanceButton.disabled = false;
        }
    });

    // Add input validation for word count
    document.getElementById('wordCount').addEventListener('input', (e) => {
        let value = parseInt(e.target.value);
        if (value < 5) e.target.value = 5;
        if (value > 100) e.target.value = 100;
    });

    // Enhanced image generation
    generateButton.addEventListener('click', async () => {
        const prompt = promptInput.value;
        const numImages = parseInt(document.getElementById('numImages').value);
        const aspectRatio = aspectRatioSelector.value;

        if (prompt && numImages > 0) {
            imageArea.innerHTML = '<div class="loading-spinner"></div>';

            const images = await Promise.all(
                Array(numImages).fill().map(async () => {
                    try {
                        return await websim.imageGen({
                            prompt: prompt,
                            aspect_ratio: aspectRatio
                        });
                    } catch (error) {
                        console.error("Error generating image:", error);
                        return null;
                    }
                })
            );

            imageArea.innerHTML = `
                <div class="images-grid"></div>
                <div class="download-controls">
                    <button class="select-all-btn">Select All</button>
                    <button class="download-selected-btn" disabled>Download Selected (0)</button>
                    <button class="edit-selected-btn" disabled>Edit Selected Image</button>
                </div>
                <div class="edit-interface" style="display: none">
                </div>
            `;

            const imagesGrid = imageArea.querySelector('.images-grid');
            images.forEach((result, index) => {
                if (result) {
                    const container = document.createElement('div');
                    container.className = 'image-container';
                    container.innerHTML = `
                        <div class="image-select">
                            <input type="checkbox" id="select-${index}" class="image-checkbox">
                        </div>
                        <img src="${result.url}" alt="${prompt} - Image ${index + 1}">
                    `;
                    imagesGrid.appendChild(container);
                }
            });

            // Enhanced selection handling
            const selectAllBtn = imageArea.querySelector('.select-all-btn');
            const downloadSelectedBtn = imageArea.querySelector('.download-selected-btn');
            const editSelectedBtn = imageArea.querySelector('.edit-selected-btn');
            const checkboxes = imageArea.querySelectorAll('.image-checkbox');
            const editInterface = imageArea.querySelector('.edit-interface');

            function updateButtons() {
                const selectedCount = [...checkboxes].filter(cb => cb.checked).length;
                downloadSelectedBtn.textContent = `Download Selected (${selectedCount})`;
                downloadSelectedBtn.disabled = selectedCount === 0;
                editSelectedBtn.disabled = selectedCount !== 1; // Enable edit only when exactly one image is selected
            }

            selectAllBtn.addEventListener('click', () => {
                const isAllSelected = [...checkboxes].every(cb => cb.checked);
                checkboxes.forEach(cb => cb.checked = !isAllSelected);
                updateButtons();
            });

            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', updateButtons);
            });

            editSelectedBtn.addEventListener('click', () => {
                const selectedImageIndex = [...checkboxes].findIndex(cb => cb.checked);
                if (selectedImageIndex === -1) return;

                const selectedImage = images[selectedImageIndex];
                editInterface.style.display = 'block';
                editInterface.innerHTML = ''; // Clear any existing content
                
                const imageEditor = new ImageEditor();
                imageEditor.initializeEditor(selectedImage.url, editInterface);
            });

            // Close editor button
            const closeEditBtn = document.createElement('button');
            closeEditBtn.textContent = 'Close Editor';
            closeEditBtn.className = 'close-edit';
            editInterface.appendChild(closeEditBtn);
            closeEditBtn.addEventListener('click', () => {
                editInterface.style.display = 'none';
            });

            // Modified download handling
            downloadSelectedBtn.addEventListener('click', () => {
                const selectedImages = [...checkboxes].map((cb, index) => {
                    if (cb.checked) {
                        return {
                            url: images[index].url,
                            index: index + 1
                        };
                    }
                    return null;
                }).filter(img => img !== null);

                // Create a container for download links
                const downloadLinksContainer = document.createElement('div');
                downloadLinksContainer.className = 'download-links-container';
                downloadLinksContainer.innerHTML = `
                    <div class="download-header">
                        <h3>Download Selected Images</h3>
                        <button class="close-download">×</button>
                    </div>
                    <div class="links-list"></div>
                `;

                const linksList = downloadLinksContainer.querySelector('.links-list');
                selectedImages.forEach(img => {
                    const linkItem = document.createElement('div');
                    linkItem.className = 'download-link-item';
                    linkItem.innerHTML = `
                        <span>Image ${img.index}</span>
                        <a href="${img.url}" download="generated-image-${img.index}.png" class="download-link">
                            Download
                        </a>
                    `;
                    linksList.appendChild(linkItem);
                });

                // Add batch download button
                const batchDownload = document.createElement('button');
                batchDownload.className = 'batch-download-btn';
                batchDownload.textContent = 'Download All Selected';
                batchDownload.onclick = () => {
                    selectedImages.forEach(img => {
                        const link = document.createElement('a');
                        link.href = img.url;
                        link.download = `generated-image-${img.index}.png`;
                        link.click();
                    });
                };
                downloadLinksContainer.appendChild(batchDownload);

                // Add close button functionality
                downloadLinksContainer.querySelector('.close-download').onclick = () => {
                    downloadLinksContainer.remove();
                };

                // Add the container to the page
                imageArea.appendChild(downloadLinksContainer);
            });
        } else {
            alert("Please enter a prompt and a valid number of images.");
        }
    });
});