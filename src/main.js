import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/*
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
// Floor
const floorAlphaTexture = textureLoader.load("/floor/alpha.jpg");
const floorColorTexture = textureLoader.load(
  "/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg",
);
const floorARMTexture = textureLoader.load(
  "/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg",
);
const floorNormalTexture = textureLoader.load(
  "/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg",
);
const floorDisplacementTexture = textureLoader.load(
  "/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg",
);

/**
 * House
 */

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    transparent: true,
    alphaMap: floorAlphaTexture,
    map: floorColorTexture,
  }),
);
scene.add(floor);
floor.rotation.x = -Math.PI * 0.5;

const houseGroup = new THREE.Group();
scene.add(houseGroup);

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({}),
);
// console.log(walls.geometry.parameters.height);
walls.position.y += walls.geometry.parameters.height / 2;
houseGroup.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({}),
);
roof.position.y +=
  walls.geometry.parameters.height + roof.geometry.parameters.height / 2;
roof.rotation.y = Math.PI * 0.25;
houseGroup.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2),
  new THREE.MeshStandardMaterial({ color: "#ff0000" }),
);
// console.log(walls.geometry.parameters);
door.position.z = walls.geometry.parameters.depth / 2 + 0.001;
door.position.y = door.geometry.parameters.height / 2;
houseGroup.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#00ff00" });

const bushPositions = [
  [0.8, 0.2, 2.2],
  [1.4, 0.1, 2.1],
  [-0.8, 0.1, 2.2],
  [-1, 0.05, 2.6],
];
const bushScales = [0.5, 0.25, 0.4, 0.15];
for (let i = 0; i < bushPositions.length; i++) {
  const bush = new THREE.Mesh(bushGeometry, bushMaterial);
  bush.scale.setScalar(bushScales[i] ?? 0.5);
  bush.position.set(...bushPositions[i]);
  houseGroup.add(bush);
}

/*
// Even more concise way of doing this: array of objects, use forEach, spread positions, and have default scale
const bushes = [
  { position: [0.8, 0.2, 2.2], scale: 0.5 },
  { position: [1.4, 0.1, 2.1], scale: 0.25 },
  { position: [-0.8, 0.1, 2.2], scale: 0.4 },
  { position: [-1, 0.05, 2.6] }, // No scale provided
  { position: [1.2, 0.1, 2.4] }, // New bush, no scale
];

bushes.forEach(({ position, scale = 0.5 }) => {
  const bush = new THREE.Mesh(bushGeometry, bushMaterial);
  bush.scale.setScalar(scale); // Defaults to 0.5 if scale is missing
  bush.position.set(...position);
  houseGroup.add(bush);
});
* */

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({});

const gravesGroup = new THREE.Group();
scene.add(gravesGroup);

for (let i = 0; i < 30; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 4;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);

  grave.position.x = x;
  grave.position.y = Math.random() * grave.geometry.parameters.height * 0.5;
  grave.position.z = z;
  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;

  gravesGroup.add(grave);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#ffffff", 1.5);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
