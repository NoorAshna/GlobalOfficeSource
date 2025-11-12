 import * as THREE from "https://unpkg.com/three@0.161.0/build/three.module.js";

document.addEventListener("DOMContentLoaded", function () {
  // Container setup
  const container = document.getElementById("sphere-container");
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Sphere (core)
  const sphereGeometry = new THREE.SphereGeometry(8, 62, 62);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xff3366,
    wireframe: true,
    transparent: true,
    opacity: 0.6,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphere);

  // --- ICONS SETUP ---
  const iconData = [
    { icon: "headset", color: 0xff3366 },
    { icon: "code", color: 0xff3366 },
    { icon: "palette", color: 0xff3366 },
    { icon: "pen-fancy", color: 0xff3366 },
    { icon: "tasks", color: 0xff3366 },
    { icon: "desktop", color: 0xff3366 },
    { icon: "chart-line", color: 0xff3366 },
    { icon: "envelope-open-text", color: 0xff3366 },
  ];

  const icons = [];
  const radius = 14;

  // Map icon names to FontAwesome unicode
  const iconMap = {
    headset: "\uf590",
    code: "\uf121",
    palette: "\uf53f",
    "pen-fancy": "\uf5ac",
    tasks: "\uf0ae",
    desktop: "\uf108",
    "chart-line": "\uf201",
    "envelope-open-text": "\uf658",
  };

  // Create icons as sprites with transparent backgrounds
  iconData.forEach((data, i) => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 128, 128);

    // Draw icon (no background)
    ctx.fillStyle = `#${data.color.toString(16)}`;
    ctx.font = "80px FontAwesome";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(iconMap[data.icon] || "?", 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);

    // Initial position around sphere
    const angle = (i / iconData.length) * Math.PI * 2;
    sprite.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    sprite.scale.set(2.5, 2.5, 2.5);
    sprite.userData = { angle, speed: 0.01 + Math.random() * 0.01 }; // store angle & speed

    scene.add(sprite);
    icons.push(sprite);
  });

  camera.position.z = 20;

  // --- ANIMATION LOOP ---
  function animate() {
    requestAnimationFrame(animate);

    // Rotate the wireframe sphere
    sphere.rotation.y += 0.002;

    // Orbit the icons
    icons.forEach((icon) => {
      icon.userData.angle += icon.userData.speed; // increment angle
      icon.position.x = Math.cos(icon.userData.angle) * radius;
      icon.position.y = Math.sin(icon.userData.angle) * radius * 0.7; // oval orbit for variation
      icon.lookAt(camera.position);
    });

    renderer.render(scene, camera);
  }

  animate();

  // --- RESIZE HANDLER ---
  window.addEventListener("resize", () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });

  // --- MOUSE INTERACTIVITY ---
  document.addEventListener("mousemove", (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    sphere.rotation.y = mouseX * 0.5;
    sphere.rotation.x = mouseY * 0.3;
  });
});
