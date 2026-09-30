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
      </div>
      <button className="sound-toggle" type="button" aria-pressed="false" aria-label="开启或关闭水声">
        <span className="sound-bars" aria-hidden="true"><i /><i /><i /><i /></span>
        <span className="sound-label">开启水声</span>
      </button>
      <audio id="soundtrack" loop preload="metadata">
        <source src="/waterlight/waterlight-loop.ogg" type="audio/ogg" />
        <source src="/waterlight/waterlight-loop.wav" type="audio/wav" />
      </audio>
      <WaterlightRuntime />
    </main>
  );
}
