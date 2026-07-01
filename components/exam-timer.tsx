"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface TimerPreset {
  label: string;
  seconds: number;
}

/**
 * 独立计时器：对照官方真题 PDF 限时作答用。
 * 预设按真实考试时长，亦可自定义。纯前端 React 状态，不依赖存储。
 */
export function ExamTimer({ presets }: { presets: TimerPreset[] }) {
  const [total, setTotal] = useState<number>(presets[0]?.seconds ?? 2400);
  const [remaining, setRemaining] = useState<number>(presets[0]?.seconds ?? 2400);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  const beep = useCallback(() => {
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      /* 静默失败：浏览器可能阻止自动发声 */
    }
  }, []);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          if (ref.current) clearInterval(ref.current);
          setRunning(false);
          setDone(true);
          beep();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running, beep]);

  const pick = (seconds: number) => {
    setRunning(false);
    setDone(false);
    setTotal(seconds);
    setRemaining(seconds);
  };

  const adjust = (deltaMin: number) => {
    if (running) return;
    const next = Math.max(60, total + deltaMin * 60);
    setTotal(next);
    setRemaining(next);
    setDone(false);
  };

  const reset = () => {
    setRunning(false);
    setDone(false);
    setRemaining(total);
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const pct = total > 0 ? (remaining / total) * 100 : 0;
  const urgent = remaining <= 60 && remaining > 0;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex flex-wrap gap-2 mb-4">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => pick(p.seconds)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition ${
              total === p.seconds
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div
        className={`text-center font-mono font-bold tabular-nums tracking-tight transition-colors ${
          done ? "text-red-600" : urgent ? "text-amber-600" : "text-neutral-900"
        }`}
        style={{ fontSize: "3.5rem", lineHeight: 1.1 }}
      >
        {mm}:{ss}
      </div>

      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden my-4">
        <div
          className={`h-full rounded-full transition-all ${done ? "bg-red-500" : urgent ? "bg-amber-500" : "bg-blue-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {done && (
        <p className="text-center text-red-600 font-semibold mb-3">⏰ 时间到！</p>
      )}

      <div className="flex items-center justify-center gap-3">
        {!running ? (
          <button
            type="button"
            onClick={() => {
              if (remaining === 0) reset();
              setRunning(true);
              setDone(false);
            }}
            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            {remaining === total ? "开始" : "继续"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setRunning(false)}
            className="px-6 py-2.5 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600"
          >
            暂停
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2.5 rounded-lg border border-neutral-300 text-sm text-neutral-600 hover:bg-neutral-50"
        >
          重置
        </button>
      </div>

      {!running && (
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-neutral-500">
          <span>自定义：</span>
          <button type="button" onClick={() => adjust(-5)} className="px-2 py-1 rounded border border-neutral-200 hover:bg-neutral-50">−5 分</button>
          <button type="button" onClick={() => adjust(-1)} className="px-2 py-1 rounded border border-neutral-200 hover:bg-neutral-50">−1 分</button>
          <button type="button" onClick={() => adjust(1)} className="px-2 py-1 rounded border border-neutral-200 hover:bg-neutral-50">+1 分</button>
          <button type="button" onClick={() => adjust(5)} className="px-2 py-1 rounded border border-neutral-200 hover:bg-neutral-50">+5 分</button>
        </div>
      )}
    </div>
  );
}

/** 按考试 id 给出贴合真考的计时预设 */
export function getTimerPresets(testId: string): TimerPreset[] {
  switch (testId) {
    case "esat":
      return [
        { label: "单模块 40 分钟", seconds: 40 * 60 },
        { label: "两模块 80 分钟", seconds: 80 * 60 },
        { label: "三模块 120 分钟", seconds: 120 * 60 },
      ];
    case "tmua":
      return [
        { label: "单篇 75 分钟", seconds: 75 * 60 },
        { label: "全卷 150 分钟", seconds: 150 * 60 },
      ];
    case "step":
      return [{ label: "STEP 一篇 180 分钟", seconds: 180 * 60 }];
    case "mat":
      return [{ label: "MAT 全卷 150 分钟", seconds: 150 * 60 }];
    case "pat":
      return [{ label: "PAT 全卷 120 分钟", seconds: 120 * 60 }];
    case "tsa":
      return [
        { label: "Section 1 · 90 分钟", seconds: 90 * 60 },
        { label: "Section 2 · 30 分钟", seconds: 30 * 60 },
      ];
    case "lnat":
      return [
        { label: "Section A · 95 分钟", seconds: 95 * 60 },
        { label: "Section B 作文 · 40 分钟", seconds: 40 * 60 },
      ];
    default:
      return [
        { label: "30 分钟", seconds: 30 * 60 },
        { label: "60 分钟", seconds: 60 * 60 },
        { label: "90 分钟", seconds: 90 * 60 },
      ];
  }
}
