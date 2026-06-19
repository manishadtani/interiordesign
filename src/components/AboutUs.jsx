"use client";

/**
 * AboutUs Component
 * Rebuilt & Enhanced with an editorial two-column layout, parallax imagery,
 * and elegant split-text scroll reveals.
 */

import React, { useEffect, useRef, useState } from 'react';

const AboutUs = () => {
  const sectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const imageContainerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 768);
    updateMobile();
    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

  useEffect(() => {
    // Dynamic import to support client-only GSAP ScrollTrigger
    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Text reveals
        const revealElements = textContainerRef.current.querySelectorAll('.reveal-text');
        gsap.fromTo(
          revealElements,
          { y: '105%', rotate: 1 },
          {
            y: '0%',
            rotate: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );

        // Image zoom parallax reveal
        const image = imageContainerRef.current.querySelector('.parallax-img');
        gsap.fromTo(
          image,
          { scale: 1.2 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );

        // Grid cards fade-in
        const cards = textContainerRef.current.querySelectorAll('.stat-card');
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
            },
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    };

    initGSAP();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about-us"
      className="relative z-10 w-full flex items-center justify-center bg-[#FAF8F5] overflow-hidden"
      style={{
        paddingTop: isMobile ? '4rem' : '8rem',
        paddingBottom: isMobile ? '4rem' : '8rem',
      }}
    >
      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
        
        {/* Left Side: Parallax Image Frame */}
        <div 
          ref={imageContainerRef}
          className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden shadow-2xl"
          style={{
            border: '1px solid rgba(0,0,0,0.06)'
          }}
        >
          <img 
            src="/projectcarousel/MODERN HOUSE, LUCKNOW.jpeg" 
            alt="Luxury Interior Living Space" 
            className="parallax-img w-full h-full object-cover"
            style={{
              willChange: 'transform',
            }}
          />
          {/* Subtle Decorative Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
          {/* Tiny Floating Gold Accent badge */}
          <div 
            className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-md px-6 py-4 rounded-[0.8rem] shadow-lg flex items-center gap-3 border border-[#e2d8d8ff]"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#B2000A] animate-ping" />
            <span className="font-urbanist text-xs uppercase tracking-widest font-semibold text-[#2b2b2b]">
              Est. Since 2014
            </span>
          </div>
        </div>

        {/* Right Side: Editorial Text */}
        <div ref={textContainerRef} className="flex flex-col justify-center">
          {/* Label — ABOUT US */}
          <div className="mb-6">
            <div className="overflow-hidden inline-block">
              <span
                className="reveal-text inline-block font-urbanist text-[0.80rem] font-bold text-[#b2000a] border-b border-[#e2d8d8ff] pb-1 uppercase tracking-[0.2em]"
              >
                About Us
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <h2
            className="font-lacroom text-[#2b2b2b] font-light leading-[1.05] tracking-tight mb-8"
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 4.2rem)',
            }}
          >
            <div className="overflow-hidden block py-1">
              <span className="reveal-text block">Dubai's Top Interior</span>
            </div>
            <div className="overflow-hidden block py-1">
              <span className="reveal-text block">Design Expertise,</span>
            </div>
            <div className="overflow-hidden block py-1">
              <span className="reveal-text block text-[#b2000a]">
                Now In Dubai
              </span>
            </div>
          </h2>

          {/* Subtext Paragraph */}
          <div className="overflow-hidden mb-12">
            <p
              className="reveal-text font-urbanist text-[#6b6b6b] leading-relaxed font-light"
              style={{
                fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
                maxWidth: '560px'
              }}
            >
              Bringing globally recognized design standards, meticulous craftsmanship,
              and structural excellence to contemporary Dubai homes. We redefine spaces 
              to match your lifestyle, ensuring every corner represents luxury and comfort.
            </p>
          </div>

          {/* Expanded Core Values / Stats Grid */}
          <div className="grid grid-cols-2 gap-8 border-t border-[#e2d8d8ff] pt-8 max-w-[500px]">
            <div className="stat-card">
              <h4 className="font-lacroom text-4xl text-[#2b2b2b] font-light">100%</h4>
              <p className="font-urbanist text-xs uppercase tracking-widest text-[#8b8b8b] mt-1">Bespoke Fitting</p>
            </div>
            <div className="stat-card">
              <h4 className="font-lacroom text-4xl text-[#b2000a] font-light">15+</h4>
              <p className="font-urbanist text-xs uppercase tracking-widest text-[#8b8b8b] mt-1">Design Awards</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutUs;
