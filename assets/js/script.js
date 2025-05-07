// Initialize animation effects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add fade-in classes to elements
  const fadeElements = document.querySelectorAll('.card, .header-title, .header-subtitle');
  fadeElements.forEach((element, index) => {
    element.classList.add('fade-in');
    element.classList.add(`delay-${(index % 3) + 1}`);
  });

  // File upload functionality
  const dropArea = document.getElementById('drop-area');
  const fileInput = document.getElementById('file-input');
  const uploadButton = document.getElementById('upload-button');

  if (dropArea && fileInput && uploadButton) {
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
      dropArea.classList.add('highlight');
    }

    function unhighlight() {
      dropArea.classList.remove('highlight');
    }

    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;
      handleFiles(files);
    }

    uploadButton.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', function() {
      handleFiles(this.files);
    });

    function handleFiles(files) {
      if (files.length) {
        // Show loader
        showLoader();

        // Função para extrair texto do PDF usando PDF.js
        const extractTextFromPDF = async (pdfFile) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async function() {
              try {
                const typedarray = new Uint8Array(this.result);
                const pdf = await pdfjsLib.getDocument({data: typedarray}).promise;
                let text = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                  const page = await pdf.getPage(i);
                  const content = await page.getTextContent();
                  const pageText = content.items.map(item => item.str).join(' ');
                  text += pageText + '\n';
                }
                resolve(text);
              } catch (err) {
                reject(err);
              }
            };
            reader.onerror = function(e) {
              reject(e);
            };
            reader.readAsArrayBuffer(pdfFile);
          });
        };

        // Função para enviar texto extraído para a OpenAI
        const processPDFWithOpenAI = async (pdfFile) => {
          try {
            const extractedText = await extractTextFromPDF(pdfFile);
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer SUA_CHAVE_DE_API_AQUI'
              },
              body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                  {
                    role: "system",
                    content: "Você é um assistente especializado em revisão de documentos oficiais. Corrija erros gramaticais, melhore a clareza e formalidade."
                  },
                  {
                    role: "user",
                    content: extractedText
                  }
                ],
                temperature: 0.7,
                max_tokens: 2000
              })
            });
            const data = await response.json();
            return data.choices[0].message.content;
          } catch (error) {
            console.error('Erro ao processar o PDF com a OpenAI:', error);
            return 'Ocorreu um erro ao processar seu PDF. Por favor, tente novamente.';
          }
        };

        // Chamar a função de processamento real
        processPDFWithOpenAI(files[0])
          .then(correctedText => {
            hideLoader();
            showResult(correctedText);
          })
          .catch(error => {
            hideLoader();
            alert('Erro ao processar o PDF: ' + error.message);
          });
      }
    }
  }

  // Text processing with OpenAI API integration
  const textInput = document.getElementById('text-input');
  const processButton = document.getElementById('process-button');
  
  if (textInput && processButton) {
    processButton.addEventListener('click', () => {
      if (textInput.value.trim() !== '') {
        // Show loader
        showLoader();

        // INTEGRAÇÃO REAL COM A API DA OPENAI
        const processWithOpenAI = async (text) => {
          try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer SUA_CHAVE_DE_API_AQUI'
              },
              body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                  {
                    role: "system",
                    content: "Você é um assistente especializado em revisão de documentos oficiais. Corrija erros gramaticais, melhore a clareza e formalidade."
                  },
                  {
                    role: "user",
                    content: text
                  }
                ],
                temperature: 0.7,
                max_tokens: 1500
              })
            });
            const data = await response.json();
            return data.choices[0].message.content;
          } catch (error) {
            console.error('Erro ao processar o texto com a OpenAI:', error);
            return 'Ocorreu um erro ao processar seu texto. Por favor, tente novamente.';
          }
        };
        processWithOpenAI(textInput.value)
          .then(correctedText => {
            hideLoader();
            showResult(correctedText);
          })
          .catch(error => {
            hideLoader();
            alert('Erro ao processar o texto: ' + error.message);
          });
      }
    });
  }

  // Create New Text button
  const newTextButton = document.getElementById('new-text-button');
  if (newTextButton) {
    newTextButton.addEventListener('click', () => {
      // Clear text input and hide result
      if (textInput) {
        textInput.value = '';
      }
      
      const resultCard = document.querySelector('.result-card');
      if (resultCard) {
        resultCard.style.display = 'none';
      }
    });
  }

  // Copy text button
  const copyButton = document.getElementById('copy-button');
  if (copyButton) {
    copyButton.addEventListener('click', () => {
      const resultText = document.querySelector('.result-text');
      if (resultText) {
        // Create a temporary textarea element
        const textarea = document.createElement('textarea');
        textarea.value = resultText.textContent;
        document.body.appendChild(textarea);
        
        // Select and copy the text
        textarea.select();
        document.execCommand('copy');
        
        // Remove the temporary element
        document.body.removeChild(textarea);
        
        // Show a copied notification
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copiado!';
        
        setTimeout(() => {
          copyButton.textContent = originalText;
        }, 2000);
      }
    });
  }

  // Helper functions for loader and results
  function showLoader() {
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
      actionButtons.style.display = 'none';
    }
    
    // Create and show loader
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.id = 'processing-loader';
    
    const card = document.querySelector('.card');
    if (card) {
      card.appendChild(loader);
    }
  }

  function hideLoader() {
    const loader = document.getElementById('processing-loader');
    if (loader) {
      loader.remove();
    }
    
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
      actionButtons.style.display = 'flex';
    }
  }

  function showResult(correctedText) {
    const resultCard = document.querySelector('.result-card');
    if (resultCard) {
      resultCard.style.display = 'block';
      
      const resultText = document.querySelector('.result-text');
      if (resultText) {
        // Se um texto corrigido for fornecido pela API, use-o
        if (correctedText) {
          resultText.textContent = correctedText;
        } else {
          // Texto de exemplo para simulação
          resultText.textContent = 'Seu texto foi aprimorado com inteligência artificial. Este é um exemplo de como seu texto ficaria após a revisão do nosso sistema. Ele está mais claro, conciso e gramaticalmente correto.';
        }
      }
      
      // Scroll to result
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Animate particles
  initParticles();
});

// Particle animation for background
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Set canvas dimensions
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Particle settings
  const particlesArray = [];
  const numberOfParticles = 50;
  
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 5 + 1;
      this.speedX = Math.random() * 3 - 1.5;
      this.speedY = Math.random() * 3 - 1.5;
      this.color = `rgba(105, 17, 255, ${Math.random() * 0.5})`;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      if (this.size > 0.2) this.size -= 0.1;
      
      // Boundary check
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  function init() {
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
      
      // Connect particles with lines if they're close enough
      for (let j = i; j < particlesArray.length; j++) {
        const dx = particlesArray[i].x - particlesArray[j].x;
        const dy = particlesArray[i].y - particlesArray[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(105, 17, 255, ${0.2 - distance/500})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
          ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
          ctx.stroke();
        }
      }
      
      // Regenerate particles
      if (particlesArray[i].size <= 0.2) {
        particlesArray.splice(i, 1);
        i--;
        particlesArray.push(new Particle());
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  init();
  animate();
}

// Handle scroll animations
window.addEventListener('scroll', () => {
  const cards = document.querySelectorAll('.card');
  const scrollPosition = window.scrollY + window.innerHeight * 0.8;
  
  cards.forEach(card => {
    const cardPosition = card.offsetTop;
    
    if (scrollPosition > cardPosition) {
      card.classList.add('fade-in');
    }
  });
});

// Add hover effects for interactive elements
const interactiveElements = document.querySelectorAll('.btn-primary, .btn-secondary, .upload-area');
interactiveElements.forEach(element => {
  element.addEventListener('mouseover', () => {
    element.classList.add('glow');
  });
  
  element.addEventListener('mouseout', () => {
    element.classList.remove('glow');
  });
});

// 3D tilt effect for cards
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    const dx = x - xc;
    const dy = y - yc;
    
    const tiltX = dy / yc * 10;
    const tiltY = -dx / xc * 10;
    
    this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  });
});