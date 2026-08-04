"use client";
import { useEffect, useRef, useState } from "react";

const CYCLE_MS = 1500;

export default function ProductCardImage({ images, className }: { images: string[]; className?: string }) {
  const gallery = images.length > 0 ? images : [""];
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  function start() {
    if (gallery.length < 2 || timerRef.current) return;
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % gallery.length);
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
      {gallery.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
          style={{ backgroundImage: src ? `url(${src})` : undefined, opacity: i === index ? 1 : 0 }}
        />
      ))}
    </div>
  );
}
