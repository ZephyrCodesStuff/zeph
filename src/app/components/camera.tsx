import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import { Vector3 } from "three";

import { Hotspot } from "./hotspots";

import * as THREE from "three";
import { BASE_CAMERA_POSITION, BASE_LOOK_AT, BASE_ZOOM } from "../lib/constants";

export const FloatingCamera = ({
  targetPosition,
  targetLookAt,
  targetZoom,
  selectedHotspot,
  setTargetZoom,
  setTargetPosition,
  setTargetLookAt,
  setSelectedHotspot,
  setDimAmount,
}: {
  targetPosition: Vector3;
  targetLookAt: Vector3;
  targetZoom: number;
  selectedHotspot: Hotspot | null;
  setTargetZoom: (zoom: number) => void;
  setTargetPosition: (position: Vector3) => void;
  setTargetLookAt: (lookAt: Vector3) => void;
  setSelectedHotspot: (hotspot: Hotspot | null) => void;
  setDimAmount: (amount: number) => void;
}) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const currentLookAt = useRef(new Vector3(-1.5, -0.9, 0));
  const baseZ = 3;

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY > 0) {
        setTargetPosition(BASE_CAMERA_POSITION);
        setTargetLookAt(BASE_LOOK_AT);
        setTargetZoom(BASE_ZOOM);
        setSelectedHotspot(null);
        setDimAmount(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("wheel", handleWheel);
    };
  });

  useFrame(({ clock }) => {
    if (!cameraRef.current) return;

    const t = clock.getElapsedTime();

    // Calculate floating motion
    const floatX = Math.sin(t * 0.5) * 0.05;
    const floatY = Math.cos(t * 0.7) * 0.05;
    const floatZ = Math.sin(t * 0.3) * 0.025;

    // Calculate parallax
    const parallaxX = mousePosition.x * 0.2;
    const parallaxY = mousePosition.y * 0.2;
    const zoomedZ = baseZ * targetZoom;

    // Calculate target position with float and parallax
    const targetX = targetPosition.x + floatX + parallaxX * targetZoom;
    const targetY = targetPosition.y + floatY + parallaxY * targetZoom;
    const targetZ = zoomedZ + floatZ;

    // Smooth camera movement
    cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.05;
    cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.05;
    cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * 0.05;

    // Calculate target lookAt point with parallax and float
    const targetLookAtX = targetLookAt.x + parallaxX * 0.5 * targetZoom + floatX * 0.2;
    const targetLookAtY = targetLookAt.y + parallaxY * 0.5 * targetZoom + floatY * 0.2;

    // Smooth lookAt transition
    currentLookAt.current.x += (targetLookAtX - currentLookAt.current.x) * 0.05;
    currentLookAt.current.y += (targetLookAtY - currentLookAt.current.y) * 0.05;
    currentLookAt.current.z += (0 - currentLookAt.current.z) * 0.05;
        
    cameraRef.current.lookAt(currentLookAt.current);
    // Interpolate dimming - reversed logic
    // @ts-expect-error - This is a hack to get the type to work
    setDimAmount((prev: number) => {
      if (selectedHotspot) {
        // Fade in dimming when approaching hotspot
        return Math.min(0.5, prev + 0.01);
      } else {
        // Fade out dimming when returning to overview
        return Math.max(0, prev - 0.01);
      }
    });
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[-1.75, -1, baseZ]}
      fov={90}
    />
  );
};
