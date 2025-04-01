// New file to handle image editing functionality
export class ImageEditor {
    constructor() {
        this.conversationHistory = [];
        this.currentImage = null;
    }

    async initializeEditor(imageUrl, editInterface) {
        this.currentImage = imageUrl;
        this.editInterface = editInterface;

        // Create the interface structure
        editInterface.innerHTML = `
            <div class="chat-interface">
                <div class="chat-messages"></div>
                <div class="chat-input-area">
                    <input type="text" class="edit-instruction" placeholder="Describe how you'd like to edit the image...">
                    <button class="send-edit">Send</button>
                </div>
            </div>
            <div class="edit-preview">
                <img src="${imageUrl}" alt="Current image">
            </div>
        `;

        // Now we can safely get these elements
        this.chatMessages = editInterface.querySelector('.chat-messages');
        this.editInstruction = editInterface.querySelector('.edit-instruction');
        this.sendEditBtn = editInterface.querySelector('.send-edit');
        this.editPreview = editInterface.querySelector('.edit-preview');

        // Initialize chat with system message
        this.chatMessages.innerHTML = `
            <div class="chat-message system">
                I can help you edit this image. Describe what changes you'd like to make.
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.sendEditBtn.addEventListener('click', () => this.handleEdit());
        this.editInstruction.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleEdit();
        });
    }

    async handleEdit() {
        const instruction = this.editInstruction.value;
        if (!instruction) return;

        // Add user message to chat
        this.addMessage('user', instruction);
        this.showLoading();

        try {
            // First, get specific edit instructions from AI
            const editPlan = await this.getEditPlan(instruction);
            
            // Generate new image based on original and edit instructions
            const editedImage = await websim.imageGen({
                prompt: editPlan.prompt,
                negative_prompt: editPlan.negative_prompt,
                seed: editPlan.seed || Math.floor(Math.random() * 1000000),
            });

            // Update preview with new image
            this.editPreview.innerHTML = `
                <div class="image-comparison">
                    <img src="${this.currentImage}" alt="Original" class="original-image">
                    <img src="${editedImage.url}" alt="Edited" class="edited-image">
                </div>
                <div class="edit-actions">
                    <button class="accept-edit">Accept Edit</button>
                    <button class="reject-edit">Try Again</button>
                </div>
            `;

            // Setup accept/reject handlers
            this.editPreview.querySelector('.accept-edit').addEventListener('click', () => {
                this.currentImage = editedImage.url;
                this.addMessage('system', 'Edit accepted! You can make additional edits if needed.');
            });

            this.editPreview.querySelector('.reject-edit').addEventListener('click', () => {
                this.editPreview.innerHTML = `<img src="${this.currentImage}" alt="Current image">`;
                this.addMessage('system', 'Edit rejected. Please try a different edit instruction.');
            });

        } catch (error) {
            console.error('Error processing edit:', error);
            this.addMessage('error', 'Error processing edit. Please try again.');
        }

        this.removeLoading();
        this.editInstruction.value = '';
    }

    async getEditPlan(instruction) {
        const completion = await websim.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an image editing expert. Create a detailed image generation prompt that will modify the current image according to the user's request while maintaining its core elements. Respond in JSON format with:
                    {
                        "prompt": "detailed prompt that describes the desired image",
                        "negative_prompt": "elements to avoid",
                        "seed": optional number for consistency
                    }`
                },
                {
                    role: "user",
                    content: `Current image context: ${this.currentImage}\nEdit request: ${instruction}`
                }
            ],
            json: true
        });

        return JSON.parse(completion.content);
    }

    addMessage(type, content) {
        this.chatMessages.innerHTML += `
            <div class="chat-message ${type}">${content}</div>
        `;
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showLoading() {
        this.chatMessages.innerHTML += `
            <div class="chat-message system loading">Processing your edit...</div>
        `;
    }

    removeLoading() {
        const loadingMsg = this.chatMessages.querySelector('.loading');
        if (loadingMsg) loadingMsg.remove();
    }
}