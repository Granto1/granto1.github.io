import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';

const canvas = document.querySelector('#bg');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

let DroidPCB;
let WinchPCB;
let SegNode7;
let Droid;
let Winch;
let Drone;

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
        DroidPCB.position.set(0, 0, 0);

        scene.add(DroidPCB);
        console.log("OBJ and MTL loaded and centered!");
    });
});

// mtlLoader.load('3D Models/Winch.mtl', function (materials) {
//     materials.preload();

//     const objLoader = new OBJLoader();
//     objLoader.setMaterials(materials);

//     objLoader.load('3D Models/Winch.obj', function (object) {
//         Winch = object;

//         const box = new THREE.Box3().setFromObject(Winch);
//         const center = box.getCenter(new THREE.Vector3());
//         Winch.position.set(15,0,0);
//         Winch.scale.set(15, 15, 15);

//         scene.add(Winch);
//         console.log("OBJ and MTL loaded and centered!");
//     });
// });


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

// .ply importing
const ply_loader = new PLYLoader();

let GrantHead;
ply_loader.load('3D Models/Grant.ply', (geometry) => {
    geometry.computeVertexNormals();
    // const material = new THREE.MeshStandardMaterial({ 
    //     vertexColors: true, // This is the key line
    //     roughness: 0.5,
    //     metalness: 0.1 
    // });
    const material = new THREE.PointsMaterial({ 
        size: 1, 
        vertexColors: true 
    });
    GrantHead = new THREE.Mesh(geometry, material);
    GrantHead.position.set(99-200,100-200,-25);
    GrantHead.scale.set(10,10,10);
    GrantHead.rotation.set(180,0,270.12);
    scene.add(GrantHead);
})

let currentCameraPos = new THREE.Vector3(0, 0, 10);
let targetCameraPos = new THREE.Vector3(0, 0, 10);
camera.position.copy(currentCameraPos);

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

// 1. Grab the sidebar
const sidebar = document.getElementById('sidebar');
const mainTitle = document.getElementById('title');
const schoolsidebar = document.getElementById('school-sidebar');

let state = 0;

const bottom_nav = document.getElementById('bottom-nav');

// 2. Create a quick helper function so we don't repeat code
function transition_to_pages() {
    if (!state) {
        sidebar.classList.add('slide-out-left');
        mainTitle.classList.add('moveup');
        schoolsidebar.classList.add('moveout');
        state = 1;
        bottom_nav.classList.add('appear');
    }
}

function return_to_main() {
    if (state) {
        sidebar.classList.remove('slide-out-left');
        mainTitle.classList.remove('moveup');
        schoolsidebar.classList.remove('moveout');
        bottom_nav.classList.remove('appear');
        state = 0;
    }
}

const aboutcontent = document.getElementById('about');



function clear_page_content() {
    aboutcontent.classList.remove('appear');
}

let pageNum = 0;

// Listen for clicks on the navigation menu
document.getElementById('link-home').addEventListener('click', (e) => {
    e.preventDefault();
    targetCameraPos.set(0, 0, 10);
    clear_page_content();
    return_to_main();
    pageNum = 0;
});

document.getElementById('link-about').addEventListener('click', (e) => {
    e.preventDefault();
    targetCameraPos.set(-100, -70, -20);
    transition_to_pages();
    clear_page_content();
    aboutcontent.classList.add('appear');
    pageNum = 1;
});
document.getElementById('link-experience').addEventListener('click', (e) => {
    e.preventDefault();
    targetCameraPos.set(30, -0, 10);
    clear_page_content();
    transition_to_pages();
    pageNum = 2;
});
document.getElementById('link-projects').addEventListener('click', (e) => {
    e.preventDefault();
    targetCameraPos.set(30, -0, 10);
    clear_page_content();
    transition_to_pages();
    pageNum = 3;
});
document.getElementById('link-contact').addEventListener('click', (e) => {
    e.preventDefault();
    targetCameraPos.set(100, 0, 100);
    clear_page_content();
    transition_to_pages();
    pageNum = 4;
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

const lookPosition = new THREE.Vector3();

const GrantHeadOffset = new THREE.Vector3(0, 0, 0);


function animate() {
    requestAnimationFrame(animate);

    // // Calculate the new camera position using sine and cosine
    // camera.position.x = Math.cos(cameraAngle) * circleRadius;
    // camera.position.z = Math.sin(cameraAngle) * circleRadius;

    // // Ensure the camera always looks at the center of the circle
    // camera.lookAt(DroidPCB.position); // 

    switch(pageNum) {
        case 0:
            camera.lookAt(DroidPCB.position);
            break;
        case 1:
            lookPosition.copy(GrantHead.position);
            lookPosition.add(GrantHeadOffset);
            camera.lookAt(lookPosition);
            break;
    }

    if (DroidPCB) {
        // 1. Mouse Tracking
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        DroidPCB.rotation.y += 0.05 * (targetX - DroidPCB.rotation.y);
        DroidPCB.rotation.x += 0.05 * (targetY - DroidPCB.rotation.x);

        // 2. SCROLL TRACKING (The Fix)
        // Read the scroll position directly every frame!
        const currentScroll = window.scrollY;

        // Apply it to the Z rotation (or whichever axis you prefer)
        DroidPCB.rotation.z = currentScroll * 0.002;
    }
    camera.position.lerp(targetCameraPos, 0.05);

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