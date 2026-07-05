// 原创插画：一道发光的桥弧 + 一高一矮两个抽象背影，走向远方的光。
// 呼应品牌「桥申」的桥母题；纯几何设计感，不含真人照片、无版权素材。
export function StoryIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 340"
      className={className}
      role="img"
      aria-label="一对父子走过一座桥，走向远方的光"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef0ff" />
          <stop offset="55%" stopColor="#f4f0ff" />
          <stop offset="100%" stopColor="#eefcff" />
        </linearGradient>
        <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="55%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff7ec" />
          <stop offset="45%" stopColor="#ffe4c4" />
          <stop offset="100%" stopColor="#ffe4c4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="figG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3c3489" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>

      {/* 天空底 */}
      <rect x="0" y="0" width="520" height="340" rx="24" fill="url(#skyGrad)" />

      {/* 远处的光（目标/希望） */}
      <circle cx="392" cy="128" r="78" fill="url(#sun)" />
      <circle cx="392" cy="128" r="30" fill="#fff3e0" />

      {/* 漂浮的星点（AI 加持的科技感点缀） */}
      <g fill="#7c3aed" opacity="0.5">
        <circle cx="120" cy="72" r="2.5" />
        <circle cx="180" cy="48" r="1.8" />
        <circle cx="300" cy="60" r="2" />
        <circle cx="440" cy="70" r="2.4" />
      </g>
      <g fill="#22d3ee" opacity="0.6">
        <circle cx="90" cy="110" r="1.8" />
        <circle cx="240" cy="40" r="1.6" />
        <circle cx="360" cy="52" r="1.6" />
      </g>

      {/* 桥弧主体：发光的品牌渐变弧线 */}
      <path
        d="M40 250 Q260 96 480 250"
        fill="none"
        stroke="url(#arcGrad)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* 桥的吊索（细线，增强"桥"的识别度） */}
      <g stroke="url(#arcGrad)" strokeWidth="1.6" opacity="0.4">
        <line x1="120" y1="186" x2="120" y2="250" />
        <line x1="180" y1="156" x2="180" y2="250" />
        <line x1="260" y1="142" x2="260" y2="250" />
        <line x1="340" y1="156" x2="340" y2="250" />
        <line x1="400" y1="186" x2="400" y2="250" />
      </g>
      {/* 桥面 */}
      <rect x="40" y="250" width="440" height="6" rx="3" fill="#4f46e5" opacity="0.85" />

      {/* 两个抽象背影：一高（父）一矮（子），走在桥上朝光走去 */}
      {/* 父 */}
      <g fill="url(#figG)">
        <circle cx="250" cy="210" r="11" />
        <path d="M250 222 q-14 4 -14 28 l0 0 q0 4 4 4 l20 0 q4 0 4 -4 q0 -24 -14 -28z" />
      </g>
      {/* 子（略矮、靠前一点，朝光） */}
      <g fill="#7c3aed">
        <circle cx="278" cy="218" r="9" />
        <path d="M278 228 q-11 3 -11 22 l0 0 q0 4 4 4 l14 0 q4 0 4 -4 q0 -19 -11 -22z" />
      </g>

      {/* 一只手相牵的暗示（连接父子的小弧线） */}
      <path d="M261 236 q8 -3 12 0" fill="none" stroke="#22d3ee" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
