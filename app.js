/**
 * UrbanPulse Outfitters & PulseBot
 * IBM SkillsBuild Project-Based Activity: Shop Assistant Chatbot with Website
 * High-Fidelity Client-side Application & Intelligent Rule-Based Chatbot Engine
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. PRODUCT CATALOGUE DATA
  // =========================================================================
  const PRODUCTS = [
    {
      id: 'prod-1',
      title: 'Urban Cloud Organic Hoodie',
      category: 'tops',
      price: 68.00,
      rating: '4.9 ★ (124)',
      badge: 'Eco Pick',
      badgeClass: 'badge-eco',
      material: '100% GOTS Certified Organic Cotton',
      description: 'Heavyweight 420 GSM brushed fleece with double-lined hood and zero microplastics.',
      icon: 'hoodie'
    },
    {
      id: 'prod-2',
      title: 'MetroTech Waterproof Parka',
      category: 'outerwear',
      price: 145.00,
      rating: '4.8 ★ (89)',
      badge: 'Bestseller',
      badgeClass: 'badge-hot',
      material: '100% Recycled Ripstop Nylon (DWR Finish)',
      description: 'Breathable weather-shield membrane with sealed storm zippers and ergonomic hood.',
      icon: 'jacket'
    },
    {
      id: 'prod-3',
      title: 'Essential Bamboo Heavyweight Tee',
      category: 'tops',
      price: 34.00,
      rating: '4.9 ★ (210)',
      badge: 'Eco Pick',
      badgeClass: 'badge-eco',
      material: '70% Organic Bamboo, 30% Ring-Spun Cotton',
      description: 'Naturally odor-resistant, thermo-regulating casual tee designed for all-day comfort.',
      icon: 'tshirt'
    },
    {
      id: 'prod-4',
      title: 'AeroStride Recycled Sneakers',
      category: 'footwear',
      price: 92.00,
      rating: '4.7 ★ (68)',
      badge: 'New Release',
      badgeClass: 'badge-new',
      material: 'Ocean-Bound Recycled PET & Natural Rubber',
      description: 'Cushioned foam midsole with high traction tread. Lightweight and 100% vegan.',
      icon: 'sneakers'
    },
    {
      id: 'prod-5',
      title: 'Canvas Explorer Daypack',
      category: 'accessories',
      price: 54.00,
      rating: '4.8 ★ (95)',
      badge: 'Durable',
      badgeClass: 'badge-eco',
      material: 'Weather-Treated Waxed Cotton Canvas',
      description: '18L capacity with padded 16-inch laptop compartment and quick-access utility pockets.',
      icon: 'backpack'
    },
    {
      id: 'prod-6',
      title: 'Solar Shield Polarized Sunglasses',
      category: 'accessories',
      price: 42.00,
      rating: '4.9 ★ (47)',
      badge: 'UV400',
      badgeClass: 'badge-new',
      material: 'Biodegradable Plant-Based Acetate Frame',
      description: 'Polarized TAC lenses with 100% UV400 radiation protection and anti-scratch coating.',
      icon: 'glasses'
    }
  ];

  // Simulated Order Database for Order Tracking Flow
  const ORDERS_DB = {
    'ORD-101': {
      id: 'ORD-101',
      item: 'Urban Cloud Organic Hoodie (Size M, Slate Grey)',
      status: 'Out for Delivery',
      currentStep: 4,
      estimatedDelivery: 'Today by 6:00 PM',
      carrier: 'EcoExpress Courier #EX-8821'
    },
    'ORD-202': {
      id: 'ORD-202',
      item: 'AeroStride Recycled Sneakers (Size 10, Chalk)',
      status: 'In Transit (Regional Hub)',
      currentStep: 3,
      estimatedDelivery: 'Tomorrow, Oct 2',
      carrier: 'CarbonNeutral Freight #CN-4910'
    },
    'ORD-303': {
      id: 'ORD-303',
      item: 'Canvas Explorer Daypack (Forest Green)',
      status: 'Delivered',
      currentStep: 5,
      estimatedDelivery: 'Delivered on Sep 25 (Left on porch)',
      carrier: 'UrbanPulse Direct Delivery'
    }
  };

  // State Management
  const State = {
    cart: [],
    discountCode: null,
    discountRate: 0,
    chatOpen: false,
    soundEnabled: true,
    theme: localStorage.getItem('up_theme') || 'light'
  };

  // =========================================================================
  // 2. WEB AUDIO SYNTHESIZER (Pleasant Chimes - Zero Audio Assets Required)
  // =========================================================================
  let audioCtx = null;
  function playChime(type) {
    if (!State.soundEnabled) return;
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      if (type === 'incoming') {
        // High two-tone friendly chime
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'pop') {
        // Gentle bubble pop
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      // Audio not supported or blocked by browser policy
    }
  }

  // =========================================================================
  // 3. PRODUCT SVG ICON GENERATORS
  // =========================================================================
  function getProductSVG(icon) {
    switch (icon) {
      case 'hoodie':
        return `<svg class="product-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M7 3 2 9l3 3 2-2v11h10V10l2 2 3-3-5-6H7Z"/>
          <path d="M9 3v4a3 3 0 0 0 6 0V3"/>
          <path d="M12 10v4"/>
        </svg>`;
      case 'jacket':
        return `<svg class="product-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="m4 6 4-3 4 3 4-3 4 3v15H4V6Z"/>
          <path d="M12 6v15"/>
          <path d="M8 12h2"/>
          <path d="M14 12h2"/>
        </svg>`;
      case 'tshirt':
        return `<svg class="product-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M6 2 2 7l4 3 1-1v12h10V9l1 1 4-3-4-5H6Z"/>
          <path d="M9 2a3 3 0 0 0 6 0"/>
        </svg>`;
      case 'sneakers':
        return `<svg class="product-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M3 17a3 3 0 0 0 3 3h14a1 1 0 0 0 1-1v-4a2 2 0 0 0-2-2h-3l-3-6H7L4 12v5"/>
          <path d="M8 12h6"/>
          <circle cx="7" cy="16" r="1"/>
        </svg>`;
      case 'backpack':
        return `<svg class="product-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect width="14" height="18" x="5" y="4" rx="4"/>
          <path d="M9 4V2a3 3 0 0 1 6 0v2"/>
          <path d="M9 13h6"/>
          <path d="M8 16h8"/>
        </svg>`;
      case 'glasses':
        return `<svg class="product-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="6" cy="14" r="4"/>
          <circle cx="18" cy="14" r="4"/>
          <path d="M10 14h4"/>
          <path d="m2 9 2.5 2"/>
          <path d="m22 9-2.5 2"/>
        </svg>`;
      default:
        return `<svg class="product-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect width="16" height="16" x="4" y="4" rx="2"/>
        </svg>`;
    }
  }

  // =========================================================================
  // 4. SHOPPING CATALOGUE & CART CONTROLLER
  // =========================================================================
  const PulseShop = {
    renderProducts(filter = 'all') {
      const grid = document.getElementById('productGrid');
      if (!grid) return;

      const filtered = filter === 'all' 
        ? PRODUCTS 
        : PRODUCTS.filter(p => p.category === filter);

      grid.innerHTML = filtered.map(prod => `
        <article class="product-card" data-id="${prod.id}">
          <div class="product-image-box">
            <span class="product-badge ${prod.badgeClass}">${prod.badge}</span>
            ${getProductSVG(prod.icon)}
          </div>
          <div class="product-details">
            <span class="product-cat">${prod.category}</span>
            <h3 class="product-title">${prod.title}</h3>
            <div class="product-material">🌱 ${prod.material}</div>
            <div class="product-meta-row">
              <span class="product-price">$${prod.price.toFixed(2)}</span>
              <span class="product-rating">${prod.rating}</span>
            </div>
            <div class="product-card-actions">
              <button class="btn-add-bag" onclick="window.PulseShop.addToCart('${prod.id}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                </svg>
                Add to Bag
              </button>
              <button class="btn-ask-bot" onclick="window.PulseChat.askAboutProduct('${prod.id}')">
                🤖 Ask Sizing
              </button>
            </div>
          </div>
        </article>
      `).join('');
    },

    addToCart(productId) {
      const product = PRODUCTS.find(p => p.id === productId);
      if (!product) return;

      const existing = State.cart.find(item => item.id === productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        State.cart.push({ ...product, quantity: 1 });
      }

      this.updateCartUI();
      showToast(`Added "${product.title}" to bag!`);
      playChime('pop');
    },

    removeFromCart(productId) {
      State.cart = State.cart.filter(item => item.id !== productId);
      this.updateCartUI();
      showToast('Item removed from bag');
    },

    applyCoupon(code) {
      const trimmed = (code || '').trim().toUpperCase();
      if (!trimmed) {
        showToast('Please enter a coupon code');
        return;
      }

      if (trimmed === 'WELCOME15') {
        State.discountCode = 'WELCOME15';
        State.discountRate = 0.15;
        showToast('🎉 Code WELCOME15 applied: 15% discount!');
      } else if (trimmed === 'STUDENT20') {
        State.discountCode = 'STUDENT20';
        State.discountRate = 0.20;
        showToast('🎓 Code STUDENT20 applied: 20% Student Discount!');
      } else if (trimmed === 'FREESHIP50') {
        State.discountCode = 'FREESHIP50';
        State.discountRate = 0.05; // 5% bonus waiver
        showToast('⚡ Free Express Shipping coupon applied!');
      } else {
        showToast('❌ Invalid code. Try WELCOME15 or STUDENT20.');
        return;
      }

      this.updateCartUI();
    },

    updateCartUI() {
      const totalCount = State.cart.reduce((sum, item) => sum + item.quantity, 0);
      const cartBadge = document.getElementById('cartCountBadge');
      const drawerCount = document.getElementById('cartDrawerCount');
      if (cartBadge) cartBadge.textContent = totalCount;
      if (drawerCount) drawerCount.textContent = totalCount;

      const listContainer = document.getElementById('cartItemsList');
      if (!listContainer) return;

      if (State.cart.length === 0) {
        listContainer.innerHTML = `
          <div class="empty-cart-state">
            <div class="empty-cart-icon">🛍️</div>
            <h4>Your bag is empty</h4>
            <p>Explore our organic collection or ask PulseBot for recommendations!</p>
          </div>
        `;
      } else {
        listContainer.innerHTML = State.cart.map(item => `
          <div class="cart-item-card">
            <div style="font-size: 1.5rem; background: var(--bg-surface); padding: 6px; border-radius: 6px;">
              ${item.category === 'tops' ? '👕' : item.category === 'outerwear' ? '🧥' : item.category === 'footwear' ? '👟' : '🎒'}
            </div>
            <div class="cart-item-info">
              <div class="cart-item-title">${item.title}</div>
              <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</div>
            </div>
            <button class="cart-item-remove" onclick="window.PulseShop.removeFromCart('${item.id}')" title="Remove">✕</button>
          </div>
        `).join('');
      }

      // Calculations
      const subtotal = State.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const discount = subtotal * State.discountRate;
      const total = Math.max(0, subtotal - discount);

      document.getElementById('cartSubtotalText').textContent = `$${subtotal.toFixed(2)}`;
      
      const discountRow = document.getElementById('cartDiscountRow');
      if (State.discountCode && discount > 0) {
        discountRow.classList.remove('hidden');
        document.getElementById('appliedCodeText').textContent = State.discountCode;
        document.getElementById('cartDiscountText').textContent = `-$${discount.toFixed(2)}`;
      } else {
        discountRow.classList.add('hidden');
      }

      document.getElementById('cartTotalText').textContent = `$${total.toFixed(2)}`;
    },

    openCart() {
      document.getElementById('cartDrawer').classList.remove('hidden');
      document.getElementById('cartModalBackdrop').classList.remove('hidden');
    },

    closeCart() {
      document.getElementById('cartDrawer').classList.add('hidden');
      document.getElementById('cartModalBackdrop').classList.add('hidden');
    },

    simulateCheckout() {
      if (State.cart.length === 0) {
        showToast('Your shopping bag is empty!');
        return;
      }
      this.closeCart();
      window.PulseChat.openChat();
      window.PulseChat.injectBotMessage(
        `🎉 <strong>Order Simulated Successfully!</strong><br>` +
        `Your mock order confirmation code is <strong>ORD-${Math.floor(100 + Math.random() * 900)}</strong>.<br>` +
        `No payment or personal details were required. You can track this simulated package anytime by clicking <strong>Track an Order</strong> below!`
      );
      State.cart = [];
      this.updateCartUI();
    }
  };

  // =========================================================================
  // 5. PULSEBOT CHATBOT ENGINE
  // Complies with IBM SkillsBuild Minimum Flow:
  // Welcome -> Needs Assessment -> Show Choices -> Useful Response -> Offer Another Option -> Goodbye / Support
  // =========================================================================
  const PulseChat = {
    messagesContainer: null,
    chipsContainer: null,
    typingElem: null,
    inputElem: null,

    init() {
      this.messagesContainer = document.getElementById('chatMessages');
      this.chipsContainer = document.getElementById('chatChipsContainer');
      this.typingElem = document.getElementById('typingIndicator');
      this.inputElem = document.getElementById('chatInput');

      // Bind Listeners
      document.getElementById('chatToggleBtn').addEventListener('click', () => this.toggleChat());
      document.getElementById('closeChatBtn').addEventListener('click', () => this.closeChat());
      document.getElementById('headerChatLaunchBtn').addEventListener('click', () => this.openChat());
      document.getElementById('heroOpenChatBtn').addEventListener('click', () => this.openChat());
      document.getElementById('restartChatBtn').addEventListener('click', () => this.resetConversation());

      // Form submit
      document.getElementById('chatForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const text = this.inputElem.value.trim();
        if (text) {
          this.handleUserInput(text);
          this.inputElem.value = '';
        }
      });

      // Sound toggle
      document.getElementById('soundToggleBtn').addEventListener('click', () => {
        State.soundEnabled = !State.soundEnabled;
        const btn = document.getElementById('soundToggleBtn');
        btn.style.opacity = State.soundEnabled ? '1' : '0.5';
        showToast(State.soundEnabled ? 'Sound alerts enabled' : 'Sound alerts muted');
      });

      // Start conversation with initial greeting
      this.startWelcomeFlow();
    },

    toggleChat() {
      if (State.chatOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    },

    openChat() {
      const windowElem = document.getElementById('chatWindow');
      const toggleBtn = document.getElementById('chatToggleBtn');
      const unreadBadge = document.getElementById('unreadBadge');

      windowElem.classList.remove('hidden');
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      unreadBadge.classList.add('hidden');
      State.chatOpen = true;

      // Scroll to bottom
      this.scrollToBottom();
      setTimeout(() => this.inputElem.focus(), 250);
    },

    closeChat() {
      const windowElem = document.getElementById('chatWindow');
      const toggleBtn = document.getElementById('chatToggleBtn');

      windowElem.classList.add('hidden');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      State.chatOpen = false;
    },

    resetConversation() {
      this.messagesContainer.innerHTML = '';
      this.startWelcomeFlow();
      showToast('Conversation reset to start');
    },

    // Step 1: Welcome & Ask what the customer needs
    startWelcomeFlow() {
      this.messagesContainer.innerHTML = '';
      this.injectBotMessage(
        `👋 <strong>Hello and welcome to UrbanPulse Outfitters!</strong><br>` +
        `I'm <strong>PulseBot</strong>, your dedicated customer support assistant.<br><br>` +
        `How can I assist you with your conscious shopping today?`,
        [
          { label: '👕 Product Information', intent: 'products' },
          { label: '🕒 Store Timings', intent: 'timings' },
          { label: '💰 Active Offers', intent: 'offers' },
          { label: '📦 Order & Delivery Help', intent: 'track' },
          { label: '📞 Contact Support', intent: 'contact' }
        ]
      );
    },

    // User Message Injection
    handleUserInput(text) {
      this.injectUserMessage(text);
      this.showTyping(true);

      setTimeout(() => {
        this.showTyping(false);
        this.processNLPQuery(text);
      }, 550);
    },

    injectUserMessage(text) {
      const time = this.getCurrentTime();
      const div = document.createElement('div');
      div.className = 'chat-message-row user';
      div.innerHTML = `
        <div class="msg-bubble">
          <div>${this.escapeHTML(text)}</div>
          <span class="msg-time">${time}</span>
        </div>
      `;
      this.messagesContainer.appendChild(div);
      this.scrollToBottom();
      playChime('pop');
    },

    injectBotMessage(htmlContent, chips = null, attachmentHtml = null) {
      const time = this.getCurrentTime();
      const div = document.createElement('div');
      div.className = 'chat-message-row bot';
      div.innerHTML = `
        <div class="msg-avatar">🤖</div>
        <div class="msg-bubble">
          <div>${htmlContent}</div>
          ${attachmentHtml ? attachmentHtml : ''}
          <span class="msg-time">${time}</span>
        </div>
      `;
      this.messagesContainer.appendChild(div);
      this.scrollToBottom();
      playChime('incoming');

      // Update quick reply chips
      if (chips && chips.length > 0) {
        this.renderChips(chips);
      } else {
        // Default follow-up chips (Fulfills: Offer another option)
        this.renderChips([
          { label: '🔙 Main Menu', intent: 'menu' },
          { label: '🕒 Store Hours', intent: 'timings' },
          { label: '💰 Discount Codes', intent: 'offers' },
          { label: '📦 Order Help', intent: 'track' },
          { label: '👋 That’s all, thanks!', intent: 'goodbye' }
        ]);
      }
    },

    renderChips(chips) {
      this.chipsContainer.innerHTML = '';
      chips.forEach(chip => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chat-chip';
        btn.textContent = chip.label;
        btn.onclick = () => {
          if (chip.intent) {
            this.triggerIntent(chip.intent, chip.payload);
          } else if (chip.action) {
            chip.action();
          }
        };
        this.chipsContainer.appendChild(btn);
      });
    },

    showTyping(show) {
      if (show) {
        this.typingElem.classList.remove('hidden');
      } else {
        this.typingElem.classList.add('hidden');
      }
      this.scrollToBottom();
    },

    scrollToBottom() {
      setTimeout(() => {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      }, 50);
    },

    getCurrentTime() {
      const now = new Date();
      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    escapeHTML(str) {
      return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
      );
    },

    // =======================================================================
    // 6. NLP INTENT MATCHER & CONVERSATION PATH ROUTER
    // =======================================================================
    processNLPQuery(input) {
      const text = input.toLowerCase().trim();

      // Check for Order ID lookup (e.g., ORD-101)
      const orderMatch = text.match(/\b(ord-\d{3})\b/i);
      if (orderMatch) {
        this.triggerIntent('track_id', orderMatch[1].toUpperCase());
        return;
      }

      // Greetings
      if (/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|yo)\b/i.test(text)) {
        this.injectBotMessage(
          `👋 Hello there! Great to see you. How can I assist you with your UrbanPulse experience today?`,
          [
            { label: '👕 Product Details & Sizing', intent: 'products' },
            { label: '🕒 Store Hours & Locations', intent: 'timings' },
            { label: '💰 Active Offers', intent: 'offers' },
            { label: '📦 Order Help', intent: 'track' }
          ]
        );
        return;
      }

      // Path 1: Product Information & Recommendations
      if (/(product|collection|item|hoodie|parka|t-shirt|tee|sneaker|shoes|bag|backpack|sunglasses|material|cotton|sustainable|fabric)/i.test(text)) {
        this.triggerIntent('products');
        return;
      }

      // Sizing Query
      if (/(size|sizing|fit|measurement|small|medium|large|xl|chart)/i.test(text)) {
        this.triggerIntent('sizing');
        return;
      }

      // Path 2: Store Timings & Hours
      if (/(timing|time|hour|schedule|open|close|weekend|sunday|saturday|monday|holiday|when)/i.test(text)) {
        this.triggerIntent('timings');
        return;
      }

      // Store Location
      if (/(location|address|where|place|metro|station|directions|flagship)/i.test(text)) {
        this.triggerIntent('location');
        return;
      }

      // Path 3: Offers, Discounts & Deals
      if (/(offer|discount|coupon|promo|code|deal|voucher|student|save|sale)/i.test(text)) {
        this.triggerIntent('offers');
        return;
      }

      // Path 4: Order & Delivery / Tracking
      if (/(order|track|tracking|status|ship|shipping|courier|delivery|package|dispatch)/i.test(text)) {
        this.triggerIntent('track');
        return;
      }

      // Returns & Exchanges Policy
      if (/(return|exchange|refund|damaged|replace|policy|14\s*day)/i.test(text)) {
        this.triggerIntent('returns');
        return;
      }

      // Path 5: Contact Us & Live Support
      if (/(contact|support|phone|call|email|human|agent|representative|talk|helpline|complaint)/i.test(text)) {
        this.triggerIntent('contact');
        return;
      }

      // Goodbye & Thank you
      if (/(bye|goodbye|thank|thanks|cya|see you|done|exit)/i.test(text)) {
        this.triggerIntent('goodbye');
        return;
      }

      // Intelligent Fallback with Suggested Paths
      this.injectBotMessage(
        `I want to make sure I give you the exact information you need! I didn't quite catch: <em>"${this.escapeHTML(input)}"</em>.<br><br>` +
        `Could you please pick one of our primary assistance options below?`,
        [
          { label: '👕 Product Information', intent: 'products' },
          { label: '🕒 Store Hours & Locations', intent: 'timings' },
          { label: '💰 Active Offers', intent: 'offers' },
          { label: '📦 Track an Order', intent: 'track' },
          { label: '📞 Speak to Human Support', intent: 'contact' }
        ]
      );
    },

    // Intent Action Handlers (All 5 Conversation Paths)
    triggerIntent(intent, payload = null) {
      this.openChat();

      switch (intent) {
        case 'menu':
          this.startWelcomeFlow();
          break;

        // PATH 1: Product Information
        case 'products':
          this.injectBotMessage(
            `👕 <strong>UrbanPulse 2026 Sustainable Collection</strong><br>` +
            `All our garments are made with ethically sourced materials like GOTS organic cotton and ocean-bound recycled nylon.<br><br>` +
            `What product details are you looking for?`,
            [
              { label: '🧥 Best Seller: Parka', intent: 'prod_parka' },
              { label: '🌿 Eco Hoodie Details', intent: 'prod_hoodie' },
              { label: '👟 Recycled Sneakers', intent: 'prod_sneakers' },
              { label: '📏 Size Guide', intent: 'sizing' },
              { label: '🔙 Main Menu', intent: 'menu' }
            ]
          );
          break;

        case 'prod_hoodie':
          this.injectBotMessage(
            `<strong>Urban Cloud Organic Hoodie ($68.00)</strong><br>` +
            `• <strong>Material:</strong> 100% GOTS Certified Organic Cotton (420 GSM).<br>` +
            `• <strong>Fit:</strong> Relaxed contemporary streetwear cut.<br>` +
            `• <strong>Care:</strong> Machine wash cold, hang dry recommended.<br>` +
            `Would you like to add it to your bag or view sizing?`,
            [
              { label: '🛒 Add to Bag', action: () => window.PulseShop.addToCart('prod-1') },
              { label: '📏 View Sizing Table', intent: 'sizing' },
              { label: '💰 Available Coupons', intent: 'offers' },
              { label: '🔙 More Products', intent: 'products' }
            ]
          );
          break;

        case 'prod_parka':
          this.injectBotMessage(
            `<strong>MetroTech Waterproof Parka ($145.00)</strong><br>` +
            `• <strong>Material:</strong> 100% Recycled Ripstop Nylon with DWR water-shield membrane.<br>` +
            `• <strong>Features:</strong> Fully taped waterproof seams, double storm zip, 4 exterior fleece-lined pockets.<br>` +
            `• <strong>Rating:</strong> 4.8 / 5 from 89 verified adventurers!`,
            [
              { label: '🛒 Add to Bag', action: () => window.PulseShop.addToCart('prod-2') },
              { label: '📏 Sizing Advice', intent: 'sizing' },
              { label: '🔙 More Products', intent: 'products' }
            ]
          );
          break;

        case 'prod_sneakers':
          this.injectBotMessage(
            `<strong>AeroStride Recycled Sneakers ($92.00)</strong><br>` +
            `• <strong>Construction:</strong> 100% Vegan. Recycled ocean plastics mesh with natural vulcanized rubber sole.<br>` +
            `• <strong>Fit Tip:</strong> Fits true to size. If you are between sizes, we recommend sizing up half a size.`,
            [
              { label: '🛒 Add to Bag', action: () => window.PulseShop.addToCart('prod-4') },
              { label: '🔄 Return Policy', intent: 'returns' },
              { label: '🔙 More Products', intent: 'products' }
            ]
          );
          break;

        case 'sizing':
          this.injectBotMessage(
            `📏 <strong>UrbanPulse Universal Sizing Guide</strong><br>` +
            `Our apparel features a tailored modern fit. Here is our chest & waist guide:`,
            [
              { label: '👕 Check Hoodies & Tops', intent: 'products' },
              { label: '📦 Shipping Speeds', intent: 'delivery_speed' },
              { label: '🔙 Main Menu', intent: 'menu' }
            ],
            `<div class="chat-card-attachment">
              <table style="width: 100%; font-size: 0.75rem; text-align: left; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid var(--border-medium);">
                  <th>Size</th><th>Chest (in)</th><th>Waist (in)</th>
                </tr>
                <tr><td><strong>S</strong></td><td>36 - 38</td><td>29 - 31</td></tr>
                <tr><td><strong>M</strong></td><td>39 - 41</td><td>32 - 34</td></tr>
                <tr><td><strong>L</strong></td><td>42 - 44</td><td>35 - 37</td></tr>
                <tr><td><strong>XL</strong></td><td>45 - 48</td><td>38 - 41</td></tr>
              </table>
              <span style="font-size: 0.7rem; color: var(--text-muted);">Tip: Free exchanges within 14 days if the fit isn't perfect!</span>
            </div>`
          );
          break;

        // PATH 2: Store Timings & Location
        case 'timings':
          this.injectBotMessage(
            `🕒 <strong>UrbanPulse Flagship Store Hours:</strong><br><br>` +
            `• <strong>Monday – Friday:</strong> 10:00 AM – 9:00 PM<br>` +
            `• <strong>Saturday:</strong> 10:00 AM – 10:00 PM (Extended Hours)<br>` +
            `• <strong>Sunday:</strong> 11:00 AM – 8:00 PM<br>` +
            `• <strong>Public Holidays:</strong> 12:00 PM – 6:00 PM<br><br>` +
            `💡 <em>In-Store Click & Collect pickup is available within 2 hours of online order placement!</em>`,
            [
              { label: '📍 Store Location & Metro', intent: 'location' },
              { label: '🚗 Click & Collect Info', intent: 'pickup_info' },
              { label: '💰 Check Offers', intent: 'offers' },
              { label: '🔙 Main Menu', intent: 'menu' }
            ]
          );
          break;

        case 'location':
          this.injectBotMessage(
            `📍 <strong>Store Address & Transit Guide:</strong><br>` +
            `742 Evergreen Plaza, Suite 400<br>` +
            `Central Metro Station, Gate 3 (Downtown Shopping District)<br><br>` +
            `• <strong>Parking:</strong> Validated underground parking (free for 2 hrs with any purchase).<br>` +
            `• <strong>Direct Phone:</strong> +1 (800) 555-PULSE`,
            [
              { label: '🕒 Store Timings', intent: 'timings' },
              { label: '📦 Track an Order', intent: 'track' },
              { label: '📞 Talk to Staff', intent: 'contact' }
            ]
          );
          break;

        case 'pickup_info':
          this.injectBotMessage(
            `🚗 <strong>Free In-Store Click & Collect</strong><br>` +
            `1. Place an order on our website.<br>` +
            `2. Select <em>"Pick up at Downtown Flagship"</em>.<br>` +
            `3. Receive an SMS notification ready in just <strong>2 hours</strong>!<br>` +
            `4. Show your mock order ID at our Express Service Counter.`,
            [
              { label: '🕒 Store Hours', intent: 'timings' },
              { label: '💰 Discount Coupons', intent: 'offers' },
              { label: '🔙 Main Menu', intent: 'menu' }
            ]
          );
          break;

        // PATH 3: Offers, Deals & Coupons
        case 'offers':
          this.injectBotMessage(
            `🎉 <strong>Exclusive Active Coupon Codes Today:</strong><br><br>` +
            `1. <strong>WELCOME15</strong> — 15% off first order for new customers.<br>` +
            `2. <strong>STUDENT20</strong> — 20% flat discount for verified students & IBM SkillsBuild learners.<br>` +
            `3. <strong>FREESHIP50</strong> — Free Express Delivery on orders over $50.<br><br>` +
            `Click a button below to copy the code directly!`,
            [
              { label: '📋 Apply WELCOME15', action: () => window.PulseShop.applyCoupon('WELCOME15') },
              { label: '🎓 Apply STUDENT20', action: () => window.PulseShop.applyCoupon('STUDENT20') },
              { label: '⚡ Apply FREESHIP50', action: () => window.PulseShop.applyCoupon('FREESHIP50') },
              { label: '👕 Shop Collection', intent: 'products' },
              { label: '🔙 Main Menu', intent: 'menu' }
            ]
          );
          break;

        // PATH 4: Order Tracking & Delivery
        case 'track':
          this.injectBotMessage(
            `📦 <strong>Order Tracking & Delivery Status</strong><br>` +
            `You can check the real-time progress of your shipment right here!<br><br>` +
            `Try entering a sample tracking number like <code>ORD-101</code>, <code>ORD-202</code>, or <code>ORD-303</code>:`,
            [
              { label: '🔍 Track ORD-101 (Out for delivery)', intent: 'track_id', payload: 'ORD-101' },
              { label: '🔍 Track ORD-202 (In Transit)', intent: 'track_id', payload: 'ORD-202' },
              { label: '🔍 Track ORD-303 (Delivered)', intent: 'track_id', payload: 'ORD-303' },
              { label: '🚚 Shipping Speeds & Rates', intent: 'delivery_speed' },
              { label: '🔄 Return Policy', intent: 'returns' }
            ]
          );
          break;

        case 'track_id': {
          const id = payload || 'ORD-101';
          const order = ORDERS_DB[id] || {
            id: id,
            item: 'Custom UrbanPulse Order',
            status: 'In Transit',
            currentStep: 3,
            estimatedDelivery: 'Expected in 2 business days',
            carrier: 'EcoExpress Courier Service'
          };

          const stepsHtml = `
            <div class="chat-order-tracker">
              <div class="tracker-header">
                <span>Tracking ID: <strong>${order.id}</strong></span>
                <span style="color: var(--accent-emerald); font-weight: 700;">${order.status}</span>
              </div>
              <div style="font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 6px;">
                📦 <strong>Item:</strong> ${order.item}
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px;">
                🚚 <strong>Carrier:</strong> ${order.carrier} &bull; <strong>ETA:</strong> ${order.estimatedDelivery}
              </div>
              <div class="tracker-timeline">
                <div class="tracker-step ${order.currentStep >= 1 ? 'completed' : ''}">
                  <span class="tracker-dot"></span>
                  <span class="tracker-label">Placed</span>
                </div>
                <div class="tracker-step ${order.currentStep >= 2 ? 'completed' : ''}">
                  <span class="tracker-dot"></span>
                  <span class="tracker-label">Packed</span>
                </div>
                <div class="tracker-step ${order.currentStep === 3 ? 'active' : order.currentStep > 3 ? 'completed' : ''}">
                  <span class="tracker-dot"></span>
                  <span class="tracker-label">In Transit</span>
                </div>
                <div class="tracker-step ${order.currentStep === 4 ? 'active' : order.currentStep > 4 ? 'completed' : ''}">
                  <span class="tracker-dot"></span>
                  <span class="tracker-label">Out for Del.</span>
                </div>
                <div class="tracker-step ${order.currentStep >= 5 ? 'completed' : ''}">
                  <span class="tracker-dot"></span>
                  <span class="tracker-label">Delivered</span>
                </div>
              </div>
            </div>
          `;

          this.injectBotMessage(
            `Here are the latest simulated tracking details for order <strong>${order.id}</strong>:`,
            [
              { label: '🚚 Delivery Speeds & Fees', intent: 'delivery_speed' },
              { label: '🔄 Return or Exchange', intent: 'returns' },
              { label: '📞 Speak with Support', intent: 'contact' },
              { label: '🔙 Main Menu', intent: 'menu' }
            ],
            stepsHtml
          );
          break;
        }

        case 'delivery_speed':
          this.injectBotMessage(
            `🚚 <strong>Shipping Speeds & Delivery Fees:</strong><br><br>` +
            `• <strong>Standard Eco-Courier:</strong> 3 – 5 business days ($4.99 or <strong>FREE</strong> over $50).<br>` +
            `• <strong>Express Priority:</strong> 1 – 2 business days ($9.99 or free with code <code>FREESHIP50</code>).<br>` +
            `• <strong>Same-Day Click & Collect:</strong> Free at our Flagship Store within 2 hours.`,
            [
              { label: '📦 Track My Order', intent: 'track' },
              { label: '🔄 Return Policy', intent: 'returns' },
              { label: '🔙 Main Menu', intent: 'menu' }
            ]
          );
          break;

        case 'returns':
          this.injectBotMessage(
            `🔄 <strong>14-Day Free Returns & Exchanges Policy</strong><br><br>` +
            `• <strong>Window:</strong> 14 days from package delivery date.<br>` +
            `• <strong>Condition:</strong> Unworn, unwashed, with all original tags attached.<br>` +
            `• <strong>Fee:</strong> Exchanges for size or color are 100% free.<br>` +
            `• <strong>Instant Drop-off:</strong> You can drop returns off at our Flagship Store or request a free prepaid return label.`,
            [
              { label: '📞 Contact Support for Return', intent: 'contact' },
              { label: '📏 View Sizing Chart', intent: 'sizing' },
              { label: '🔙 Main Menu', intent: 'menu' }
            ]
          );
          break;

        // PATH 5: Contact Us & Live Support
        case 'contact':
          this.injectBotMessage(
            `📞 <strong>UrbanPulse Customer Care & Escalation</strong><br><br>` +
            `Need human assistance? Our store associates are on standby:<br>` +
            `• <strong>Toll-Free Helpline:</strong> +1 (800) 785-PULSE (Mon–Sat, 9am–8pm)<br>` +
            `• <strong>Email:</strong> support@urbanpulse-shop.example<br>` +
            `• <strong>In Person:</strong> 742 Evergreen Plaza, Suite 400<br><br>` +
            `Would you like to log a simulated customer callback request?`,
            [
              { label: '🎫 Request Support Callback', intent: 'simulate_ticket' },
              { label: '🕒 Check Store Timings', intent: 'timings' },
              { label: '🔙 Main Menu', intent: 'menu' }
            ]
          );
          break;

        case 'simulate_ticket': {
          const ticketId = 'TICK-' + Math.floor(1000 + Math.random() * 9000);
          this.injectBotMessage(
            `✅ <strong>Simulated Support Ticket Created!</strong><br>` +
            `Ticket ID: <strong>#${ticketId}</strong>.<br>` +
            `In a production environment, our senior support specialist would contact you within 15 minutes.<br><br>` +
            `<em>Notice: Under IBM SkillsBuild guidelines, no real personal details were collected or stored.</em>`,
            [
              { label: '👕 Browse Products', intent: 'products' },
              { label: '🕒 Store Timings', intent: 'timings' },
              { label: '👋 End Conversation', intent: 'goodbye' }
            ]
          );
          break;
        }

        // Final Step: Goodbye / Positive Wrap-up
        case 'goodbye':
          this.injectBotMessage(
            `✨ <strong>Thank you for visiting UrbanPulse Outfitters!</strong><br>` +
            `It was a pleasure assisting you today. If you need anything else, simply tap or click on me anytime.<br><br>` +
            `Have a wonderful day and happy shopping! 🌿🛍️`,
            [
              { label: '🔄 Start New Chat', intent: 'menu' },
              { label: '📋 View IBM Project Dossier', action: () => document.getElementById('viewProjectSheetBtn').click() }
            ]
          );
          break;

        default:
          this.startWelcomeFlow();
          break;
      }
    },

    askAboutProduct(productId) {
      const prod = PRODUCTS.find(p => p.id === productId);
      if (!prod) return;

      this.openChat();
      this.injectUserMessage(`Tell me more about the ${prod.title}`);
      this.showTyping(true);

      setTimeout(() => {
        this.showTyping(false);
        this.injectBotMessage(
          `✨ Great choice! The <strong>${prod.title}</strong> is one of our flagship items.<br><br>` +
          `• <strong>Price:</strong> $${prod.price.toFixed(2)}<br>` +
          `• <strong>Fabric:</strong> ${prod.material}<br>` +
          `• <strong>Fit:</strong> True to size with a comfortable modern silhouette.<br>` +
          `• <strong>Care:</strong> Wash cold inside-out to protect organic fibers.<br><br>` +
          `Would you like to add it to your shopping bag or view available discount coupons?`,
          [
            { label: '🛒 Add to Bag ($' + prod.price.toFixed(2) + ')', action: () => window.PulseShop.addToCart(prod.id) },
            { label: '💰 Check Discounts', intent: 'offers' },
            { label: '📏 Size Chart', intent: 'sizing' },
            { label: '🔙 Main Menu', intent: 'menu' }
          ]
        );
      }, 500);
    }
  };

  // =========================================================================
  // 7. TOAST NOTIFICATION UTILITY
  // =========================================================================
  let toastTimeout = null;
  function showToast(msg) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = msg;
    toast.classList.remove('hidden');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2800);
  }

  // Copy Coupon Helper
  window.copyCoupon = function (code, btnElem) {
    navigator.clipboard.writeText(code).then(() => {
      const originalText = btnElem.textContent;
      btnElem.textContent = 'Copied! ✓';
      btnElem.style.background = '#10b981';
      btnElem.style.color = '#ffffff';
      showToast(`Coupon code ${code} copied to clipboard!`);
      setTimeout(() => {
        btnElem.textContent = originalText;
        btnElem.style.background = '';
        btnElem.style.color = '';
      }, 2000);
    }).catch(() => {
      showToast(`Coupon code: ${code}`);
    });
  };

  // =========================================================================
  // 8. THEME TOGGLE CONTROLLER
  // =========================================================================
  function initTheme() {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (State.theme === 'dark') {
      document.body.classList.add('dark-theme');
    }

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        State.theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('up_theme', State.theme);
        showToast(`Switched to ${State.theme} mode`);
      });
    }
  }

  // =========================================================================
  // 9. IBM SKILLSBUILD PROJECT MODAL & DOSSIER CONTROLLER
  // =========================================================================
  function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const backdrop = document.getElementById('projectModalBackdrop');
    const openBtn = document.getElementById('viewProjectSheetBtn');
    const closeBtn = document.getElementById('closeProjectModalBtn');
    const dateSpan = document.getElementById('currentDateSpan');

    if (dateSpan) {
      const today = new Date().toISOString().split('T')[0];
      dateSpan.textContent = today;
    }

    function openModal() {
      modal.classList.remove('hidden');
      backdrop.classList.remove('hidden');
    }

    function closeModal() {
      modal.classList.add('hidden');
      backdrop.classList.add('hidden');
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('showDossier') === 'true') {
      setTimeout(openModal, 200);
    }
  }

  // =========================================================================
  // 10. INITIALIZATION ENTRY POINT
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Catalog
    PulseShop.renderProducts('all');

    // 2. Setup Category Filter Tabs
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const cat = btn.getAttribute('data-category');
        PulseShop.renderProducts(cat);
      });
    });

    // 3. Setup Cart Listeners
    document.getElementById('cartToggleBtn').addEventListener('click', () => PulseShop.openCart());
    document.getElementById('closeCartBtn').addEventListener('click', () => PulseShop.closeCart());
    document.getElementById('cartModalBackdrop').addEventListener('click', () => PulseShop.closeCart());

    const couponBtn = document.getElementById('applyCouponBtn');
    if (couponBtn) {
      couponBtn.addEventListener('click', () => {
        const val = document.getElementById('cartCouponInput').value;
        PulseShop.applyCoupon(val);
      });
    }

    // 4. Initialize Theme & Project Modal
    initTheme();
    initProjectModal();

    // 5. Initialize Chatbot Engine
    PulseChat.init();

    // Check URL parameters (e.g. ?openChat=true or ?intent=timings)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('openChat') === 'true' || urlParams.has('intent')) {
      setTimeout(() => {
        PulseChat.openChat();
        const intent = urlParams.get('intent');
        if (intent) {
          PulseChat.triggerIntent(intent);
        }
      }, 300);
    }

    // Expose globals for inline HTML event handlers
    window.PulseShop = PulseShop;
    window.PulseChat = PulseChat;
  });

})();
