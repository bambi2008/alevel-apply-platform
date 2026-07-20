"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathRendererProps {
  text: string;
  className?: string;
  block?: boolean;
}

/** Renders a string that may contain $...$ (inline) and $$...$$ (display) LaTeX. */
export function MathRenderer({ text, className, block = false }: MathRendererProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Split on $$ and $ delimiters, render each segment
    ref.current.innerHTML = renderMixedMath(text);
  }, [text]);

  if (block) {
    return <div ref={ref} className={`min-w-0 max-w-full overflow-x-auto overflow-y-hidden ${className ?? ""}`} />;
  }
  return <span ref={ref} className={`min-w-0 max-w-full overflow-x-auto overflow-y-hidden ${className ?? ""}`} />;
}

function renderMixedMath(text: string): string {
  const segments = text.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g);
  return segments.map((segment) => {
    if (segment.startsWith("$$") && segment.endsWith("$$")) {
      return renderMath(segment.slice(2, -2), true);
    }
    if (segment.startsWith("$") && segment.endsWith("$")) {
      return renderMath(segment.slice(1, -1), false);
    }
    return escapeHtml(segment).replace(/\n/g, "<br>");
  }).join("");
}

function renderMath(math: string, displayMode: boolean): string {
  try {
    return katex.renderToString(math.trim(), { displayMode, throwOnError: false });
  } catch {
    return `<span class="text-red-500">[math error]</span>`;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Simple inline math-only renderer, no mixed text */
export function InlineMath({ math }: { math: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    try {
      ref.current.innerHTML = katex.renderToString(math, { throwOnError: false });
    } catch {
      if (ref.current) ref.current.textContent = math;
    }
  }, [math]);
  return <span ref={ref} />;
}
