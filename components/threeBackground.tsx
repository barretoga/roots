"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const graphGroupRef = useRef<THREE.Group | null>(null);
  const nodesRef = useRef<THREE.Mesh[]>([]);
  const linesRef = useRef<
    {
      line: THREE.Line;
      start: THREE.Vector3;
      end: THREE.Vector3;
      progress: number;
    }[]
  >([]);
  const animationIdRef = useRef<number | null>(null);
  const isFirstRenderRef = useRef(true);
  const autoGrowthTimerRef = useRef<NodeJS.Timeout | null>(null);
  const maxNodesRef = useRef(15);

  useEffect(() => {
    setIsClient(true);

    if (isClient) {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 150;

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

      const graphGroup = new THREE.Group();
      graphGroupRef.current = graphGroup;
      scene.add(graphGroup);

      nodesRef.current = [];
      linesRef.current = [];

      generateNewGraphs(maxNodesRef.current);
      setupAutomaticGrowth();

      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate);

        if (graphGroup) {
          graphGroup.rotation.x += 0.0003;
          graphGroup.rotation.y += 0.0005;
        }

        animateGrowingLines();

        renderer.render(scene, camera);
      };

      animate();

      const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onWindowResize);

      const handleClick = () => {
        maxNodesRef.current += 5;
        generateNewGraphs(maxNodesRef.current);
      };
      window.addEventListener("click", handleClick);

      return () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }

        if (autoGrowthTimerRef.current) {
          clearInterval(autoGrowthTimerRef.current);
        }

        window.removeEventListener("resize", onWindowResize);
        window.removeEventListener("click", handleClick);
        if (renderer.domElement && mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
      };
    }
  }, [isClient]);

  const animateGrowingLines = () => {
    if (!graphGroupRef.current) return;

    const graphGroup = graphGroupRef.current;
    const linesToRemove: number[] = [];

    linesRef.current.forEach((lineObj, index) => {
      if (lineObj.progress < 1) {
        lineObj.progress += 0.005;

        if (lineObj.progress > 1) lineObj.progress = 1;

        const currentPoint = new THREE.Vector3().lerpVectors(
          lineObj.start,
          lineObj.end,
          lineObj.progress
        );

        const points = [lineObj.start, currentPoint];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        lineObj.line.geometry.dispose();
        lineObj.line.geometry = geometry;
      }
    });

    for (let i = linesToRemove.length - 1; i >= 0; i--) {
      const idx = linesToRemove[i];
      graphGroup.remove(linesRef.current[idx].line);
      linesRef.current.splice(idx, 1);
    }
  };

  const setupAutomaticGrowth = () => {
    autoGrowthTimerRef.current = setInterval(() => {
      if (!isFirstRenderRef.current) {
        maxNodesRef.current += 3;
        addMoreNodes(3);
      } else {
        isFirstRenderRef.current = false;
      }
    }, 10000);
  };

  const addMoreNodes = (numNodesToAdd = 3) => {
    if (!graphGroupRef.current) return;

    const graphGroup = graphGroupRef.current;
    const nodes = [...nodesRef.current];
    let addedCount = 0;

    const addNextNode = () => {
      if (addedCount >= numNodesToAdd) return;

      const size = THREE.MathUtils.randFloat(0.3, 0.7);
      const distortion = THREE.MathUtils.randFloat(0.7, 1.3);

      let nodeGeometry;
      const geometryType = Math.floor(Math.random() * 3);

      if (geometryType === 0) {
        nodeGeometry = new THREE.SphereGeometry(size, 4, 4);
      } else if (geometryType === 1) {
        nodeGeometry = new THREE.DodecahedronGeometry(size * 0.8);
      } else {
        nodeGeometry = new THREE.OctahedronGeometry(size);
      }

      const hue = Math.random();
      const saturation = 0.5 + Math.random() * 0.5;
      const lightness = 0.7 + Math.random() * 0.3;
      const color = new THREE.Color().setHSL(hue, saturation, lightness);

      const nodeMaterial = new THREE.MeshPhongMaterial({
        color: color,
        shininess: 70,
        transparent: true,
        opacity: 0.9,
      });

      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);

      node.position.set(
        THREE.MathUtils.randFloatSpread(180),
        THREE.MathUtils.randFloatSpread(180 * distortion),
        THREE.MathUtils.randFloatSpread(180)
      );

      nodes.forEach((existingNode) => {
        const distance = node.position.distanceTo(existingNode.position);

        if (distance < 40 + nodes.length / 10) {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            node.position,
            node.position,
          ]);

          const hueOffset = Math.random() * 0.1;
          const lineColor = new THREE.Color().setHSL(
            (hue + hueOffset) % 1,
            saturation * 0.5,
            lightness * 0.6
          );

          const lineMaterial = new THREE.LineBasicMaterial({
            color: lineColor,
            transparent: true,
            opacity: 0.4,
          });

          const line = new THREE.Line(lineGeometry, lineMaterial);
          graphGroup.add(line);

          linesRef.current.push({
            line: line,
            start: node.position.clone(),
            end: existingNode.position.clone(),
            progress: 0,
          });
        }
      });

      graphGroup.add(node);
      nodes.push(node);
      addedCount++;

      setTimeout(addNextNode, 300);
    };

    addNextNode();

    nodesRef.current = nodes;
  };

  const generateNewGraphs = (maxNodesToAdd = 20) => {
    if (!graphGroupRef.current || !sceneRef.current) return;

    const graphGroup = graphGroupRef.current;

    linesRef.current.forEach((lineObj) => {
      graphGroup.remove(lineObj.line);
    });
    linesRef.current = [];

    nodesRef.current.forEach((node) => {
      graphGroup.remove(node);
    });
    nodesRef.current = [];

    const nodes: THREE.Mesh[] = [];

    let nodesToAdd = maxNodesToAdd;
    let nodesAdded = 0;

    const intervalId = setInterval(() => {
      if (nodesAdded >= nodesToAdd) {
        clearInterval(intervalId);
        return;
      }

      const size = THREE.MathUtils.randFloat(0.3, 0.7);
      const distortion = THREE.MathUtils.randFloat(0.7, 1.3);

      let nodeGeometry;
      const geometryType = Math.floor(Math.random() * 3);

      if (geometryType === 0) {
        nodeGeometry = new THREE.SphereGeometry(size, 4, 4);
      } else if (geometryType === 1) {
        nodeGeometry = new THREE.DodecahedronGeometry(size * 0.8);
      } else {
        nodeGeometry = new THREE.OctahedronGeometry(size);
      }

      const hue = Math.random();
      const saturation = 0.5 + Math.random() * 0.5;
      const lightness = 0.7 + Math.random() * 0.3;
      const color = new THREE.Color().setHSL(hue, saturation, lightness);

      const nodeMaterial = new THREE.MeshPhongMaterial({
        color: color,
        shininess: 70,
        transparent: true,
        opacity: 0.9,
      });

      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);

      node.position.set(
        THREE.MathUtils.randFloatSpread(180),
        THREE.MathUtils.randFloatSpread(180 * distortion),
        THREE.MathUtils.randFloatSpread(180)
      );

      nodes.forEach((existingNode) => {
        const connectionDistance = 40 + nodes.length / 5;
        const distance = node.position.distanceTo(existingNode.position);

        if (distance < connectionDistance) {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            node.position,
            node.position,
          ]);

          const hueOffset = Math.random() * 0.1;
          const lineColor = new THREE.Color().setHSL(
            (hue + hueOffset) % 1,
            saturation * 0.5,
            lightness * 0.6
          );

          const lineMaterial = new THREE.LineBasicMaterial({
            color: lineColor,
            transparent: true,
            opacity: 0.4,
          });

          const line = new THREE.Line(lineGeometry, lineMaterial);
          graphGroup.add(line);

          linesRef.current.push({
            line: line,
            start: node.position.clone(),
            end: existingNode.position.clone(),
            progress: 0,
          });
        }
      });

      graphGroup.add(node);
      nodes.push(node);
      nodesAdded++;

      nodesRef.current = nodes;
    }, 150);
  };

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-[-1] bg-neutral-900"
      title="Clique para adicionar mais grafos"
    />
  );
}
