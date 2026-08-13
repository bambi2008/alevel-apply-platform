import type { MouseEvent } from "react";

export function forceFullNavigation(event: MouseEvent<HTMLAnchorElement>) {
  if (
    event.defaultPrevented
    || event.button !== 0
    || event.metaKey
    || event.ctrlKey
    || event.shiftKey
    || event.altKey
  ) return;

  event.preventDefault();
  window.location.assign(event.currentTarget.href);
}
