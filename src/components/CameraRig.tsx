import { CameraControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import type { TargetRegistration } from "../types";

export function CameraRig({
  focusId,
  focusNonce,
  targetRegistry
}: {
  focusId: string;
  focusNonce: number;
  targetRegistry: React.MutableRefObject<Map<string, TargetRegistration>>;
}) {
  const controlsRef = useRef<React.ElementRef<typeof CameraControls>>(null);
  const pressedKeys = useRef(new Set<string>());
  const { camera } = useThree();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "SELECT" ||
        target?.tagName === "TEXTAREA"
      ) {
        return;
      }
      pressedKeys.current.add(event.key.toLowerCase());
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.current.delete(event.key.toLowerCase());
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const controls = controlsRef.current;
    const target = targetRegistry.current.get(focusId);
    if (!controls || !target) {
      return;
    }

    const position = new Vector3();
    target.object.getWorldPosition(position);
    const offset = target.focusRadius;
    void controls.setLookAt(
      position.x + offset,
      position.y + offset * 0.48,
      position.z + offset,
      position.x,
      position.y,
      position.z,
      true
    );
  }, [focusId, focusNonce, targetRegistry]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) {
      return;
    }

    const keys = pressedKeys.current;
    const fast = keys.has("shift");
    const speed = delta * (fast ? 180 : 62);
    if (keys.has("w") || keys.has("arrowup")) {
      void controls.forward(speed, false);
    }
    if (keys.has("s") || keys.has("arrowdown")) {
      void controls.forward(-speed, false);
    }
    if (keys.has("a") || keys.has("arrowleft")) {
      void controls.truck(-speed, 0, false);
    }
    if (keys.has("d") || keys.has("arrowright")) {
      void controls.truck(speed, 0, false);
    }
    if (keys.has("q")) {
      camera.position.y -= speed;
    }
    if (keys.has("e")) {
      camera.position.y += speed;
    }

    const target = targetRegistry.current.get(focusId);
    if (target) {
      const position = new Vector3();
      target.object.getWorldPosition(position);
      void controls.setTarget(position.x, position.y, position.z, false);
    }
  });

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      smoothTime={0.35}
      draggingSmoothTime={0.08}
      maxDistance={12000}
      minDistance={0.08}
      dollySpeed={0.78}
      truckSpeed={1.3}
    />
  );
}
