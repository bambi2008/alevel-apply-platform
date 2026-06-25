import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// 语言感知的导航 API（Link/useRouter/usePathname 会自动带上当前 locale 前缀）
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
