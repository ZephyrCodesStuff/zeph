"use client";

import { Canvas, extend } from "@react-three/fiber";
import { useState, useEffect } from "react";

import * as THREE from "three";
import { Vector3 } from "three";
import { UnrealBloomPass } from "three/examples/jsm/Addons.js";

import { Hotspot, hotspots, Hotspots } from "./components/hotspots";
import { OilPaintingShader } from "./components/shader";
import { FloatingCamera } from "./components/camera";
import { ControlBar } from "./components/controlBar";
import { LightShaft } from "./components/effects/light";
import { AtmosphericParticles } from "./components/effects/particles";
import { SocialBar } from "./components/socialBar";
import { MobileHotspotSelector } from "./components/mobileHotspotSelector";
import { OrientationWarning } from "./components/orientationWarning";
import { BASE_CAMERA_POSITION, BASE_LOOK_AT, BASE_ZOOM, MOBILE_ZOOM } from "./lib/constants";

const Background = ({
  onHotspotClick,
  selectedHotspot,
  dimAmount,
}: {
  onHotspotClick: (hotspot: Hotspot) => void;
  selectedHotspot: Hotspot | null;
  dimAmount: number;
}) => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <OilPaintingShader dimAmount={dimAmount} />
      <Hotspots
        onHotspotClick={onHotspotClick}
        selectedHotspot={selectedHotspot}
      />
      <LightShaft />
      <AtmosphericParticles />
    </>
  );
};

export default function Home() {
  // Extend R3F to recognize shaderMaterial
  extend({
    ShaderMaterial: THREE.ShaderMaterial,
    UnrealBloomPass: UnrealBloomPass,
  });

  const [targetPosition, setTargetPosition] = useState(BASE_CAMERA_POSITION);
  const [targetLookAt, setTargetLookAt] = useState(BASE_LOOK_AT);
  const [targetZoom, setTargetZoom] = useState(BASE_ZOOM);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [dimAmount, setDimAmount] = useState(0);

  // Track if we're on mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (selectedHotspot?.id === hotspot.id) {
      handleOverviewClick();
      return;
    }

    setTargetPosition(new Vector3(...hotspot.cameraPosition));
    setTargetLookAt(new Vector3(...hotspot.lookAt));
    // Use different zoom level for mobile
    setTargetZoom(isMobile ? MOBILE_ZOOM : (hotspot.cameraPosition[2] > 2 ? 1 : 0.5));
    setSelectedHotspot(hotspot);
    setDimAmount(0);
  };

  const handleOverviewClick = () => {
    setTargetPosition(BASE_CAMERA_POSITION);
    setTargetLookAt(BASE_LOOK_AT);
    setTargetZoom(BASE_ZOOM);
    setSelectedHotspot(null);
    setDimAmount(0.5);
  };

  // Adjust zoom steps for mobile
  const handleZoomIn = () => {
    setTargetZoom((prev) => Math.max(isMobile ? 0.5 : 0.25, prev - (isMobile ? 0.1 : 0.25)));
  };

  const handleZoomOut = () => {
    setTargetZoom((prev) => Math.min(1, prev + (isMobile ? 0.1 : 0.25)));
  };

  return (
    <>
      <OrientationWarning />
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Background
          onHotspotClick={handleHotspotClick}
          selectedHotspot={selectedHotspot}
          dimAmount={dimAmount}
        />
        <FloatingCamera
          targetPosition={targetPosition}
          targetLookAt={targetLookAt}
          targetZoom={targetZoom}
          selectedHotspot={selectedHotspot}
          setTargetZoom={setTargetZoom}
          setTargetPosition={setTargetPosition}
          setTargetLookAt={setTargetLookAt}
          setSelectedHotspot={setSelectedHotspot}
          setDimAmount={setDimAmount}
        />
      </Canvas>
      <ControlBar
        onOverviewClick={handleOverviewClick}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
      <SocialBar />
      <MobileHotspotSelector 
        hotspots={hotspots} 
        selectedHotspot={selectedHotspot}
        onHotspotClick={handleHotspotClick}
      />
    </>
  );
}
