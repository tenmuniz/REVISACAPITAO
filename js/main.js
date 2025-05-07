// Main JavaScript for Revisão do Capitão

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the loading screen
    initializeLoadingScreen();
    
    // Setup drag and drop for file upload
    setupFileDragDrop();
    
    // Setup event listeners
    setupEventListeners();
});

// Initialize loading screen
function initializeLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    const appContainer = document.querySelector('.app-container');
    
    // Simulate loading time (remove in production)
    setTimeout(() => {
        // Hide loading screen
        loadingScreen.classList.add('hidden');
        
        // Show app content
        setTimeout(() => {
            appContainer.classList.add('visible');
            
            // Trigger animations for cards
            document.querySelectorAll('.card').forEach(card => {
                card.style.animationPlayState = 'running';
            });
        }, 500);
    }, 1500);
}

// Setup drag and drop for file upload
function setupFileDragDrop() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('pdf-upload');
    const filename = document.getElementById('filename');
    
    if (!uploadArea || !fileInput) return;
    
    // Handle drag events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlight drop area when file is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.add('active');
        });
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.remove('active');
        });
    });
    
    // Handle file drop
    uploadArea.addEventListener('drop', (e) => {
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length) {
            fileInput.files = droppedFiles;
            handleFileSelect(droppedFiles[0]);
        }
    });
    
    // Handle file selection via input
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileSelect(e.target.files[0]);
        }
    });
    
    // Handle the selected file
    function handleFileSelect(file) {
        if (file.type !== 'application/pdf') {
            showNotification('Por favor, selecione apenas arquivos PDF.');
            return;
        }
        
        filename.textContent = file.name;
        showNotification(`Arquivo "${file.name}" selecionado com sucesso!`);
        
        // In a real app, you would process the PDF here
        // For demonstration, we'll simulate extracting text
        simulatePdfExtraction(file);
    }
    
    // Click the upload area to trigger file input
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
}

// Setup event listeners for buttons
function setupEventListeners() {
    // Buttons
    const correctTextBtn = document.getElementById('correct-text');
    const createTextBtn = document.getElementById('create-text');
    const copyTextBtn = document.getElementById('copy-text');
    
    // Text areas
    const textInput = document.getElementById('text-input');
    const resultText = document.getElementById('result-text');
    
    // Correct text button
    if (correctTextBtn) {
        correctTextBtn.addEventListener('click', () => {
            processText('correct');
        });
    }
    
    // Create new text button
    if (createTextBtn) {
        createTextBtn.addEventListener('click', () => {
            processText('create');
        });
    }
    
    // Copy text button
    if (copyTextBtn) {
        copyTextBtn.addEventListener('click', () => {
            if (!resultText.value.trim()) {
                showNotification('Não há texto para copiar.');
                return;
            }
            
            navigator.clipboard.writeText(resultText.value)
                .then(() => {
                    showNotification('Texto copiado para a área de transferência!');
                    
                    // Add visual feedback
                    copyTextBtn.classList.add('copied');
                    setTimeout(() => {
                        copyTextBtn.classList.remove('copied');
                    }, 1000);
                })
                .catch(() => {
                    // Fallback for older browsers
                    resultText.select();
                    document.execCommand('copy');
                    showNotification('Texto copiado para a área de transferência!');
                });
        });
    }
    
    // Process text function
    function processText(mode) {
        if (!textInput.value.trim()) {
            showNotification('Por favor, insira algum texto para processar.');
            return;
        }
        
        // Show processing state
        resultText.value = 'Processando...';
        
        // Add loading animation
        const btnUsed = mode === 'correct' ? correctTextBtn : createTextBtn;
        btnUsed.classList.add('processing');
        
        // Simulate API call delay
        setTimeout(() => {
            // Remove loading state
            btnUsed.classList.remove('processing');
            
            // Process the text based on mode
            if (mode === 'correct') {
                // Simulate text correction
                resultText.value = simulateTextCorrection(textInput.value);
                showNotification('Texto corrigido com sucesso!');
            } else {
                // Simulate text creation
                resultText.value = simulateTextCreation(textInput.value);
                showNotification('Texto recriado com sucesso!');
            }
            
            // Scroll to results
            document.querySelector('.result-card').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // Add highlight animation to result
            resultText.classList.add('highlight');
            setTimeout(() => {
                resultText.classList.remove('highlight');
            }, 1500);
        }, 2000);
    }
}

// Show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    if (!notification || !notificationText) return;
    
    // Set notification message
    notificationText.textContent = message;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Simulate PDF extraction (for demo purposes)
function simulatePdfExtraction(file) {
    const textInput = document.getElementById('text-input');
    
    showNotification('Extraindo texto do PDF...');
    
    // Simulate processing delay
    setTimeout(() => {
        textInput.value = `Conteúdo extraído do arquivo "${file.name}":\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere.`;
        
        showNotification('Texto extraído com sucesso!');
        
        // Focus on the text input
        textInput.focus();
    }, 1500);
}

// Simulate text correction (for demo purposes)
function simulateTextCorrection(text) {
    // Here you would connect to the OpenAI API
    // For demo purposes, we'll just correct a few common mistakes
    
    return text
        .replace(/(?<=\s|^)a\s+([aeiouáéíóúãẽĩõũâêîôû])/gi, 'à $1')
        .replace(/\s+/g, ' ')
        .replace(/\s+([.,;:!?])/g, '$1')
        .replace(/([a-zA-Z])\s+([a-zA-Z])\s+/g, '$1$2 ');
}

// Simulate text creation (for demo purposes)
function simulateTextCreation(text) {
    // In a real application, this would use the OpenAI API
    // For demo purposes, we'll add some flourishes to the text
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length === 0) return text;
    
    const enhancedSentences = sentences.map(sentence => {
        const trimmed = sentence.trim();
        
        // Add adjectives and adverbs to enhance the text
        const enhancements = [
            'Evidentemente, ',
            'Sem dúvida, ',
            'É importante ressaltar que ',
            'Cabe destacar que ',
            'Nesse contexto, ',
            'De modo inequívoco, ',
            'Conforme mencionado, ',
            'De acordo com as normas vigentes, '
        ];
        
        const randomEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
        
        if (Math.random() > 0.5) {
            return randomEnhancement + trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
        } else {
            return trimmed;
        }
    });
    
    return enhancedSentences.join('. ') + '.';
}