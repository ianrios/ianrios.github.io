import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import { Button } from '../components/atoms/Button';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';

const IS_MOBILE =
  /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent,
  );

const RESOLUTION = IS_MOBILE ? 60 : 100;
const NUM_BLOBS = IS_MOBILE ? 10 : 30;
const ISOLATION = IS_MOBILE ? 250 : 400;
const SPEED = 0.1;

export default function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const showBackLink = location.key !== 'default';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let time = 0;

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000,
    );
    camera.position.set(-200, 500, 1500);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0.5, 0.5, 1);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xff3300);
    pointLight.position.set(0, 0, 100);
    scene.add(pointLight);

    scene.add(new THREE.AmbientLight(0x080808));

    const material = new THREE.MeshPhongMaterial({
      specular: 0x111111,
      shininess: 1,
    });
    const effect = new MarchingCubes(RESOLUTION, material, true, true, 100000);
    effect.position.set(0, 0, 0);
    effect.scale.set(1400, 1400, 1400);
    effect.enableUvs = false;
    effect.enableColors = false;
    effect.isolation = ISOLATION;
    scene.add(effect);

    const renderer = new THREE.WebGLRenderer();
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 500;
    controls.maxDistance = 5000;

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    const timer = new THREE.Timer();
    let animId: number;

    function updateCubes() {
      effect.reset();
      const subtract = 12;
      const strength = 1.2 / ((Math.sqrt(NUM_BLOBS) - 1) / 4 + 1);
      for (let i = 0; i < NUM_BLOBS; i++) {
        const ballx =
          Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 +
          0.5;
        const bally =
          Math.abs(Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))) *
          0.77;
        const ballz =
          Math.cos(i + 1.32 * time * 0.1 * Math.sin(0.92 + 0.53 * i)) * 0.27 +
          0.5;
        effect.addBall(ballx, bally, ballz, strength, subtract);
      }
      effect.update();
    }

    function animate() {
      animId = requestAnimationFrame(animate);
      timer.update();
      time += timer.getDelta() * SPEED * 0.5;
      updateCubes();
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="skeu-scene-container" />
      {showBackLink && (
        <span className="skeu-scene-back">
          <Button
            as="link"
            href="/"
            routerState={{ view: 'main' }}
            size="xs"
            variant="surface"
          >
            ← Portfolio
          </Button>
        </span>
      )}
    </>
  );
}
