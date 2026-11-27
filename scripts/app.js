/* ==========================================================================
   L'AURA CAFÉ — MAIN APPLICATION ORCHESTRATOR
   Cart & Tray Management, Interactive 3D Brew Lab Sync,
   Roast Matrix, Table Booking & Sensory Feedback
   ========================================================================== */

(function () {
  'use strict';

  // State Management
  const state = {
    cart: [],
    promoCode: null,
    discountRate: 0,
    customDrink: {
      vessel: 'latte',
      vesselName: 'Artisan Ceramic Latte Cup',
      glaze: 'obsidian',
      glazeName: 'Noir Obsidian (Matte)',
      origin: 'ethiopia',
      originName: 'Ethiopia Guji',
      milk: 'oat',
      milkName: 'Oat Milk Microfoam',
      addons: [],
      basePrice: 6.50
    }
  };

  // DOM Elements
  const elements = {
    // Header & Audio
    audioToggleBtn: document.getElementById('audio-toggle-btn'),
    cartToggleBtn: document.getElementById('cart-toggle-btn'),
    cartCountBadge: document.getElementById('cart-count-badge'),
    mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
    mobileDrawer: document.getElementById('mobile-drawer'),
    mobileDrawerClose: document.getElementById('mobile-drawer-close'),

    // Cart Drawer
    cartDrawer: document.getElementById('cart-drawer'),
    cartBackdrop: document.getElementById('cart-backdrop'),
    cartDrawerClose: document.getElementById('cart-drawer-close'),
    cartItemsContainer: document.getElementById('cart-items-container'),
    emptyCartMessage: document.getElementById('empty-cart-message'),
    cartFooter: document.getElementById('cart-footer'),
    cartSubtotal: document.getElementById('cart-subtotal'),
    cartDiscountRow: document.getElementById('cart-discount-row'),
    cartDiscount: document.getElementById('cart-discount'),
    cartTax: document.getElementById('cart-tax'),
    cartGrandTotal: document.getElementById('cart-grand-total'),
    checkoutTotalBtn: document.getElementById('checkout-total-btn'),
    promoCodeInput: document.getElementById('promo-code-input'),
    btnApplyPromo: document.getElementById('btn-apply-promo'),
    promoStatusMsg: document.getElementById('promo-status-msg'),
    btnCheckout: document.getElementById('btn-checkout'),

    // Menu
    menuItemsGrid: document.getElementById('menu-items-grid'),
    menuTabBtns: document.querySelectorAll('.menu-tab-btn'),

    // 3D Customizer
    customBrewPrice: document.getElementById('custom-brew-price'),
    btnAddCustomToCart: document.getElementById('btn-add-custom-to-cart'),
    barAroma: document.getElementById('bar-aroma'),
    barSweetness: document.getElementById('bar-sweetness'),
    barAcidity: document.getElementById('bar-acidity'),
    barBody: document.getElementById('bar-body'),
    radarFlavorText: document.getElementById('radar-flavor-text'),

    // Roast Slider
    roastSlider: document.getElementById('roast-slider'),
    roastNameBadge: document.getElementById('roast-name-badge'),
    roastColorPreview: document.getElementById('roast-color-preview'),
    roastHeadline: document.getElementById('roast-headline'),
    roastDescription: document.getElementById('roast-description'),

    // Reservation Form
    reservationForm: document.getElementById('reservation-form'),
    resDate: document.getElementById('res-date'),

    // Newsletter Form
    newsletterForm: document.getElementById('newsletter-form'),
    newsletterEmail: document.getElementById('newsletter-email'),
    newsletterFeedback: document.getElementById('newsletter-feedback'),

    // Modal & Toast
    dialogModal: document.getElementById('dialog-modal'),
    modalIcon: document.getElementById('modal-icon'),
    modalTitle: document.getElementById('modal-title'),
    modalMessage: document.getElementById('modal-message'),
    modalDetails: document.getElementById('modal-details'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    toastContainer: document.getElementById('toast-container')
  };

  /* ==========================================================================
     INIT & BOOTSTRAP
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initAudioControls();
    initMobileNavigation();
    initCartDrawer();
    initMenuRenderer();
    initCustomizerSync();
    initRoastSlider();
    initReservationForm();
    initNewsletter();
    initModalHandlers();

    // Default reservation date to tomorrow
    if (elements.resDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      elements.resDate.value = tomorrow.toISOString().split('T')[0];
      elements.resDate.min = new Date().toISOString().split('T')[0];
    }
  });

  /* ==========================================================================
     AUDIO SYNTHESIZER CONTROLS
     ========================================================================== */
  function initAudioControls() {
    if (!elements.audioToggleBtn) return;

    elements.audioToggleBtn.addEventListener('click', () => {
      if (window.cafeAudio) {
        const isPlaying = window.cafeAudio.toggle();
        elements.audioToggleBtn.classList.toggle('playing', isPlaying);
        if (isPlaying) {
          showToast('Playing Vinyl & Coffeehouse Jazz Soundscape', 'fa-music');
        } else {
          showToast('Soundscape Muted', 'fa-volume-xmark');
        }
      }
    });
  }

  /* ==========================================================================
     MOBILE NAVIGATION
     ========================================================================== */
  function initMobileNavigation() {
    if (!elements.mobileMenuToggle || !elements.mobileDrawer) return;

    const openDrawer = () => {
      elements.mobileDrawer.classList.add('open');
      elements.mobileDrawer.setAttribute('aria-hidden', 'false');
      elements.mobileMenuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      elements.mobileDrawer.classList.remove('open');
      elements.mobileDrawer.setAttribute('aria-hidden', 'true');
      elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    elements.mobileMenuToggle.addEventListener('click', openDrawer);
    if (elements.mobileDrawerClose) elements.mobileDrawerClose.addEventListener('click', closeDrawer);

    // Close on backdrop click
    const backdrop = elements.mobileDrawer.querySelector('.mobile-drawer-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    // Close on any link click
    const mobileLinks = elements.mobileDrawer.querySelectorAll('.mobile-nav-link, .btn');
    mobileLinks.forEach(link => link.addEventListener('click', closeDrawer));
  }

  /* ==========================================================================
     MENU RENDERING & FILTERING
     ========================================================================== */
  function initMenuRenderer() {
    if (!elements.menuItemsGrid || typeof MENU_DATA === 'undefined') return;

    renderMenuItems('all');

    elements.menuTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.menuTabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const category = btn.getAttribute('data-category');
        renderMenuItems(category);
      });
    });
  }

  function renderMenuItems(category = 'all') {
    elements.menuItemsGrid.innerHTML = '';

    const filtered = category === 'all'
      ? MENU_DATA
      : MENU_DATA.filter(item => item.category === category);

    filtered.forEach(item => {
      const card = document.createElement('article');
      card.className = 'menu-card';
      card.setAttribute('data-id', item.id);

      const tagsHtml = item.tags
        .map(t => `<span class="diet-tag ${t === 'Signature' ? 'signature' : ''}">${t}</span>`)
        .join('');

      card.innerHTML = `
        <div class="menu-card-header">
          <h3 class="menu-item-title">${item.name}</h3>
          <span class="menu-item-price">$${item.price.toFixed(2)}</span>
        </div>
        <p class="menu-item-desc">${item.description}</p>
        <div class="menu-card-tags">${tagsHtml}</div>
        <div class="menu-card-footer">
          <span class="menu-origin-note">${item.originNote}</span>
          <button class="btn-add-tray" data-id="${item.id}" aria-label="Add ${item.name} to tray">
            <i class="fa-solid fa-plus"></i> Add
          </button>
        </div>
      `;

      // Event Listener for Adding to Tray
      const addBtn = card.querySelector('.btn-add-tray');
      addBtn.addEventListener('click', () => {
        addItemToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          mods: item.originNote.replace(/&bull;/g, '•')
        });
        showToast(`Added ${item.name} to tray`, 'fa-mug-saucer');
      });

      elements.menuItemsGrid.appendChild(card);
    });

    if (typeof gsap !== 'undefined') {
      gsap.from('.menu-card', {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  }

  /* ==========================================================================
     3D BREW LAB CUSTOMIZER CALCULATION & SYNC
     ========================================================================== */
  function initCustomizerSync() {
    window.updateCustomizerSummary = updateCustomizerSummary;

    // Origin Selector Pills
    const originPills = document.querySelectorAll('.origin-pill');
    originPills.forEach(pill => {
      pill.addEventListener('click', () => {
        originPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        state.customDrink.origin = pill.getAttribute('data-origin');
        state.customDrink.originName = pill.querySelector('.pill-title').textContent;
        const notes = pill.getAttribute('data-notes');
        const hintEl = document.getElementById('selected-origin-name');
        if (hintEl) hintEl.textContent = `${state.customDrink.originName} – ${notes}`;

        updateCustomizerSummary();
      });
    });

    // Milk Choice Radio Buttons
    const milkRadios = document.querySelectorAll('input[name="milk-choice"]');
    milkRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        state.customDrink.milk = radio.value;
        state.customDrink.milkName = radio.value === 'oat'
          ? 'Organic Oat Microfoam'
          : 'A2 Whole Milk';
        updateCustomizerSummary();
      });
    });

    // Addon Checkboxes
    const addonChecks = [document.getElementById('addon-cinnamon'), document.getElementById('addon-vanilla')];
    addonChecks.forEach(cb => {
      if (cb) {
        cb.addEventListener('change', updateCustomizerSummary);
      }
    });

    // Add Customized Drink to Tray Button
    if (elements.btnAddCustomToCart) {
      elements.btnAddCustomToCart.addEventListener('click', () => {
        const drink = state.customDrink;
        const price = calculateCustomPrice();

        const activeVesselBtn = document.querySelector('.vessel-btn.active');
        const drinkTitle = activeVesselBtn ? activeVesselBtn.getAttribute('data-drink') : 'Bespoke Brew';

        const modsList = [
          drink.vesselName,
          drink.glazeName,
          drink.originName,
          drink.milkName
        ];

        if (document.getElementById('addon-cinnamon')?.checked) modsList.push('Ceylon Cinnamon & Gold');
        if (document.getElementById('addon-vanilla')?.checked) modsList.push('Bourbon Vanilla Bean');

        addItemToCart({
          id: `custom-${Date.now()}`,
          name: drinkTitle,
          price: price,
          mods: modsList.join(' • ')
        });

        showToast(`Added ${drinkTitle} to tray!`, 'fa-wand-magic-sparkles');
        openCartDrawer();
      });
    }

    updateCustomizerSummary();
  }

  function calculateCustomPrice() {
    let price = 6.50; // base price

    // Vessel adjustment
    const activeVessel = document.querySelector('.vessel-btn.active')?.getAttribute('data-vessel');
    if (activeVessel === 'espresso') price = 5.75;
    else if (activeVessel === 'coldbrew') price = 7.75;
    else if (activeVessel === 'matcha') price = 8.50;

    // Origin surcharge
    const activeOrigin = document.querySelector('.origin-pill.active');
    if (activeOrigin) {
      price += parseFloat(activeOrigin.getAttribute('data-price') || 0);
    }

    // Addons
    if (document.getElementById('addon-cinnamon')?.checked) price += 0.75;
    if (document.getElementById('addon-vanilla')?.checked) price += 1.00;

    return price;
  }

  function updateCustomizerSummary() {
    const price = calculateCustomPrice();
    if (elements.customBrewPrice) {
      elements.customBrewPrice.textContent = `$${price.toFixed(2)}`;
    }

    // Calculate Dynamic Sensory Radar based on origin & vessel
    let aroma = 92;
    let sweetness = 80;
    let acidity = 75;
    let body = 85;
    let flavorHeadline = 'Floral, Jasmine & Honey Peach finish';

    const origin = document.querySelector('.origin-pill.active')?.getAttribute('data-origin');
    if (origin === 'colombia') {
      aroma = 94;
      sweetness = 90;
      acidity = 82;
      body = 86;
      flavorHeadline = 'Cacao Nib, Red Currant & Brown Butter sweetness';
    } else if (origin === 'sumatra') {
      aroma = 88;
      sweetness = 72;
      acidity = 55;
      body = 96;
      flavorHeadline = 'Heavy dark chocolate, molasses & cedar complexity';
    }

    if (elements.barAroma) elements.barAroma.style.width = `${aroma}%`;
    if (elements.barSweetness) elements.barSweetness.style.width = `${sweetness}%`;
    if (elements.barAcidity) elements.barAcidity.style.width = `${acidity}%`;
    if (elements.barBody) elements.barBody.style.width = `${body}%`;
    if (elements.radarFlavorText) elements.radarFlavorText.textContent = flavorHeadline;
  }

  /* ==========================================================================
     INTERACTIVE ROAST MATRIX SLIDER
     ========================================================================== */
  function initRoastSlider() {
    if (!elements.roastSlider) return;

    const ROAST_LEVELS = [
      {
        name: 'Light Roast (Cinnamon)',
        color: '#c49a6c',
        headline: 'Cinnamon Roast – High Brightness & Wild Florals',
        desc: 'Dropped right as first crack initiates. Displays crisp citric acidity, delicate jasmine tea notes, and raw floral sweetness.'
      },
      {
        name: 'Medium-Light (City+)',
        color: '#8b5a2b',
        headline: 'City+ Roast – Peak Terroir & Harmonious Balance',
        desc: 'Caramelizes natural sugars while preserving floral jasmine aromatics and bright peach acidity. Optimal for pour-over and modern espresso.'
      },
      {
        name: 'Medium-Dark (Full City)',
        color: '#5c3818',
        headline: 'Full City Roast – Rich Crema & Cacao Depth',
        desc: 'Second crack active. Accents roasted pecan, dark chocolate ganache, and syrupy crema body with gentle muted acidity.'
      },
      {
        name: 'French Dark Roast',
        color: '#2b180d',
        headline: 'French Dark Roast – Intense Smokiness & Roasted Cacao',
        desc: 'Oils migrate to the bean surface. Delivers heavy body, smoky cedar notes, bittersweet dark cocoa, and lingering boldness.'
      }
    ];

    elements.roastSlider.addEventListener('input', (e) => {
      const idx = parseInt(e.target.value, 10) - 1;
      const data = ROAST_LEVELS[idx];
      if (!data) return;

      if (elements.roastNameBadge) elements.roastNameBadge.textContent = data.name;
      if (elements.roastColorPreview) elements.roastColorPreview.style.backgroundColor = data.color;
      if (elements.roastHeadline) elements.roastHeadline.textContent = data.headline;
      if (elements.roastDescription) elements.roastDescription.textContent = data.desc;
    });
  }

  /* ==========================================================================
     ORDER TRAY / CART DRAWER LOGIC
     ========================================================================== */
  function initCartDrawer() {
    if (!elements.cartToggleBtn || !elements.cartDrawer) return;

    elements.cartToggleBtn.addEventListener('click', openCartDrawer);
    if (elements.cartDrawerClose) elements.cartDrawerClose.addEventListener('click', closeCartDrawer);
    if (elements.cartBackdrop) elements.cartBackdrop.addEventListener('click', closeCartDrawer);

    // Close on link click inside empty state
    const emptyLinks = elements.cartDrawer.querySelectorAll('.close-cart-link');
    emptyLinks.forEach(l => l.addEventListener('click', closeCartDrawer));

    // Promo Code Application
    if (elements.btnApplyPromo && elements.promoCodeInput) {
      elements.btnApplyPromo.addEventListener('click', applyPromoCode);
    }

    // Checkout Button
    if (elements.btnCheckout) {
      elements.btnCheckout.addEventListener('click', handleCheckout);
    }

    // Keyboard ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCartDrawer();
        closeModal();
      }
    });
  }

  function openCartDrawer() {
    elements.cartDrawer.classList.add('open');
    elements.cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    elements.cartDrawer.classList.remove('open');
    elements.cartDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function addItemToCart(item) {
    const existing = state.cart.find(i => i.id === item.id && i.mods === item.mods);
    if (existing) {
      existing.quantity += 1;
    } else {
      state.cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        mods: item.mods || '',
        quantity: 1
      });
    }

    renderCart();
  }

  function renderCart() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (elements.cartCountBadge) elements.cartCountBadge.textContent = totalCount;

    if (state.cart.length === 0) {
      if (elements.emptyCartMessage) elements.emptyCartMessage.style.display = 'flex';
      if (elements.cartFooter) elements.cartFooter.style.display = 'none';
      const itemCards = elements.cartItemsContainer.querySelectorAll('.cart-item-card');
      itemCards.forEach(c => c.remove());
      return;
    }

    if (elements.emptyCartMessage) elements.emptyCartMessage.style.display = 'none';
    if (elements.cartFooter) elements.cartFooter.style.display = 'flex';

    // Clear and re-render item list
    const existingCards = elements.cartItemsContainer.querySelectorAll('.cart-item-card');
    existingCards.forEach(c => c.remove());

    state.cart.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'cart-item-card';
      card.innerHTML = `
        <div class="cart-item-top">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
        ${item.mods ? `<span class="cart-item-mods">${item.mods}</span>` : ''}
        <div class="cart-item-actions">
          <div class="qty-control">
            <button class="qty-btn btn-dec" data-index="${index}" aria-label="Decrease quantity">&minus;</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn btn-inc" data-index="${index}" aria-label="Increase quantity">&plus;</button>
          </div>
          <button class="btn-remove-item" data-index="${index}">Remove</button>
        </div>
      `;

      card.querySelector('.btn-inc').addEventListener('click', () => {
        state.cart[index].quantity += 1;
        renderCart();
      });

      card.querySelector('.btn-dec').addEventListener('click', () => {
        if (state.cart[index].quantity > 1) {
          state.cart[index].quantity -= 1;
        } else {
          state.cart.splice(index, 1);
        }
        renderCart();
      });

      card.querySelector('.btn-remove-item').addEventListener('click', () => {
        state.cart.splice(index, 1);
        renderCart();
      });

      elements.cartItemsContainer.appendChild(card);
    });

    calculateCartTotals();
  }

  function applyPromoCode() {
    const code = elements.promoCodeInput.value.trim().toUpperCase();
    if (!code) return;

    if (code === 'AURA20' || code === 'COFFEEVIBES' || code === 'SPECIALTY') {
      state.promoCode = code;
      state.discountRate = 0.20;
      elements.promoStatusMsg.className = 'promo-msg success';
      elements.promoStatusMsg.textContent = 'Courtesy code applied: 20% discount granted!';
    } else {
      elements.promoStatusMsg.className = 'promo-msg error';
      elements.promoStatusMsg.textContent = 'Invalid code. Try "AURA20" for 20% off.';
    }

    calculateCartTotals();
  }

  function calculateCartTotals() {
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal * state.discountRate;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * 0.085;
    const grandTotal = taxableAmount + tax;

    if (elements.cartSubtotal) elements.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;

    if (state.discountRate > 0) {
      if (elements.cartDiscountRow) elements.cartDiscountRow.style.display = 'flex';
      if (elements.cartDiscount) elements.cartDiscount.textContent = `-$${discount.toFixed(2)}`;
    } else {
      if (elements.cartDiscountRow) elements.cartDiscountRow.style.display = 'none';
    }

    if (elements.cartTax) elements.cartTax.textContent = `$${tax.toFixed(2)}`;
    if (elements.cartGrandTotal) elements.cartGrandTotal.textContent = `$${grandTotal.toFixed(2)}`;
    if (elements.checkoutTotalBtn) elements.checkoutTotalBtn.textContent = grandTotal.toFixed(2);
  }

  function handleCheckout() {
    if (state.cart.length === 0) return;

    const total = elements.cartGrandTotal.textContent;
    const orderNum = 'LA-' + Math.floor(100000 + Math.random() * 900000);

    const itemsSummary = state.cart
      .map(item => `<div>• ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})</div>`)
      .join('');

    showModal({
      icon: 'fa-solid fa-mug-hot',
      title: 'Order Dispatched to Barista Counter',
      message: 'Your artisanal coffee and pastry selection is being prepared with surgical precision.',
      detailsHtml: `
        <div><strong>Order Reference:</strong> ${orderNum}</div>
        <div><strong>Estimated Preparation:</strong> 6 to 9 minutes</div>
        <div><strong>Pickup Counter:</strong> North Espresso Bar (Station #2)</div>
        <div style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed rgba(255,255,255,0.1);">
          <strong>Items in Order:</strong>
          ${itemsSummary}
        </div>
        <div style="margin-top: 0.5rem; font-size: 1rem; color: #d4af37;">
          <strong>Total Paid: ${total}</strong>
        </div>
      `
    });

    // Clear Cart
    state.cart = [];
    renderCart();
    closeCartDrawer();
  }

  /* ==========================================================================
     TABLE RESERVATION FORM
     ========================================================================== */
  function initReservationForm() {
    if (!elements.reservationForm) return;

    elements.reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('res-name').value.trim();
      const email = document.getElementById('res-email').value.trim();
      const phone = document.getElementById('res-phone').value.trim();
      const guests = document.getElementById('res-guests').value;
      const date = elements.resDate.value;
      const time = document.getElementById('res-time').value;
      const zoneRadio = document.querySelector('input[name="res-zone"]:checked');
      const zone = zoneRadio ? zoneRadio.value : 'Garden Patio';
      const notes = document.getElementById('res-notes').value.trim();

      if (!name || !email || !phone || !date) {
        showToast('Please fill out all required fields.', 'fa-circle-exclamation');
        return;
      }

      const resCode = 'RES-' + Math.floor(1000 + Math.random() * 9000);

      showModal({
        icon: 'fa-solid fa-calendar-check',
        title: 'Table Reserved Successfully',
        message: `We look forward to welcoming you to L'AURA Atelier, ${name}.`,
        detailsHtml: `
          <div><strong>Confirmation Code:</strong> ${resCode}</div>
          <div><strong>Guest Name:</strong> ${name}</div>
          <div><strong>Party Size:</strong> ${guests}</div>
          <div><strong>Date & Time:</strong> ${date} at ${time}</div>
          <div><strong>Atmosphere Zone:</strong> ${zone}</div>
          ${notes ? `<div><strong>Special Request:</strong> "${notes}"</div>` : ''}
          <div style="margin-top: 0.5rem; color: #86efac; font-size: 0.8rem;">
            <i class="fa-solid fa-envelope-circle-check"></i> Confirmation sent to ${email}
          </div>
        `
      });

      elements.reservationForm.reset();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      elements.resDate.value = tomorrow.toISOString().split('T')[0];
    });
  }

  /* ==========================================================================
     NEWSLETTER SUBSCRIPTION
     ========================================================================== */
  function initNewsletter() {
    if (!elements.newsletterForm) return;

    elements.newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = elements.newsletterEmail.value.trim();
      if (!email) return;

      elements.newsletterFeedback.textContent = `Thank you! Invitation sent to ${email}`;
      elements.newsletterEmail.value = '';
      showToast('Subscribed to Roastery Gazette', 'fa-envelope-open');

      setTimeout(() => {
        elements.newsletterFeedback.textContent = '';
      }, 5000);
    });
  }

  /* ==========================================================================
     CUSTOM MODAL & TOAST DIALOGS
     ========================================================================== */
  function initModalHandlers() {
    if (elements.modalCloseBtn) elements.modalCloseBtn.addEventListener('click', closeModal);
    const backdrop = elements.dialogModal?.querySelector('.modal-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeModal);
  }

  function showModal({ icon, title, message, detailsHtml }) {
    if (!elements.dialogModal) return;

    if (elements.modalIcon) elements.modalIcon.innerHTML = `<i class="${icon}"></i>`;
    if (elements.modalTitle) elements.modalTitle.textContent = title;
    if (elements.modalMessage) elements.modalMessage.textContent = message;
    if (elements.modalDetails) elements.modalDetails.innerHTML = detailsHtml;

    elements.dialogModal.classList.add('open');
    elements.dialogModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!elements.dialogModal) return;
    elements.dialogModal.classList.remove('open');
    elements.dialogModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showToast(message, icon = 'fa-check') {
    if (!elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

})();
