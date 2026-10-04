"use client";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import { CanvasTexture, Color, Group, Mesh, NoColorSpace, SRGBColorSpace, Sprite, TextureLoader, Vector3 } from "three";
import { CAMERA_POSITION, EARTH_VIEW, starPoint } from "@/lib/earth-model";
import { programs } from "@/lib/content";

type SceneProps = {
  onReady: () => void;
  onFailure: () => void;
  lowPower: boolean;
  moving: boolean;
  selected: string | null;
  labels: RefObject<Record<string, HTMLDivElement | null>>;
  capture?: boolean;
};
function makeStarTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const halo = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  halo.addColorStop(0, "rgba(255,255,244,1)");
  halo.addColorStop(.1, "rgba(255,247,216,1)");
  halo.addColorStop(.24, "rgba(242,192,103,.7)");
  halo.addColorStop(.55, "rgba(236,185,99,.19)");
  halo.addColorStop(1, "rgba(236,185,99,0)");
  ctx.fillStyle = halo; ctx.fillRect(0,0,128,128);
  ctx.fillStyle = "rgba(255,250,229,.9)";
  ctx.beginPath();
  ctx.moveTo(64,21); ctx.quadraticCurveTo(67,60,104,64);
  ctx.quadraticCurveTo(67,68,64,107); ctx.quadraticCurveTo(61,68,24,64);
  ctx.quadraticCurveTo(61,60,64,21); ctx.fill();
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace;
  return texture;
}
const atmosphereVertex = `varying vec3 vNormal; varying vec3 vView;
void main(){vec4 p=modelViewMatrix*vec4(position,1.); vNormal=normalize(normalMatrix*normal);vView=normalize(-p.xyz);gl_Position=projectionMatrix*p;}`;
const atmosphereFragment = `varying vec3 vNormal; varying vec3 vView;
void main(){vec3 normal=normalize(vNormal); float facing=max(dot(normal,normalize(vView)),0.); float rim=pow(1.-facing,1.9); float edge=smoothstep(0.,.08,facing); float sun=max(dot(normal,normalize(vec3(-.7,.8,.35))),0.); vec3 air=mix(vec3(.28,.55,.78),vec3(.85,.95,1.),sun); gl_FragColor=vec4(air,rim*edge*(.15+.85*sun)*.85);}`;
// The source's polar infill converges at the UV pole; fade only that cloud cap.
function softenCloudPoles(shader: { vertexShader: string; fragmentShader: string }) {
  shader.vertexShader = "varying float vCloudLatitude;\n" + shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvCloudLatitude = position.y / 1.012;");
  shader.fragmentShader = "varying float vCloudLatitude;\n" + shader.fragmentShader.replace("#include <alphamap_fragment>", "#include <alphamap_fragment>\ndiffuseColor.a *= 1. - smoothstep(.92, .99, abs(vCloudLatitude));");
}
function Globe(props: SceneProps) {
  const { lowPower, moving, selected, labels, onReady, onFailure } = props;
  const { camera, size, invalidate, gl } = useThree();
  const maps = useLoader(TextureLoader, [
    `/assets/earth/surface-${lowPower ? 2048 : 4096}.webp`,
    `/assets/earth/clouds-${lowPower ? 1024 : 2048}.webp`,
  ]);
  // Own clones so unmount releases GPU textures without poisoning useLoader's cache.
  const [surface, clouds] = useMemo(() => {
    const surface = maps[0].clone(), clouds = maps[1].clone();
    surface.colorSpace = SRGBColorSpace; surface.anisotropy = lowPower ? 2 : 4;
    clouds.colorSpace = NoColorSpace;
    surface.needsUpdate = clouds.needsUpdate = true;
    return [surface, clouds];
  }, [maps, lowPower]);
  const starTexture = useMemo(makeStarTexture, []);
  const earth = useRef<Group>(null), cloudSphere = useRef<Mesh>(null);
  const stars = useRef<Array<Sprite | null>>([]), time = useRef(0), frames = useRef(0);
  const vector = useMemo(() => new Vector3(), []);
  useEffect(() => () => { surface.dispose(); clouds.dispose(); starTexture.dispose(); }, [surface, clouds, starTexture]);
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);
  useEffect(() => { invalidate(); }, [moving, selected, size, invalidate]);
  useFrame((_, delta) => {
    if (moving) time.current += Math.min(delta, .04);
    const t = time.current;
    if (earth.current) {
      earth.current.rotation.y = Math.sin(t * .075) * .012;
      earth.current.rotation.x = Math.sin(t * .06) * .006;
      earth.current.updateMatrixWorld();
    }
    if (cloudSphere.current) cloudSphere.current.rotation.y = t * .002;
    programs.forEach((program, i) => {
      const point = starPoint(program.id, t);
      const star = stars.current[i];
      if (star) {
        star.position.set(...point);
        star.scale.setScalar(program.id === selected ? .115 : .08);
      }
      vector.set(...point);
      if (earth.current) vector.applyMatrix4(earth.current.matrixWorld);
      vector.project(camera);
      const label = labels.current[program.id];
      if (label) {
        label.style.setProperty("--star-x", `${(vector.x * .5 + .5) * size.width}px`);
        label.style.setProperty("--star-y", `${(-vector.y * .5 + .5) * size.height}px`);
      }
    });
    // Publish ready only after the first actual render, including paused scenes.
    if (++frames.current === 2) onReady();
    if (moving || frames.current < 2) invalidate();
  });
  return (
    <>
      <ambientLight intensity={1.05} />
      <directionalLight position={[4, 5, -1]} color="#fff9f0" intensity={4.4} />
      <directionalLight position={[-2, 1, -4]} color="#d5eaff" intensity={.2} />
      <group ref={earth}>
        <mesh>
          <sphereGeometry args={[1, lowPower ? 64 : 96, lowPower ? 48 : 64]} />
          <meshStandardMaterial map={surface} roughness={.94} metalness={0} />
        </mesh>
        <mesh ref={cloudSphere}>
          <sphereGeometry args={[1.012, 64, 48]} />
          <meshStandardMaterial color="#ffffff" alphaMap={clouds} onBeforeCompile={softenCloudPoles} transparent opacity={.42} depthWrite={false} roughness={1} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.006, 96, 64]} />
          <shaderMaterial vertexShader={atmosphereVertex} fragmentShader={atmosphereFragment} transparent depthWrite={false} />
        </mesh>
        {!props.capture && programs.map((p, i) => (
          <sprite key={p.id} ref={(el) => { stars.current[i] = el; }} position={starPoint(p.id)} scale={.08}>
            <spriteMaterial map={starTexture} transparent depthWrite={false} toneMapped={false} />
          </sprite>
        ))}
      </group>
    </>
  );
}
export default function EarthScene(props: SceneProps) {
  return (
    <Canvas
      frameloop="demand"
      dpr={props.lowPower ? 1 : [1, 1.5]}
      camera={{ position: CAMERA_POSITION, fov: EARTH_VIEW.fov, near: .1, far: 20 }}
      gl={{ alpha: true, antialias: !props.lowPower, powerPreference: "low-power", preserveDrawingBuffer: props.capture }}
      onCreated={({ camera, gl }) => {
        camera.lookAt(0, 0, 0);
        gl.setClearColor(new Color("#fafaf7"), 0);
        gl.toneMappingExposure = 1.14;
      }}
      fallback={null}
    >
      <Suspense fallback={null}><Globe {...props} /></Suspense>
    </Canvas>
  );
}