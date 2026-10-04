"use client";
import { Canvas, useLoader } from "@react-three/fiber";
import { TextureLoader, SRGBColorSpace } from "three";
import { Suspense, useEffect } from "react";
function Globe({ onReady }: { onReady: () => void }) {
  const texture = useLoader(TextureLoader, "/assets/earth-texture.png");
  texture.colorSpace = SRGBColorSpace;
  useEffect(() => {
    onReady();
  }, [onReady]);
  return (
    <>
      <ambientLight intensity={1.9} />
      <directionalLight position={[-3, 6, -4]} intensity={2} />
      <mesh>
        <sphereGeometry args={[1.7, 64, 48]} />
        <meshStandardMaterial map={texture} roughness={1} metalness={0} />
      </mesh>
    </>
  );
}
export default function EarthScene({
  onReady,
  onFailure,
  lowPower,
}: {
  onReady: () => void;
  onFailure: () => void;
  lowPower: boolean;
}) {
  return (
    <Canvas
      frameloop="demand"
      dpr={lowPower ? 1 : [1, 1.5]}
      camera={{ position: [0, 4.42, -3.1], fov: 43 }}
      gl={{ alpha: true, antialias: !lowPower, powerPreference: "low-power" }}
      onCreated={({ gl, camera }) => {
        camera.lookAt(0, 0, 0);
        gl.domElement.addEventListener("webglcontextlost", onFailure, {
          once: true,
        });
      }}
      fallback={null}
    >
      <Suspense fallback={null}>
        <Globe onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
