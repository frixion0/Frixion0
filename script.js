document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('start-btn');
    const mainMenu = document.getElementById('main-menu');
    const appContainer = document.getElementById('app-container');
    const generateBtn = document.getElementById('generate-btn');
    const mobName = document.getElementById('mob-name');
    const mobHealth = document.getElementById('mob-health');
    const mobAttack = document.getElementById('mob-attack');
    const mobBiome = document.getElementById('mob-biome');
    const mobDescription = document.getElementById('mob-description');
    const mobDisplay = document.getElementById('mob-display');
    const generateSpawnEggBtn = document.createElement('button');
    generateSpawnEggBtn.id = 'generate-spawn-egg-btn';
    generateSpawnEggBtn.className = 'minecraft-button';
    generateSpawnEggBtn.textContent = 'Generate Spawn Egg';
    generateSpawnEggBtn.style.marginLeft = '10px';
    generateSpawnEggBtn.style.display = 'none';
    const moreImagesBtn = document.createElement('button');
    moreImagesBtn.id = 'more-images-btn';
    moreImagesBtn.className = 'minecraft-button';
    moreImagesBtn.textContent = 'Show In-Game';
    moreImagesBtn.style.marginLeft = '10px';
    moreImagesBtn.style.display = 'none';
    const customPromptInput = document.getElementById('custom-prompt');
    const customNameInput = document.getElementById('custom-name');
    const customHealthInput = document.getElementById('custom-health');
    const customAttackInput = document.getElementById('custom-attack');
    const customBiomeInput = document.getElementById('custom-biome');
    const mobTypeSelect = document.getElementById('mob-type');
    const downloadAllBtn = document.getElementById('download-all-btn');
    const shareMobBtn = document.getElementById('share-mob-btn');
    const createTab = document.getElementById('create-tab');
    const communityTab = document.getElementById('community-tab');
    const createSection = document.getElementById('create-section');
    const communitySection = document.getElementById('community-section');
    const sortNewestBtn = document.getElementById('sort-newest');
    const sortPopularBtn = document.getElementById('sort-popular');
    const mobPostsContainer = document.getElementById('mob-posts-container');
    const shareSuccessModal = document.getElementById('share-success-modal');
    const closeButtons = document.querySelectorAll('.close-button');

    // Create WebSocket connection for multiplayer functionality
    const room = new WebsimSocket();

    document.querySelector('.generate-section').appendChild(moreImagesBtn);
    document.querySelector('.generate-section').appendChild(generateSpawnEggBtn);

    let currentMob = null; // Store the current mob data
    let currentImageIndex = 0;
    let mobImages = [];
    let currentSort = 'newest'; // Default sort order

    // Prefixes and suffixes for mob names
    const prefixes = [
        "Ender", "Nether", "Cave", "Wither", "Blaze", "Creeping", "Shadow", "Frost", 
        "Ancient", "Corrupt", "Void", "Glowing", "Dark", "Cursed", "Warped", "Crimson", 
        "Phantom", "Ruined", "Crystal", "Forgotten", "Soul", "Primal", "Spectral", "Mystic"
    ];

    const suffixes = [
        "Creeper", "Slime", "Spider", "Zombie", "Skeleton", "Guardian", "Blaze", "Piglin",
        "Golem", "Strider", "Lurker", "Crawler", "Beast", "Elemental", "Horror", "Warden",
        "Walker", "Stalker", "Blight", "Wraith", "Ravager", "Colossus", "Fiend", "Devourer"
    ];

    // Adding friendlier prefixes and suffixes for passive mobs
    const passivePrefixes = [
        "Fluffy", "Gentle", "Sunny", "Mossy", "Friendly", "Cloudy", "Merry", "Cozy", 
        "Happy", "Forest", "Meadow", "Floral", "Golden", "Snowy", "Bright", "Peaceful",
        "Tiny", "Bubbly", "Curious", "Sweet", "Sleepy", "Dainty", "Humble", "Jolly"
    ];
    
    const passiveSuffixes = [
        "Bunny", "Sheep", "Calf", "Pup", "Kitten", "Duckling", "Fawn", "Butterfly", 
        "Hopper", "Floater", "Grazer", "Helper", "Friend", "Snuggler", "Feather", "Blossom",
        "Nibbler", "Hopper", "Chirper", "Whisker", "Fluffer", "Wanderer", "Companion", "Sprout"
    ];

    // Adding neutral mob prefixes and suffixes
    const neutralPrefixes = [
        "Wild", "Wary", "Territorial", "Watchful", "Cautious", "Defensive", "Sentinel", "Guardian",
        "Twilight", "Wandering", "Vigilant", "Balanced", "Proud", "Roaming", "Stalking", "Observant",
        "Tundra", "Mesa", "Highland", "Sentinel", "Dusk", "Dawn", "Temperate", "Adaptive"
    ];
    
    const neutralSuffixes = [
        "Wolf", "Bear", "Golem", "Protector", "Watcher", "Guardian", "Keeper", "Sentry",
        "Judge", "Defender", "Hunter", "Wanderer", "Sentinel", "Prowler", "Enforcer", "Scout",
        "Mediator", "Strider", "Outlander", "Nomad", "Tracker", "Beastling", "Patroller", "Ranger"
    ];

    // Biome types
    const biomes = [
        "Plains", "Forest", "Taiga", "Desert", "Swamp", "Mountains", "Ocean", "Nether",
        "End", "Jungle", "Badlands", "Savanna", "Mushroom Fields", "Deep Dark", "Basalt Deltas",
        "Soul Sand Valley", "Warped Forest", "Crimson Forest", "Lush Caves", "Dripstone Caves"
    ];

    // Mob behavior patterns
    const hostileBehaviors = [
        "aggressive towards players",
        "neutral until provoked",
        "attracted to light sources",
        "avoids water at all costs",
        "only spawns at night",
        "spawns in groups of 2-5",
        "explodes when killed",
        "phases through blocks",
        "teleports when damaged",
        "turns invisible when at low health",
        "drains experience points",
        "steals items from players",
        "mimics other mobs",
        "can ride other mobs",
        "inflicts random status effects"
    ];
    
    const passiveBehaviors = [
        "friendly to players",
        "runs away when approached",
        "follows players holding certain items",
        "can be tamed with specific foods",
        "travels in herds",
        "emits gentle sounds",
        "drops useful resources when sheared",
        "provides beneficial effects to nearby players",
        "helps find rare resources",
        "can be bred with specific items",
        "slowly regenerates health to nearby players",
        "plants seeds as it walks",
        "eats natural blocks",
        "illuminates dark areas"
    ];

    // Adding neutral mob behaviors
    const neutralBehaviors = [
        "neutral until provoked",
        "defends its territory when approached",
        "protects other mobs of its kind",
        "becomes aggressive at night",
        "wary of players but not immediately hostile",
        "becomes friendly when fed specific items",
        "attacks only if the player has certain items",
        "passive during the day, hostile at night",
        "remains neutral unless attacked first",
        "becomes aggressive when at low health",
        "defends nearby passive mobs",
        "attacks hostile mobs that come too close",
        "becomes aggressive during specific weather",
        "passive until a nearby mob is damaged"
    ];

    // Special abilities
    const hostileAbilities = [
        "shoots fireballs",
        "summons lightning",
        "creates temporary portals",
        "builds small structures",
        "spawns smaller versions of itself",
        "emits blinding light",
        "leaves a trail of fire",
        "can fly for short periods",
        "turns blocks into its element",
        "controls nearby creatures",
        "absorbs blocks into its body",
        "creates shockwaves when jumping",
        "splits into smaller entities when damaged",
        "reflects projectiles",
        "temporarily disables player abilities",
        "causes darkness effect in radius"
    ];
    
    const passiveAbilities = [
        "produces valuable resources over time",
        "can carry small items for the player",
        "jumps very high",
        "glides short distances",
        "digs quickly through certain blocks",
        "marks locations of nearby ores",
        "creates small light sources",
        "repels hostile mobs",
        "purifies corrupted blocks",
        "neutralizes potion effects",
        "changes color based on biome",
        "creates musical melodies when happy",
        "grows plants rapidly",
        "can swim rapidly underwater",
        "clears weather temporarily"
    ];

    // Adding neutral mob abilities
    const neutralAbilities = [
        "can be tamed after defeating it in combat",
        "alerts nearby mobs when threatened",
        "temporarily increases its strength when damaged",
        "can switch between passive and hostile states",
        "mimics environmental blocks for camouflage",
        "gains different abilities based on biome",
        "stores items for the player after being tamed",
        "has a chance to drop rare items when defeated",
        "assists the player after completing specific tasks",
        "calls other neutral mobs to its defense",
        "becomes stronger during specific moon phases",
        "can track specific items or entities",
        "adapts its attacks based on player armor",
        "creates temporary allies when threatened",
        "can navigate complex terrain efficiently"
    ];

    // Colors for pixel art generation
    const mobColors = [
        // Green tones (Creeper-like)
        ["#0A5E0A", "#0E8E0E", "#52A52F", "#83BD46"],
        // Red tones (Nether-like)
        ["#8B0000", "#A52A2A", "#CD5C5C", "#E9967A"],
        // Gray/White tones (Skeleton/Ghast-like)
        ["#A0A0A0", "#C8C8C8", "#E0E0E0", "#F5F5F5"],
        // Purple tones (Enderman/End-like)
        ["#240624", "#4A0E4A", "#741F74", "#9D399D"],
        // Brown tones (Natural/Earth)
        ["#5C4033", "#8B4513", "#A0522D", "#CD853F"],
        // Blue tones (Water/Ice)
        ["#000080", "#0000CD", "#4169E1", "#87CEEB"],
        // Yellow tones (Blaze/Desert)
        ["#8B8000", "#DAA520", "#FFFF00", "#FFFFE0"],
        // Pink/Magenta tones (Piglin/Crimson)
        ["#8B008B", "#DA70D6", "#FF00FF", "#FFB6C1"],
    ];

    async function generateRandomMob() {
        // Generate random name or use custom name if provided
        let name;
        if (customNameInput.value.trim()) {
            name = customNameInput.value.trim();
        } else {
            // Determine mob type from dropdown or random if not specified
            const mobTypeValue = mobTypeSelect.value;
            let mobType;
            
            if (mobTypeValue === 'random') {
                // Equal chances for each mob type when random is selected
                const randomVal = Math.random();
                if (randomVal < 0.33) {
                    mobType = 'passive';
                } else if (randomVal < 0.66) {
                    mobType = 'neutral';
                } else {
                    mobType = 'hostile';
                }
            } else {
                mobType = mobTypeValue;
            }
            
            if (mobType === 'passive') {
                const prefix = passivePrefixes[Math.floor(Math.random() * passivePrefixes.length)];
                const suffix = passiveSuffixes[Math.floor(Math.random() * passiveSuffixes.length)];
                name = `${prefix} ${suffix}`;
            } else if (mobType === 'neutral') {
                const prefix = neutralPrefixes[Math.floor(Math.random() * neutralPrefixes.length)];
                const suffix = neutralSuffixes[Math.floor(Math.random() * neutralSuffixes.length)];
                name = `${prefix} ${suffix}`;
            } else {
                const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
                const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
                name = `${prefix} ${suffix}`;
            }
        }
        
        // Generate random stats or use custom values if provided
        const health = customHealthInput.value.trim() ? parseInt(customHealthInput.value) : Math.floor(Math.random() * 40) + 5;
        const attack = customAttackInput.value.trim() ? parseInt(customAttackInput.value) : Math.floor(Math.random() * 15) + 1;
        
        // Choose random biome or use custom value
        const biome = customBiomeInput.value.trim() ? customBiomeInput.value.trim() : biomes[Math.floor(Math.random() * biomes.length)];
        
        // Determine mob type from dropdown or random if not specified
        const mobTypeValue = mobTypeSelect.value;
        let mobType;
        
        if (mobTypeValue === 'random') {
            // Equal chances for each mob type when random is selected
            const randomVal = Math.random();
            if (randomVal < 0.33) {
                mobType = 'passive';
            } else if (randomVal < 0.66) {
                mobType = 'neutral';
            } else {
                mobType = 'hostile';
            }
        } else {
            mobType = mobTypeValue;
        }
        
        // Generate description based on mob type
        let behavior, ability;
        
        if (mobType === 'passive') {
            behavior = passiveBehaviors[Math.floor(Math.random() * passiveBehaviors.length)];
            ability = passiveAbilities[Math.floor(Math.random() * passiveAbilities.length)];
        } else if (mobType === 'neutral') {
            behavior = neutralBehaviors[Math.floor(Math.random() * neutralBehaviors.length)];
            ability = neutralAbilities[Math.floor(Math.random() * neutralAbilities.length)];
        } else {
            behavior = hostileBehaviors[Math.floor(Math.random() * hostileBehaviors.length)];
            ability = hostileAbilities[Math.floor(Math.random() * hostileAbilities.length)];
        }
        
        const appearance = generateMobAppearance(mobType);
        const description = `The ${name} is ${appearance}. It is ${behavior}. It ${ability} and can be found lurking in the ${biome}.`;
        
        // Update UI
        mobName.textContent = name;
        mobHealth.textContent = `${health} ❤`;
        mobAttack.textContent = `${attack} 🗡`;
        mobBiome.textContent = biome;
        mobDescription.textContent = description;
        
        // Set mob type indicator
        const mobTypeIndicator = document.getElementById('mob-type-indicator');
        if (mobType === 'passive') {
            mobTypeIndicator.textContent = '😊 Passive';
            mobTypeIndicator.className = 'passive-indicator';
        } else if (mobType === 'neutral') {
            mobTypeIndicator.textContent = '😐 Neutral';
            mobTypeIndicator.className = 'neutral-indicator';
        } else {
            mobTypeIndicator.textContent = '😠 Hostile';
            mobTypeIndicator.className = 'hostile-indicator';
        }
        
        // Reset images array and index
        mobImages = [];
        currentImageIndex = 0;
        moreImagesBtn.style.display = 'none';
        generateSpawnEggBtn.style.display = 'none';
        
        // Generate seed for consistency across images
        const mobSeed = Math.floor(Math.random() * 10000);
        
        // Store current mob data
        currentMob = { 
            name, health, attack, biome, description, 
            seed: mobSeed,
            mobType: mobType,
            createdAt: new Date().toISOString()
        };
        
        // Generate AI image of the mob
        await generateAIMobImage(name, description, biome, mobType);
        
        // Show the Generate Spawn Egg button
        generateSpawnEggBtn.style.display = 'inline-block';
    }

    function generateMobAppearance(mobType) {
        const sizes = ["tiny", "small", "medium-sized", "large", "massive", "towering"];
        
        // Different body types based on mob type
        const hostileBodyTypes = ["bulky", "spiky", "skeletal", "muscular", "armored", "jagged"];
        const passiveBodyTypes = ["round", "fluffy", "slender", "plump", "cute", "fuzzy"];
        const neutralBodyTypes = ["sturdy", "balanced", "lean", "agile", "tough", "stocky"];
        
        let bodyTypes;
        if (mobType === 'passive') {
            bodyTypes = passiveBodyTypes;
        } else if (mobType === 'neutral') {
            bodyTypes = neutralBodyTypes;
        } else {
            bodyTypes = hostileBodyTypes;
        }
        
        // Different features based on mob type
        const hostileFeatures = [
            "glowing red eyes", "multiple sharp limbs", "spiky protrusions", "armored plates", 
            "exposed bones", "crystalline formations", "a segmented body", "glowing markings",
            "sharp fangs", "tentacle-like appendages", "venomous spines", "predatory appearance"
        ];
        
        const passiveFeatures = [
            "bright friendly eyes", "soft fur", "gentle limbs", "rounded edges",
            "colorful patterns", "small antennae", "floppy ears", "a bushy tail",
            "tiny horns", "a smiling face", "decorative markings", "small wings"
        ];
        
        const neutralFeatures = [
            "alert eyes", "thick hide", "defensive posture", "protective scales",
            "sturdy limbs", "territorial markings", "balanced proportions", "attentive ears",
            "medium-sized horns", "watchful expression", "camouflage patterns", "swift legs"
        ];
        
        let features;
        if (mobType === 'passive') {
            features = passiveFeatures;
        } else if (mobType === 'neutral') {
            features = neutralFeatures;
        } else {
            features = hostileFeatures;
        }
        
        // Colors tend to be brighter for passive mobs
        const hostileColors = [
            "dark green", "blood red", "deep purple", "pitch black", "ashen gray", 
            "obsidian", "murky brown", "shadowy blue", "crimson", "dark teal"
        ];
        
        const passiveColors = [
            "light green", "sky blue", "pastel pink", "sunny yellow", "bright orange",
            "soft lavender", "cream", "light cyan", "mint green", "salmon pink"
        ];
        
        const neutralColors = [
            "earthy brown", "forest green", "slate gray", "amber", "muted blue",
            "copper", "tan", "olive", "stone gray", "dusty orange"
        ];
        
        let colors;
        if (mobType === 'passive') {
            colors = passiveColors;
        } else if (mobType === 'neutral') {
            colors = neutralColors;
        } else {
            colors = hostileColors;
        }
        
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const bodyType = bodyTypes[Math.floor(Math.random() * bodyTypes.length)];
        const feature = features[Math.floor(Math.random() * features.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const feature2 = features[Math.floor(Math.random() * features.length)];
        
        return `a ${size}, ${bodyType} creature with ${feature} and a ${color} coloration that features ${feature2}`;
    }

    async function generateAIMobImage(name, description, biome, mobType) {
        // Clear previous mob display and show loading indicator
        mobDisplay.innerHTML = '<div class="loading-text">Generating mob...</div>';
        
        try {
            // Get custom prompt if provided
            const customPrompt = customPromptInput.value.trim();
            
            // Extract appearance details from the description
            const appearancePart = description.split('.')[0] + '.';
            
            // Adjust prompt based on mob type
            let mobTypeDesc;
            if (mobType === 'passive') {
                mobTypeDesc = "a friendly, peaceful passive mob";
            } else if (mobType === 'neutral') {
                mobTypeDesc = "a neutral mob that only becomes hostile when provoked";
            } else {
                mobTypeDesc = "a hostile, aggressive enemy mob";
            }
                
            // Generate more Minecraft-focused prompt with better style guidance
            let prompt = `A Minecraft style pixelated creature called "${name}" in the ${biome} biome. It is ${mobTypeDesc}. ${appearancePart} The creature should be blocky and cubic with clear pixel edges, exact Minecraft art style. The image should look like official Minecraft concept art or a screenshot from the game. Use the Minecraft color palette and cubic design philosophy.`;
            
            // Add custom prompt if provided
            if (customPrompt) {
                prompt += ` The creature is ${customPrompt}.`;
            }
            
            // Enhance prompt for different mob types to ensure consistent design characteristics
            if (mobType === 'passive') {
                prompt += ` This is a PASSIVE MOB so make it look friendly with rounded features, bright colors, bigger eyes, and a non-threatening appearance. It should resemble other Minecraft passive mobs like sheep, cows, or rabbits in design philosophy. Add cute details that make it look approachable and gentle.`;
            } else if (mobType === 'neutral') {
                prompt += ` This is a NEUTRAL MOB so make it look alert and cautious with a balanced appearance - not too threatening but not too cute either. It should resemble other Minecraft neutral mobs like wolves, endermen, or iron golems. Add features that suggest it can defend itself but isn't inherently aggressive.`;
            } else {
                prompt += ` This is a HOSTILE MOB so make it look menacing with sharp features, darker colors, and a threatening appearance. It should look dangerous like other Minecraft hostile mobs such as creepers, zombies, or skeletons.`;
            }
            
            // Use seed to maintain consistency across generations
            let seed = Math.floor(Math.random() * 1000);
            if (currentMob && currentMob.seed) {
                // Reuse the same seed if regenerating the same mob
                seed = currentMob.seed;
            }
            
            const result = await websim.imageGen({
                prompt: prompt,
                aspect_ratio: "1:1",
                seed: seed
            });
            
            // Store the seed for consistent style in future generations
            if (currentMob) {
                currentMob.seed = seed;
            }
            
            // Store the main image
            mobImages.push({
                url: result.url,
                alt: name,
                type: 'main'
            });
            
            // Clear the loading text
            mobDisplay.innerHTML = '';
            
            // Create image element
            const mobImage = document.createElement('img');
            mobImage.src = result.url;
            mobImage.alt = name;
            mobImage.style.maxWidth = '100%';
            mobImage.style.height = 'auto';
            mobImage.style.maxHeight = '100%';
            mobImage.style.objectFit = 'contain';
            
            // Add image to the display
            mobDisplay.appendChild(mobImage);
            
            // Show the More Images button
            moreImagesBtn.style.display = 'inline-block';
        } catch (error) {
            console.error("Error generating image:", error);
            mobDisplay.innerHTML = '<div>Failed to generate image</div>';
            // Fallback to pixel art
            generatePixelArtMob(mobType);
        }
    }
    
    async function generateInGameImage() {
        if (!currentMob) return;
        
        // Show loading indicator
        mobDisplay.innerHTML = '<div class="loading-text">Generating in-game view...</div>';
        
        // Get custom prompt if provided
        const customPrompt = customPromptInput.value.trim();
        
        // Define different scene types to show the mob in different Minecraft contexts
        // Different scenes based on mob type
        const hostileScenes = [
            `inside a Minecraft ${currentMob.biome} biome`,
            `fighting a player in Minecraft`,
            `attacking a village in Minecraft`,
            `inside a Minecraft cave system`,
            `during a Minecraft night scene with other hostile mobs`
        ];
        
        const passiveScenes = [
            `grazing peacefully in a Minecraft ${currentMob.biome}`,
            `being tamed by a player in Minecraft`,
            `in a fenced enclosure with other passive mobs`,
            `following a player who is holding food`,
            `in a Minecraft village with villagers nearby`
        ];
        
        const neutralScenes = [
            `patrolling its territory in a Minecraft ${currentMob.biome}`,
            `being approached cautiously by a player in Minecraft`,
            `interacting with both hostile and passive mobs`,
            `guarding a specific structure in Minecraft`,
            `showing both peaceful and aggressive states`
        ];
        
        let sceneTypes;
        if (currentMob.mobType === 'passive') {
            sceneTypes = passiveScenes;
        } else if (currentMob.mobType === 'neutral') {
            sceneTypes = neutralScenes;
        } else {
            sceneTypes = hostileScenes;
        }
        
        // Get a scene that hasn't been generated yet, or cycle through all scenes
        let sceneIndex = currentImageIndex % (sceneTypes.length + 1);
        
        // If we've gone through all scene types, return to the main image
        if (sceneIndex === 0) {
            // Display the main image again
            displayImageByIndex(0);
            return;
        }
        
        // Adjust to get the actual scene type (accounting for the main image at index 0)
        const sceneType = sceneTypes[sceneIndex - 1];
        
        // Check if we've already generated this scene
        if (mobImages.some(img => img.type === sceneType)) {
            // We already have this scene, display it
            const imgIndex = mobImages.findIndex(img => img.type === sceneType);
            displayImageByIndex(imgIndex);
        } else {
            try {
                // Get the main mob image to use as reference
                const mainMobImage = mobImages.find(img => img.type === 'main');
                
                // Define context based on mob type
                let mobContext;
                if (currentMob.mobType === 'passive') {
                    mobContext = "a friendly, passive mob that players can interact with safely";
                } else if (currentMob.mobType === 'neutral') {
                    mobContext = "a neutral mob that only becomes hostile when provoked";
                } else {
                    mobContext = "an aggressive enemy mob that attacks players";
                }
                
                // Generate new scene image with more specific Minecraft style guidance
                let prompt = `A screenshot from Minecraft showing the "${currentMob.name}" mob ${sceneType}. The mob is ${mobContext}. The mob looks exactly like this: ${currentMob.description}. Maintain the same design, color scheme, and features as the main image. The image should be rendered in authentic Minecraft style with cubic blocks, 16x16 textures, and the standard Minecraft UI elements visible. Include typical Minecraft scene elements like grass blocks, torches, and the characteristic blocky terrain.`;
                
                // Add custom prompt if provided
                if (customPrompt) {
                    prompt += ` The creature is ${customPrompt}.`;
                }
                
                // Add specific passive/neutral/hostile guidance to maintain design consistency
                if (currentMob.mobType === 'passive') {
                    prompt += ` Keep this mob looking friendly and passive with the same cute features as the main image. Ensure it has the same bright colors, rounded shape, and gentle appearance throughout all scenes.`;
                } else if (currentMob.mobType === 'neutral') {
                    prompt += ` Keep this mob looking balanced and cautious with the same alert features as the main image. Show its neutral nature - neither overly aggressive nor completely passive. Perhaps show a transition between calm and defensive states.`;
                } else {
                    prompt += ` Keep this mob looking threatening and hostile with the same menacing features as the main image. Ensure it has the same dark colors, sharp edges, and aggressive appearance throughout all scenes.`;
                }
                
                // Use the same seed family for consistent style across scenes
                const sceneSeed = currentMob.seed ? currentMob.seed + sceneIndex * 100 : Math.floor(Math.random() * 1000);
                
                const result = await websim.imageGen({
                    prompt: prompt,
                    aspect_ratio: "16:9",
                    seed: sceneSeed
                });
                
                // Store the new scene image
                mobImages.push({
                    url: result.url,
                    alt: `${currentMob.name} ${sceneType}`,
                    type: sceneType
                });
                
                // Display the new image
                displayImageByIndex(mobImages.length - 1);
            } catch (error) {
                console.error("Error generating in-game image:", error);
                mobDisplay.innerHTML = '<div>Failed to generate in-game image</div>';
                
                // Go back to the main image
                setTimeout(() => {
                    displayImageByIndex(0);
                }, 2000);
            }
        }
    }

    function displayImageByIndex(index) {
        if (index >= 0 && index < mobImages.length) {
            currentImageIndex = index;
            
            // Clear the display
            mobDisplay.innerHTML = '';
            
            // Create image element
            const mobImage = document.createElement('img');
            mobImage.src = mobImages[index].url;
            mobImage.alt = mobImages[index].alt;
            mobImage.style.maxWidth = '100%';
            mobImage.style.height = 'auto';
            mobImage.style.maxHeight = '100%';
            mobImage.style.objectFit = 'contain';
            
            // Add image to the display
            mobDisplay.appendChild(mobImage);
            
            // Add download button
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-button';
            downloadBtn.textContent = '💾 Download';
            downloadBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                downloadImage(mobImages[index].url, `${currentMob.name}-${mobImages[index].type || 'main'}.png`);
            });
            mobDisplay.appendChild(downloadBtn);
            
            // Add image navigation indicators if we have more than one image
            if (mobImages.length > 1) {
                const navIndicator = document.createElement('div');
                navIndicator.className = 'image-nav';
                navIndicator.textContent = `Scene ${index === 0 ? 'Main' : index}/${mobImages.length - 1}`;
                navIndicator.style.position = 'absolute';
                navIndicator.style.bottom = '10px';
                navIndicator.style.left = '50%';
                navIndicator.style.transform = 'translateX(-50%)';
                navIndicator.style.backgroundColor = 'rgba(0,0,0,0.7)';
                navIndicator.style.color = 'white';
                navIndicator.style.padding = '5px 10px';
                navIndicator.style.borderRadius = '3px';
                navIndicator.style.fontSize = '14px';
                
                mobDisplay.appendChild(navIndicator);
                
                // Update button text based on current image
                if (index === 0) {
                    moreImagesBtn.textContent = 'Show In-Game';
                } else if (index === mobImages.length - 1) {
                    moreImagesBtn.textContent = 'Back to Main';
                } else {
                    moreImagesBtn.textContent = 'Next Scene';
                }
            }
        }
    }

    function downloadImage(url, filename) {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => {
                console.error('Error downloading image:', error);
                alert('Failed to download image. Please try again.');
            });
    }
    
    function generatePixelArtMob(mobType) {
        // Clear previous mob display
        mobDisplay.innerHTML = '';
        
        // Create pixel mob container
        const pixelMob = document.createElement('div');
        pixelMob.className = 'pixel-mob';
        
        // Select a random color palette based on mob type
        let paletteIndex;
        if (mobType === 'passive') {
            paletteIndex = [2, 5, 6, 7][Math.floor(Math.random() * 4)]; // Brighter palettes
        } else if (mobType === 'neutral') {
            paletteIndex = [0, 4, 5, 7][Math.floor(Math.random() * 4)]; // Mixed palettes
        } else {
            paletteIndex = [0, 1, 3, 4][Math.floor(Math.random() * 4)]; // Darker palettes
        }
            
        const colorPalette = mobColors[paletteIndex];
        
        // Generate a random symmetrical pattern for the mob
        const pattern = generateMobPattern(colorPalette, mobType);
        
        // Create the pixel art
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const pixel = document.createElement('div');
                pixel.className = 'pixel';
                pixel.style.backgroundColor = pattern[y][x];
                pixelMob.appendChild(pixel);
            }
        }
        
        mobDisplay.appendChild(pixelMob);
    }

    function generateMobPattern(colors, mobType) {
        // Create an 8x8 grid for the mob
        const pattern = Array(8).fill().map(() => Array(8).fill('transparent'));
        
        // Decide on the mob body shape (0=slim, 1=medium, 2=large)
        let bodyType;
        if (mobType === 'passive') {
            bodyType = Math.floor(Math.random() * 2) + 1; // Medium to large for passive
        } else if (mobType === 'neutral') {
            bodyType = 1; // Medium for neutral
        } else {
            bodyType = Math.floor(Math.random() * 3); // Any size for hostile
        }
        
        // Fill in the body (make it symmetrical)
        for (let y = 1; y < 7; y++) {
            const width = bodyType === 0 ? 2 : bodyType === 1 ? 3 : 4;
            const startX = Math.floor((8 - width) / 2);
            
            for (let x = startX; x < startX + width; x++) {
                pattern[y][x] = colors[Math.floor(Math.random() * colors.length)];
            }
        }
        
        // 70% chance to add "head" on top for passive mobs, 50% for hostile
        if (Math.random() > (mobType === 'passive' ? 0.3 : mobType === 'neutral' ? 0.5 : 0.5)) {
            const headWidth = Math.min(bodyType + 2, 4);
            const headStartX = Math.floor((8 - headWidth) / 2);
            
            for (let x = headStartX; x < headStartX + headWidth; x++) {
                pattern[0][x] = colors[Math.floor(Math.random() * colors.length)];
            }
        }
        
        // Add some randomized spots/details
        const numDetails = Math.floor(Math.random() * 5) + 3;
        for (let i = 0; i < numDetails; i++) {
            const x = Math.floor(Math.random() * 8);
            const y = Math.floor(Math.random() * 8);
            
            if (pattern[y][x] !== 'transparent') {
                // Choose a contrasting color
                let detailColor = colors[Math.floor(Math.random() * colors.length)];
                while (detailColor === pattern[y][x]) {
                    detailColor = colors[Math.floor(Math.random() * colors.length)];
                }
                pattern[y][x] = detailColor;
                
                // Make it symmetrical
                if (x !== 3 && x !== 4) {
                    const mirrorX = 7 - x;
                    if (pattern[y][mirrorX] !== 'transparent') {
                        pattern[y][mirrorX] = detailColor;
                    }
                }
            }
        }
        
        // Add eyes - different for passive vs hostile
        if (Math.random() > 0.2) {
            const eyeY = Math.floor(Math.random() * 3) + 1;
            const eyeDistance = mobType === 'passive' ? 1 : Math.floor(Math.random() * 2) + 1;
            const eyeX1 = 3 - eyeDistance;
            const eyeX2 = 4 + eyeDistance;
            
            if (pattern[eyeY][eyeX1] !== 'transparent' && pattern[eyeY][eyeX2] !== 'transparent') {
                // White eyes for both, but passive mobs might get blue eyes
                const eyeColor = mobType === 'passive' && Math.random() > 0.7 ? "#77BBFF" : "#FFFFFF";
                pattern[eyeY][eyeX1] = eyeColor;
                pattern[eyeY][eyeX2] = eyeColor;
                
                // Add a smile for passive mobs (50% chance)
                if (mobType === 'passive' && Math.random() > 0.5) {
                    const mouthY = eyeY + 1;
                    if (mouthY < 7 && pattern[mouthY][3] !== 'transparent') {
                        pattern[mouthY][3] = "#000000";
                        if (pattern[mouthY][4] !== 'transparent') {
                            pattern[mouthY][4] = "#000000";
                        }
                    }
                }
            }
        }
        
        return pattern;
    }

    async function generateSpawnEgg() {
        if (!currentMob) return;
        
        // Check if spawn egg already exists
        const existingSpawnEgg = mobImages.find(img => img.type === 'spawn-egg');
        if (existingSpawnEgg) {
            // Display the existing spawn egg
            const eggIndex = mobImages.findIndex(img => img.type === 'spawn-egg');
            displayImageByIndex(eggIndex);
            return;
        }
        
        // Show loading indicator
        mobDisplay.innerHTML = '<div class="loading-text">Generating spawn egg...</div>';
        
        try {
            // Different color guidance based on mob type
            let colorGuidance;
            if (currentMob.mobType === 'passive') {
                colorGuidance = "light, bright colors like green, blue, or yellow for the primary color to indicate it's a passive mob";
            } else if (currentMob.mobType === 'neutral') {
                colorGuidance = "balanced, earthy colors like brown, gray, or beige for the primary color to indicate it's a neutral mob";
            } else {
                colorGuidance = "dark, intense colors like red, purple, or black for the primary color to indicate it's a hostile mob";
            }
            
            // Define the prompt for generating a Minecraft spawn egg with better guidance
            let prompt = `A Minecraft spawn egg for the "${currentMob.name}" mob. Create a spawn egg that follows the exact Minecraft design: oval-shaped with two colors and a speckled pattern. Use ${colorGuidance}. The secondary color should complement the primary. The egg should be viewed straight-on against a transparent background, pixel-perfect Minecraft art style with no shading beyond what Minecraft uses.`;
            
            // Use a modified seed from the main mob for consistency but with some variation
            const eggSeed = currentMob.seed ? currentMob.seed + 500 : Math.floor(Math.random() * 1000);
            
            const result = await websim.imageGen({
                prompt: prompt,
                aspect_ratio: "1:1",
                seed: eggSeed
            });
            
            // Store the spawn egg image
            mobImages.push({
                url: result.url,
                alt: `${currentMob.name} Spawn Egg`,
                type: 'spawn-egg'
            });
            
            // Display the new spawn egg image
            displayImageByIndex(mobImages.length - 1);
        } catch (error) {
            console.error("Error generating spawn egg:", error);
            mobDisplay.innerHTML = '<div>Failed to generate spawn egg</div>';
            
            // Go back to the main image
            setTimeout(() => {
                displayImageByIndex(0);
            }, 2000);
        }
    }

    function downloadAllImages() {
        if (!currentMob || mobImages.length === 0) {
            alert("No images available to download.");
            return;
        }

        const zip = new JSZip();
        const promises = [];

        // Add all mob images to the zip file
        mobImages.forEach((image, index) => {
            const filename = `${currentMob.name}-${image.type || `scene-${index}`}.png`;
            const promise = fetch(image.url)
                .then(response => response.blob())
                .then(blob => {
                    zip.file(filename, blob);
                });
            promises.push(promise);
        });

        // Create a text file with mob information
        const mobInfo = `Name: ${currentMob.name}
Health: ${currentMob.health} ❤
Attack: ${currentMob.attack} 🗡
Biome: ${currentMob.biome}
Description: ${currentMob.description}
Type: ${currentMob.mobType === 'passive' ? 'Passive' : currentMob.mobType === 'neutral' ? 'Neutral' : 'Hostile'}`;

        zip.file(`${currentMob.name}-info.txt`, mobInfo);

        // Generate the zip file when all images are added
        Promise.all(promises)
            .then(() => {
                return zip.generateAsync({ type: 'blob' });
            })
            .then(content => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = `${currentMob.name}-pack.zip`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => {
                console.error('Error creating zip file:', error);
                alert('Failed to download images. Please try again.');
            });
    }

    // Function to check for inappropriate content
    function containsInappropriateContent(text) {
        const inappropriateWords = [
            'inappropriate', 'offensive', 'profanity', 'vulgar', 'obscene', 
            'explicit', 'nsfw', 'adult', 'sexual', 'violent', 'hate', 'racist',
            'discriminatory', 'harassing', 'threatening', 'abusive'
        ];
        
        const lowerText = text.toLowerCase();
        return inappropriateWords.some(word => lowerText.includes(word));
    }

    // Tab switching logic
    createTab.addEventListener('click', function() {
        createTab.classList.add('active');
        communityTab.classList.remove('active');
        createSection.style.display = 'block';
        communitySection.style.display = 'none';
    });
    
    communityTab.addEventListener('click', function() {
        communityTab.classList.add('active');
        createTab.classList.remove('active');
        createSection.style.display = 'none';
        communitySection.style.display = 'block';
        loadMobPosts();
    });
    
    // Sort buttons functionality
    sortNewestBtn.addEventListener('click', function() {
        sortNewestBtn.classList.add('active');
        sortPopularBtn.classList.remove('active');
        currentSort = 'newest';
        loadMobPosts();
    });
    
    sortPopularBtn.addEventListener('click', function() {
        sortPopularBtn.classList.add('active');
        sortNewestBtn.classList.remove('active');
        currentSort = 'popular';
        loadMobPosts();
    });
    
    // Share mob functionality
    shareMobBtn.addEventListener('click', function() {
        if (!currentMob || mobImages.length === 0) {
            alert("Please generate a mob first!");
            return;
        }
        
        shareMob();
    });
    
    // Close modal buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            shareSuccessModal.style.display = 'none';
            const mobViewerModal = document.getElementById('mob-viewer-modal');
            if (mobViewerModal) {
                mobViewerModal.style.display = 'none';
            }
        });
    });
    
    // Click outside modal to close
    window.addEventListener('click', function(event) {
        if (event.target === shareSuccessModal) {
            shareSuccessModal.style.display = 'none';
        }
        const mobViewerModal = document.getElementById('mob-viewer-modal');
        if (mobViewerModal && event.target === mobViewerModal) {
            mobViewerModal.style.display = 'none';
        }
    });
    
    // Share mob function
    async function shareMob() {
        // Check for inappropriate content
        if (containsInappropriateContent(currentMob.description)) {
            alert("Your mob description contains inappropriate content. Please revise it before sharing.");
            return;
        }
        
        // Create a record in the collection
        try {
            const mainImage = mobImages[0]; // Main image
            const spawnEggImage = mobImages.find(img => img.type === 'spawn-egg');
            const inGameImages = mobImages.filter(img => img.type !== 'main' && img.type !== 'spawn-egg');
            
            await room.collection('minecraft_mob').create({
                name: currentMob.name,
                health: currentMob.health,
                attack: currentMob.attack,
                biome: currentMob.biome,
                description: currentMob.description,
                mobType: currentMob.mobType,
                mainImageUrl: mainImage.url,
                inGameImageUrls: inGameImages.map(img => img.url),
                spawnEggUrl: spawnEggImage ? spawnEggImage.url : null,
                likes: 0
            });
            
            // Show success modal
            shareSuccessModal.style.display = 'block';
            
            // Switch to community tab to show the post
            setTimeout(() => {
                communityTab.click();
            }, 1500);
            
        } catch (error) {
            console.error("Error sharing mob:", error);
            alert("Failed to share mob. Please try again.");
        }
    }
    
    // Load mob posts
    async function loadMobPosts() {
        mobPostsContainer.innerHTML = '<div class="loading-message">Loading community mobs...</div>';
        
        try {
            let posts;
            
            if (currentSort === 'newest') {
                // Get posts sorted by creation time (newest first)
                posts = room.collection('minecraft_mob').getList();
            } else {
                // Get posts sorted by likes (most liked first)
                posts = room.collection('minecraft_mob').getList().sort((a, b) => b.likes - a.likes);
            }
            
            // Clear the container
            mobPostsContainer.innerHTML = '';
            
            if (posts.length === 0) {
                mobPostsContainer.innerHTML = '<div class="loading-message">No mobs have been shared yet. Be the first!</div>';
                return;
            }
            
            // Render each post
            posts.forEach(post => renderMobPost(post));
            
        } catch (error) {
            console.error("Error loading posts:", error);
            mobPostsContainer.innerHTML = '<div class="loading-message">Failed to load mobs. Please try again.</div>';
        }
    }
    
    // Render a single mob post
    function renderMobPost(post) {
        const postElement = document.createElement('div');
        postElement.className = 'mob-post';
        postElement.dataset.id = post.id;
        
        const postDate = new Date(post.created_at);
        const formattedDate = postDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric'
        });
        
        // Check if current user is Red_bot to show delete button
        const isRedBot = room.party.client.username === 'Red_bot';
        const deleteButtonHtml = isRedBot ? 
            `<button class="delete-button" data-id="${post.id}" style="font-family: 'Minecraft', sans-serif; background-color: #C43636; margin-left: 10px;">🗑️ Delete</button>` : '';
            
        // Add mob type indicator
        let mobTypeIndicator;
        if (post.mobType === 'passive') {
            mobTypeIndicator = '<span class="passive-indicator">😊 Passive</span>';
        } else if (post.mobType === 'neutral') {
            mobTypeIndicator = '<span class="neutral-indicator">😐 Neutral</span>';
        } else {
            mobTypeIndicator = '<span class="hostile-indicator">😠 Hostile</span>';
        }
        
        postElement.innerHTML = `
            <div class="post-header">
                <div class="post-author">${post.username}</div>
                <div class="post-timestamp">${formattedDate}</div>
            </div>
            <div class="post-content">
                <div class="post-img-container">
                    <img src="${post.mainImageUrl}" alt="${post.name}" class="post-img">
                </div>
                
                <div class="post-info">
                    <div class="post-title">${post.name} ${mobTypeIndicator}</div>
                    <div class="post-stats">
                        <div class="post-stat">Health: ${post.health} ❤</div>
                        <div class="post-stat">Attack: ${post.attack} 🗡</div>
                        <div class="post-stat">Biome: ${post.biome}</div>
                    </div>
                    <div class="post-description">${post.description}</div>
                </div>
            </div>
            <div class="post-actions">
                <button class="like-button ${hasUserLiked(post) ? 'liked' : ''}" data-id="${post.id}">
                    ${hasUserLiked(post) ? '❤️' : '🤍'} ${post.likes || 0} Likes
                </button>
                <div>
                    <button class="view-button" data-id="${post.id}">View Mob</button>
                    ${deleteButtonHtml}
                </div>
            </div>
        `;
        
        // Add to the posts container
        mobPostsContainer.appendChild(postElement);
        
        // Add event listeners
        postElement.querySelector('.like-button').addEventListener('click', handleLikeButtonClick);
        postElement.querySelector('.view-button').addEventListener('click', handleViewButtonClick);
        
        // Add delete button event listener if the current user is Red_bot
        if (isRedBot) {
            postElement.querySelector('.delete-button').addEventListener('click', handleDeleteButtonClick);
        }
    }
    
    // Check if the current user has liked a post
    function hasUserLiked(post) {
        // Get current user ID
        const clientId = room.party.client.id;
        // Look for a like record for this post from this user
        const likeRecords = room.collection('minecraft_mob_likes')
            .filter({ postId: post.id, userId: clientId })
            .getList();
            
        return likeRecords.length > 0;
    }
    
    // Handle like button click
    async function handleLikeButtonClick(event) {
        const button = event.currentTarget;
        const postId = button.dataset.id;
        const clientId = room.party.client.id;
        
        try {
            // Check if user already liked
            const existingLikes = room.collection('minecraft_mob_likes')
                .filter({ postId: postId, userId: clientId })
                .getList();
            
            const post = room.collection('minecraft_mob').getList().find(p => p.id === postId);
            
            if (existingLikes.length > 0) {
                // User already liked, remove the like
                await room.collection('minecraft_mob_likes').delete(existingLikes[0].id);
                
                // Update post's like count
                await room.collection('minecraft_mob').update(postId, {
                    likes: Math.max(0, (post.likes || 0) - 1)
                });
                
                button.classList.remove('liked');
                button.innerHTML = `🤍 ${Math.max(0, (post.likes || 0) - 1)} Likes`;
            } else {
                // User hasn't liked, add like
                await room.collection('minecraft_mob_likes').create({
                    postId: postId,
                    userId: clientId
                });
                
                // Update post's like count
                await room.collection('minecraft_mob').update(postId, {
                    likes: (post.likes || 0) + 1
                });
                
                button.classList.add('liked');
                button.innerHTML = `❤️ ${(post.likes || 0) + 1} Likes`;
            }
        } catch (error) {
            console.error("Error handling like:", error);
            alert("Could not process your like. Please try again.");
        }
    }
    
    // Handle view button click
    function handleViewButtonClick(event) {
        const postId = event.currentTarget.dataset.id;
        const post = room.collection('minecraft_mob').getList().find(p => p.id === postId);
        
        if (!post) return;
        
        // Create modal for viewing the mob
        createMobViewerModal(post);
    }
    
    // Handle delete button click
    async function handleDeleteButtonClick(event) {
        const postId = event.currentTarget.dataset.id;
        
        if (room.party.client.username !== 'Red_bot') {
            alert("Only Red_bot can delete posts!");
            return;
        }
        
        if (confirm("Are you sure you want to delete this mob?")) {
            try {
                // Delete the post
                await room.collection('minecraft_mob').delete(postId);
                
                // Find and delete all likes associated with the post
                const likesToDelete = room.collection('minecraft_mob_likes')
                    .filter({ postId: postId })
                    .getList();
                    
                for (const like of likesToDelete) {
                    await room.collection('minecraft_mob_likes').delete(like.id);
                }
                
                // Refresh the post list
                loadMobPosts();
                
            } catch (error) {
                console.error("Error deleting post:", error);
                alert("Could not delete the post. Please try again.");
            }
        }
    }

    // Create mob viewer modal
    function createMobViewerModal(post) {
        // Remove existing modal if any
        const existingModal = document.getElementById('mob-viewer-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Collect all images
        const allImages = [post.mainImageUrl, ...(post.inGameImageUrls || [])];
        
        // Add spawn egg image if available
        if (post.spawnEggUrl) {
            allImages.push(post.spawnEggUrl);
        }
        
        // Get mob type indicator
        let mobTypeIndicator;
        if (post.mobType === 'passive') {
            mobTypeIndicator = '<span class="passive-indicator">😊 Passive</span>';
        } else if (post.mobType === 'neutral') {
            mobTypeIndicator = '<span class="neutral-indicator">😐 Neutral</span>';
        } else {
            mobTypeIndicator = '<span class="hostile-indicator">😠 Hostile</span>';
        }
        
        // Create modal element
        const modal = document.createElement('div');
        modal.id = 'mob-viewer-modal';
        modal.className = 'mob-viewer-modal';
        
        modal.innerHTML = `
            <div class="mob-viewer-content">
                <div class="viewer-header">
                    <div class="viewer-title">${post.name} ${mobTypeIndicator}</div>
                    <div class="viewer-close">&times;</div>
                </div>
                <div class="viewer-content">
                    <div class="viewer-image-section">
                        <img src="${post.mainImageUrl}" alt="${post.name}" class="viewer-image">
                    </div>
                    
                    <div class="viewer-thumbnails" style="font-family: 'Minecraft', sans-serif;">
                        ${allImages.map((img, index) => `
                            <div class="viewer-thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                                <img src="${img}" alt="${post.name} image ${index + 1}">
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="viewer-details">
                        <div class="viewer-stats">
                            <div class="viewer-stat">Health: ${post.health} ❤</div>
                            <div class="viewer-stat">Attack: ${post.attack} 🗡</div>
                            <div class="viewer-stat">Biome: ${post.biome}</div>
                        </div>
                        <div class="viewer-description">${post.description}</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Show the modal
        modal.style.display = 'block';
        
        // Add close event for the X button
        modal.querySelector('.viewer-close').addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Add thumbnail click events
        modal.querySelectorAll('.viewer-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                const mainImage = modal.querySelector('.viewer-image');
                mainImage.src = allImages[index];
                
                // Update active state
                modal.querySelectorAll('.viewer-thumbnail').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // Subscribe to minecraft_mob collection changes
    room.collection('minecraft_mob').subscribe(function() {
        // Only refresh if on community tab
        if (communityTab.classList.contains('active')) {
            loadMobPosts();
        }
    });
    
    // Add event listener to the generate button
    generateBtn.addEventListener('click', generateRandomMob);
    
    // Add event listener to the more images button
    moreImagesBtn.addEventListener('click', function() {
        currentImageIndex++;
        generateInGameImage();
    });

    // Add event listener to download all button
    downloadAllBtn.addEventListener('click', downloadAllImages);
    
    // Add event listener to the generate spawn egg button
    generateSpawnEggBtn.addEventListener('click', generateSpawnEgg);

    // Main menu transition
    startBtn.addEventListener('click', function() {
        mainMenu.style.display = 'none';
        appContainer.style.display = 'block';
        
        // Generate a mob after transitioning to main app
        setTimeout(generateRandomMob, 500);
    });
});