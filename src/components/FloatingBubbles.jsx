"use client";

import React, { useState, useEffect, useRef } from 'react';

const FloatingBubbles = ({ img1, img2 }) => {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Normalize coordinates between -0.5 and 0.5
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  // Parallax offsets (bubble 1 moves slightly, bubble 2 moves in opposite/different intensity)
  const driftX1 = mousePos.x * 40; // Max 20px drift
  const driftY1 = mousePos.y * 40;
  const driftX2 = -mousePos.x * 60; // Max 30px drift in opposite direction
  const driftY2 = -mousePos.y * 60;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full flex items-center justify-center select-none"
      style={{ minHeight: '400px' }}
    >
      {/* Subtle Background Glow to make bubbles pop */}
      <div 
        className="absolute w-[280px] h-[280px] rounded-full filter blur-[100px] opacity-25"
        style={{
          background: 'radial-gradient(circle, #b2000a 0%, transparent 70%)',
          zIndex: 0
        }}
      />

      {/* Bubble 1 (Larger, background) */}
      <div
        className="absolute w-[240px] md:w-[320px] aspect-square transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${driftX1}px, ${driftY1}px)`,
          zIndex: 2,
          left: '12%',
          top: '15%',
          animation: 'bubble-float-1 12s ease-in-out infinite'
        }}
      >
        <img
          src={img1}
          alt="Bespoke Luxury Curation"
          className="w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)] transition-transform duration-500 hover:scale-108 cursor-pointer"
          style={{ willChange: 'transform' }}
        />
      </div>

      {/* Bubble 2 (Smaller, foreground, overlapping) */}
      <div
        className="absolute w-[160px] md:w-[220px] aspect-square transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${driftX2}px, ${driftY2}px)`,
          zIndex: 3,
          right: '15%',
          bottom: '18%',
          animation: 'bubble-float-2 9s ease-in-out infinite'
        }}
      >
        <img
          src={img2}
          alt="Bespoke Spatial Design"
          className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-transform duration-500 hover:scale-110 cursor-pointer"
          style={{ willChange: 'transform' }}
        />
      </div>

      {/* Embedded Animations */}
      <style jsx global>{`
        @keyframes bubble-float-1 {
          0%, 100% {
            translate: 0px 0px;
          }
          33% {
            translate: 12px -20px;
          }
          66% {
            translate: -10px 15px;
          }
        }
        @keyframes bubble-float-2 {
          0%, 100% {
            translate: 0px 0px;
          }
          50% {
            translate: -18px -12px;
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingBubbles;
