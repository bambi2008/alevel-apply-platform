import { WaterlightRuntime } from "@/components/waterlight/waterlight-runtime";
import "./waterlight.css";

export default function WaterlightPage() {
  return (
    <main className="waterlight-experience" aria-label="可用鼠标或触控划动的交互水面">
      <div id="water-stage" aria-hidden="true" />
      <div className="waterlight-grain" aria-hidden="true" />
      <div className="waterlight-runtime-controls" aria-hidden="true" hidden>
        <div className="cursor-orbit"><span /></div>
        <div className="center-copy"><span id="scene-eyebrow" /><span id="scene-title" /><span id="scene-caption" /></div>
        <div className="mood-wheel" tabIndex={-1}>{[0, 1, 2, 3].map((mood) => <button key={mood} type="button" data-mood={mood} />)}</div>
        <span id="light-name" /><span id="scene-clock" />
        <button className="sound-toggle" type="button"><span className="sound-label" /></button>
        <audio id="soundtrack" />
      </div>
      <WaterlightRuntime />
    </main>
  );
}
