"use client";

import { useEffect } from "react";

export function WaterlightRuntime() {
  useEffect(() => {
    void import("./waterlight-scene");
  }, []);

  return null;
}
