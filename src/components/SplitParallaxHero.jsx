"use client";

import React, { useEffect, useRef, useState } from 'react';

const SplitParallaxHero = () => {
  const containerRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const textRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        if (!isMobile) {
          // ── Desktop Counter-Parallax ──
          // Left column image moves down
          gsap.fromTo(leftColRef.current,
            { y: '-8%' },
            {
              y: '8%',
              ease: 'none',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: true
              }
            }
          );

          // Right column image moves up
          gsap.fromTo(rightColRef.current,
            { y: '8%' },
            {
              y: '-8%',
              ease: 'none',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: true
              }
            }
          );
        } else {
          // ── Mobile Single Parallax ──
          gsap.fromTo(leftColRef.current,
            { y: '-5%' },
            {
              y: '5%',
              ease: 'none',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: true
              }
            }
          );
        }

        // ── Text Fade & Scale Out ──
        gsap.fromTo(textRef.current,
          { opacity: 1, scale: 1 },
          {
            opacity: 0,
            scale: 1.1,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: '80% top',
              scrub: true
            }
          }
        );

        // ── Text Entrance Reveal on load ──
        gsap.fromTo('.hero-text-reveal',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.4, stagger: 0.15, ease: 'power4.out', delay: 0.5 }
        );
      }, containerRef);

      return () => ctx.revert();
    };

    initGSAP();

  }, [isMobile]);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#FAF8F5]"
      style={{ height: '100vh', marginTop: '-1px' }}
    >
      {/* ── DESKTOP SPLIT PARALLAX ── */}
      {!isMobile ? (
        <div className="w-full h-full flex relative z-0">
          {/* Left Panel */}
          <div className="w-1/2 h-full overflow-hidden relative">
            <div 
              ref={leftColRef}
              className="absolute inset-0 w-full h-[120%]"
              style={{ top: '-10%' }}
            >
              <img 
                src="/images/Modern.png" 
                alt="Luxury Living Curation" 
                className="w-full h-full object-cover filter brightness-[0.70]"
              />
            </div>
            {/* Soft Edge Shadow Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          </div>

          {/* Center Divider line */}
          <div className="absolute left-1/2 top-0 w-[1px] h-full bg-[#FAF8F5]/15 z-10" />

          {/* Right Panel */}
          <div className="w-1/2 h-full overflow-hidden relative">
            <div 
              ref={rightColRef}
              className="absolute inset-0 w-full h-[120%]"
              style={{ top: '-10%' }}
            >
              <img 
                src="/images/Modern 1.png" 
                alt="Bespoke Architecture" 
                className="w-full h-full object-cover filter brightness-[0.70]"
              />
            </div>
            {/* Soft Edge Shadow Gradient */}
            <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent" />
          </div>
        </div>
      ) : (
        /* ── MOBILE FULL SCREEN SINGLE IMAGE ── */
        <div className="w-full h-full overflow-hidden relative z-0">
          <div 
            ref={leftColRef}
            className="absolute inset-0 w-full h-[115%]"
            style={{ top: '-7%' }}
          >
            <img 
              src="/images/Modern.png" 
              alt="Luxury Living" 
              className="w-full h-full object-cover filter brightness-[0.65]"
            />
          </div>
        </div>
      )}

      {/* Cinematic Linear Gradient bottom to overlap next section */}
      <div className="absolute bottom-0 left-0 w-full h-[20vh] bg-gradient-to-t from-[#FAF8F5] to-transparent z-10 pointer-events-none" />

      {/* ── CENTRAL TYPOGRAPHY OVERLAY ── */}
      <div 
        ref={textRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 pointer-events-none px-6"
      >
        <span 
          className="hero-text-reveal font-urbanist text-[0.8rem] md:text-[0.9rem] font-bold text-[#FAF8F5] tracking-[0.25em] uppercase mb-4 md:mb-6"
          style={{ textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
        >
          Marquis Living Dubai
        </span>

        <h1 
          className="hero-text-reveal font-lacroom text-[#FAF8F5] font-light leading-[1.05] tracking-tight mb-8 uppercase"
          style={{ 
            fontSize: 'clamp(2.5rem, 6.5vw, 5.8rem)',
            textShadow: '0 10px 30px rgba(0,0,0,0.45)'
          }}
        >
          SHAPING / SPATIAL / <br />
          <span className="text-[#b2000a]">POETRY</span>
        </h1>

        <p 
          className="hero-text-reveal font-urbanist text-[#e2d8d8] font-light leading-relaxed max-w-[500px]"
          style={{ 
            fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
            textShadow: '0 2px 8px rgba(0,0,0,0.35)' 
          }}
        >
          Translating structural precision into ultra-luxury residential fit-outs and bespoke curations.
        </p>

        {/* Scroll Indicator Icon */}
        <div className="hero-text-reveal absolute bottom-12 flex flex-col items-center gap-2">
          <span className="font-urbanist text-[0.65rem] tracking-[0.2em] text-[#e2d8d8]/80 uppercase">
            Scroll to explore
          </span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-[#e2d8d8]/80 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default SplitParallaxHero;
