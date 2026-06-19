"use client";

import React, { useEffect, useRef } from 'react';

const AboutHero3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    let THREE;
    let renderer, scene, camera, mesh, particles;
    let animationFrameId;
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    const init = async () => {
      // Dynamic import of Three.js to ensure SSR safety
      THREE = await import('three');

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      // ── 1. Scene, Camera & Renderer ──
      scene = new THREE.Scene();
      
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 8;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      containerRef.current.appendChild(renderer.domElement);

      // ── 2. Lights ──
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      // Point light that will follow mouse coordinates slightly
      const pointLight = new THREE.PointLight(0xb2000a, 2, 20); // Crimson Red glow
      pointLight.position.set(0, 0, 2);
      scene.add(pointLight);

      // ── 3. Central Geometry (Futuristic Monolithic Icosahedron) ──
      const geometry = new THREE.IcosahedronGeometry(1.6, 1); // Architectural faceted shape
      const material = new THREE.MeshStandardMaterial({
        color: 0x2b2b2b,
        metalness: 0.85,
        roughness: 0.15,
        wireframe: true, // Wireframe styling for clean digital drafting feel
      });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Add a solid inner core with a golden metallic glow
      const coreGeo = new THREE.IcosahedronGeometry(0.8, 0);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xb2000a, // Marquis Crimson
        metalness: 0.9,
        roughness: 0.1,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      mesh.add(coreMesh);

      // ── 4. Particle Field (Dust motes floating in light) ──
      const particleCount = 100;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const particleMat = new THREE.PointsMaterial({
        color: 0xb2000a,
        size: 0.04,
        transparent: true,
        opacity: 0.6,
      });

      particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // ── 5. Mouse Move Handler ──
      const handleMouseMove = (e) => {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
        mouseY = -((e.clientY - rect.top) / height) * 2 + 1;
      };

      window.addEventListener('mousemove', handleMouseMove);

      // ── 6. Animation Loop ──
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        // Smooth interpolation for mouse movements (LERP)
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        // Rotate central monolith
        mesh.rotation.y += 0.005;
        mesh.rotation.x += 0.003;

        // Mouse influence on rotation
        mesh.rotation.y += targetX * 0.02;
        mesh.rotation.x += targetY * 0.02;

        // Point light moves with target coordinates
        pointLight.position.x = targetX * 4;
        pointLight.position.y = targetY * 4;

        // Rotate particle system slowly
        particles.rotation.y -= 0.001;

        renderer.render(scene, camera);
      };

      animate();

      // ── 7. Resize Handler ──
      const handleResize = () => {
        if (!containerRef.current) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;

        camera.aspect = w / h;
        camera.updateProjectionMatrix();

        renderer.setSize(w, h);
      };

      window.addEventListener('resize', handleResize);

      // Return cleanup function
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        
        // Dispose geometries and materials to clear memory
        geometry.dispose();
        material.dispose();
        coreGeo.dispose();
        coreMat.dispose();
        particleGeo.dispose();
        particleMat.dispose();

        if (renderer && renderer.domElement && containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    };

    let cleanupFn;
    init().then(cleanup => {
      cleanupFn = cleanup;
    });

    return () => {
      if (cleanupFn) cleanupFn();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full" 
      style={{ overflow: 'hidden', position: 'relative' }}
    />
  );
};

export default AboutHero3D;
