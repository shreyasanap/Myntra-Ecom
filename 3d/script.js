// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Adjusted FOV and aspect ratio
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // Enabled antialiasing
renderer.setSize(window.innerWidth, window.innerHeight); // Full window size
renderer.setPixelRatio(window.devicePixelRatio); // High DPI support
document.body.appendChild(renderer.domElement); // Directly append to the body
scene.background = new THREE.Color(0xffffff); // Set background color to white

// GLTFLoader setup
const loader = new THREE.GLTFLoader();
let shirt;
loader.load('./shirt.glb', function(gltf) {
    shirt = gltf.scene;
    shirt.scale.set(3, 3, 3); // Increased the size of the model for better visibility
    shirt.position.set(0, -4, 2); // Adjust the model’s position
    scene.add(shirt);
    console.log('Model loaded:', shirt); // Debugging: Check if the model is loaded
    animate();
}, undefined, function(error) {
    console.error('An error happened:', error);
});

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Increased the light intensity
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Increased light intensity
directionalLight.position.set(5, 10, 5).normalize(); // Adjusted position for better illumination
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 2, 100); // Increased light intensity
pointLight.position.set(0, 0, 10); // Adjust position to ensure it illuminates the model
scene.add(pointLight);

// Camera position
camera.position.z = 5; // Moved the camera further back
camera.fov = 75; // Increased the field of view for a wider view
camera.updateProjectionMatrix(); // Update the projection matrix after changing the FOV

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the shirt model
    if (shirt) {
        shirt.rotation.y += 0.01; // Adjust the rotation speed as needed
    }

    renderer.render(scene, camera);
}

// Color change functionality
document.querySelectorAll('.color').forEach(colorDiv => {
    colorDiv.addEventListener('click', () => {
        const color = colorDiv.getAttribute('data-color');
        if (shirt) {
            shirt.traverse(node => {
                if (node.isMesh) {
                    node.material.color.set(color);
                }
            });
        }
    });
});

// Go Back button functionality
document.getElementById('go-back').addEventListener('click', () => {
    window.history.back(); // Navigate to the previous page
});

// Download button functionality
document.getElementById('download').addEventListener('click', () => {
    if (shirt) {
        // Create a data URL from the renderer's canvas
        const dataURL = renderer.domElement.toDataURL('image/png');
        
        // Create a link and trigger download
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'shirt-customization.png';
        link.click();
    } else {
        console.log('No shirt model loaded for download.');
    }
});
