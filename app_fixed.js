// Fixed JavaScript for Web Apps Portfolio - Combines original functionality with enhancements

// Global variables
let currentFilter = 'all';
let privateAppsUnlocked = localStorage.getItem('privateAppsUnlocked') === 'true';

// Enhanced Chatbot Class (Working Version)
class WebAppsChatbot {
  constructor() {
    this.useDemoMode = false;
    this.useMinistralAPI = true;
    this.apiKey = 'mnmKw0OPPoClTcjqaOpJDGO4ZLJLH93M';
    this.apiUrl = 'https://api.mistral.ai/v1/chat/completions';
    this.model = 'ministral-3b-2410';
    this.isTyping = false;
    this.requestCount = 0;
    this.maxRequests = 10000;
    this.hasInteracted = localStorage.getItem('chatbot-interacted') === 'true';
    
    this.initializeElements();
    this.attachEventListeners();
    this.setupAttentionAnimations();
  }

  initializeElements() {
    this.toggle = document.getElementById('chatbot-toggle');
    this.window = document.getElementById('chatbot-window');
    this.closeBtn = document.getElementById('chatbot-close');
    this.clearBtn = document.getElementById('chatbot-clear');
    this.messages = document.getElementById('chatbot-messages');
    this.input = document.getElementById('chatbot-input');
    this.sendBtn = document.getElementById('chatbot-send');
    
    console.log('Chatbot elements initialized:', {
      toggle: !!this.toggle,
      window: !!this.window,
      closeBtn: !!this.closeBtn,
      clearBtn: !!this.clearBtn,
      messages: !!this.messages,
      input: !!this.input,
      sendBtn: !!this.sendBtn
    });
  }

  attachEventListeners() {
    if (this.toggle) {
      this.toggle.addEventListener('click', () => {
        this.toggleWindow();
        this.hideAttentionAnimations();
      });
    }
    
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeWindow());
    }
    
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => this.clearConversation());
    }
    
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => {
        this.sendMessage();
        this.hideAttentionAnimations();
      });
    }
    
    if (this.input) {
      this.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
          this.hideAttentionAnimations();
        }
      });
    }
  }

  setupAttentionAnimations() {
    this.pulseRing = document.querySelector('.chatbot-pulse');
    this.tooltip = document.querySelector('.chatbot-notification');
    
    if (!this.hasInteracted) {
      setTimeout(() => {
        if (this.pulseRing) {
          this.pulseRing.style.setProperty('display', 'block', 'important');
        }
        if (this.tooltip) {
          this.tooltip.style.setProperty('display', 'block', 'important');
        }
      }, 2000);
      
      setTimeout(() => {
        this.hideAttentionAnimations();
      }, 17000);
    } else {
      this.hideAttentionAnimations();
    }
  }

  hideAttentionAnimations() {
    if (this.pulseRing) {
      this.pulseRing.style.setProperty('display', 'none', 'important');
    }
    if (this.tooltip) {
      this.tooltip.style.setProperty('display', 'none', 'important');
    }
    
    this.hasInteracted = true;
    localStorage.setItem('chatbot-interacted', 'true');
  }

  toggleWindow() {
    if (this.window) {
      this.window.classList.toggle('hidden');
      if (!this.window.classList.contains('hidden')) {
        this.input?.focus();
      }
    }
  }

  closeWindow() {
    if (this.window) {
      this.window.classList.add('hidden');
    }
  }

  clearConversation() {
    if (!this.messages) return;
    
    const messages = this.messages.querySelectorAll('.message');
    messages.forEach((message, index) => {
      if (index > 0) {
        message.remove();
      }
    });
    
    this.addMessage('Chat cleared! 🧹 Each message is now processed independently with fresh context.', 'bot');
  }

  async sendMessage() {
    if (!this.input) return;
    
    const message = this.input.value.trim();
    if (!message || this.isTyping) return;

    if (this.requestCount >= this.maxRequests) {
      this.addMessage('Rate limit reached. Please try again later.', 'bot');
      return;
    }

    this.addMessage(message, 'user');
    this.input.value = '';
    this.input.disabled = true;
    this.sendBtn.disabled = true;
    
    this.showTypingIndicator();
    
    try {
      let response;
      if (this.useDemoMode) {
        response = await this.getDemoResponse(message);
      } else if (this.useMinistralAPI) {
        response = await this.callMinistralAPI(message);
      } else {
        response = await this.callGeminiAPI(message);
      }
      
      this.hideTypingIndicator();
      this.addMessage(response, 'bot');
      this.requestCount++;
    } catch (error) {
      this.hideTypingIndicator();
      console.error('Chatbot error:', error);
      
      try {
        const demoResponse = await this.getDemoResponse(message);
        this.addMessage(demoResponse + '\n\n⚠️ API unavailable - using intelligent local processing', 'bot');
        this.requestCount++;
      } catch (demoError) {
        this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
      }
    }
    
    this.input.disabled = false;
    this.sendBtn.disabled = false;
    this.input?.focus();
  }

  addMessage(content, sender) {
    if (!this.messages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    bubbleDiv.innerHTML = content.replace(/\n/g, '<br>');
    
    contentDiv.appendChild(bubbleDiv);
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    this.messages.appendChild(messageDiv);
    this.messages.scrollTop = this.messages.scrollHeight;
  }

  showTypingIndicator() {
    this.isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-robot"></i>
      </div>
      <div class="message-content">
        <div class="message-bubble">
          <div class="typing-indicator">
            <span>Assistant is typing</span>
            <div class="typing-dots">
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.messages.appendChild(typingDiv);
    this.messages.scrollTop = this.messages.scrollHeight;
  }

  hideTypingIndicator() {
    this.isTyping = false;
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  async getDemoResponse(userMessage) {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const getPageContent = () => {
      const appsGrid = document.getElementById('appsGrid');
      if (!appsGrid) return '';
      
      let pageContent = 'COMPLETE WEB APPS PORTFOLIO CONTENT:\n\n';
      
      const sections = appsGrid.querySelectorAll('.app-section');
      sections.forEach(section => {
        const categoryTitle = section.querySelector('.category-title')?.textContent || '';
        pageContent += `\n=== ${categoryTitle.toUpperCase()} ===\n`;
        
        const subcategories = section.querySelectorAll('.subcategory');
        if (subcategories.length > 0) {
          subcategories.forEach(subcategory => {
            const subcatTitle = subcategory.querySelector('.subcategory-title')?.textContent || '';
            pageContent += `\n--- ${subcatTitle} ---\n`;
            
            const apps = subcategory.querySelectorAll('.app-card');
            apps.forEach(app => {
              const link = app.querySelector('.app-link');
              const name = app.querySelector('.app-name')?.textContent || '';
              const description = app.querySelector('.app-description')?.textContent || '';
              if (link && name) {
                pageContent += `• ${name}: ${description}\n  URL: ${link.href}\n`;
              }
            });
          });
        } else {
          const apps = section.querySelectorAll('.app-card');
          apps.forEach(app => {
            const link = app.querySelector('.app-link');
            const name = app.querySelector('.app-name')?.textContent || '';
            const description = app.querySelector('.app-description')?.textContent || '';
            if (link && name) {
              pageContent += `• ${name}: ${description}\n  URL: ${link.href}\n`;
            }
          });
        }
      });
      
      return pageContent;
    };
    
    const pageContent = getPageContent();
    
    const generateIntelligentResponse = (userQuery, fullPageContent) => {
      const query = userQuery.toLowerCase().trim();
      
      const lines = fullPageContent.split('\n');
      const apps = [];
      let currentSection = '';
      let currentSubsection = '';
      
      lines.forEach(line => {
        if (line.includes('===') && line.includes('===')) {
          currentSection = line.replace(/=/g, '').trim();
        } else if (line.includes('---') && line.includes('---')) {
          currentSubsection = line.replace(/-/g, '').trim();
        } else if (line.startsWith('•')) {
          const appLine = line.substring(1).trim();
          const [nameDesc, url] = appLine.split('\n  URL: ');
          const [name, description] = nameDesc.split(': ');
          if (name && description) {
            apps.push({
              name: name.trim(),
              description: description.trim(),
              url: url?.trim() || '',
              section: currentSection,
              subsection: currentSubsection
            });
          }
        }
      });
      
      // Handle different query types
      if (query.includes('is there') || query.includes('are there') || query.includes('any app') || query.includes('do you have')) {
        if (query.includes('image') || query.includes('photo') || query.includes('picture')) {
          const imageApps = apps.filter(app => 
            app.description.toLowerCase().includes('image') || 
            app.description.toLowerCase().includes('png') || 
            app.description.toLowerCase().includes('jpeg') ||
            app.description.toLowerCase().includes('photo')
          );
          if (imageApps.length > 0) {
            let response = `📸 **Yes! Here are apps that work with images:**\n\n`;
            imageApps.forEach(app => {
              response += `• **${app.name}** - ${app.description}\n`;
            });
            return response;
          }
        }
        
        if (query.includes('pdf')) {
          const pdfApps = apps.filter(app => app.description.toLowerCase().includes('pdf'));
          if (pdfApps.length > 0) {
            let response = `📄 **Yes! Here are apps that work with PDF files:**\n\n`;
            pdfApps.forEach(app => {
              response += `• **${app.name}** - ${app.description}\n`;
            });
            return response;
          }
        }
        
        if (query.includes('excel') || query.includes('csv') || query.includes('spreadsheet')) {
          const excelApps = apps.filter(app => 
            app.description.toLowerCase().includes('excel') || 
            app.description.toLowerCase().includes('csv')
          );
          if (excelApps.length > 0) {
            let response = `📊 **Yes! Here are apps that work with Excel/CSV files:**\n\n`;
            excelApps.forEach(app => {
              response += `• **${app.name}** - ${app.description}\n`;
            });
            return response;
          }
        }
        
        if (query.includes('game') || query.includes('play') || query.includes('fun')) {
          const gameApps = apps.filter(app => app.subsection && app.subsection.toLowerCase().includes('games'));
          if (gameApps.length > 0) {
            let response = `🎮 **Yes! Here are available games:**\n\n`;
            gameApps.forEach(app => {
              response += `• **${app.name}** - ${app.description}\n`;
            });
            response += `\n🔓 **To access these games, click "Private Apps" in the navigation!**`;
            return response;
          }
        }
        
        if (query.includes('ai') || query.includes('chatbot') || query.includes('assistant')) {
          const aiApps = apps.filter(app => 
            app.section.toLowerCase().includes('ai') || 
            app.description.toLowerCase().includes('ai') ||
            app.description.toLowerCase().includes('chatbot') ||
            app.description.toLowerCase().includes('gpt')
          );
          if (aiApps.length > 0) {
            let response = `🤖 **Yes! Here are AI assistants and chatbots:**\n\n`;
            aiApps.forEach(app => {
              response += `• **${app.name}** - ${app.description}\n`;
            });
            return response;
          }
        }
      }
      
      if (query.includes('show me all games') || query.includes('all games') || query === 'games') {
        const gameApps = apps.filter(app => app.subsection && app.subsection.toLowerCase().includes('games'));
        if (gameApps.length > 0) {
          let response = `🎮 **All Available Games (${gameApps.length}):**\n\n`;
          gameApps.forEach(app => {
            response += `• **${app.name}** - ${app.description}\n`;
          });
          response += `\n🔓 **To access these games, click "Private Apps" in the navigation!**`;
          return response;
        }
      }
      
      if (query.includes('private apps') || query.includes('private section') || query.includes('hidden apps')) {
        const privateApps = apps.filter(app => app.section.toLowerCase().includes('private'));
        if (privateApps.length > 0) {
          return `🔓 **Private Apps Access:**\n\nClick the "Private Apps" button in the navigation to unlock the private section with exclusive apps including games, tools, and client applications!\n\n*Just click the "Private Apps" button at the top of the page!*`;
        }
      }
      
      // General search
      const searchTerms = query.split(' ').filter(word => word.length > 2);
      const relevantApps = apps.filter(app => {
        return searchTerms.some(term => 
          app.name.toLowerCase().includes(term) || 
          app.description.toLowerCase().includes(term)
        );
      });
      
      if (relevantApps.length > 0) {
        let response = `🔍 **Found ${relevantApps.length} matching apps:**\n\n`;
        relevantApps.slice(0, 5).forEach(app => {
          response += `• **${app.name}** - ${app.description}\n`;
        });
        if (relevantApps.length > 5) {
          response += `\n...and ${relevantApps.length - 5} more matches!`;
        }
        return response;
      }
      
      return `I have complete knowledge of all ${apps.length} applications on this page! Try asking:\n\n• "Is there any app that works with images?"\n• "Show me all games"\n• "Where are the AI assistants?"\n• Or describe what you need help with!`;
    };
    
    const response = generateIntelligentResponse(userMessage, pageContent);
    return response;
  }

  async callMinistralAPI(userMessage) {
    if (!this.apiKey || this.apiKey === 'YOUR_MISTRAL_API_KEY_HERE') {
      throw new Error('Ministral API key not configured');
    }

    const htmlContent = this.getPageContent();
    
    const systemPrompt = `You are the "Web Apps Assistant" for this portfolio. You can ONLY answer questions about the specific apps listed in the HTML content below.

STRICT RULES:
1. ONLY answer about apps found in the HTML below
2. If asked about an app not in the HTML, say "I don't see that app in this portfolio"
3. Focus ONLY on the portfolio apps: data analysis tools, games, calculators, etc.
4. If unsure, redirect to exploring the available apps

WEB APPS PORTFOLIO CONTENT:
${htmlContent}

SPECIFIC ANSWERS:
- "What is Refinery Expert?" → "Refinery Expert is an AI assistant for petroleum refining questions, based on GPT 3.5, available on POE platform."
- Questions about private apps → "Private Apps can be accessed by clicking the 'Private Apps' button in the navigation."

Remember: You are an assistant for THIS specific portfolio only. Stay focused on these apps!`;
    
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ];

    const requestBody = {
      model: this.model,
      messages: messages,
      temperature: 0.1,
      max_tokens: 5000,
      stream: false
    };

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        return data.choices[0].message.content.trim();
      } else {
        throw new Error('Unexpected response format from API');
      }
    } catch (error) {
      throw new Error(`API call failed: ${error.message}`);
    }
  }

  getPageContent() {
    const appsGrid = document.getElementById('appsGrid');
    if (!appsGrid) return '';
    
    let pageContent = 'COMPLETE WEB APPS PORTFOLIO CONTENT:\n\n';
    
    const sections = appsGrid.querySelectorAll('.app-section');
    sections.forEach(section => {
      const categoryTitle = section.querySelector('.category-title')?.textContent || '';
      pageContent += `\n=== ${categoryTitle.toUpperCase()} ===\n`;
      
      const subcategories = section.querySelectorAll('.subcategory');
      if (subcategories.length > 0) {
        subcategories.forEach(subcategory => {
          const subcatTitle = subcategory.querySelector('.subcategory-title')?.textContent || '';
          pageContent += `\n--- ${subcatTitle} ---\n`;
          
          const apps = subcategory.querySelectorAll('.app-card');
          apps.forEach(app => {
            const link = app.querySelector('.app-link');
            const name = app.querySelector('.app-name')?.textContent || '';
            const description = app.querySelector('.app-description')?.textContent || '';
            if (link && name) {
              pageContent += `• ${name}: ${description}\n  URL: ${link.href}\n`;
            }
          });
        });
      } else {
        const apps = section.querySelectorAll('.app-card');
        apps.forEach(app => {
          const link = app.querySelector('.app-link');
          const name = app.querySelector('.app-name')?.textContent || '';
          const description = app.querySelector('.app-description')?.textContent || '';
          if (link && name) {
            pageContent += `• ${name}: ${description}\n  URL: ${link.href}\n`;
          }
        });
      }
    });
    
    pageContent += '\n\nNOTE: Private Apps section can be accessed by clicking the "Private Apps" button in the navigation.\n';
    
    return pageContent;
  }

  async callGeminiAPI(userMessage) {
    throw new Error('Gemini API not implemented. Using Ministral API instead.');
  }
}

// Core functionality
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId) || document.querySelector(`.${sectionId}-section`);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

function filterApps(category) {
  currentFilter = category;
  
  // Update active filter tab
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  const activeTab = document.querySelector(`[onclick="filterApps('${category}')"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }
  
  // Filter app cards
  const appCards = document.querySelectorAll('.app-card');
  appCards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    if (category === 'all' || cardCategory === category) {
      card.style.display = 'block';
      card.parentElement.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
  
  // Handle section visibility
  const sections = document.querySelectorAll('.app-section');
  sections.forEach(section => {
    const visibleCards = section.querySelectorAll('.app-card[style*="display: block"], .app-card:not([style*="display: none"])');
    if (category === 'all' || visibleCards.length > 0) {
      section.style.display = 'block';
    } else {
      section.style.display = 'none';
    }
  });
  
  // Scroll to apps section
  scrollToSection('apps');
}

function showPrivateApps() {
  const privateAppsSection = document.getElementById('hidden-apps');
  const privateAppsBtn = document.getElementById('privateAppsBtn');
  
  if (privateAppsSection && privateAppsBtn) {
    privateAppsUnlocked = !privateAppsUnlocked;
    localStorage.setItem('privateAppsUnlocked', privateAppsUnlocked);
    
    if (privateAppsUnlocked) {
      privateAppsSection.style.display = 'block';
      privateAppsSection.classList.add('fade-in');
      privateAppsBtn.innerHTML = '<i class="fas fa-lock"></i><span>Hide Private</span>';
      
      // Scroll to private apps
      setTimeout(() => {
        privateAppsSection.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      
      // Show notification
      showNotification('Private apps unlocked! 🔓');
    } else {
      privateAppsSection.style.display = 'none';
      privateAppsBtn.innerHTML = '<i class="fas fa-unlock-alt"></i><span>Private Apps</span>';
      showNotification('Private apps hidden');
    }
  }
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type} show`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="notification-icon fas fa-check-circle"></i>
      <span class="notification-text">${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Search functionality
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  const navSearchInput = document.getElementById('searchInputNav');
  
  function handleSearch(searchTerm) {
    const appCards = document.querySelectorAll('.app-card');
    
    appCards.forEach(card => {
      const name = card.querySelector('.app-name')?.textContent.toLowerCase() || '';
      const description = card.querySelector('.app-description')?.textContent.toLowerCase() || '';
      const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
      
      const searchText = (name + ' ' + description + ' ' + tags).toLowerCase();
      
      if (searchTerm === '' || searchText.includes(searchTerm.toLowerCase())) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      handleSearch(e.target.value);
    });
  }
  
  if (navSearchInput) {
    navSearchInput.addEventListener('input', (e) => {
      handleSearch(e.target.value);
    });
  }
}

// Donation handling
function handleDonation(amount) {
  showThankYouModal(amount);
  
  setTimeout(() => {
    window.open(`https://paypal.me/AhmedSabri85/${amount}`, '_blank');
  }, 2000);
}

function showThankYouModal(amount) {
  const modal = document.createElement('div');
  modal.className = 'thank-you-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(5px);
  `;
  
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: linear-gradient(135deg, #1e293b, #334155);
    border-radius: 20px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    color: #f8fafc;
  `;

  modalContent.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 1rem;">🙏</div>
    <h2 style="color: #db2777; margin-bottom: 1rem; font-size: 1.5rem;">Thank You So Much!</h2>
    <p style="margin-bottom: 1.5rem; line-height: 1.6;">
      Your $${amount} contribution means the world to me! As a special thank you, 
      here's a little secret... 🤫
    </p>
    <div style="background: rgba(79, 70, 229, 0.2); border-radius: 12px; padding: 1rem; margin: 1rem 0; border: 1px solid rgba(79, 70, 229, 0.3);">
      <p style="font-weight: 600; color: #4f46e5; margin-bottom: 0.5rem;">🔓 Secret Tip:</p>
      <p style="font-size: 0.9rem;">Click the "Private Apps" button in the navigation to unlock exclusive games and tools!</p>
    </div>
    <p style="font-size: 0.8rem; opacity: 0.8; margin-bottom: 1.5rem;">
      You'll be redirected to PayPal to complete your donation in a few seconds...
    </p>
    <button onclick="closeThankYouModal()" style="
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      transition: transform 0.2s ease;
    ">
      Got it! 🚀
    </button>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  window.currentModal = modal;
  
  setTimeout(() => {
    closeThankYouModal();
  }, 12000);
}

function closeThankYouModal() {
  if (window.currentModal && document.body.contains(window.currentModal)) {
    document.body.removeChild(window.currentModal);
    window.currentModal = null;
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...');
  
  // Initialize chatbot
  const chatbot = new WebAppsChatbot();
  
  // Setup search
  setupSearch();
  
  // Setup private apps button
  const privateAppsBtn = document.getElementById('privateAppsBtn');
  if (privateAppsBtn) {
    privateAppsBtn.addEventListener('click', showPrivateApps);
  }
  
  // Setup chatbot nav button
  const chatbotNavBtn = document.getElementById('chatbotNavBtn');
  if (chatbotNavBtn) {
    chatbotNavBtn.addEventListener('click', () => {
      chatbot.toggleWindow();
    });
  }
  
  // Setup title tap functionality (8 taps to unlock private apps)
  const navTitle = document.getElementById('navTitle');
  if (navTitle) {
    let tapCount = 0;
    let tapTimer = null;
    const requiredTaps = 8;
    const tapTimeout = 2000;
    
    navTitle.addEventListener('click', function(e) {
      e.preventDefault();
      tapCount++;
      
      if (tapTimer) {
        clearTimeout(tapTimer);
      }
      
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 100);
      
      if (tapCount >= requiredTaps) {
        showPrivateApps();
        tapCount = 0;
        showNotification(`Secret unlocked! 🔓`);
      } else {
        tapTimer = setTimeout(() => {
          tapCount = 0;
        }, tapTimeout);
      }
    });
  }
  
  // Setup loading
  const loading = document.getElementById('loading');
  if (loading) {
    setTimeout(() => {
      loading.style.display = 'none';
    }, 500);
  }
  
  // Setup scroll effects
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.main-nav');
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }
  });
  
  // Setup keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('searchInputNav');
      if (searchInput) {
        searchInput.focus();
      }
    }
    
    if (e.key === 'Escape') {
      const chatbotWindow = document.getElementById('chatbot-window');
      if (chatbotWindow && !chatbotWindow.classList.contains('hidden')) {
        chatbotWindow.classList.add('hidden');
      }
    }
  });
  
  // Setup private apps initial state
  if (privateAppsUnlocked) {
    showPrivateApps();
  }
  
  // Track page load
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_load_complete', {
      event_category: 'engagement',
      event_label: 'fixed_version'
    });
  }
  
  console.log('App initialized successfully!');
});

// Global functions for inline event handlers
window.scrollToSection = scrollToSection;
window.filterApps = filterApps;
window.showPrivateApps = showPrivateApps;
window.handleDonation = handleDonation;
window.closeThankYouModal = closeThankYouModal;