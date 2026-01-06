import React, { useEffect, useRef } from "react";

/**
 * Simple black dot that follows the mouse with smooth delay.
 * The dot is placed exactly at the tip of the cursor (uses translate -50%, -50%).
 */
export default function CursorFollower() {
  const dotRef = useRef(null);

  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    // Only on fine pointer devices (desktop)
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const loop = () => {
      // smoothing
      const speed = 0.18; // lower = more delay, higher = snappier
      pos.current.x += (target.current.x - pos.current.x) * speed;
      pos.current.y += (target.current.y - pos.current.y) * speed;

      dot.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      dot.style.opacity = "1";

      raf.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return <div ref={dotRef} className="sw-cursor-dot" />;
}