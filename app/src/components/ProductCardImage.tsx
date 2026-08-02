"use client";
import { useEffect, useRef, useState } from "react";

const CYCLE_MS = 1500;

function gallery(img: string, category: string): string[] {
  return [img, `/images/${category}-2.svg`, `/images/${category}-3.svg`];
}

export default function ProductCardImage({ img, category, className }: { img: string; category: string; className?: string }) {
  const images = gallery(img, category);
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  function start() {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % images.length);
    }, CYCLE_MS);
  }

  function stop() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIndex(0);
  }

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`} onMouseEnter={start} onMouseLeave={stop}>
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
          style={{ backgroundImage: `url(${src})`, opacity: i === index ? 1 : 0 }}
        />
      ))}
    </div>
  );
}
