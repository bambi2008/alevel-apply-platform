"use client";

import { useEffect, useRef } from "react";

/** Pause the embedded scene when the hero leaves the viewport. */
export function WaterlightHeroFrame({ locale }: { locale: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    let visible = true;
    const publish = () => element.contentWindow?.postMessage({ type: "qiaoshen-waterlight-visibility", visible: visible && !document.hidden }, window.location.origin);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; publish(); }, { threshold: 0 });
    observer.observe(element);
    element.addEventListener("load", publish);
    const onReady = (event: MessageEvent) => {
      if (event.source === element.contentWindow && event.origin === window.location.origin && event.data?.type === "qiaoshen-waterlight-ready") publish();
    };
    window.addEventListener("message", onReady);
    document.addEventListener("visibilitychange", publish);
    return () => { observer.disconnect(); element.removeEventListener("load", publish); window.removeEventListener("message", onReady); document.removeEventListener("visibilitychange", publish); };
  }, []);
  return <iframe ref={frame} src={`/${locale}/waterlight`} title={locale === "en" ? "Interactive water reacting to pointer or touch" : "鼠标或触控划动会产生波纹的交互水面"} className="absolute inset-0 h-full w-full border-0" />;
}
