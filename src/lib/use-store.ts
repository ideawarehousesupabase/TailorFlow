import { useEffect, useState } from "react";

// Forces re-render whenever any tf:update event fires.
export function useStoreTick() {
  const [, setT] = useState(0);
  useEffect(() => {
    const h = () => setT((x) => x + 1);
    window.addEventListener("tf:update", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("tf:update", h);
      window.removeEventListener("storage", h);
    };
  }, []);
}
