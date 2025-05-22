// Three.js + interakcje z modelami i produktami

document.addEventListener('DOMContentLoaded', () => {
  // Inicjalizacja sceny Three.js
  const canvas = document.getElementById('webglCanvas');
  const scene = new THREE.Scene();
  // Usunięcie tła WebGL, aby pokazać CSS-owy background-image
  scene.background = null;

  // Kamera
  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2.0, 3);

  // Renderer z transparentnością
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.toneMappingExposure = 1.0;
  // Pełna przezroczystość tła WebGL
  renderer.setClearColor(0x000000, 0);

  // OrbitControls – umożliwiają obracanie kamerą myszką
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.target.set(0, 1.6, 0);

  // Oświetlenie
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.9);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
  dirLight.position.set(0, 10, 10);
  scene.add(dirLight);
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
  fillLight.position.set(10, 10, -10);
  scene.add(fillLight);

  // Grupa modeli
  const modelGroup = new THREE.Group();
  scene.add(modelGroup);

  // Loader modeli (.glb)
  const loader = new THREE.GLTFLoader();
  let mannequin, pants, shirt, tshirt;

  function loadGLB(path, callback) {
    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        modelGroup.add(model);
        callback(model);
      },
      undefined,
      (error) => console.error('Błąd ładowania .glb:', error)
    );
  }

  // Manekin
  loadGLB('models/model.glb', (model) => {
    mannequin = model;
    mannequin.scale.set(0.3, 0.3, 0.3);
    mannequin.position.set(0, 0.4, 0);
  });

  // Spodnie
  loadGLB('models/pants.glb', (model) => {
    pants = model;
    pants.visible = false;
    pants.scale.set(0.3, 0.3, 0.3);
    pants.position.set(0, 0.4, 0);
  });

  // Koszulka bez nadruku
  loadGLB('models/shirt.glb', (model) => {
    shirt = model;
    shirt.visible = false;
    shirt.scale.set(0.3, 0.3, 0.3);
    shirt.position.set(0, 0.4, 0);
  });

  // T-shirt z nadrukiem
  loadGLB('models/tshirt.glb', (model) => {
    tshirt = model;
    tshirt.visible = false;
    tshirt.scale.set(0.3, 0.3, 0.3);
    tshirt.position.set(0, 0.4, 0);
  });

  // Animacja i render loop
  function animate() {
    requestAnimationFrame(animate);
    modelGroup.rotation.y += 0.0005;
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Interakcje – zakładanie ubrań
  const productCards = document.querySelectorAll('.product-card');
  const wornItemsContainer = document.querySelector('.worn-items');

  productCards.forEach((card) => {
    card.addEventListener('click', () => {
      const type = card.getAttribute('data-type');
      if (type === 'pants' && pants) {
        pants.visible = true;
        addWornItemIcon('pants');
      } else if (type === 'shirt' && shirt) {
        shirt.visible = true;
        addWornItemIcon('shirt');
      } else if (type === 'tshirt' && tshirt) {
        tshirt.visible = true;
        addWornItemIcon('tshirt');
      }
    });
  });

  // Funkcja dodająca ikonkę założonego ubrania
  function addWornItemIcon(type) {
    if (wornItemsContainer.querySelector(`[data-type="${type}"]`)) return;
    const div = document.createElement('div');
    div.classList.add('worn-item');
    div.setAttribute('data-type', type);
  
    const img = document.createElement('img');
    if (type === 'pants') img.src = 'assets/pants3d.png';
    else if (type === 'shirt') img.src = 'assets/shirt3d.png';
    else if (type === 'tshirt') img.src = 'assets/tshirt3d.png';
    img.alt = `Usuń ${type}`;
  
    div.appendChild(img);
    wornItemsContainer.appendChild(div);
  
    div.addEventListener('click', () => {
      removeClothes(type);
      wornItemsContainer.removeChild(div);
    });
  }

  // Funkcja zdejmująca ubranie
  function removeClothes(type) {
    if (type === 'pants' && pants) pants.visible = false;
    else if (type === 'shirt' && shirt) shirt.visible = false;
    else if (type === 'tshirt' && tshirt) tshirt.visible = false;
  }
});
