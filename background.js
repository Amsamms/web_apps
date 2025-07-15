import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

class Background {
  constructor() {
    this.container = document.getElementById('threejs-container');
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.particles = [];
    this.init();
  }

  init() {
    // Setup renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    // Setup camera
    this.camera.position.z = 5;

    // Create particles with a more subtle effect
    const geometry = new THREE.SphereGeometry(0.05, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.3
    });

    // Create fewer, larger particles
    for (let i = 0; i < 50; i++) {
      const particle = new THREE.Mesh(geometry, material);
      particle.position.x = (Math.random() - 0.5) * 15;
      particle.position.y = (Math.random() - 0.5) * 15;
      particle.position.z = (Math.random() - 0.5) * 15;
      particle.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01
      );
      this.particles.push(particle);
      this.scene.add(particle);
    }

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize(), false);

    // Start animation
    this.animate();
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Update particles with smoother movement
    this.particles.forEach(particle => {
      particle.position.add(particle.velocity);

      // Bounce off boundaries with smoother transitions
      if (Math.abs(particle.position.x) > 7.5) particle.velocity.x *= -1;
      if (Math.abs(particle.position.y) > 7.5) particle.velocity.y *= -1;
      if (Math.abs(particle.position.z) > 7.5) particle.velocity.z *= -1;

      // Subtle rotation
      particle.rotation.x += 0.005;
      particle.rotation.y += 0.005;
    });

    // Very subtle camera movement
    this.camera.position.x = Math.sin(Date.now() * 0.00005) * 0.3;
    this.camera.position.y = Math.cos(Date.now() * 0.00005) * 0.3;

    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Background();
}); 