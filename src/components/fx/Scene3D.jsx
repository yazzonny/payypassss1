import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Lightweight Three.js backdrop: glowing wireframe shapes + particles
 * that float and react to the mouse. Pauses when off-screen / tab hidden.
 */
export const Scene3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 9;

    scene.add(new THREE.AmbientLight(0x8b7cff, 0.7));
    const key = new THREE.PointLight(0xa78bfa, 60, 40);
    key.position.set(4, 4, 6);
    scene.add(key);

    const makeMat = (color, wire) => new THREE.MeshStandardMaterial({
      color, metalness: 0.6, roughness: 0.25, wireframe: wire,
      emissive: color, emissiveIntensity: wire ? 0.9 : 0.25,
      transparent: true, opacity: wire ? 0.4 : 0.55,
    });

    const shapes = [];
    const add = (geo, color, wire, x, y, z, s) => {
      const m = new THREE.Mesh(geo, makeMat(color, wire));
      m.position.set(x, y, z); m.scale.setScalar(s);
      m.userData = { bx: x, by: y, sp: 0.15 + Math.random() * 0.25, ph: Math.random() * 6.28 };
      scene.add(m); shapes.push(m);
    };
    add(new THREE.TorusKnotGeometry(1, 0.32, 120, 16), 0x7c5cfc, false, 7.4, -1.2, -2.5, 0.8);
    add(new THREE.IcosahedronGeometry(1, 1), 0xa78bfa, true, 5.2, 3.2, -2, 0.9);
    add(new THREE.OctahedronGeometry(1, 0), 0x38bdf8, true, -13, -3.4, -3, 0.8);
    add(new THREE.TorusGeometry(0.9, 0.22, 20, 60), 0xc4b5fd, false, 8.6, -3.4, -2.5, 0.6);
    add(new THREE.BoxGeometry(1, 1, 1), 0x6842f4, true, -9, 3.6, -3, 0.8);

    // particles
    const N = 220;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const points = new THREE.Points(pg, new THREE.PointsMaterial({
      color: 0xc4b5fd, size: 0.05, transparent: true, opacity: 0.7, depthWrite: false,
    }));
    scene.add(points);

    const resize = () => {
      const w = mount.clientWidth || 1, h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let visible = true, raf = 0;
    const clock = new THREE.Clock();
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      const t = clock.getElapsedTime();
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      camera.position.x = mouse.x * 0.9;
      camera.position.y = -mouse.y * 0.6;
      camera.lookAt(0, 0, 0);
      shapes.forEach((m) => {
        const u = m.userData;
        m.rotation.x = t * u.sp; m.rotation.y = t * u.sp * 1.3;
        m.position.y = u.by + Math.sin(t * u.sp * 3 + u.ph) * 0.35;
      });
      points.rotation.y = t * 0.02;
      renderer.render(scene, camera);
    };
    if (reduce) { renderer.render(scene, camera); } else { frame(); }

    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      shapes.forEach((m) => { m.geometry.dispose(); m.material.dispose(); });
      pg.dispose(); points.material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="scene3d" aria-hidden="true" />;
};
