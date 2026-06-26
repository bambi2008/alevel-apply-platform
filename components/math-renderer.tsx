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
    return <div ref={ref} className={className} />;
  }
  return <span ref={ref} className={className} />;
}

function renderMixedMath(text: string): string {
  // Replace $$...$$ first (display), then $...$ (inline)
  let result = text;

  // Display math $$...$$
  result = result.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
    } catch {
      return `<span class="text-red-500">[math error]</span>`;
    }
  });

  // Inline math $...$
  result = result.replace(/\$([^$\n]+?)\$/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return `<span class="text-red-500">[math error]</span>`;
    }
  });

  // Convert newlines to <br> for plain text segments
  result = result.replace(/\n/g, "<br>");

  return result;
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
