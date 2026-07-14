"use client";
import { useState, useEffect } from "react";
import type { Tier } from "@/lib/billing";
import { getUserTier } from "@/lib/billing";

/** 客户端读取当前用户层级。
 *  占位实现：目前恒为 "free"（付费墙默认关闭，所以不影响任何人）。
 *  接入登录 / 订阅后，改成从 session 解析即可，例如：
 *    const { data } = useSession();
 *    return getUserTier(data?.user);
 */
export function useTier(): Tier {
  const [tier, setTier] = useState<Tier>("free");
  useEffect(() => {
    // TODO(billing): 接入后替换为真实来源（next-auth useSession / 用户记录）。
    setTier(getUserTier(null));
  }, []);
  return tier;
}
