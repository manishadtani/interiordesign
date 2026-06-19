"use client";

/**
 * HeroQuotes Component
 * Displays secondary brand quotes during the 100vh - 200vh scroll phase
 * Uses GSAP ScrollTrigger for smooth fade-in/out
 */

import React, { useEffect, useRef, useState } from 'react';

const HeroQuotes = () => {
  const containerRef = useRef(null);
  const shadowRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const splitLetters = (text) => {
    return text.split('').map((char, i) => (
      <span 
        key={i} 
        className="letter" 
        style={{ 
          display: 'inline-block', 
          lineHeight: '1em', 
          transformOrigin: '0 0' 
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const letters = gsap.utils.toArray('.letter');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: "330vh top",
            end: "430vh top",
            scrub: 1,
          }
        });

        tl.fromTo(containerRef.current,
          { opacity: 0, y: 150 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );

        tl.fromTo(letters,
          { rotateY: -90, opacity: 0 },
          { 
            rotateY: 0, 
            opacity: 1, 
            stagger: 0.1, 
            duration: 1.5,
            ease: "power2.out"
          },
          "+=0.2"
        );

        tl.to(containerRef.current, { opacity: 1, duration: 2 });

        const shadowTl = gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: "400vh top",
            end: "430vh top",
            scrub: 1,
          }
        });

        shadowTl.fromTo(shadowRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: "power2.inOut" }
        );
      });

      return () => ctx.revert();
    };

    initGSAP();

  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-0 left-0 w-full z-[0] pointer-events-none px-[6%] pt-32 pb-8"
      style={{
        opacity: 0,
        willChange: 'opacity, transform',
        perspective: '1000px',
      }}
    >
      <div
        ref={shadowRef}
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{
          height: '100%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)',
          opacity: 0,
          zIndex: -1,
        }}
      />

      <div className={isMobile ? "flex flex-col gap-4" : "max-w-[1500px] mx-auto flex items-end justify-between"}>
        {/* Bottom Left Quote */}
        <div className={isMobile ? "w-full" : "max-w-[450px]"}>
          <h3
            className="font-urbanist"
            style={{
              fontSize: isMobile ? 'clamp(0.95rem, 4vw, 1.2rem)' : 'clamp(1rem, 1.8vw, 1.8rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              color: '#FFFFFF',
              textShadow: '0 4px 20px rgba(0,0,0,0.8)',
              margin: 0,
              textAlign: isMobile ? 'center' : 'left',
            }}
          >
            {splitLetters("Homes That Reflect")}
            <br />
            {splitLetters("The Lives Within")}
          </h3>
        </div>

        {/* Bottom Right Quote */}
        <div className={isMobile ? "w-full" : "max-w-[650px] text-right"}>
          <p
            className="font-urbanist"
            style={{
              fontSize: isMobile ? 'clamp(0.95rem, 4vw, 1.2rem)' : 'clamp(1rem, 1.8vw, 1.8rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              color: '#ffffff',
              textShadow: '0 4px 20px rgba(0,0,0,0.8)',
              margin: 0,
              textAlign: isMobile ? 'center' : 'right',
            }}
          >
            {splitLetters("Great Interiors Don't Begin With Layouts")}
            <br />
            {splitLetters("Or Materials. They Begin With People.")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroQuotes;
