import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { Mesh, ShaderMaterial } from "three";

import * as THREE from "three";

export const OilPaintingShader = ({ dimAmount = 0 }: { dimAmount?: number }) => {
  const meshRef = useRef<Mesh>(null);
  const shaderRef = useRef<ShaderMaterial>(null);

  const paintingTexture = useTexture("./textures/background.jpg");

  // Animation for subtle movement
  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
      shaderRef.current.uniforms.uDimAmount.value = dimAmount;
    }
  });

  // Shader uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0.0 },
      uLightPos: { value: new THREE.Vector3(5, 5, 5) },
      uShininess: { value: 100.0 }, // Reduced shininess for smoother look
      uSpecularStrength: { value: 2.0 }, // Increased specular strength
      uTextureScale: { value: 8.0 }, // Reduced texture scale for less graininess
      uTextureStrength: { value: 0.1 }, // Reduced texture strength
      uBaseTexture: { value: paintingTexture },
      uAmbientStrength: { value: 0.1 }, // Add ambient light contribution
      uFresnelPower: { value: 2.0 }, // Add fresnel effect for edge shine
      uDimAmount: { value: dimAmount },
    }),
    [paintingTexture, dimAmount]
  );

  // Vertex Shader
  const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
  
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

  // Fragment Shader
  const fragmentShader = `
      uniform float uTime;
      uniform vec3 uLightPos;
      uniform float uShininess;
      uniform float uSpecularStrength;
      uniform float uTextureScale;
      uniform float uTextureStrength;
      uniform sampler2D uBaseTexture;
      uniform float uAmbientStrength;
      uniform float uFresnelPower;
      uniform float uDimAmount;
  
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
  
      // Smoother noise function
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f); // Smoothstep
        
        float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453);
        float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7))) * 43758.5453);
        float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
        float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
        
        return mix(
          mix(a, b, f.x),
          mix(c, d, f.x),
          f.y
        );
      }
  
      // Smoother brushstroke texture
      float brushNoise(vec2 uv) {
        float n = noise(uv * uTextureScale);
        n += 0.5 * noise(uv * uTextureScale * 2.0);
        return n / 1.5;
      }
  
      void main() {
        // Sample the painting texture
        vec4 texColor = texture2D(uBaseTexture, vUv);
        vec3 baseColor = texColor.rgb;
        
        // Calculate brightness for shine mask
        float brightness = dot(baseColor, vec3(0.299, 0.587, 0.114));
        float shineMask = smoothstep(0.7, 0.9, brightness);
  
        // Generate subtle brush texture
        float textureHeight = brushNoise(vUv + uTime * 0.01);
        
        // Calculate lighting
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(uLightPos - vPosition);
        vec3 viewDir = normalize(-vPosition);
        vec3 halfDir = normalize(lightDir + viewDir);
  
        // Add fresnel effect
        float fresnel = pow(1.0 - dot(normal, viewDir), uFresnelPower);
        
        // Enhanced lighting calculation
        vec3 ambient = uAmbientStrength * baseColor;
        float diff = max(dot(normal, lightDir), 0.0);
        vec3 diffuse = diff * baseColor;
  
        // Specular with fresnel boost
        float spec = pow(max(dot(normal, halfDir), 0.0), uShininess);
        vec3 specular = vec3(spec) * uSpecularStrength * (shineMask + fresnel * 0.5);
  
        // Combine everything
        vec3 color = ambient + diffuse + specular;
        color += fresnel * vec3(0.2, 0.2, 0.3) * shineMask; // Add blue-ish edge shine
        
        // Add subtle texture variation
        color *= (1.0 + textureHeight * uTextureStrength);
  
        // Enhance contrast
        color = pow(color, vec3(0.95)); // Slight gamma adjustment
  
        // Add dimming at the end
        color = mix(color, vec3(0.0), uDimAmount);
  
        gl_FragColor = vec4(color, 1.0);
      }
    `;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[4.788 * 2.5, 3.746 * 2.5, 1]} />
      <shaderMaterial
        ref={shaderRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </mesh>
  );
};
