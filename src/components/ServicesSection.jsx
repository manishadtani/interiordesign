"use client";

/**
 * ServicesSection Component
 * Premium list of services with an inset clear image over a blurred/darkened background.
 * Scroll animations powered by GSAP.
 */

import React, { useEffect, useRef, useState } from 'react';

const SERVICES = [
  {
    id: "01",
    title: "Design\n Consultation",
    desc: "Thoughtful direction to help you shape spaces that feel personal and intentional.",
    image: "/images/service1.png",
  },
  {
    id: "02",
    title: "Luxury\n Projects",
    desc: "Delivering high-value projects with careful planning, precision, and superior finishes.",
    image: "/images/service2.png",
  },
  {
    id: "03",
    title: "Consultation\n + Execution",
    desc: "End-to-end execution, from concept development to the final handover.",
    image: "/images/service3.png",
  },
];

const ServicesSection = () => {
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
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

      ScrollTrigger.config({
        ignoreMobileResize: true
      });

      const cards = gsap.utils.toArray('.service-card');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: `+=${cards.length * 100}%`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 1.8,
          invalidateOnRefresh: true,
        }
      });

      let currentTime = 0;

      cards.forEach((card, i) => {
        if (i > 0) {
          gsap.set(card, { y: '110%', opacity: 0 });
        }

        if (i > 0) {
          tl.to(card, {
            y: '0%',
            opacity: 1,
            duration: 2,
            ease: 'power3.inOut',
          }, currentTime);

          const prevCard = cards[i - 1];
          tl.to(prevCard, {
            scale: 0.9,
            opacity: 0,
            filter: 'blur(15px)',
            duration: 2,
            ease: 'power3.inOut',
          }, currentTime);
          
          currentTime += 2;
        }

        const innerImg = card.querySelector('.inner-clear-image');
        if (innerImg) {
          const startScale = (i === 0) ? 1.12 : 1.25;
          const startY = (i === 0) ? '2%' : '5%';

          tl.fromTo(innerImg,
            { scale: startScale, y: startY },
            { scale: 1, y: '-5%', ease: 'none', duration: 2 },
            currentTime
          );
        }
        
        currentTime += 2;
      });

      tl.to({}, { duration: 0.5 });
    };

    initGSAP();

  }, []);

  return (
    <section
      ref={triggerRef}
      style={{
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#FAF8F5',
        position: 'relative',
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 2rem',
        }}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1600px',
          height: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {SERVICES.map((service, idx) => (
            <div
              key={service.id}
              className="service-card group"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100%',
                height: '100%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#ffffff',
                borderRadius: '40px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: isMobile ? 'flex-start' : 'center',
                zIndex: idx,
                willChange: 'transform, opacity, filter',
              }}
            >
              {/* Blur BG Image */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <img
                  src={service.image}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'blur(1px) brightness(0.80)',
                    transform: 'scale(1.4)',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)',
                }} />
              </div>

              {/* Inner Clear Image */}
              <div style={{
                position: 'relative',
                marginLeft: isMobile ? '0' : '3.5rem',
                marginTop: isMobile ? '1.5rem' : '0',
                width: isMobile ? '88%' : '42%',
                height: isMobile ? '45%' : '95%',
                borderRadius: '30px',
                overflow: 'hidden',
                zIndex: 1,
                boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
              }}>
                <img
                  className="inner-clear-image"
                  src={service.image}
                  alt={service.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Content Panel */}
              <div style={{
                position: 'relative',
                zIndex: 2,
                flex: 1,
                padding: isMobile ? '2rem 1.5rem' : '0 4rem 0 3rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: isMobile ? 'center' : 'flex-end',
                textAlign: isMobile ? 'center' : 'right',
                color: '#fff',
              }}>
                <span style={{
                  fontFamily: "'Lacroom', serif",
                  fontSize: isMobile ? '1.5rem' : '2rem',
                  color: 'rgba(255,255,255,0.25)',
                  marginBottom: isMobile ? '0.5rem' : '1rem',
                  letterSpacing: '0.05em',
                }}>
                  {service.id}
                </span>
                <h3 style={{
                  fontFamily: "'Lacroom', serif",
                  fontSize: isMobile ? 'clamp(1.8rem, 7vw, 2.7rem)' : 'clamp(2.5rem, 3.3vw, 2.7rem)',
                  lineHeight: 1.0,
                  marginBottom: isMobile ? '1rem' : '1.25rem',
                  whiteSpace: 'pre-line',
                  maxWidth: '650px',
                }}>
                  {service.title}
                </h3>
                <p style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontSize: isMobile ? '0.95rem' : '1.05rem',
                  color: '#ffffff',
                  lineHeight: 1.6,
                  maxWidth: isMobile ? '90%' : '300px',
                  fontWeight: 300,
                }}>
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
