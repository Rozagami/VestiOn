document.addEventListener('DOMContentLoaded', () => {
  // Inicjalizacja sceny Three.js
  const canvas = document.getElementById('webglCanvas');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdcd6f7);

  // Kamera
  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2.0, 3);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  // OrbitControls – umożliwiają obracanie kamerą myszką
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.target.set(0, 1.6, 0);

  // Oświetlenie
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);

  // Dodajemy grupę, aby manekin i ubrania obracały się razem
  const modelGroup = new THREE.Group();
  scene.add(modelGroup);

  // Ładowanie modeli (.glb)
  const loader = new THREE.GLTFLoader();
  let mannequin, pants, shirt;

  function loadGLB(path, callback) {
    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        modelGroup.add(model);
        callback(model);
      },
      undefined,
      (error) => {
        console.error('Błąd ładowania .glb:', error);
      }
    );
  }

  // Manekin
  loadGLB('models/model.glb', (model) => {
    mannequin = model;
    mannequin.scale.set(1, 1, 1);
    mannequin.scale.set(0.3, 0.3, 0.3); 
// Przesunięcie manekina w górę (np. o 0.5 w osi Y)
  mannequin.position.set(0, 0.5, 0);
  });

  // Spodnie (domyślnie niewidoczne)
loadGLB('models/pants.glb', (model) => {
  pants = model;
  pants.visible = false;
  // Skalowanie ubrań tak samo jak manekin, np. 0.3
  pants.scale.set(0.3, 0.3, 0.3);
  pants.position.set(0, 0.5, 0);
});

  // Koszulka (domyślnie niewidoczna)
loadGLB('models/shirt.glb', (model) => {
  shirt = model;
  shirt.visible = false;
  // Skalowanie koszulki też na 0.3
  shirt.scale.set(0.3, 0.3, 0.3);
  shirt.position.set(0, 0.5, 0);
});

  // Render pętla – automatyczny powolny obrót
  function animate() {
    requestAnimationFrame(animate);

    // Bardzo wolny obrót całej grupy
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
      }
    });
  });

  // Dodawanie ikonki ubrania (do zdjęcia)
  function addWornItemIcon(type) {
    const existing = wornItemsContainer.querySelector(`[data-type="${type}"]`);
    if (existing) return;

    const div = document.createElement('div');
    div.classList.add('worn-item');
    div.setAttribute('data-type', type);

    // Taka sama ikonka jak w panelu produktów
    const img = document.createElement('img');
    if (type === 'pants') {
      img.src = 'assets/pants-icon.png';
    } else if (type === 'shirt') {
      img.src = 'assets/shirt-icon.png';
    }
    img.alt = `Usuń ${type}`;

    div.appendChild(img);
    wornItemsContainer.appendChild(div);

    // Kliknięcie w ikonkę -> zdejmij ubranie
    div.addEventListener('click', () => {
      removeClothes(type);
      wornItemsContainer.removeChild(div);
    });
  }

  // Zdejmowanie ubrania
  function removeClothes(type) {
    if (type === 'pants' && pants) {
      pants.visible = false;
    } else if (type === 'shirt' && shirt) {
      shirt.visible = false;
    }
  }
});
