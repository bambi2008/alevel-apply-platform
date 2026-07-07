// 原创 SVG 插画库 —— Notion 手绘漫画风（零版权，完全原创）。
// 升级：加入有表情的小人角色、更自信的线条、粉彩「错位填充」层次（先铺一层略微偏移的色块，
// 再压黑色描边，制造手绘"填色没描准"的高级感）。约 2.4px 圆头墨线。
import type { SVGProps } from "react";

const INK = "#37352f";
const BLUE = "#cfe6f2";
const YEL = "#f8ecc2";
const GRN = "#d7e8d3";
const PNK = "#f4d9e6";
const PUR = "#e4d6f0";
const ORG = "#f6ddc4";
const SKIN = "#f7e0cf";

const sw = 2.4;
const S = { stroke: INK, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
const Sf = (fill: string) => ({ fill, stroke: INK, strokeWidth: sw, strokeLinejoin: "round" as const, strokeLinecap: "round" as const });

/* 小人的脸：点眼 + 小微笑 + 腮红（Notion 招牌表情） */
function Face({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={-5} cy={-2} r={1.6} fill={INK} />
      <circle cx={5} cy={-2} r={1.6} fill={INK} />
      <path d="M-4 4 Q0 8 4 4" {...S} strokeWidth={2} />
      <circle cx={-9} cy={3} r={2.4} fill={PNK} opacity={0.8} />
      <circle cx={9} cy={3} r={2.4} fill={PNK} opacity={0.8} />
    </g>
  );
}

/* 英雄：背着书包的小人走过拱桥，伸手够向远处小旗（申请=通往未来的桥） */
export function HeroBridge(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* 太阳 + 云 */}
      <circle cx="250" cy="54" r="26" fill={YEL} />
      <path d="M40 58 q10 -12 24 -6 q8 -10 22 -2 q10 2 6 12 z" fill={BLUE} opacity="0.8" />
      {/* 拱桥（错位色块 + 描边） */}
      <path d="M24 176 Q160 84 296 176" fill="none" stroke={ORG} strokeWidth="10" strokeLinecap="round" opacity="0.55" />
      <path d="M24 176 Q160 96 296 176" {...S} />
      <path d="M24 192 Q160 112 296 192" {...S} />
      <path d="M60 156 L60 184 M104 130 L104 178 M160 122 L160 176 M216 130 L216 178 M260 156 L260 184" {...S} />
      {/* 小人 */}
      <g>
        {/* 书包 */}
        <path d="M132 132 q-14 4 -12 22 l14 2 z" {...Sf(PUR)} />
        {/* 身体 */}
        <path d="M150 118 q12 2 12 20 q0 12 -4 22 l-16 0 q-4 -14 -2 -26 q1 -12 10 -16 z" {...Sf(BLUE)} />
        {/* 头 */}
        <circle cx="150" cy="104" r="13" {...Sf(SKIN)} />
        <Face x={150} y={104} s={0.9} />
        {/* 头发一撮 */}
        <path d="M139 97 q6 -12 22 -4" {...S} />
        {/* 手臂伸向旗 */}
        <path d="M160 132 q16 -6 26 -18" {...S} />
        {/* 腿（走路） */}
        <path d="M143 182 l-6 22 M156 182 l8 20" {...S} />
      </g>
      {/* 远处小旗 */}
      <path d="M206 118 L206 90" {...S} />
      <path d="M206 90 q22 -5 17 10 q-4 10 -17 5 z" {...Sf(PNK)} />
      {/* 地面 */}
      <path d="M12 214 L308 214" {...S} opacity="0.5" />
      {/* 星点点缀 */}
      <path d="M96 46 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" fill={YEL} />
    </svg>
  );
}

/* 指南针：小人抱着大指南针在思考（选校方向） */
export function SceneCompass(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 190" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="112" cy="98" r="50" fill={BLUE} />
      <circle cx="112" cy="98" r="50" {...S} />
      <circle cx="112" cy="98" r="42" {...S} strokeWidth="1.5" opacity="0.5" />
      <path d="M112 98 L138 62 L120 92 Z" {...Sf(PNK)} />
      <path d="M112 98 L86 134 L104 104 Z" {...Sf("#fff")} />
      <circle cx="112" cy="98" r="5" fill={INK} />
      <path d="M112 42 L112 52 M112 144 L112 154 M56 98 L66 98 M158 98 L168 98" {...S} />
      <text x="112" y="38" textAnchor="middle" fontSize="12" fill={INK} fontWeight="700">N</text>
      {/* 旁边探头的小人 */}
      <g>
        <circle cx="188" cy="118" r="15" {...Sf(SKIN)} />
        <Face x={186} y={118} s={0.95} />
        <path d="M176 111 q10 -14 26 -4" {...S} />
        <path d="M178 132 q10 10 22 2" {...Sf(GRN)} />
      </g>
    </svg>
  );
}

/* 文书：小人在桌前写作，纸张飞起（文书教练） */
export function SceneDocs(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 190" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* 飞纸 */}
      <rect x="150" y="34" width="46" height="58" rx="6" transform="rotate(12 173 63)" {...Sf("#fff")} />
      <path d="M162 52 h24 M162 64 h24 M162 76 h16" transform="rotate(12 173 63)" {...S} strokeWidth="1.6" opacity="0.7" />
      {/* 桌面主纸 */}
      <rect x="70" y="70" width="86" height="70" rx="8" {...Sf(YEL)} />
      <path d="M86 90 h54 M86 104 h54 M86 118 h38" {...S} strokeWidth="1.8" opacity="0.75" />
      {/* 小人 */}
      <g>
        <circle cx="56" cy="86" r="14" {...Sf(SKIN)} />
        <Face x={57} y={86} s={0.9} />
        <path d="M45 80 q11 -13 24 -3" {...S} />
        <path d="M46 100 q4 26 0 40" {...Sf(PUR)} />
        {/* 握笔的手 */}
        <path d="M64 116 q18 2 30 8" {...S} />
        <path d="M92 120 l16 8 -6 6 z" {...Sf(PNK)} />
      </g>
    </svg>
  );
}

/* 面试：两个小人对话，气泡里有笑脸（面试准备） */
export function SceneChat(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 190" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* 左小人 */}
      <g>
        <circle cx="48" cy="118" r="17" {...Sf(SKIN)} />
        <Face x={49} y={116} s={1.05} />
        <path d="M35 110 q13 -16 29 -4" {...S} />
        <path d="M32 140 q16 14 34 2" {...Sf(BLUE)} />
      </g>
      {/* 右小人 */}
      <g>
        <circle cx="196" cy="122" r="15" {...Sf(SKIN)} />
        <Face x={194} y={120} s={0.95} />
        <path d="M184 115 q12 -14 27 -3" {...S} />
        <path d="M182 142 q14 12 30 2" {...Sf(GRN)} />
      </g>
      {/* 对话气泡 */}
      <path d="M78 30 h74 a14 14 0 0 1 14 14 v26 a14 14 0 0 1 -14 14 h-46 l-16 16 v-16 h-12 a14 14 0 0 1 -14 -14 v-26 a14 14 0 0 1 14 -14 Z" {...Sf(PUR)} />
      <circle cx="104" cy="57" r="2.6" fill={INK} />
      <circle cx="116" cy="57" r="2.6" fill={INK} />
      <path d="M100 65 q8 7 16 0" {...S} strokeWidth="2" />
    </svg>
  );
}

/* 成长：小人爬阶梯给小苗浇水（背景提升/进步） */
export function SceneGrowth(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 190" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* 阶梯 */}
      <path d="M150 160 h64 v-26 h-32 v-26 h-32 v-26 h-32" {...Sf(ORG)} />
      {/* 花盆 + 苗 */}
      <path d="M34 138 h46 l-6 30 h-34 z" {...Sf(BLUE)} />
      <path d="M57 138 C57 108 57 100 57 88" {...S} />
      <path d="M57 108 C40 104 34 90 34 78 C52 78 57 92 57 104" {...Sf(GRN)} />
      <path d="M57 100 C74 96 80 82 80 70 C63 70 57 84 57 96" {...Sf(GRN)} />
      {/* 顶端小人举旗 */}
      <g>
        <circle cx="196" cy="112" r="13" {...Sf(SKIN)} />
        <Face x={196} y={112} s={0.85} />
        <path d="M186 106 q10 -12 22 -3" {...S} />
        <path d="M190 124 q6 10 16 2" {...Sf(PNK)} />
        <path d="M210 118 l0 -26" {...S} />
        <path d="M210 92 q18 -4 14 8 q-3 8 -14 4 z" {...Sf(YEL)} />
      </g>
      <path d="M12 172 h216" {...S} opacity="0.45" />
    </svg>
  );
}
