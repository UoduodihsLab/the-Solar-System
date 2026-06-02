import { useCallback, useRef, useState } from "react";
import type { TargetRegistration } from "./types";
import { SolarSystemScene } from "./components/SolarSystemScene";
import { Hud } from "./components/Hud";

export default function App() {
  const [elapsedDays, setElapsedDays] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [daysPerSecond, setDaysPerSecond] = useState(30);
  const [labelsVisible, setLabelsVisible] = useState(true);
  const [orbitsVisible, setOrbitsVisible] = useState(true);
  const [selectedId, setSelectedId] = useState("earth");
  const [focusRequest, setFocusRequest] = useState({ id: "earth", nonce: 0 });
  const targetRegistry = useRef(new Map<string, TargetRegistration>());

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleFocus = useCallback((id: string) => {
    setSelectedId(id);
    setFocusRequest((current) => ({ id, nonce: current.nonce + 1 }));
  }, []);

  return (
    <main className="app-shell">
      <SolarSystemScene
        elapsedDays={elapsedDays}
        setElapsedDays={setElapsedDays}
        playing={playing}
        daysPerSecond={daysPerSecond}
        selectedId={selectedId}
        labelsVisible={labelsVisible}
        orbitsVisible={orbitsVisible}
        focusId={focusRequest.id}
        focusNonce={focusRequest.nonce}
        onSelect={handleSelect}
        targetRegistry={targetRegistry}
      />
      <Hud
        selectedId={selectedId}
        elapsedDays={elapsedDays}
        playing={playing}
        daysPerSecond={daysPerSecond}
        labelsVisible={labelsVisible}
        orbitsVisible={orbitsVisible}
        onSelect={handleSelect}
        onFocus={handleFocus}
        onPlayingChange={setPlaying}
        onSpeedChange={setDaysPerSecond}
        onElapsedDaysChange={setElapsedDays}
        onLabelsVisibleChange={setLabelsVisible}
        onOrbitsVisibleChange={setOrbitsVisible}
      />
    </main>
  );
}
