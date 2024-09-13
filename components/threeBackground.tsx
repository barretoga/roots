"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (isClient) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 100;

      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement);
      }

      const ambientLight = new THREE.AmbientLight(0x404040, 2);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 1.5);
      pointLight.position.set(50, 50, 50);
      scene.add(pointLight);

      const particleCount = 10000;
      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      const colors = [];

      for (let i = 0; i < particleCount; i++) {
        const x = THREE.MathUtils.randFloatSpread(400);
        const y = THREE.MathUtils.randFloatSpread(400);
        const z = THREE.MathUtils.randFloatSpread(400);
        vertices.push(x, y, z);

        const color = new THREE.Color();
        color.setHSL(i / particleCount, 1.0, 0.5);
        colors.push(color.r, color.g, color.b);
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({ size: 1.5, vertexColors: true });
      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      const animate = () => {
        requestAnimationFrame(animate);

        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.001;

        renderer.render(scene, camera);
      };
      animate();

      const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onWindowResize);

      return () => {
        window.removeEventListener('resize', onWindowResize);
        if (renderer.domElement && mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
      };
    }
  }, [isClient]);

  return <div ref={mountRef} className="fixed inset-0 z-[-1]" />;
}
