// 原创 SVG 插画库 —— 大色块剪影 / 杂志编辑风（零版权）。
// 手法：大面积双色剪影 + 极少细节线，克制成熟、有设计态度。
// 配色：深墨 + UCAS 蓝，少量青/暖点缀。
import type { SVGProps } from "react";

const INK = "#12141a";
const BLUE = "#3b5bdb";
const BLUE_2 = "#5b7fd4";
const PAPER = "#eef2fb";
const CYAN = "#22d3ee";
const SAND = "#f0c869";

/* 英雄插画：一位剪影人物眺望远方的城市天际线（申请=眺望未来） */
export function HeroBridge(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 560 440" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* 底色块：斜切双色 */}
      <path d="M0 0 H560 V440 H0 Z" fill={PAPER} />
      <path d="M0 300 L560 210 V440 H0 Z" fill={BLUE} />
      <path d="M0 355 L560 300 V440 H0 Z" fill={INK} />
      {/* 太阳大圆 */}
      <circle cx="405" cy="150" r="70" fill={SAND} />
      <path d="M405 80 A70 70 0 0 1 405 220 Z" fill="#e8b84b" />
      {/* 天际线剪影（城市/校园） */}
      <g fill={INK} opacity="0.92">
        <rect x="60" y="215" width="34" height="95" />
        <rect x="104" y="180" width="26" height="130" />
        <rect x="140" y="235" width="40" height="75" />
        <path d="M195 230 h44 v80 h-44 Z M217 205 l16 25 h-32 Z" />
        <rect x="255" y="200" width="30" height="110" />
        <rect x="300" y="245" width="46" height="65" />
      </g>
      {/* 前景剪影人物（背影，眺望） */}
      <g fill={INK}>
        <circle cx="150" cy="300" r="30" />
        <path d="M110 420 Q150 320 190 420 Z" />
      </g>
      {/* 一道细弧线，呼应"桥/连接" */}
      <path d="M180 300 Q330 180 470 250" stroke={CYAN} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <circle cx="470" cy="250" r="6" fill={CYAN} />
    </svg>
  );
}

/* 分区插画：罗盘/方向（选校匹配） */
export function SceneCompass(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="400" height="260" fill={INK} />
      <circle cx="200" cy="130" r="150" fill={BLUE} opacity="0.25" />
      <circle cx="200" cy="130" r="78" fill={PAPER} />
      <path d="M200 62 L228 130 L200 198 L172 130 Z" fill={BLUE} />
      <path d="M200 62 L172 130 L200 130 Z" fill={INK} />
      <circle cx="200" cy="130" r="8" fill={INK} />
      <circle cx="200" cy="130" r="78" stroke={INK} strokeWidth="2" fill="none" />
    </svg>
  );
}

/* 分区插画：文书/写作（大剪影 + 笔） */
export function SceneDocs(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="400" height="260" fill={PAPER} />
      <path d="M0 0 H400 V260 H210 Q160 130 210 0 Z" fill={BLUE} />
      {/* 纸 */}
      <rect x="70" y="55" width="150" height="150" rx="6" fill="#fff" stroke={INK} strokeWidth="2.5" />
      <g stroke={BLUE_2} strokeWidth="6" strokeLinecap="round">
        <line x1="95" y1="90" x2="195" y2="90" /><line x1="95" y1="120" x2="195" y2="120" />
        <line x1="95" y1="150" x2="160" y2="150" />
      </g>
      {/* 笔剪影 */}
      <path d="M250 60 L330 140 L305 165 L225 85 Z" fill={INK} />
      <path d="M225 85 L245 105 L305 165 L285 185 Z" fill={CYAN} />
    </svg>
  );
}

/* 分区插画：对话/AI（两个大色块气泡） */
export function SceneChat(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="400" height="260" fill={INK} />
      <path d="M60 60 h150 a16 16 0 0 1 16 16 v70 a16 16 0 0 1 -16 16 h-100 l-30 28 v-28 h-20 a16 16 0 0 1 -16 -16 v-70 a16 16 0 0 1 16 -16 Z" fill={PAPER} />
      <path d="M230 110 h110 a16 16 0 0 1 16 16 v56 a16 16 0 0 1 -16 16 h-70 l-24 24 v-24 h-16 a16 16 0 0 1 -16 -16 v-56 a16 16 0 0 1 16 -16 Z" fill={BLUE} />
      <g stroke={INK} strokeWidth="6" strokeLinecap="round" opacity="0.8">
        <line x1="82" y1="95" x2="192" y2="95" /><line x1="82" y1="120" x2="160" y2="120" />
      </g>
    </svg>
  );
}

/* 分区插画：成长/数据（大色块柱状 + 折线） */
export function SceneGrowth(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="400" height="260" fill={PAPER} />
      <path d="M0 260 H400 V150 L280 175 L170 120 L60 175 Z" fill={BLUE} opacity="0.22" />
      {[{ x: 70, h: 70 }, { x: 145, h: 120 }, { x: 220, h: 95 }, { x: 295, h: 165 }].map((b, i) => (
        <rect key={i} x={b.x} y={220 - b.h} width="52" height={b.h} fill={i === 3 ? BLUE : INK} />
      ))}
      <path d="M96 150 L171 95 L246 120 L321 45" stroke={CYAN} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="321" cy="45" r="8" fill={CYAN} />
    </svg>
  );
}
