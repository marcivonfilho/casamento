"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({ children }: any) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShow(true);
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`section ${show ? "show" : ""}`}>
      {children}
    </div>
  );
}