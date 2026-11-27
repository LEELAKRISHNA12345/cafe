# ☕ L'AURA Atelier & Café — 3D Artisanal Coffee Website

A professional, aesthetic, and creative website for a luxury specialty coffee roastery and sensory lounge, featuring **interactive 3D WebGL models**, real-time drink customization, ambient acoustic soundscapes, and full ordering & table reservation capabilities.

---

## ✨ Features & Highlights

### 1. 🎨 Creative & Professional Luxury Aesthetic
- **Visual Design**: Obsidian espresso dark tones (`#0c0a09`), champagne gold accents (`#d4af37`), warm crema highlights (`#f7eed8`), and subtle frosted glassmorphism.
- **Typography**: Editorial display serif (*Playfair Display* & *Cinzel*) combined with modern readability (*Plus Jakarta Sans*).
- **Responsive Layout**: Designed for mobile, tablet, laptop, and ultra-wide displays.

### 2. 🧊 Interactive 3D WebGL Showcase (Three.js)
- **Hero 3D Coffee Cup Experience**:
  - Sculpted ceramic cup, saucer, and ergonomic handle with PBR physical materials.
  - Realistic coffee liquid surface with procedural latte art / crema swirl texture.
  - Dynamic **sinusoidal rising steam particle system**.
  - **Orbiting roasted coffee beans** with realistic creases and physics-inspired bobbing.
  - Multi-point studio lighting with camera perspective presets (*Perspective*, *Top-Down*, *Macro Rim*).
  - 360° drag-to-rotate & scroll-to-zoom controls.

### 3. 🧪 3D Bespoke Brew Lab (Drink Customizer)
- **Switchable 3D Vessels**:
  - *Artisanal Ceramic Cup & Saucer* (Flat White, Cortado, Latte)
  - *Crystal Fluted Highball Tumbler* (Kyoto Cold Drip with transparent refractive glass & floating ice cubes)
  - *Matte Demitasse* (Double Ristretto / Espresso)
  - *Kyoto Clay Chawan Bowl* (Ceremonial Uji Matcha)
- **Ceramic Glaze Finishes**: Noir Obsidian, Carrara Silk, Tuscan Terracotta, Imperial Emerald, and 24K Gold Trim.
- **Dynamic Sensory Gauge**: Real-time calculated cupping notes (Aroma, Sweetness, Acidity, Body).
- **Interactive Add-to-Tray**: Direct integration into the order tray.

### 4. 🎵 Built-In Ambient Cafe Soundscape (Web Audio API)
- Zero external MP3 downloads required.
- Generates warm analog vinyl dust crackle and cozy Rhodes electric piano / jazz chord progressions directly via the browser's Web Audio API.
- Toggle button with animated audio equalizer waves in the navigation bar.

### 5. 📖 Curated Gastronomy Menu & Tray Drawer
- Filterable categories: *All Offerings*, *Signatures & Elixirs*, *Artisan Espresso*, *Cold Brew & Tonics*, *Boulangerie & Sweets*, *Gourmet Brunch*.
- Slide-over order tray with quantity modifiers, tax calculation, and promo code support (try promo code: `AURA20` for 20% off).
- Simulated checkout with barista preparation ticket and order reference.

### 6. 📅 Private Sanctuary Table Reservation
- Interactive reservation system with date picker, party size, time slots, and atmospheric zone selection (*Garden Patio*, *Roaster Bar*, *Velvet Library*).
- Instant confirmation pass with reference code and guest details.

### 7. ☕ Interactive Roastery & Roast Degree Matrix
- Interactive range slider from *Cinnamon* ➔ *City+* ➔ *Full City* ➔ *French Dark* with live visual bean color shift and cupping characteristics.

---

## 🚀 How to Run

### Method 1: Python Local Server (Recommended)
Open a terminal in this project directory and run:
```bash
python server.py
```
This automatically starts a local HTTP server at `http://localhost:8080` and opens it in your default browser.

### Method 2: Node.js / npx
```bash
npx serve .
```

### Method 3: Direct Browser Launch
Simply double-click `index.html` or open it with your browser of choice (Chrome, Edge, Safari, Firefox).
