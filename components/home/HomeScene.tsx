"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { sceneState } from "@/lib/scene-state";
import { buildAllFormations, DESKTOP_COUNT, MOBILE_COUNT } from "./formations";
import { particleFragment, particleVertex } from "./particle-shaders";

type SceneProps = {
  onProgress?: (p: number) => void;
  onReady?: () => void;
};

function Particles({
  formations,
  count,
  onReady,
}: {
  formations: Float32Array[];
  count: number;
  onReady?: () => void;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const firstFrame = useRef(false);
  const { gl } = useThree();

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    formations.forEach((f, i) => {
      geo.setAttribute(`aP${i}`, new THREE.BufferAttribute(f, 3));
    });
    // position attribute is required by three even though the shader ignores it
    geo.setAttribute("position", new THREE.BufferAttribute(formations[0], 3));

    const seeds = new Float32Array(count * 4);
    for (let i = 0; i < count * 4; i++) seeds[i] = Math.random();
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 30);

    const mat = new THREE.ShaderMaterial({
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uW0: { value: 1 },
        uW1: { value: 0 },
        uW2: { value: 0 },
        uW3: { value: 0 },
        uW4: { value: 0 },
        uW5: { value: 0 },
        uW6: { value: 0 },
        uW7: { value: 0 },
        uTime: { value: 0 },
        uTurb: { value: 1 },
        uSize: { value: 1 },
        uPixelRatio: { value: 1 },
        uReveal: { value: 0 },
        uHue: { value: new THREE.Vector3(0.92, 0.9, 0.86) },
        uOpacity: { value: 0 },
      },
    });
    return { geometry: geo, material: mat };
  }, [formations, count]);

  useEffect(() => {
    material.uniforms.uPixelRatio.value = gl.getPixelRatio();
  }, [gl, material]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state, delta) => {
    const u = material.uniforms;
    u.uTime.value += Math.min(delta, 0.05);
    const w = sceneState.weights;
    u.uW0.value = w[0];
    u.uW1.value = w[1];
    u.uW2.value = w[2];
    u.uW3.value = w[3];
    u.uW4.value = w[4];
    u.uW5.value = w[5];
    u.uW6.value = w[6];
    u.uW7.value = w[7];
    u.uTurb.value = sceneState.turbulence;
    u.uSize.value = sceneState.size;
    u.uOpacity.value = sceneState.opacity;
    u.uReveal.value = sceneState.revealed;
    u.uHue.value.set(sceneState.hue[0], sceneState.hue[1], sceneState.hue[2]);

    // camera rig — timelines write, the rig eases
    const cam = state.camera;
    cam.position.x += (sceneState.camX - cam.position.x) * 0.07;
    cam.position.y += (sceneState.camY - cam.position.y) * 0.07;
    cam.position.z += (sceneState.camZ - cam.position.z) * 0.07;
    cam.lookAt(0, sceneState.lookY, 0);

    if (!firstFrame.current) {
      firstFrame.current = true;
      onReady?.();
    }
  });

  return (
    <points
      geometry={geometry}
      material={material}
      frustumCulled={false}
      ref={(p) => {
        if (p) materialRef.current = material;
      }}
    />
  );
}

export default function HomeScene({ onProgress, onReady }: SceneProps) {
  const [formations, setFormations] = useState<Float32Array[] | null>(null);
  const [count] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768
      ? MOBILE_COUNT
      : DESKTOP_COUNT
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      onProgress?.(0.15);
      // the title formation samples real type — wait briefly for fonts
      await Promise.race([
        document.fonts?.ready,
        new Promise((r) => setTimeout(r, 1500)),
      ]);
      if (cancelled) return;
      onProgress?.(0.4);
      const family =
        getComputedStyle(document.body).fontFamily || "sans-serif";
      // build off the critical path so the preloader can paint
      await new Promise((r) => setTimeout(r, 30));
      const built = buildAllFormations(count, family);
      if (cancelled) return;
      onProgress?.(0.85);
      setFormations(built);
    })();
    return () => {
      cancelled = true;
    };
  }, [count, onProgress]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {formations && (
        <Canvas
          dpr={[1, 1.75]}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
          }}
          camera={{ fov: 42, near: 0.1, far: 60, position: [0, 0, 11] }}
          events={undefined}
        >
          <Particles formations={formations} count={count} onReady={onReady} />
        </Canvas>
      )}
      {/* stage vignette — keeps the edges of the frame dark */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 42%, transparent 0%, transparent 55%, rgba(11,11,12,0.72) 100%)",
        }}
      />
    </div>
  );
}
