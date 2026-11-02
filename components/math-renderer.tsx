"use client";

import { useMemo } from "react";
import { renderStudyMath, renderStudyText } from "@/lib/render-study-text";
import "katex/dist/katex.min.css";

interface MathRendererProps {
  text: string;
  className?: string;
  block?: boolean;
}

/** Study Markdown with protected inline/display math, including server HTML. */
export function MathRenderer({ text, className, block = false }: MathRendererProps) {
  const html = useMemo(() => renderStudyText(text, block), [text, block]);
  if (block) {
    return <div dangerouslySetInnerHTML={{ __html: html }} className={`min-w-0 max-w-full overflow-x-auto overflow-y-hidden [&_p+p]:mt-3 ${className ?? ""}`} />;
  }
  return <span dangerouslySetInnerHTML={{ __html: html }} className={`min-w-0 max-w-full overflow-x-auto overflow-y-hidden ${className ?? ""}`} />;
}

/** Simple inline math-only renderer, no mixed text */
export function InlineMath({ math }: { math: string }) {
  const html = useMemo(() => renderStudyMath(math), [math]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
