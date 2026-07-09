"use client";

import { useState, type ReactNode } from "react";

/**
 * 照片占位组件：优先显示 public/images 下的真实照片（建议 AI 生成，规避版权）。
 * 若图片缺失或加载失败，自动回退到传入的插画 fallback —— 永不开天窗。
 * 放好图后无需改代码，刷新即显示。
 */
export function Photo({
  src,
  alt,
  fallback,
  className = "",
  imgClassName = "",
}: {
  src: string;
  alt: string;
  fallback: ReactNode;
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={className}>{fallback}</div>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${className} ${imgClassName}`.trim()}
    />
  );
}
