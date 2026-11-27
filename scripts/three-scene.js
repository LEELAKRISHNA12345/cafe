/* ==========================================================================
   L'AURA CAFÉ — THREE.JS 3D ENGINE
   Photorealistic 3D Coffee Vessels, Steam Particle Physics,
   Floating Roasted Beans & Real-time Material Customizer
   ========================================================================== */

(function () {
  'use strict';

  // Ensure THREE is present or wait for it
  window.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not yet loaded. Initializing canvas fallback.');
      initCanvasFallback();
      return;
    }
    initHeroScene();
    initCustomizerScene();
  });

  /* ==========================================================================
     PROCEDURAL TEXTURE GENERATORS (Crema, Latte Art & Ceramic Noise)
     ========================================================================== */

  // Generates high-res dynamic latte art texture on a 2D canvas
  function createLatteArtTexture(style = 'rosette') {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Rich Espresso Base with radial crema gradient
    const grad = ctx.createRadialGradient(512, 512, 50, 512, 512, 510);
    grad.addColorStop(0, '#5a3418');
    grad.addColorStop(0.35, '#44230d');
    grad.addColorStop(0.75, '#2e1507');
    grad.addColorStop(0.92, '#70421e'); // Crema rim
    grad.addColorStop(1, '#210e04');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle micro-foam speckles
    ctx.fillStyle = 'rgba(235, 195, 140, 0.12)';
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const r = Math.random() * 3 + 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render Latte Art
    ctx.save();
    ctx.translate(512, 512);

    if (style === 'rosette') {
      // Elegant Rosette Pattern
      ctx.fillStyle = '#fff9f0';
      ctx.shadowColor = 'rgba(120, 60, 20, 0.4)';
      ctx.shadowBlur = 12;

      // Base leaves
      for (let i = 0; i < 7; i++) {
        const yOffset = -180 + i * 55;
        const width = 140 - Math.abs(i - 3) * 22;
        ctx.beginPath();
        ctx.ellipse(0, yOffset, width, 18, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Center Stem
      ctx.beginPath();
      ctx.moveTo(0, -220);
      ctx.lineTo(0, 220);
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#fff9f0';
      ctx.lineCap = 'round';
      ctx.stroke();

      // Top Heart
      ctx.beginPath();
      ctx.moveTo(0, 210);
      ctx.bezierCurveTo(45, 170, 70, 240, 0, 280);
      ctx.bezierCurveTo(-70, 240, -45, 170, 0, 210);
      ctx.fill();
    } else if (style === 'matcha') {
      // Vibrant Matcha Green Foam swirl
      ctx.fillStyle = '#2c532b';
      ctx.fillRect(-512, -512, 1024, 1024);
      
      const matchaGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, 500);
      matchaGrad.addColorStop(0, '#589445');
      matchaGrad.addColorStop(0.5, '#3b6a2f');
      matchaGrad.addColorStop(1, '#1e3818');
      ctx.fillStyle = matchaGrad;
      ctx.fillRect(-512, -512, 1024, 1024);

      // Micro white foam ring
      ctx.strokeStyle = 'rgba(245, 255, 240, 0.4)';
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.arc(0, 0, 220, 0, Math.PI * 2);
      ctx.stroke();
    } else if (style === 'espresso') {
      // Golden Tiger Crema with rich caramel swirls
      for (let i = 0; i < 18; i++) {
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.random() * 320;
        ctx.fillStyle = 'rgba(215, 155, 75, 0.35)';
        ctx.beginPath();
        ctx.ellipse(Math.cos(angle) * rad, Math.sin(angle) * rad, 60, 25, angle, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  // Generates circular soft alpha texture for rising steam
  function createSteamParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(0.35, 'rgba(240, 230, 220, 0.25)');
    grad.addColorStop(0.7, 'rgba(200, 190, 180, 0.08)');
    grad.addColorStop(1, 'rgba(200, 190, 180, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  /* ==========================================================================
     PROCEDURAL 3D GEOMETRY BUILDERS (Vessels, Beans & Handles)
     ========================================================================== */

  // Creates a sculpted 3D Coffee Bean with center fissure
  function createCoffeeBeanMesh(material) {
    const beanGroup = new THREE.Group();

    // Bean Main Body (Ellipsoid)
    const beanGeo = new THREE.SphereGeometry(0.32, 24, 24);
    beanGeo.scale(1, 1.45, 0.65);

    // Deform vertices to create longitudinal cleft/crease
    const pos = beanGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      // Indent along front crease (z > 0 and close to x = 0)
      if (z > 0.05 && Math.abs(x) < 0.12) {
        const factor = (0.12 - Math.abs(x)) / 0.12;
        pos.setZ(i, z - factor * 0.14);
      }
    }
    beanGeo.computeVertexNormals();

    const beanMesh = new THREE.Mesh(beanGeo, material);
    beanGroup.add(beanMesh);

    return beanGroup;
  }

  // Creates an elegant Lathe Ceramic Cup with curved lip & interior
  function createCupGeometry(topRadius = 1.9, bottomRadius = 1.1, height = 2.4) {
    const points = [];
    const segments = 24;

    // Outer profile from base to rim
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(bottomRadius, 0.05));
    points.push(new THREE.Vector2(bottomRadius + 0.15, 0.35));
    points.push(new THREE.Vector2(topRadius - 0.2, height * 0.65));
    points.push(new THREE.Vector2(topRadius, height));
    
    // Rounded Lip
    points.push(new THREE.Vector2(topRadius - 0.08, height + 0.06));
    points.push(new THREE.Vector2(topRadius - 0.18, height));

    // Inner profile going down into the chamber
    points.push(new THREE.Vector2(topRadius - 0.25, height * 0.7));
    points.push(new THREE.Vector2(bottomRadius - 0.05, 0.4));
    points.push(new THREE.Vector2(0, 0.35));

    return new THREE.LatheGeometry(points, 48);
  }

  // Creates a contoured ceramic saucer with cup recess
  function createSaucerGeometry(radius = 3.2) {
    const points = [];
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(0.9, 0.04));
    points.push(new THREE.Vector2(1.2, 0.12)); // Recess rim for cup foot
    points.push(new THREE.Vector2(1.4, 0.08));
    points.push(new THREE.Vector2(radius * 0.85, 0.35));
    points.push(new THREE.Vector2(radius, 0.65)); // Curved outer lip
    points.push(new THREE.Vector2(radius - 0.05, 0.68));
    points.push(new THREE.Vector2(radius * 0.8, 0.3));
    points.push(new THREE.Vector2(1.2, 0.02));
    points.push(new THREE.Vector2(0, 0));

    return new THREE.LatheGeometry(points, 48);
  }

  // Creates an ergonomic ceramic handle connecting smoothly to cup
  function createHandleMesh(material, cupHeight = 2.4, topRadius = 1.9) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(topRadius - 0.25, cupHeight * 0.85, 0),
      new THREE.Vector3(topRadius + 1.05, cupHeight * 0.75, 0),
      new THREE.Vector3(topRadius + 1.15, cupHeight * 0.35, 0),
      new THREE.Vector3(topRadius - 0.3, cupHeight * 0.25, 0)
    ]);

    const handleGeo = new THREE.TubeGeometry(curve, 32, 0.16, 16, false);
    return new THREE.Mesh(handleGeo, material);
  }

  // Creates a Steam Particle System
  function createSteamSystem(count = 55, baseY = 2.4) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const alphas = new Float32Array(count);
    const scales = new Float32Array(count);
    const velocities = [];

    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 0.8;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = baseY + Math.random() * 2.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      alphas[i] = Math.random() * 0.5 + 0.1;
      scales[i] = Math.random() * 0.6 + 0.3;

      velocities.push({
        y: Math.random() * 0.025 + 0.015,
        swaySpeed: Math.random() * 1.5 + 0.8,
        swayOffset: Math.random() * Math.PI * 2,
        initialY: baseY
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.PointsMaterial({
      size: 1.1,
      map: createSteamParticleTexture(),
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      blending: THREE.NormalBlending,
      color: 0xffffff
    });

    const particles = new THREE.Points(geometry, material);
    particles.userData = { velocities, count, baseY };

    return particles;
  }

  /* ==========================================================================
     SCENE 1: HERO SHOWCASE 3D COFFEE CUP
     ========================================================================== */

  let heroRenderer, heroScene, heroCamera, heroControls;
  let heroCupGroup, heroSteamParticles, heroFloatingBeans = [];
  let isHeroRunning = false;

  function initHeroScene() {
    const container = document.getElementById('hero-3d-container');
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // Scene & Camera
    heroScene = new THREE.Scene();
    heroCamera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    heroCamera.position.set(0, 4.2, 7.8);

    // Renderer
    heroRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    heroRenderer.setSize(width, height);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    heroRenderer.shadowMap.enabled = true;
    heroRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    heroRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    heroRenderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(heroRenderer.domElement);

    // Orbit Controls
    if (typeof THREE.OrbitControls !== 'undefined') {
      heroControls = new THREE.OrbitControls(heroCamera, heroRenderer.domElement);
      heroControls.enableDamping = true;
      heroControls.dampingFactor = 0.05;
      heroControls.maxPolarAngle = Math.PI / 2 + 0.05; // Don't flip under table
      heroControls.minDistance = 4;
      heroControls.maxDistance = 12;
      heroControls.autoRotate = true;
      heroControls.autoRotateSpeed = 0.85;
    }

    // Studio Lighting Rig
    setupStudioLighting(heroScene);

    // Build the Cup & Saucer Assembly
    heroCupGroup = new THREE.Group();
    heroCupGroup.position.y = -0.6;

    // Ceramic Material: Rich Obsidian Noir with subtle gold-accent rim
    const ceramicMat = new THREE.MeshStandardMaterial({
      color: 0x171412,
      roughness: 0.28,
      metalness: 0.12
    });

    const cupMesh = new THREE.Mesh(createCupGeometry(1.9, 1.1, 2.3), ceramicMat);
    cupMesh.castShadow = true;
    cupMesh.receiveShadow = true;
    heroCupGroup.add(cupMesh);

    // Saucer
    const saucerMesh = new THREE.Mesh(createSaucerGeometry(3.3), ceramicMat);
    saucerMesh.position.y = -0.05;
    saucerMesh.receiveShadow = true;
    heroCupGroup.add(saucerMesh);

    // Handle
    const handleMesh = createHandleMesh(ceramicMat, 2.3, 1.9);
    handleMesh.castShadow = true;
    heroCupGroup.add(handleMesh);

    // 24K Gold Rim Accent Ring
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25
    });
    const goldRimGeo = new THREE.TorusGeometry(1.9, 0.035, 16, 64);
    goldRimGeo.rotateX(Math.PI / 2);
    const goldRimMesh = new THREE.Mesh(goldRimGeo, goldMat);
    goldRimMesh.position.y = 2.32;
    heroCupGroup.add(goldRimMesh);

    // Coffee Liquid Surface with dynamic Latte Art
    const liquidGeo = new THREE.CircleGeometry(1.72, 48);
    liquidGeo.rotateX(-Math.PI / 2);
    const latteArtTex = createLatteArtTexture('rosette');
    const liquidMat = new THREE.MeshStandardMaterial({
      map: latteArtTex,
      roughness: 0.2,
      metalness: 0.05
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.y = 2.12;
    heroCupGroup.add(liquidMesh);

    // Rising Steam System
    heroSteamParticles = createSteamSystem(55, 2.2);
    heroCupGroup.add(heroSteamParticles);

    // Floating Roasted Coffee Beans with orbit physics
    const beanMat = new THREE.MeshStandardMaterial({
      color: 0x24150c,
      roughness: 0.42,
      metalness: 0.08
    });

    for (let i = 0; i < 7; i++) {
      const bean = createCoffeeBeanMesh(beanMat);
      const angle = (i / 7) * Math.PI * 2;
      const radius = 3.6 + Math.random() * 0.8;
      bean.position.set(
        Math.cos(angle) * radius,
        1.2 + (Math.random() - 0.5) * 1.5,
        Math.sin(angle) * radius
      );
      bean.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      bean.userData = {
        baseRadius: radius,
        baseAngle: angle,
        orbitSpeed: 0.006 + Math.random() * 0.004,
        bobSpeed: 1.2 + Math.random() * 0.8,
        bobHeight: 0.25 + Math.random() * 0.2,
        initialY: bean.position.y
      };
      heroFloatingBeans.push(bean);
      heroCupGroup.add(bean);
    }

    heroScene.add(heroCupGroup);

    // Setup Preset View Buttons
    setupHeroViewPresets();

    // Start Animation Loop
    isHeroRunning = true;
    animateHero();

    // Resize Handler
    window.addEventListener('resize', onHeroResize);
  }

  function setupStudioLighting(scene) {
    // Ambient Warm Glow
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.7);
    scene.add(ambientLight);

    // Key Light: Warm Golden Studio Spotlight
    const keyLight = new THREE.DirectionalLight(0xffecd0, 2.2);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Back / Rim Light: Cool Crisp Azure
    const rimLight = new THREE.DirectionalLight(0xa5c4f5, 1.4);
    rimLight.position.set(-6, 6, -5);
    scene.add(rimLight);

    // Crema Specular Point Light directly above cup
    const pointLight = new THREE.PointLight(0xffc988, 1.8, 8);
    pointLight.position.set(0, 4.5, 0);
    scene.add(pointLight);
  }

  function setupHeroViewPresets() {
    const buttons = document.querySelectorAll('.preset-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const viewType = btn.getAttribute('data-view');
        if (typeof gsap !== 'undefined') {
          if (viewType === 'top') {
            gsap.to(heroCamera.position, { x: 0, y: 7.5, z: 0.1, duration: 1.2, ease: 'power2.inOut' });
          } else if (viewType === 'macro') {
            gsap.to(heroCamera.position, { x: 1.8, y: 2.2, z: 3.2, duration: 1.2, ease: 'power2.inOut' });
          } else {
            gsap.to(heroCamera.position, { x: 0, y: 4.2, z: 7.8, duration: 1.2, ease: 'power2.inOut' });
          }
        } else {
          if (viewType === 'top') heroCamera.position.set(0, 7.5, 0.1);
          else if (viewType === 'macro') heroCamera.position.set(1.8, 2.2, 3.2);
          else heroCamera.position.set(0, 4.2, 7.8);
        }
      });
    });
  }

  function onHeroResize() {
    const container = document.getElementById('hero-3d-container');
    if (!container || !heroRenderer || !heroCamera) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    heroCamera.aspect = width / height;
    heroCamera.updateProjectionMatrix();
    heroRenderer.setSize(width, height);
  }

  let clock = new THREE.Clock();

  function animateHero() {
    if (!isHeroRunning) return;
    requestAnimationFrame(animateHero);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Update Orbit Controls
    if (heroControls) {
      heroControls.update();
    }

    // Animate Rising Steam
    if (heroSteamParticles) {
      const pos = heroSteamParticles.geometry.attributes.position;
      const vels = heroSteamParticles.userData.velocities;
      const count = heroSteamParticles.userData.count;
      const baseY = heroSteamParticles.userData.baseY;

      for (let i = 0; i < count; i++) {
        let y = pos.getY(i) + vels[i].y;
        if (y > baseY + 2.8) {
          y = baseY;
          const r = Math.random() * 0.7;
          const a = Math.random() * Math.PI * 2;
          pos.setX(i, Math.cos(a) * r);
          pos.setZ(i, Math.sin(a) * r);
        } else {
          // Sinusoidal curl
          const sway = Math.sin(elapsedTime * vels[i].swaySpeed + vels[i].swayOffset) * 0.005;
          pos.setX(i, pos.getX(i) + sway);
        }
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }

    // Orbit Floating Coffee Beans
    heroFloatingBeans.forEach(bean => {
      const u = bean.userData;
      u.baseAngle += u.orbitSpeed;
      bean.position.x = Math.cos(u.baseAngle) * u.baseRadius;
      bean.position.z = Math.sin(u.baseAngle) * u.baseRadius;
      bean.position.y = u.initialY + Math.sin(elapsedTime * u.bobSpeed) * u.bobHeight;
      bean.rotation.x += 0.01;
      bean.rotation.y += 0.015;
    });

    heroRenderer.render(heroScene, heroCamera);
  }

  /* ==========================================================================
     SCENE 2: INTERACTIVE 3D BESPOKE BREW LAB CUSTOMIZER
     ========================================================================== */

  let customizerRenderer, customizerScene, customizerCamera, customizerControls;
  let customizerVesselGroup, customizerSteam;
  let currentVesselType = 'latte';
  let isSteamActive = true;
  let isAutoRotate = true;

  // Glaze Palettes
  const GLAZE_CONFIGS = {
    obsidian: { color: 0x12100e, roughness: 0.45, metalness: 0.1, name: 'Noir Obsidian' },
    carrara: { color: 0xece8df, roughness: 0.18, metalness: 0.05, name: 'Carrara Silk' },
    terracotta: { color: 0x9c5538, roughness: 0.75, metalness: 0.0, name: 'Tuscan Terracotta' },
    emerald: { color: 0x163828, roughness: 0.15, metalness: 0.2, name: 'Imperial Emerald' },
    goldtrim: { color: 0x1a1614, rimColor: 0xd4af37, roughness: 0.3, metalness: 0.1, name: 'Noir with 24K Gold' }
  };

  let activeGlazeKey = 'obsidian';

  function initCustomizerScene() {
    const stage = document.getElementById('customizer-3d-canvas');
    if (!stage) return;

    const width = stage.clientWidth || 550;
    const height = stage.clientHeight || 550;

    customizerScene = new THREE.Scene();
    customizerCamera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    customizerCamera.position.set(0, 3.8, 6.8);

    customizerRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    customizerRenderer.setSize(width, height);
    customizerRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    customizerRenderer.shadowMap.enabled = true;
    customizerRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    customizerRenderer.toneMappingExposure = 1.15;
    stage.innerHTML = '';
    stage.appendChild(customizerRenderer.domElement);

    if (typeof THREE.OrbitControls !== 'undefined') {
      customizerControls = new THREE.OrbitControls(customizerCamera, customizerRenderer.domElement);
      customizerControls.enableDamping = true;
      customizerControls.dampingFactor = 0.06;
      customizerControls.maxPolarAngle = Math.PI / 2 + 0.08;
      customizerControls.minDistance = 3.5;
      customizerControls.maxDistance = 11;
      customizerControls.autoRotate = true;
      customizerControls.autoRotateSpeed = 1.0;
    }

    setupStudioLighting(customizerScene);

    customizerVesselGroup = new THREE.Group();
    customizerScene.add(customizerVesselGroup);

    // Build Initial Vessel
    rebuildCustomizerVessel();

    // Start Customizer Loop
    animateCustomizer();

    // Attach UI Event Listeners
    setupCustomizerUIListeners();

    window.addEventListener('resize', onCustomizerResize);
  }

  function rebuildCustomizerVessel() {
    // Clear old meshes
    while (customizerVesselGroup.children.length > 0) {
      const child = customizerVesselGroup.children[0];
      customizerVesselGroup.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
    }

    const glaze = GLAZE_CONFIGS[activeGlazeKey] || GLAZE_CONFIGS.obsidian;

    if (currentVesselType === 'latte') {
      // Ceramic Latte Cup & Saucer
      const ceramicMat = new THREE.MeshStandardMaterial({
        color: glaze.color,
        roughness: glaze.roughness,
        metalness: glaze.metalness
      });

      const cup = new THREE.Mesh(createCupGeometry(1.9, 1.1, 2.3), ceramicMat);
      const saucer = new THREE.Mesh(createSaucerGeometry(3.3), ceramicMat);
      saucer.position.y = -0.05;
      const handle = createHandleMesh(ceramicMat, 2.3, 1.9);

      // Liquid
      const liquidGeo = new THREE.CircleGeometry(1.72, 48);
      liquidGeo.rotateX(-Math.PI / 2);
      const liquidMat = new THREE.MeshStandardMaterial({
        map: createLatteArtTexture('rosette'),
        roughness: 0.2
      });
      const liquid = new THREE.Mesh(liquidGeo, liquidMat);
      liquid.position.y = 2.12;

      customizerVesselGroup.add(cup, saucer, handle, liquid);

      if (glaze.rimColor) {
        const rim = new THREE.Mesh(
          new THREE.TorusGeometry(1.9, 0.04, 16, 64).rotateX(Math.PI / 2),
          new THREE.MeshStandardMaterial({ color: glaze.rimColor, metalness: 0.85, roughness: 0.2 })
        );
        rim.position.y = 2.32;
        customizerVesselGroup.add(rim);
      }

      if (isSteamActive) {
        customizerSteam = createSteamSystem(45, 2.2);
        customizerVesselGroup.add(customizerSteam);
      }
    } else if (currentVesselType === 'espresso') {
      // Small Demitasse
      const ceramicMat = new THREE.MeshStandardMaterial({
        color: glaze.color,
        roughness: glaze.roughness,
        metalness: glaze.metalness
      });

      const cup = new THREE.Mesh(createCupGeometry(1.3, 0.8, 1.6), ceramicMat);
      const saucer = new THREE.Mesh(createSaucerGeometry(2.3), ceramicMat);
      saucer.position.y = -0.05;
      const handle = createHandleMesh(ceramicMat, 1.6, 1.3);

      const liquidGeo = new THREE.CircleGeometry(1.18, 48);
      liquidGeo.rotateX(-Math.PI / 2);
      const liquidMat = new THREE.MeshStandardMaterial({
        map: createLatteArtTexture('espresso'),
        roughness: 0.25
      });
      const liquid = new THREE.Mesh(liquidGeo, liquidMat);
      liquid.position.y = 1.45;

      customizerVesselGroup.add(cup, saucer, handle, liquid);

      if (isSteamActive) {
        customizerSteam = createSteamSystem(35, 1.5);
        customizerVesselGroup.add(customizerSteam);
      }
    } else if (currentVesselType === 'coldbrew') {
      // Crystal Fluted Highball with Ice Cubes
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.45,
        transmission: 0.85,
        roughness: 0.08,
        ior: 1.52,
        reflectivity: 0.9
      });

      // Ribbed Cylinder Glass
      const glassGeo = new THREE.CylinderGeometry(1.5, 1.3, 3.4, 32, 1, true);
      const glassBase = new THREE.CylinderGeometry(1.3, 1.3, 0.25, 32);
      const glassMesh = new THREE.Mesh(glassGeo, glassMat);
      const baseMesh = new THREE.Mesh(glassBase, glassMat);
      glassMesh.position.y = 1.7;
      baseMesh.position.y = 0.125;

      // Rich Amber Cold Brew Liquid
      const liquidMat = new THREE.MeshStandardMaterial({
        color: 0x3d1c08,
        roughness: 0.1,
        transparent: true,
        opacity: 0.92
      });
      const liquidGeo = new THREE.CylinderGeometry(1.42, 1.25, 2.8, 32);
      const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
      liquidMesh.position.y = 1.5;

      // Floating Beveled Ice Cubes
      const iceMat = new THREE.MeshPhysicalMaterial({
        color: 0xf0f8ff,
        transparent: true,
        opacity: 0.72,
        transmission: 0.9,
        roughness: 0.12
      });

      const ice1 = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), iceMat);
      ice1.position.set(0.2, 2.4, 0.2);
      ice1.rotation.set(0.4, 0.6, 0.2);

      const ice2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), iceMat);
      ice2.position.set(-0.3, 2.0, -0.2);
      ice2.rotation.set(0.8, 0.2, 0.5);

      customizerVesselGroup.add(glassMesh, baseMesh, liquidMesh, ice1, ice2);
    } else if (currentVesselType === 'matcha') {
      // Ceremonial Kyoto Clay Chawan Bowl
      const clayMat = new THREE.MeshStandardMaterial({
        color: glaze.color,
        roughness: 0.65,
        metalness: 0.05
      });

      const bowl = new THREE.Mesh(createCupGeometry(2.3, 1.4, 1.9), clayMat);

      const liquidGeo = new THREE.CircleGeometry(2.1, 48);
      liquidGeo.rotateX(-Math.PI / 2);
      const liquidMat = new THREE.MeshStandardMaterial({
        map: createLatteArtTexture('matcha'),
        roughness: 0.35
      });
      const liquid = new THREE.Mesh(liquidGeo, liquidMat);
      liquid.position.y = 1.72;

      customizerVesselGroup.add(bowl, liquid);

      if (isSteamActive) {
        customizerSteam = createSteamSystem(40, 1.8);
        customizerVesselGroup.add(customizerSteam);
      }
    }

    // Smooth Entrance Scale Animation
    if (typeof gsap !== 'undefined') {
      customizerVesselGroup.scale.set(0.8, 0.8, 0.8);
      gsap.to(customizerVesselGroup.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: 'back.out(1.7)' });
    }
  }

  function setupCustomizerUIListeners() {
    // Vessel Selector Buttons
    const vesselBtns = document.querySelectorAll('.vessel-btn');
    vesselBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        vesselBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentVesselType = btn.getAttribute('data-vessel');
        const vesselName = btn.getAttribute('data-name');
        const hintEl = document.getElementById('selected-vessel-name');
        if (hintEl) hintEl.textContent = vesselName;

        // Auto disable steam for cold brew
        if (currentVesselType === 'coldbrew') {
          isSteamActive = false;
          const steamBtn = document.getElementById('btn-toggle-steam');
          if (steamBtn) {
            steamBtn.classList.remove('active');
            steamBtn.innerHTML = '<i class="fa-solid fa-smog"></i> Steam OFF';
          }
          // Update Sensor readings
          document.getElementById('val-temp-display').textContent = '3.8°C (Chilled)';
          document.getElementById('val-extract-display').textContent = '16 Hours';
        } else {
          document.getElementById('val-temp-display').textContent = '93.5°C';
          document.getElementById('val-extract-display').textContent = '28s';
        }

        rebuildCustomizerVessel();
        if (window.updateCustomizerSummary) window.updateCustomizerSummary();
      });
    });

    // Glaze Swatches
    const glazeSwatches = document.querySelectorAll('.glaze-swatch');
    glazeSwatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        glazeSwatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');

        activeGlazeKey = swatch.getAttribute('data-glaze');
        const glazeName = swatch.getAttribute('data-name');
        const hintEl = document.getElementById('selected-glaze-name');
        if (hintEl) hintEl.textContent = glazeName;

        rebuildCustomizerVessel();
      });
    });

    // Steam Toggle
    const steamBtn = document.getElementById('btn-toggle-steam');
    if (steamBtn) {
      steamBtn.addEventListener('click', () => {
        isSteamActive = !isSteamActive;
        steamBtn.classList.toggle('active', isSteamActive);
        steamBtn.innerHTML = isSteamActive 
          ? '<i class="fa-solid fa-smog"></i> Steam ON' 
          : '<i class="fa-solid fa-smog"></i> Steam OFF';
        rebuildCustomizerVessel();
      });
    }

    // Auto-Rotate Toggle
    const rotateBtn = document.getElementById('btn-auto-rotate');
    if (rotateBtn) {
      rotateBtn.addEventListener('click', () => {
        isAutoRotate = !isAutoRotate;
        rotateBtn.classList.toggle('active', isAutoRotate);
        if (customizerControls) customizerControls.autoRotate = isAutoRotate;
      });
    }

    // Reset View
    const resetBtn = document.getElementById('btn-reset-view');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(customizerCamera.position, { x: 0, y: 3.8, z: 6.8, duration: 1, ease: 'power2.inOut' });
        } else {
          customizerCamera.position.set(0, 3.8, 6.8);
        }
      });
    }
  }

  function onCustomizerResize() {
    const stage = document.getElementById('customizer-3d-canvas');
    if (!stage || !customizerRenderer || !customizerCamera) return;

    const width = stage.clientWidth;
    const height = stage.clientHeight;
    customizerCamera.aspect = width / height;
    customizerCamera.updateProjectionMatrix();
    customizerRenderer.setSize(width, height);
  }

  function animateCustomizer() {
    requestAnimationFrame(animateCustomizer);

    if (customizerControls) {
      customizerControls.update();
    }

    // Animate customizer steam if present
    if (customizerSteam) {
      const pos = customizerSteam.geometry.attributes.position;
      const vels = customizerSteam.userData.velocities;
      const count = customizerSteam.userData.count;
      const baseY = customizerSteam.userData.baseY;

      for (let i = 0; i < count; i++) {
        let y = pos.getY(i) + vels[i].y;
        if (y > baseY + 2.5) {
          y = baseY;
          const r = Math.random() * 0.6;
          const a = Math.random() * Math.PI * 2;
          pos.setX(i, Math.cos(a) * r);
          pos.setZ(i, Math.sin(a) * r);
        }
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }

    customizerRenderer.render(customizerScene, customizerCamera);
  }

  /* ==========================================================================
     CANVAS 2D FALLBACK (If WebGL / CDN fails)
     ========================================================================== */
  function initCanvasFallback() {
    ['hero-3d-container', 'customizer-3d-canvas'].forEach(id => {
      const container = document.getElementById(id);
      if (!container) return;
      const canvas = document.createElement('canvas');
      canvas.width = container.clientWidth || 500;
      canvas.height = container.clientHeight || 500;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#16120e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#d4af37';
      ctx.font = '24px serif';
      ctx.textAlign = 'center';
      ctx.fillText('☕ L\'AURA ATELIER 3D VIEWPORT', canvas.width / 2, canvas.height / 2);
      container.appendChild(canvas);
    });
  }

})();
