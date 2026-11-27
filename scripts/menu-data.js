/* ==========================================================================
   L'AURA CAFÉ — CURATED MENU DATA
   Artisanal Roastery, Signatures, Cold Brews & Boulangerie
   ========================================================================== */

const MENU_DATA = [
  // --- SIGNATURES & ELIXIRS ---
  {
    id: "sig-gold-latte",
    name: "L'AURA 24K Imperial Latte",
    category: "signatures",
    price: 9.50,
    tags: ["Signature", "House Blend", "Organic"],
    originNote: "Ethiopia Guji Natural &bull; 24K Edible Gold Leaf",
    description: "Double extraction of heirloom Gesha, steamed organic oat milk, real Bourbon vanilla bean, topped with delicate flakes of 24K gold leaf."
  },
  {
    id: "sig-smoked-kyoto",
    name: "Smoked Kyoto Slow Drip",
    category: "signatures",
    price: 8.75,
    tags: ["Signature", "Cold Crafted", "Single Origin"],
    originNote: "Colombia Huila &bull; 16-Hour Ice Extraction",
    description: "Extracted one drop per second through Japanese glass towers over charred oak chips. Served with a hand-carved ice sphere."
  },
  {
    id: "sig-cardamom-rose",
    name: "Persian Cardamom & Rose Cortado",
    category: "signatures",
    price: 7.75,
    tags: ["Signature", "Spiced", "Floral"],
    originNote: "Guatemala Antigua &bull; Organic Damascus Rose",
    description: "Equal parts espresso and textured milk infused with freshly crushed green cardamom pods and organic Damascus rose water distillate."
  },
  {
    id: "sig-nitro-cloud",
    name: "Velvet Nitro Crema Cloud",
    category: "signatures",
    price: 8.25,
    tags: ["Signature", "Nitro Cold", "Dairy Free"],
    originNote: "Sumatra Lintong &bull; Nitrogen Infusion",
    description: "Keg-conditioned cold brew charged with micro-nitrogen bubbles, producing a cascading Guinness-like head of velvety silk crema."
  },

  // --- ARTISAN ESPRESSO ---
  {
    id: "esp-gesha-shot",
    name: "Single-Estate Gesha Ristretto",
    category: "espresso",
    price: 6.50,
    tags: ["Specialty", "Direct-Trade", "Single-Origin"],
    originNote: "Panama Boquete &bull; Lot #19 &bull; 94.5 Cupping Score",
    description: "A tight 1:1.5 brew ratio maximizing bright bergamot acidity, ripe white peach nectar, and lingering elderflower sweetness."
  },
  {
    id: "esp-flat-white",
    name: "Atelier Velvet Flat White",
    category: "espresso",
    price: 6.75,
    tags: ["Classic", "Popular"],
    originNote: "House Master Blend (Ethiopia & Colombia)",
    description: "Double ristretto foundation folded under a glossy, micro-textured layer of steamed whole milk with delicate tulip latte art."
  },
  {
    id: "esp-piccolo",
    name: "Piccolo Demitasse Latte",
    category: "espresso",
    price: 5.50,
    tags: ["Classic", "Intense"],
    originNote: "Brazil Cerrado Natural &bull; Low Acidity",
    description: "Single espresso cut with 3oz of silky microfoam in an unglazed ceramic demitasse, balancing roasted hazelnut and dark chocolate."
  },
  {
    id: "esp-macchiato",
    name: "Macchiato Tradizionale",
    category: "espresso",
    price: 5.25,
    tags: ["Classic", "Italian Style"],
    originNote: "Ethiopia Guji &bull; Light Roast",
    description: "A bold double shot of espresso gently marked ('stained') with a single velvety dollop of dense microfoam."
  },

  // --- COLD BREW & TONICS ---
  {
    id: "cold-espresso-tonic",
    name: "Botanical Espresso Tonic",
    category: "cold",
    price: 7.25,
    tags: ["Refreshing", "Botanical", "Vegan"],
    originNote: "Kenya Nyeri &bull; Mediterranean Tonic",
    description: "Chilled espresso float layered over artisan fever-tree tonic water, fresh rosemary sprig, and a flamed grapefruit peel."
  },
  {
    id: "cold-cascara-spritz",
    name: "Sparkling Cascara Cherry Spritz",
    category: "cold",
    price: 6.50,
    tags: ["Antioxidant", "Low Caffeine", "Vegan"],
    originNote: "Sun-Dried Coffee Cherries &bull; Sicilian Lemon",
    description: "Brewed coffee cherry cascara steeped cold with wild hibiscus, Meyer lemon juice, sparkling spring water, and mint."
  },
  {
    id: "cold-vanilla-cloud",
    name: "Bourbon Vanilla Cold Foam",
    category: "cold",
    price: 7.50,
    tags: ["Indulgent", "House Favorite"],
    originNote: "Colombia Huila &bull; Madagascar Vanilla",
    description: "Signature cold brew poured over cracked crystal ice, crowned with a thick layer of whipped vanilla sweet cream."
  },
  {
    id: "cold-matcha-cloud",
    name: "Kyoto Ceremonial Uji Matcha Tonic",
    category: "cold",
    price: 8.50,
    tags: ["Ceremonial Grade", "Antioxidant", "Vegan"],
    originNote: "Single-Estate Uji, Kyoto &bull; First Flush Harvest",
    description: "Whisked master-grade ceremonial matcha layered gently over sparkling tonic and yuzu citrus purée."
  },

  // --- BOULANGERIE & SWEETS ---
  {
    id: "pastry-pistachio-escargot",
    name: "Pistachio & Cardamom Escargot",
    category: "pastry",
    price: 6.50,
    tags: ["Baked Daily", "AOP Butter"],
    originNote: "Bronte Pistachios &bull; French Isigny Butter",
    description: "Spiral laminated croissant dough rolled with pure Sicilian pistachio frangipane and freshly crushed green cardamom."
  },
  {
    id: "pastry-pain-chocolat",
    name: "Valrhona Triple Pain au Chocolat",
    category: "pastry",
    price: 5.75,
    tags: ["Baked Daily", "French Classic"],
    originNote: "Valrhona 70% Guanaja Dark Chocolate Batons",
    description: "Flaky honeycomb layers of 48-hour fermented pastry wrapped around three generous batons of French grand cru chocolate."
  },
  {
    id: "pastry-kouign-amann",
    name: "Breton Kouign-Amann Caramelisé",
    category: "pastry",
    price: 6.25,
    tags: ["Caramelized", "Signature"],
    originNote: "Guérande Sea Salt &bull; Charentes Butter",
    description: "Breton cake with caramelized sugar crust on the exterior and tender buttery pastry spirals within."
  },
  {
    id: "pastry-basque-cheesecake",
    name: "Burnt Basque Vanilla Cheesecake",
    category: "pastry",
    price: 8.00,
    tags: ["Gluten-Free", "House Made"],
    originNote: "San Sebastián Style &bull; Tahitian Vanilla",
    description: "Deep caramel caramelized exterior contrasting with an ultra-creamy, molten custard interior. Naturally gluten-free."
  },

  // --- GOURMET BRUNCH ---
  {
    id: "brunch-mushroom-toast",
    name: "Wild Morel & Chanterelle Tartine",
    category: "brunch",
    price: 16.50,
    tags: ["Savory", "Vegetarian", "Chef Special"],
    originNote: "Wild Foraged Mushrooms &bull; 36hr Sourdough",
    description: "Pan-roasted wild forest morels on grilled country levain with black garlic crème, thyme blossom, and shaved pecorino."
  },
  {
    id: "brunch-scramble-brioche",
    name: "Truffled Soft Scramble & Brioche",
    category: "brunch",
    price: 18.00,
    tags: ["Savory", "Indulgent"],
    originNote: "Pasture-Raised Eggs &bull; Perigord Black Truffle",
    description: "Slow-cooked velvety eggs finished with cultured butter and French black truffle butter on toasted Japanese milk brioche."
  },
  {
    id: "brunch-gravlax-croissant",
    name: "Citrus Cured Gravlax Croissant",
    category: "brunch",
    price: 17.50,
    tags: ["Savory", "Seafood"],
    originNote: "Loch Duart Salmon &bull; House Croissant",
    description: "House beetroot-and-gin cured salmon, lemon-dill whipped mascarpone, pickled shallots, and salted capers."
  },
  {
    id: "brunch-avocado-tartine",
    name: "Hass Avocado & Egyptian Dukkah Tartine",
    category: "brunch",
    price: 14.50,
    tags: ["Vegan", "Organic"],
    originNote: "California Haas &bull; Toasted Sesame Dukkah",
    description: "Smashed ripe avocado on seeded Danish rye, topped with toasted pistachio dukkah, watermelon radish, and cold-pressed olive oil."
  }
];

if (typeof module !== 'undefined') {
  module.exports = { MENU_DATA };
}
