import * as THREE from 'https://unpkg.com/three@0.152.0/build/three.module.js';

// Create a subtle particle field and floating group for depth
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvas.clientWidth, canvas.clientHeight);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000 );
camera.position.set(0, 0, 220);

const group = new THREE.Group();
scene.add(group);

// soft ambient light and neon point
const ambient = new THREE.AmbientLight(0xffffff, 0.45);
scene.add(ambient);

const pLight = new THREE.PointLight(0x00f0ff, 0.9, 600);
pLight.position.set(50, 50, 100);
scene.add(pLight);

// particles
const particles = new THREE.BufferGeometry();
const count = 120;
const positions = new Float32Array(count * 3);
for(let i=0;i<count;i++){
  positions[i*3 + 0] = (Math.random() - 0.5) * 340;
  positions[i*3 + 1] = (Math.random() - 0.5) * 180;
  positions[i*3 + 2] = (Math.random() - 0.5) * 200;
}
particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const pMat = new THREE.PointsMaterial({ size: 3.5, color: 0x00e8ff, transparent: true, opacity: 0.9 });
const points = new THREE.Points(particles, pMat);
group.add(points);

// a floating neon plane
const planeGeo = new THREE.PlaneGeometry(120, 80, 1, 1);
const planeMat = new THREE.MeshStandardMaterial({ color: 0x061233, emissive: 0x002244, metalness: 0.2, roughness: 0.6, transparent: true, opacity: 0.85 });
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = -0.18;
plane.position.set(0, -10, 0);
group.add(plane);

function resize(){
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);

let t = 0;
function animate(){
  t += 0.008;
  group.rotation.y = Math.sin(t) * 0.08;
  points.rotation.y = Math.sin(t * 0.6) * 0.06;
  plane.position.y = Math.sin(t * 0.9) * 4;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
resize();
animate();

export default {};

