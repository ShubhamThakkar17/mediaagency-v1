'use client';
import { Environment, Lightformer, MeshDistortMaterial, RoundedBox, View } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { ServiceObject } from '@/content/services';

type Shared = { color: THREE.Color; reduced: boolean };

function useBrandColor() {
  const [color] = useState(() => new THREE.Color('#FF6036'));
  useEffect(() => {
    const read = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
      if (v) color.set(v);
    };
    read();
    window.addEventListener('themechange', read);
    return () => window.removeEventListener('themechange', read);
  }, [color]);
  return color;
}

function Glossy({ color, ...rest }: { color: THREE.Color } & Partial<THREE.MeshPhysicalMaterialParameters>) {
  return <meshPhysicalMaterial color={color} clearcoat={1} clearcoatRoughness={0.08} roughness={0.15} metalness={0.05} {...rest} />;
}

function Shape({ kind, color }: { kind: ServiceObject; color: THREE.Color }) {
  switch (kind) {
    case 'torus':
      return (
        <mesh rotation={[0.9, 0.2, 0]}>
          <torusGeometry args={[0.95, 0.42, 48, 120]} />
          <Glossy color={color} />
        </mesh>
      );
    case 'capsules':
      return (
        <group rotation={[0, 0, 0.5]}>
          {[-0.62, 0, 0.62].map((x, i) => (
            <mesh key={x} position={[x, i === 1 ? 0.18 : -0.1, 0]} rotation={[0, 0, i === 1 ? 0 : 0.12 * (i - 1)]}>
              <capsuleGeometry args={[0.27, 1.15, 12, 32]} />
              <Glossy color={color} />
            </mesh>
          ))}
        </group>
      );
    case 'starburst':
      return (
        <group>
          {Array.from({ length: 10 }, (_, i) => (
            <mesh key={i} rotation={[0, 0, (i / 10) * Math.PI]} >
              <capsuleGeometry args={[0.15, 2.0, 10, 24]} />
              <Glossy color={color} />
            </mesh>
          ))}
          <mesh>
            <sphereGeometry args={[0.36, 32, 32]} />
            <Glossy color={color} />
          </mesh>
        </group>
      );
    case 'blobs':
      return (
        <group>
          {(
            [
              [0, 0.15, 0, 0.72],
              [-0.72, -0.42, 0.2, 0.46],
              [0.7, -0.36, -0.1, 0.52],
              [0.2, 0.92, -0.3, 0.34],
            ] as const
          ).map(([x, y, z, r], i) => (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[r, 64, 64]} />
              <MeshDistortMaterial color={color} clearcoat={1} clearcoatRoughness={0.1} roughness={0.15} distort={0.32} speed={1.6} />
            </mesh>
          ))}
        </group>
      );
    case 'cube':
      // A rounded square frame: a cube with its centre cut out.
      return (
        <group rotation={[0.5, 0.6, 0]}>
          {(
            [
              [0, 0.68, 1.75, 0.42],
              [0, -0.68, 1.75, 0.42],
              [0.68, 0, 0.42, 1.75],
              [-0.68, 0, 0.42, 1.75],
            ] as const
          ).map(([x, y, w, h], i) => (
            <RoundedBox key={i} args={[w, h, 1.1]} radius={0.18} smoothness={5} position={[x, y, 0]}>
              <Glossy color={color} />
            </RoundedBox>
          ))}
        </group>
      );
    case 'knot':
      return (
        <mesh>
          <torusKnotGeometry args={[0.72, 0.24, 220, 32, 2, 3]} />
          <Glossy color={color} />
        </mesh>
      );
  }
}

function Rig({ kind, hovered, shared }: { kind: ServiceObject; hovered: boolean; shared: Shared }) {
  const group = useRef<THREE.Group>(null);
  const t = useRef(Math.random() * 10);
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    if (!shared.reduced) t.current += dt;
    const px = shared.reduced ? 0 : state.pointer.x;
    const py = shared.reduced ? 0 : state.pointer.y;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, t.current * 0.35 + px * 0.5, 4, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -py * 0.35 + Math.sin(t.current * 0.6) * 0.08, 4, dt);
    const sy = hovered ? 0.86 : 1;
    const sxz = hovered ? 1.1 : 1;
    g.scale.x = THREE.MathUtils.damp(g.scale.x, sxz, 8, dt);
    g.scale.y = THREE.MathUtils.damp(g.scale.y, sy, 8, dt);
    g.scale.z = THREE.MathUtils.damp(g.scale.z, sxz, 8, dt);
  });
  return (
    <group ref={group}>
      <Shape kind={kind} color={shared.color} />
    </group>
  );
}

function Studio() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 4]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="ring" intensity={2} position={[4, 1, 3]} scale={2} color="#ffffff" />
        <Lightformer form="rect" intensity={0.6} position={[0, -4, 1]} rotation-x={Math.PI / 2} scale={[8, 4, 1]} color="#ffd9cc" />
      </Environment>
    </>
  );
}

/** Rendered inside a card: drei <View> creates the DOM box and tunnels the scene into the shared canvas. */
export function ServiceView({ kind, hovered, reduced }: { kind: ServiceObject; hovered: boolean; reduced: boolean }) {
  const color = useBrandColor();
  const shared = useMemo<Shared>(() => ({ color, reduced }), [color, reduced]);
  return (
    <View className="absolute inset-0">
      <Studio />
      <Rig kind={kind} hovered={hovered} shared={shared} />
    </View>
  );
}

/**
 * One shared WebGL canvas for all six service objects (drei <View>, BRIEF §7.3).
 * Rendering stops when the services section is off-screen.
 */
export function ServiceCanvas({ active, reduced }: { active: boolean; reduced: boolean }) {
  const [eventSource, setEventSource] = useState<HTMLElement | undefined>();
  useEffect(() => setEventSource(document.body), []);
  if (!eventSource) return null;
  return (
    <Canvas
      eventSource={eventSource}
      eventPrefix="client"
      frameloop={active ? (reduced ? 'demand' : 'always') : 'never'}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 4.4], fov: 38 }}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}
      aria-hidden
    >
      <View.Port />
    </Canvas>
  );
}
