import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) {
      return undefined;
    }

    let current = 0;
    const end = Number.parseInt(target, 10);

    if (Number.isNaN(end)) {
      return undefined;
    }

    const duration = 1500;
    const step = (end / duration) * 16;
    const timer = window.setInterval(() => {
      current += step;

      if (current >= end) {
        setCount(end);
        window.clearInterval(timer);
        return;
      }

      setCount(Math.floor(current));
    }, 16);

    return () => window.clearInterval(timer);
  }, [started, target]);

  const numericTarget = Number.parseInt(target, 10);
  const display = Number.isNaN(numericTarget) ? target : `${count}${suffix}`;

  return <span ref={ref}>{display}</span>;
}
