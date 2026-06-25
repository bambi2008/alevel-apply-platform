"use client";

import { useEffect, useState } from "react";
import {
  addApplication,
  hasApplication,
  removeApplication,
  subscribeApps,
} from "@/lib/applications/store";

export function AddToApplication({ programId }: { programId: string }) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const sync = () => setAdded(hasApplication(programId));
    sync();
    return subscribeApps(sync);
  }, [programId]);

  return (
    <button
      type="button"
      onClick={() => (added ? removeApplication(programId) : addApplication(programId))}
      className={`text-xs px-2.5 py-1 rounded-md border transition ${
        added
          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          : "border-neutral-300 text-neutral-600 hover:bg-neutral-50"
      }`}
    >
      {added ? "✓ 已加入申请" : "+ 加入申请"}
    </button>
  );
}
