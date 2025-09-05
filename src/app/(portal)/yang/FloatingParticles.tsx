"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const PARTICLE_COUNT = 20;

function getRandomParticle(windowWidth: number, windowHeight: number) {
  return {
    x: Math.random() * windowWidth,
    y: windowHeight + 10,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 10,
  };
}

export default function FloatingParticles() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const arr = Array.from({ length: PARTICLE_COUNT }).map(() =>
        getRandomParticle(window.innerWidth, window.innerHeight)
      );
      setParticles(arr);
    }
  }, []);

  if (!particles.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-orange-400 rounded-full opacity-60"
          initial={{ x: p.x, y: p.y }}
          animate={{ y: -10, x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 100) }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}