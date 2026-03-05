import * as THREE from 'three';

// 1. Setup the Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Create a 3D Object (A Cube)
const geometry = new THREE.BoxGeometry(1, 1, 1);
// MeshNormalMaterial creates a cool rainbow effect based on lighting angles
const material = new THREE.MeshNormalMaterial(); 
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

// Move the camera back so we can see the cube
camera.position.z = 3;

// 3. Create an Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the cube a little bit every frame
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

// 4. Handle Window Resizing gracefully
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation
animate();