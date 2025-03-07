console.log("THREE.OrbitControls:", THREE.OrbitControls);
document.addEventListener('DOMContentLoaded', () => {
  // Inicjalizacja sceny Three.js
  const canvas = document.getElementById('webglCanvas');
  const scene = new THREE.Scene();

  // Tło sceny (np. czarny)
  scene.background = new THREE.Color(0x000000);

  // Kamera
  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.6, 3);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  // OrbitControls (myszka)
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

  // Loader do plików .glb
  const loader = new THREE.GLTFLoader();

  // Obiekty 3D
  let mannequin, pants, shirt;

  // Aby manekin i ubrania kręciły się razem, można stworzyć grupę:
  const modelGroup = new THREE.Group();
  scene.add(modelGroup);

  // Funkcja wczytująca .glb
  function loadGLB(path, callback) {
    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        modelGroup.add(model); // Dodajemy do grupy
        callback(model);
      },
      undefined,
      (error) => {
        console.error('Błąd ładowania .glb:', error);
      }
    );
  }

  // Wczytujemy manekina
  loadGLB('models/model.glb', (model) => {
    mannequin = model;
    mannequin.scale.set(1, 1, 1);
    mannequin.position.set(0, 0, 0);
  });

  // Wczytujemy spodnie (domyślnie niewidoczne)
  loadGLB('models/pants.glb', (model) => {
    pants = model;
    pants.visible = false;
    pants.scale.set(1, 1, 1);
    pants.position.set(0, 0, 0);
  });

  // Wczytujemy koszulkę (domyślnie niewidoczną)
  loadGLB('models/shirt.glb', (model) => {
    shirt = model;
    shirt.visible = false;
    shirt.scale.set(1, 1, 1);
    shirt.position.set(0, 0, 0);
  });

  // Render + powolny obrót
  function animate() {
    requestAnimationFrame(animate);

    // Jeśli chcesz bardzo wolny automatyczny obrót całej grupy:
    modelGroup.rotation.y += 0.0005; 

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Zakładanie/Zdejmowanie ubrań
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

  // Dodaje małą ikonkę w .worn-items
  function addWornItemIcon(type) {
    const existing = wornItemsContainer.querySelector(`[data-type="${type}"]`);
    if (existing) return;

    const div = document.createElement('div');
    div.classList.add('worn-item');
    div.setAttribute('data-type', type);

    // Ta sama ikonka co w products-section
    // Dla shirt -> shirt-icon, dla pants -> pants-icon
    const img = document.createElement('img');
    if (type === 'pants') {
      img.src = 'assets/pants-icon.png';
    } else if (type === 'shirt') {
      img.src = 'assets/shirt-icon.png';
    }
    img.alt = `Usuń ${type}`;

    div.appendChild(img);
    wornItemsContainer.appendChild(div);

    // Kliknięcie -> zdejmij
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
