"use client";

import { useEffect, useRef } from "react";

/** ref가 감싼 영역 바깥을 클릭하거나 Escape를 누르면 onDismiss를 부른다. active일 때만 듣는다. */
export function useOutsideDismiss<T extends HTMLElement>(active: boolean, onDismiss: () => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!active) return;

    function handlePointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onDismiss();
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onDismiss();
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, onDismiss]);

  return ref;
}
