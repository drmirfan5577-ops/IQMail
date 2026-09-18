import { useState, useEffect, useCallback, useRef } from 'react';

export interface ParallaxState {
  x: number; // -1 to 1
  y: number; // -1 to 1
}

export function useParallax(strength = 0.02): ParallaxState {
  const [pos, setPos] = useState<ParallaxState>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef<ParallaxState>({ x: 0, y: 0 });
  const currentRef = useRef<ParallaxState>({ x: 0, y: 0 });

  const animate = useCallback(() => {
    const dx = targetRef.current.x - currentRef.current.x;
    const dy = targetRef.current.y - currentRef.current.y;
    currentRef.current = {
      x: currentRef.current.x + dx * 0.06,
      y: currentRef.current.y + dy * 0.06,
    };
    setPos({ ...currentRef.current });
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetRef.current = {
        x: ((e.clientX - cx) / cx) * strength,
        y: ((e.clientY - cy) / cy) * strength,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetRef.current = {
        x: ((e.touches[0].clientX - cx) / cx) * (strength * 0.5),
        y: ((e.touches[0].clientY - cy) / cy) * (strength * 0.5),
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate, strength]);

  return pos;
}
