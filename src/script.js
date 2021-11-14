import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

const textureLoader = new THREE.TextureLoader();

const normalTexture = textureLoader.load("./texture/normalMap.jpg");
const baseColorTexture = textureLoader.load("./texture/baseColor.jpg");
const ambientTexture = textureLoader.load("./texture/ambient.jpg");
const heightTexture = textureLoader.load("./texture/height.png");
const roughnessTexture = textureLoader.load("./texture/roughness.jpg");

// Canvas
const canvas = document.querySelector(".c");

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

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// (75, sizes.width / sizes.height, 0.1, 100)
let fov = 75;
let aspect = sizes.width / sizes.height;
let near = 0.1;
let far = 100;
// Camera
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 0, 7.7);
// Scene
const scene = new THREE.Scene();
scene.add(camera);

const pointLight1 = new THREE.DirectionalLight(0xffffff, 3);
pointLight1.position.set(50, 50, 100);
scene.add(pointLight1);

// const pointLight2 = new THREE.DirectionalLight(0xffffff, 3);
// pointLight2.position.set(-100, -100, -100);
// scene.add(pointLight2);

// const pointLight3 = new THREE.DirectionalLight(0xffffff, 3);
// pointLight3.position.set(-100, 10, 100);
// scene.add(pointLight3);

// Object  (Planet)
let radius = 2;
let widthSegments = 100;
let heightSegments = 100;
const sphereGeometry = new THREE.SphereGeometry(
  radius,
  widthSegments,
  heightSegments
);

// Material
const material = new THREE.MeshStandardMaterial({
  normalMap: normalTexture,
  map: baseColorTexture,
  displacementMap: heightTexture,
  aoMap: ambientTexture,
  roughnessMap: roughnessTexture,
});
// material.roughness = 0.7;
// // material.normalMap = normalTexture;
// material.color = new THREE.Color(0xfff);

// Mesh (Planet)
let planet = new THREE.Mesh(sphereGeometry, material);
scene.add(planet);

renderer.render(scene, camera);

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

let onDocumentMouseMove = (event) => {
  mouseX = event.clientX - windowX;
  mouseY = event.clientY - windowY;
};
document.addEventListener("mousemove", onDocumentMouseMove);


let render = (time) => {
  time *= 0.001;
  //   planet.rotation.x = time  ;

  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;
  planet.rotation.y = time * 0.5;

  planet.rotation.y += 0.5 * (targetX - planet.rotation.y);
  planet.rotation.x += 0.5 * (targetY - planet.rotation.x);

  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

requestAnimationFrame(render);
