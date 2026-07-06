// 单色线性图标集（Linear/Stripe 风格）——取代彩色 emoji，塑造"操作系统"质感。
// 统一 20×20、stroke=currentColor、无填充，颜色由父级文字色决定。
import type { SVGProps } from "react";

const paths: Record<string, React.ReactNode> = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20h14V9.5" /></>,
  target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3.2" /></>,
  building: <><path d="M4 21V6l8-3 8 3v15" /><path d="M9 21v-5h6v5" /><path d="M9 9h.01M15 9h.01M9 12.5h.01M15 12.5h.01" /></>,
  user: <><circle cx="12" cy="8" r="3.5" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>,
  clipboard: <><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4.5V4a3 3 0 0 1 6 0v.5" /><path d="M9 10h6M9 14h6" /></>,
  calendar: <><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M4 9h16M9 3v4M15 3v4" /></>,
  file: <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><path d="M10 13h5M10 16.5h5" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0" /><path d="M12 17v4M9 21h6" /></>,
  star: <><path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L3.5 9.7l5.9-.9z" /></>,
  pen: <><path d="M4 20l4-1 10-10-3-3L5 16z" /><path d="M13.5 6.5l3 3" /></>,
  listChecks: <><path d="M4 6.5l1.5 1.5L8 5.5" /><path d="M4 13l1.5 1.5L8 12" /><path d="M11 7h9M11 13h9M11 19h9" /><path d="M4 19l1.5 1.5L8 18" /></>,
  check: <><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.3 2.3L15.5 9.5" /></>,
  folder: <><path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></>,
  shield: <><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /><path d="m9 12 2 2 4-4" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  bell: <><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  sparkle: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="M12 8l1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5z" /></>,
};

export function NavIcon({ name, ...props }: { name: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name] ?? paths.home}
    </svg>
  );
}
