import config from './config.js';

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

            imageArea.innerHTML = '';
            images.forEach((result, index) => {
                if (result) {
                    const container = document.createElement('div');
                    container.className = 'image-container';

                    const img = document.createElement('img');
                    img.src = result.url;
                    img.alt = `${prompt} - Image ${index + 1}`;
                    container.appendChild(img);

                    const controls = document.createElement('div');
                    controls.className = 'image-controls';
                    controls.innerHTML = `
                        <button class="control-button download-btn">Download</button>
                        <button class="control-button share-btn">Share</button>
                    `;
                    container.appendChild(controls);

                    controls.querySelector('.download-btn').addEventListener('click', () => {
                        const link = document.createElement('a');
                        link.href = result.url;
                        link.download = `generated-image-${index + 1}.png`;
                        link.click();
                    });

                    controls.querySelector('.share-btn').addEventListener('click', async () => {
                        try {
                            await navigator.share({
                                title: 'Generated Image',
                                text: prompt,
                                url: result.url
                            });
                        } catch (err) {
                            console.log('Share failed:', err);
                        }
                    });

                    imageArea.appendChild(container);
                }
            });
        } else {
            alert("Please enter a prompt and a valid number of images.");
        }
    });
});