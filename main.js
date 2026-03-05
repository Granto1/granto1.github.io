import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

// 1. Define the content for each section
// You can use standard HTML tags like <h2>, <p>, and <ul> inside these backticks
const sectionContent = {
    // about: `
    //     <h2>About Me</h2>
    //     <p>I am an Embedded Firmware and PCB Engineer specializing in bridging the gap between hardware and intelligent software.</p>
    //     <p>My work focuses on developing robust firmware, designing custom printed circuit boards, and integrating complex signal processing algorithms directly onto edge devices.</p>
    // `,
    // experience: `
    //     <h2>Experience</h2>
    //     <ul>
    //         <li><strong>Hardware Integration:</strong> Implementing CAN bus communication and configuring moteus motor controllers for advanced robotic actuation.</li>
    //         <li><strong>Wireless Sensor Networks:</strong> Synchronizing ESP32 and Raspberry Pi hardware over Wi-Fi utilizing Holt EMA algorithms for precision latency prediction.</li>
    //     </ul>
    // `,
    // projects: `
    //     <h2>Selected Projects</h2>
    //     <ul>
    //         <li><strong>Machine Learning on the Edge:</strong> Developed a PyTorch Convolutional Neural Network (CNN) to classify hand gestures using non-invasive ultrasound spectrogram data.</li>
    //         <li><strong>Non-Invasive Diagnostics:</strong> Engineered a wireless sensor utilizing mmWave radar and ultrasonic transducers for advanced material analysis.</li>
    //         <li><strong>Embedded Graphics:</strong> Designed a Raspberry Pi Pico system interfacing with a TFT display and PAM8302 audio amplifier.</li>
    //     </ul>
    // `,
    // contact: `
    //     <h2>Get in Touch</h2>
    //     <p>I am always open to discussing embedded systems, machine learning, and new hardware challenges.</p>
    //     <p><strong>Email:</strong> grant@example.com</p>
    //     <p><strong>GitHub:</strong> github.com/yourusername</p>
    //     <p><strong>LinkedIn:</strong> linkedin.com/in/yourprofile</p>
    // `
};

// Grab the container from the HTML
const contentBox = document.getElementById('Education-EXP');

function updateText(sectionKey) {
    // 1. Add the class to trigger the slide-down and fade-out animation
    contentBox.classList.add('hidden-bottom');
    
    // 2. Wait for the animation to finish (400ms matches our CSS transition)
    setTimeout(() => {
        // Swap the HTML content while it is hidden
        contentBox.innerHTML = sectionContent[sectionKey];
        
        // Remove the class so it slides back UP into view
        contentBox.classList.remove('hidden-bottom');
    }, 400); 
}

// 3. Initialize the page with the "About" text immediately
contentBox.innerHTML = sectionContent['about'];


// 1. Setup Canvas, Scene, and Camera
const canvas = document.querySelector('#bg');
const scene = new THREE.Scene();

// We move the camera a bit further back (z=10) because OBJ files are often exported quite large
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// 2. Add Lighting (Crucial for MTL materials)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// 3. Load Materials and Geometry
let DroidPCB; // We declare this outside the loaders so the animation loop can see it
let WinchPCB;
let SegNode7;
let Droid;

const mtlLoader = new MTLLoader();
mtlLoader.load('3D Models/DroidPCB.mtl', function (materials) {
    materials.preload();

    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    
    objLoader.load('3D Models/DroidPCB.obj', function (object) {
        DroidPCB = object;

        const box = new THREE.Box3().setFromObject(DroidPCB);
        const center = box.getCenter(new THREE.Vector3());
        // DroidPCB.position.sub(center);
        DroidPCB.position.set(0,0,0);

        scene.add(DroidPCB);
        console.log("OBJ and MTL loaded and centered!");
    });
});

// mtlLoader.load('3D Models/WinchPCB.mtl', function (materials) {
//     materials.preload();

//     const objLoader = new OBJLoader();
//     objLoader.setMaterials(materials);
    
//     objLoader.load('3D Models/WinchPCB.obj', function (object) {
//         WinchPCB = object;

//         const box = new THREE.Box3().setFromObject(WinchPCB);
//         const center = box.getCenter(new THREE.Vector3());
//         WinchPCB.position.set(15,0,0);

//         scene.add(WinchPCB);
//         console.log("OBJ and MTL loaded and centered!");
//     });
// });

// mtlLoader.load('3D Models/Final Assembly.mtl', function (materials) {
//     materials.preload();

//     const objLoader = new OBJLoader();
//     objLoader.setMaterials(materials);
    
//     objLoader.load('3D Models/Final Assembly.obj', function (object) {
//         Droid = object;

//         const box = new THREE.Box3().setFromObject(Droid);
//         const center = box.getCenter(new THREE.Vector3());
//         Droid.position.set(0,0,0);
//         Droid.scale.set(10, 10, 10);
//         Droid.rotation.set(-90,0,0);

//         scene.add(Droid);
//         console.log("OBJ and MTL loaded and centered!");
//     });
// });


// mtlLoader.load('3D Models/Node.mtl', function (materials) {
//     materials.preload();

//     const objLoader = new OBJLoader();
//     objLoader.setMaterials(materials);
    
//     objLoader.load('3D Models/Node.obj', function (object) {
//         SegNode7 = object;

//         const box = new THREE.Box3().setFromObject(SegNode7);
//         const center = box.getCenter(new THREE.Vector3());
//         SegNode7.position.set(10,0,0);

//         scene.add(SegNode7);
//         console.log("OBJ and MTL loaded and centered!");
//     });
// });


// 3. Camera Movement Logic
// Set the starting camera position (Looking at "About")
let currentCameraPos = new THREE.Vector3(0, 0, 10);
let targetCameraPos = new THREE.Vector3(0, 0, 10);
camera.position.copy(currentCameraPos);

// 4. Set up Interactivity Variables
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

// Listen for mouse movement
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Listen for scrolling
let scrollPercent = 0;
document.body.onscroll = () => {
    scrollPercent = window.scrollY;
};

function updateCameraPosition() {
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = scrollY / Math.max(1, maxScroll);

    // 1. Move the camera along the X-axis (as before)
    targetCameraX = scrollPercent * 90;

    // --- NEW: Scrubbing the Hardware Model ---
    // Let's assume hardwareModel is sitting at x = 90 (the bottom of the page).
    // We map the 0.0 - 1.0 scroll percentage to a perfect 360-degree rotation (Math.PI * 2).
    // As the user drags the scrollbar down, the model physically turns with their mouse.
    if (WinchPCB) {
        WinchPCB.rotation.y = scrollPercent * (Math.PI * 2);
        
        // You can even scrub its vertical position so it slightly "floats" up 
        // as the scrollbar is dragged!
        WinchPCB.position.y = Math.sin(scrollPercent * Math.PI) * 2;
    }
}

// Listen for clicks on the navigation menu
document.getElementById('link-home').addEventListener('click', (e) => {
    e.preventDefault();
    targetCameraPos.set(0, 0, 10); 
    updateText("about");
});
document.getElementById('link-about').addEventListener('click', (e) => {
    e.preventDefault();
    targetCameraPos.set(0, 0, 10); 
    updateText("about");
});
document.getElementById('link-experience').addEventListener('click', (e) => {
    e.preventDefault();
    targetCameraPos.set(30, -0, 10); 
    updateText("experience");
});
document.getElementById('link-projects').addEventListener('click', (e) => {
    e.preventDefault();
    targetCameraPos.set(30, -0, 10); 
    updateText("projects");
});
document.getElementById('link-contact').addEventListener('click', (e) => {
    e.preventDefault();
    targetCameraPos.set(100, 0, 100); 
    updateText("contact");
});

// Define the radius of the circular path
const circleRadius = 20; // Adjust as needed
// Define a variable to store the current angle
let cameraAngle = 0;

// Function to handle the scroll event
function onMouseWheel(event) {
    // Determine scroll direction and adjust the angle change magnitude
    const delta = event.deltaY * 0.005; // Adjust the multiplier for scroll sensitivity
    cameraAngle += delta;
}
window.addEventListener('wheel', onMouseWheel, false);

// Fire the calculation whenever the user scrolls
window.addEventListener('scroll', updateCameraPosition);

function animate() {
    requestAnimationFrame(animate);

    // Calculate the new camera position using sine and cosine
    camera.position.x = Math.cos(cameraAngle) * circleRadius;
    camera.position.z = Math.sin(cameraAngle) * circleRadius;
    
    // Ensure the camera always looks at the center of the circle
    camera.lookAt(DroidPCB.position); //

    // if (DroidPCB) {
    //     // 1. Mouse Tracking
    //     targetX = mouseX * 0.001;
    //     targetY = mouseY * 0.001;
    //     DroidPCB.rotation.y += 0.05 * (targetX - DroidPCB.rotation.y);
    //     DroidPCB.rotation.x += 0.05 * (targetY - DroidPCB.rotation.x);

    //     // 2. SCROLL TRACKING (The Fix)
    //     // Read the scroll position directly every frame!
    //     const currentScroll = window.scrollY;
        
    //     // Apply it to the Z rotation (or whichever axis you prefer)
    //     DroidPCB.rotation.z = currentScroll * 0.002; 
    // }
    camera.position.lerp(targetCameraPos, 0.03);

    renderer.render(scene, camera);
}
// Handle resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateCameraPosition(); // Recalculate maxScroll if window size changes
});

animate();