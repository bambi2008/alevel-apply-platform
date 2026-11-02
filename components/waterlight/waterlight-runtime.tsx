"use client";

import { useEffect } from "react";

export function WaterlightRuntime() {
  useEffect(() => {
    let stopped = false;
    let cleanup: (() => void) | undefined;
    let loading = false;
    const events = new AbortController();
    const audio = document.querySelector<HTMLAudioElement>("#soundtrack");
    const button = document.querySelector<HTMLButtonElement>(".sound-toggle");
    const label = document.querySelector(".sound-label");
    const en = document.querySelector(".waterlight-experience")?.getAttribute("data-locale") === "en";
    button?.addEventListener("click", async () => {
      if (!audio || !label) return;
      if (!audio.paused) { audio.pause(); button.setAttribute("aria-pressed", "false"); label.textContent = en ? "Enable water sound" : "开启水声"; return; }
      if (!audio.getAttribute("src")) audio.src = audio.canPlayType("audio/ogg") ? "/waterlight/waterlight-loop.ogg" : "/waterlight/waterlight-loop.wav";
      window.dispatchEvent(new Event("waterlight-audio-start"));
      try { await audio.play(); button.setAttribute("aria-pressed", "true"); label.textContent = en ? "Mute water sound" : "关闭水声"; }
      catch { label.textContent = en ? "Try sound again" : "请再点一次"; }
    }, { signal: events.signal });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const start = () => {
      if (stopped || cleanup || loading || reduced.matches) return;
      loading = true;
      void import("./waterlight-scene").then(module => {
        if (!stopped) cleanup = module.startWaterlightScene();
      }).catch(() => { loading = false; document.querySelector("#water-stage")?.setAttribute("data-waterlight-fallback", "true"); });
    };
    // The static water paints immediately; load the simulation on first intent.
    // Pointer movement starts ripples on desktop without blocking initial paint.
    window.addEventListener("pointermove", start, { once: true });
    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });
    return () => { stopped = true; events.abort(); audio?.pause(); window.removeEventListener("pointermove", start); window.removeEventListener("pointerdown", start); window.removeEventListener("keydown", start); cleanup?.(); };
  }, []);

  return null;
}
