"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  addApplication,
  hasApplication,
  removeApplication,
  subscribeApps,
} from "@/lib/applications/store";

export function AddToApplication({ programId }: { programId: string }) {
  const [added, setAdded] = useState(false);
  const t = useTranslations("common");

  useEffect(() => {
    const sync = () => {
      hasApplication(programId).then(setAdded);
    };
    sync();
    return subscribeApps(sync);
  }, [programId]);

  return (
    <button
      type="button"
      onClick={() => {
        const next = !added;
        setAdded(next); // 乐观更新；写入后的事件会再次校正
        if (next) addApplication(programId);
        else removeApplication(programId);
      }}
      className={`text-xs px-2.5 py-1 rounded-md border transition ${
        added
          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          : "border-neutral-300 text-neutral-600 hover:bg-neutral-50"
      }`}
    >
      {added ? `✓ ${t("added")}` : `+ ${t("addToApplication")}`}
    </button>
  );
}
