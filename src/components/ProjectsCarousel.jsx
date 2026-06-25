"use client";

/**
 * ProjectsCarousel Component
 * 3D Coverflow carousel — cards rotate in perspective like a circular wheel
 * Premium interior design portfolio showcase
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

// ── Secret Code Vault (5 tabs) ──
const SECRET_TABS = [
  {
    label: 'layout.tsx',
    code: [
      'import type { Metadata } from "next";',
      'import "./globals.css";',
      'import SmoothScroll from "@/components/SmoothScroll";',
      '',
      'export const metadata: Metadata = {',
      '  title: "Marquis Living | Premium Design",',
      '  description: "Bespoke luxury architecture & interior design studio",',
      '};',
      '',
      'export default function RootLayout({',
      '  children,',
      '}: Readonly<{',
      '  children: React.ReactNode;',
      '}>) {',
      '  return (',
      '    <html lang="en">',
      '      <body className="antialiased">',
      '        <SmoothScroll>',
      '          {children}',
      '        </SmoothScroll>',
      '      </body>',
      '    </html>',
      '  );',
      '}',
    ].join('\n')
  },
  {
    label: 'page.tsx',
    code: [
      'import CinematicHero from "@/components/CinematicHero";',
      '',
      'export default function Home() {',
      '  return (',
      '    <main className="w-full bg-[#FAF8F5]">',
      '      {/* 1. Cinematic Scroll Canvas Hero */}',
      '      <CinematicHero />',
      '',
      '      {/* 2. Test Content Area */}',
      '      <section className="w-full h-screen bg-white flex items-center justify-center border-t border-gray-100">',
      '        <div className="text-center">',
      '          <h2 className="text-3xl md:text-5xl font-light text-neutral-800 tracking-wider uppercase mb-4">',
      '            Next Architectural Exhibit',
      '          </h2>',
      '          <p className="text-neutral-500 font-light text-sm md:text-base">',
      '            This space indicates you have scrolled past the pinned canvas gallery.',
      '          </p>',
      '        </div>',
      '      </section>',
      '    </main>',
      '  );',
      '}',
    ].join('\n')
  },
  {
    label: 'CinematicHero.tsx',
    code: [
      '"use client";',
      'import React, { useEffect, useRef, useState } from \'react\';',
      'import dynamic from \'next/dynamic\';',
      '',
      'const CinematicHeroMobile = dynamic(() => import(\'./CinematicHeroMobile\'), { ssr: false });',
      '',
      'const TOTAL_FRAMES = 192;',
      'const INITIAL_LOAD_COUNT = 12;',
      'const MAX_DPR = 1.5;',
      '',
      'export default function CinematicHero() {',
      '  const [isMobile, setIsMobile] = useState<boolean>(false);',
      '  const containerRef = useRef<HTMLDivElement>(null);',
      '  const pinRef = useRef<HTMLDivElement>(null);',
      '  const canvasRef = useRef<HTMLCanvasElement>(null);',
      '  const [loadProgress, setLoadProgress] = useState<number>(0);',
      '  const [isReady, setIsReady] = useState<boolean>(false);',
      '  const framesRef = useRef<Array<HTMLImageElement | undefined>>([]);',
      '  const lastFrameIndexRef = useRef<number>(-1);',
      '  const currentFrameIndexRef = useRef<number>(0);',
      '  const requestRef = useRef<number | null>(null);',
      '  const unmountedRef = useRef<boolean>(false);',
      '  const progressRef = useRef<number>(0);',
      '',
      '  useEffect(() => {',
      '    const onResize = () => setIsMobile(window.innerWidth < 768);',
      '    onResize();',
      '    window.addEventListener(\'resize\', onResize);',
      '    return () => window.removeEventListener(\'resize\', onResize);',
      '  }, []);',
      '',
      '  useEffect(() => {',
      '    if (typeof window === \'undefined\' || isMobile) return;',
      '',
      '    let loadedCount = 0;',
      '    const preloadedImages: Array<HTMLImageElement | undefined> = new Array(TOTAL_FRAMES);',
      '',
      '    const updateProgress = () => {',
      '      const percent = Math.round((loadedCount / TOTAL_FRAMES) * 100);',
      '      if (percent !== progressRef.current) {',
      '        progressRef.current = percent;',
      '        setLoadProgress(percent);',
      '      }',
      '    };',
      '',
      '    const loadImage = (index: number) => {',
      '      return new Promise<void>((resolve) => {',
      '        if (unmountedRef.current) return resolve();',
      '',
      '        const img = new Image();',
      '        img.onload = () => {',
      '          preloadedImages[index] = img;',
      '          loadedCount += 1;',
      '          updateProgress();',
      '          resolve();',
      '        };',
      '        img.onerror = () => {',
      '          console.error(`Failed to load frame ${index}`);',
      '          loadedCount += 1;',
      '          updateProgress();',
      '          resolve();',
      '        };',
      '        img.src = `/scroll/1st frame_${String(index).padStart(5, \'0\')}.webp`;',
      '      });',
      '    };',
      '',
      '    const idle = (callback: () => void) => {',
      '      if (\'requestIdleCallback\' in window) {',
      '        (window as any).requestIdleCallback(callback, { timeout: 200 });',
      '      } else {',
      '        setTimeout(callback, 200);',
      '      }',
      '    };',
      '',
      '    const loadBatch = async (startIndex: number, count: number) => {',
      '      const batch = Array.from(',
      '        { length: Math.min(count, TOTAL_FRAMES - startIndex) },',
      '        (_, offset) => startIndex + offset',
      '      );',
      '      await Promise.all(batch.map(loadImage));',
      '    };',
      '',
      '    const loadRemaining = async (startIndex: number) => {',
      '      const batchSize = 6;',
      '      for (let i = startIndex; i < TOTAL_FRAMES && !unmountedRef.current; i += batchSize) {',
      '        await new Promise<void>((resolve) => {',
      '          idle(() => {',
      '            loadBatch(i, batchSize).then(resolve);',
      '          });',
      '        });',
      '      }',
      '    };',
      '',
      '    const loadImages = async () => {',
      '      await loadBatch(0, INITIAL_LOAD_COUNT);',
      '      if (unmountedRef.current) return;',
      '',
      '      framesRef.current = preloadedImages;',
      '      setIsReady(true);',
      '',
      '      if (TOTAL_FRAMES > INITIAL_LOAD_COUNT) {',
      '        loadRemaining(INITIAL_LOAD_COUNT);',
      '      }',
      '    };',
      '',
      '    loadImages();',
      '',
      '    return () => {',
      '      unmountedRef.current = true;',
      '      if (requestRef.current !== null) {',
      '        cancelAnimationFrame(requestRef.current);',
      '      }',
      '    };',
      '  }, [isMobile]);',
      '  const drawFrame = (index: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {',
      '    const frameIndex = Math.max(0, Math.min(Math.floor(index), TOTAL_FRAMES - 1));',
      '    currentFrameIndexRef.current = frameIndex;',
      '    if (lastFrameIndexRef.current === frameIndex) return;',
      '    lastFrameIndexRef.current = frameIndex;',
      '    const img = framesRef.current[frameIndex];',
      '    if (!img) return;',
      '    ctx.clearRect(0, 0, canvas.width, canvas.height);',
      '    const imgRatio = img.width / img.height;',
      '    const canvasRatio = canvas.width / canvas.height;',
      '    let dw: number, dh: number, dx: number, dy: number;',
      '    if (imgRatio > canvasRatio) {',
      '      dh = canvas.height;',
      '      dw = dh * imgRatio;',
      '      dx = (canvas.width - dw) / 2;',
      '      dy = 0;',
      '    } else {',
      '      dw = canvas.width;',
      '      dh = dw / imgRatio;',
      '      dx = 0;',
      '      dy = (canvas.height - dh) / 2;',
      '    }',
      '    ctx.drawImage(img, dx, dy, dw, dh);',
      '  };',
      '  const setCanvasDimensions = (canvas: HTMLCanvasElement) => {',
      '    if (!canvas) return;',
      '    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);',
      '    const rect = canvas.getBoundingClientRect();',
      '    canvas.width = rect.width * dpr;',
      '    canvas.height = rect.height * dpr;',
      '',
      '    const ctx = canvas.getContext(\'2d\');',
      '    if (!ctx) return;',
      '    ctx.imageSmoothingEnabled = true;',
      '    ctx.imageSmoothingQuality = \'high\';',
      '',
      '    if (framesRef.current[currentFrameIndexRef.current]) {',
      '      lastFrameIndexRef.current = -1;',
      '      drawFrame(currentFrameIndexRef.current, canvas, ctx);',
      '    }',
      '  };',
      '  useEffect(() => {',
      '    if (typeof window === \'undefined\' || !isReady) return;',
      '    const canvas = canvasRef.current;',
      '    if (!canvas) return;',
      '    const ctx = canvas.getContext(\'2d\', { alpha: false });',
      '    if (!ctx) return;',
      '    setCanvasDimensions(canvas);',
      '    const handleResize = () => setCanvasDimensions(canvas);',
      '    window.addEventListener(\'resize\', handleResize);',
      '',
      '    let gsapContext: any = null;',
      '    let scrollTriggerInstance: any = null;',
      '',
      '    const initGSAP = async () => {',
      '      const { gsap } = await import(\'gsap\');',
      '      const { ScrollTrigger } = await import(\'gsap/ScrollTrigger\');',
      '',
      '      gsap.registerPlugin(ScrollTrigger);',
      '      gsapContext = gsap.context(() => {',
      '        const timeline = gsap.timeline({',
      '          scrollTrigger: {',
      '            trigger: containerRef.current,',
      '            pin: pinRef.current,',
      '            start: \'top top\',',
      '            end: \'bottom bottom\',',
      '            scrub: true,',
      '            onUpdate: (self) => {',
      '              const frameIndex = self.progress * (TOTAL_FRAMES - 1);',
      '              if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);',
      '              requestRef.current = requestAnimationFrame(() => drawFrame(frameIndex, canvas, ctx));',
      '            },',
      '            onRefresh: () => {',
      '              setCanvasDimensions(canvas);',
      '            }',
      '          }',
      '        });',
      '        scrollTriggerInstance = timeline.scrollTrigger;',
      '      }, containerRef);',
      '    };',
      '    initGSAP();',
      '    return () => {',
      '      window.removeEventListener(\'resize\', handleResize);',
      '      scrollTriggerInstance?.kill();',
      '      gsapContext?.revert();',
      '    };',
      '  }, [isReady]);',
      '  useEffect(() => {',
      '    if (!isReady || !canvasRef.current) return;',
      '',
      '    const canvas = canvasRef.current;',
      '    const ctx = canvas.getContext(\'2d\', { alpha: false });',
      '    if (!ctx) return;',
      '',
      '    lastFrameIndexRef.current = -1;',
      '    drawFrame(currentFrameIndexRef.current, canvas, ctx);',
      '',
      '    let gsapContext: any = null;',
      '    let cancelled = false;',
      '',
      '    import(\'gsap\').then(({ gsap }) => {',
      '      if (cancelled) return;',
      '      gsapContext = gsap.context(() => {',
      '        gsap.fromTo(',
      '          \'.scroll-indicator-container\',',
      '          { opacity: 0, y: 20 },',
      '          { opacity: 1, y: 0, duration: 1.0, ease: \'power3.out\', delay: 0.8 }',
      '        );',
      '        gsap.fromTo(',
      '          \'.scroll-indicator-arrow\',',
      '          { y: -3 },',
      '          { y: 5, duration: 1.0, repeat: -1, yoyo: true, ease: \'power1.inOut\', delay: 1.0 }',
      '        );',
      '',
      '        const teaserVal = { frame: 0 };',
      '        gsap.timeline({ delay: 1.0 })',
      '          .to(teaserVal, {',
      '            frame: 16,',
      '            duration: 1.2,',
      '            ease: \'power1.out\',',
      '            onUpdate: () => {',
      '              if (window.scrollY === 0) {',
      '                drawFrame(teaserVal.frame, canvas, ctx);',
      '              }',
      '            }',
      '          })',
      '          .to(teaserVal, {',
      '            frame: 0,',
      '            duration: 1.0,',
      '            ease: \'power1.inOut\',',
      '            onUpdate: () => {',
      '              if (window.scrollY === 0) {',
      '                drawFrame(teaserVal.frame, canvas, ctx);',
      '              }',
      '            }',
      '          });',
      '      }, containerRef);',
      '    });',
      '',
      '    return () => {',
      '      cancelled = true;',
      '      gsapContext?.revert();',
      '    };',
      '  }, [isReady]);',
      '  if (isMobile) {',
      '    return <CinematicHeroMobile />;',
      '  }',
      '  return (',
      '    <section ref={containerRef} className="relative w-full h-[180vh] md:h-[220vh] bg-[#FAF8F5]">',
      '      <div ref={pinRef} className="w-full h-screen relative overflow-hidden">',
      '        <div className="absolute inset-0 z-0 select-none pointer-events-none">',
      '          <canvas',
      '            ref={canvasRef}',
      '            className={`w-full h-full block object-cover transition-opacity duration-1000 ${isReady ? \'opacity-100\' : \'opacity-0\'}`}',
      '            style={{ willChange: \'transform\' }}',
      '          />',
      '        </div>',
      '        <div className="scroll-indicator-container absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none" style={{ opacity: 0 }}>',
      '          <span className="text-[0.65rem] tracking-[0.2em] text-[#8b8b8b] uppercase">Scroll to explore</span>',
      '          <div className="scroll-indicator-arrow w-[1px] h-10 bg-gradient-to-b from-[#8b8b8b] to-transparent" />',
      '        </div>',
      '        {!isReady && (',
      '          <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#FAF8F5] z-20">',
      '            <div className="relative w-20 h-20 flex items-center justify-center">',
      '              <svg className="w-full h-full transform -rotate-90">',
      '                <circle cx="40" cy="40" r="34" stroke="#E8E3DD" strokeWidth="3" fill="transparent" />',
      '                <circle',
      '                  cx="40" cy="40" r="34" stroke="#B2000A" strokeWidth="3" fill="transparent"',
      '                  strokeDasharray={2 * Math.PI * 34}',
      '                  strokeDashoffset={(2 * Math.PI * 34) * (1 - loadProgress / 100)}',
      '                  className="transition-all duration-300"',
      '                />',
      '              </svg>',
      '              <span className="absolute text-xs font-semibold text-[#2b2b2b]">{loadProgress}%</span>',
      '            </div>',
      '            <span className="text-xs text-[#8b8b8b] uppercase tracking-[0.2em] mt-4">Loading Walkthrough...</span>',
      '          </div>',
      '        )}',
      '      </div>',
      '    </section>',
      '  );',
      '}',
    ].join('\n')
  },
  {
    label: 'CinematicHeroMobile.tsx',
    code: [
      '"use client";',
      'import React, { useEffect, useRef, useState } from \'react\';',
      '',
      'const TOTAL_MOBILE_FRAMES = 191;',
      '',
      'export default function CinematicHeroMobile() {',
      '  const containerRef = useRef<HTMLDivElement>(null);',
      '  const canvasRef = useRef<HTMLCanvasElement>(null);',
      '  const requestRef = useRef<number | null>(null);',
      '  const framesRef = useRef<Array<HTMLImageElement | undefined>>([]);',
      '  const [isReady, setIsReady] = useState(false);',
      '  const [progress, setProgress] = useState(0);',
      '',
      '  useEffect(() => {',
      '    let mounted = true;',
      '',
      '    const preload = async () => {',
      '      const total = TOTAL_MOBILE_FRAMES;',
      '      if (total <= 0) return;',
      '      const batch = 6;',
      '      let loaded = 0;',
      '      const imgs: Array<HTMLImageElement | undefined> = new Array(total);',
      '',
      '      const loadImg = (i: number) => new Promise<void>((resolve) => {',
      '        const img = new Image();',
      '        img.onload = () => { imgs[i] = img; loaded += 1; if (mounted && loaded === Math.min(total, 8)) setIsReady(true); resolve(); };',
      '        img.onerror = () => { loaded += 1; resolve(); };',
      '        img.src = `/scroll-mobile-frames/mobile-frame_${String(i + 1).padStart(5, \'0\')}.png`;',
      '      });',
      '',
      '      for (let i = 0; i < total; i += batch) {',
      '        const tasks = [] as Promise<void>[];',
      '        for (let j = i; j < Math.min(i + batch, total); j++) tasks.push(loadImg(j));',
      '        // eslint-disable-next-line no-await-in-loop',
      '        await Promise.all(tasks);',
      '      }',
      '',
      '      framesRef.current = imgs;',
      '      if (mounted) setIsReady(true);',
      '    };',
      '',
      '    preload();',
      '    return () => { mounted = false; if (requestRef.current) cancelAnimationFrame(requestRef.current); };',
      '  }, []);',
      '',
      '  // scroll-synced playback: map page scroll over the container to frames',
      '  useEffect(() => {',
      '    if (!isReady || !canvasRef.current || !containerRef.current) return;',
      '    const canvas = canvasRef.current;',
      '    const ctx = canvas.getContext(\'2d\');',
      '    if (!ctx) return;',
      '',
      '    const setSize = () => {',
      '      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);',
      '      const rect = canvas.getBoundingClientRect();',
      '      canvas.width = rect.width * dpr;',
      '      canvas.height = rect.height * dpr;',
      '    };',
      '    setSize();',
      '    window.addEventListener(\'resize\', setSize);',
      '',
      '    const total = TOTAL_MOBILE_FRAMES;',
      '',
      '    const drawFrame = (frameIndexFloat: number) => {',
      '      const frameIndex = Math.max(0, Math.min(Math.floor(frameIndexFloat), Math.max(0, total - 1)));',
      '      const img = framesRef.current[frameIndex];',
      '      if (!img) return;',
      '      ctx.clearRect(0, 0, canvas.width, canvas.height);',
      '      const imgRatio = img.width / img.height;',
      '      const canvasRatio = canvas.width / canvas.height;',
      '      let dw: number, dh: number, dx: number, dy: number;',
      '      if (imgRatio > canvasRatio) {',
      '        dh = canvas.height;',
      '        dw = dh * imgRatio;',
      '        dx = (canvas.width - dw) / 2;',
      '        dy = 0;',
      '      } else {',
      '        dw = canvas.width;',
      '        dh = dw / imgRatio;',
      '        dx = 0;',
      '        dy = (canvas.height - dh) / 2;',
      '      }',
      '      ctx.drawImage(img, dx, dy, dw, dh);',
      '    };',
      '',
      '    const onScroll = () => {',
      '      const rect = containerRef.current!.getBoundingClientRect();',
      '      const containerTop = window.scrollY + rect.top;',
      '      const containerHeight = rect.height;',
      '      const viewportH = window.innerHeight;',
      '',
      '      const denom = Math.max(1, containerHeight - viewportH);',
      '      const raw = (window.scrollY - containerTop) / denom;',
      '      const progress = Math.min(1, Math.max(0, raw));',
      '        ',
      '      const frameIndex = progress * (Math.max(0, total - 1));',
      '      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);',
      '      requestRef.current = requestAnimationFrame(() => drawFrame(frameIndex));',
      '    };',
      '',
      '    window.addEventListener(\'scroll\', onScroll, { passive: true });',
      '    onScroll();',
      '',
      '    return () => {',
      '      window.removeEventListener(\'resize\', setSize);',
      '      window.removeEventListener(\'scroll\', onScroll);',
      '      if (requestRef.current) cancelAnimationFrame(requestRef.current);',
      '    };',
      '  }, [isReady]);',
      '',
      '  return (',
      '    <section ref={containerRef} className="relative w-full h-[200vh] bg-[#FAF8F5]">',
      '      <div className="w-full sticky top-0 h-screen relative overflow-hidden">',
      '        <div className="absolute inset-0 z-0 select-none pointer-events-none">',
      '          <canvas ref={canvasRef} className={`w-full h-full block object-cover transition-opacity duration-500 ${isReady ? \'opacity-100\' : \'opacity-0\'}`} style={{ willChange: \'transform\' }} />',
      '        </div>',
      '        {!isReady && (',
      '          <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#FAF8F5] z-20">',
      '            <div className="relative w-20 h-20 flex items-center justify-center">',
      '              <svg className="w-full h-full transform -rotate-90">',
      '                <circle cx="40" cy="40" r="34" stroke="#E8E3DD" strokeWidth="3" fill="transparent" />',
      '                <circle cx="40" cy="40" r="34" stroke="#B2000A" strokeWidth="3" fill="transparent" strokeDasharray={2 * Math.PI * 34} strokeDashoffset={(2 * Math.PI * 34) * (1 - progress / 100)} className="transition-all duration-300" />',
      '              </svg>',
      '              <span className="absolute text-xs font-semibold text-[#2b2b2b]">{progress}%</span>',
      '            </div>',
      '            <span className="text-xs text-[#8b8b8b] uppercase tracking-[0.2em] mt-4">Loading Mobile Walkthrough...</span>',
      '          </div>',
      '        )}',
      '      </div>',
      '    </section>',
      '  );',
      '}',
    ].join('\n')
  },
  {
    label: 'SmoothScroll.tsx',
    code: [
      '"use client";',
      '',
      'import React, { useEffect } from \'react\';',
      'import Lenis from \'lenis\';',
      '',
      'interface SmoothScrollProps {',
      '  children: React.ReactNode;',
      '}',
      '',
      'export default function SmoothScroll({ children }: SmoothScrollProps) {',
      '  useEffect(() => {',
      '    const lenis = new Lenis({',
      '      duration: 1.2,',
      '      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),',
      '      orientation: \'vertical\',',
      '      smoothWheel: true,',
      '    });',
      '',
      '    function raf(time: number) {',
      '      lenis.raf(time);',
      '      requestAnimationFrame(raf);',
      '    }',
      '',
      '    requestAnimationFrame(raf);',
      '',
      '    return () => {',
      '      lenis.destroy();',
      '    };',
      '  }, []);',
      '',
      '  return <>{children}</>;',
      '}',
    ].join('\n')
  }
];

// Secret Code Modal Component
const SecretCodeModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SECRET_TABS[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', animation: 'fadeIn 0.3s ease'
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0;transform:translateY(30px) } to { opacity:1;transform:translateY(0) } }
        .secret-modal-code::-webkit-scrollbar { width:6px; height:6px }
        .secret-modal-code::-webkit-scrollbar-track { background:rgba(255,255,255,0.05) }
        .secret-modal-code::-webkit-scrollbar-thumb { background:rgba(178,0,10,0.4); border-radius:3px }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '900px', maxHeight: '85vh',
          background: '#1a1a1a', borderRadius: '16px',
          border: '1px solid rgba(178,0,10,0.3)',
          display: 'flex', flexDirection: 'column',
          animation: 'slideUp 0.4s ease', overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <span style={{ color: '#b2000a', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            ● Vault Access Granted
          </span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#666',
            fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1
          }}>×</button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.1)',
          overflowX: 'auto', flexShrink: 0
        }}>
          {SECRET_TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => { setActiveTab(i); setCopied(false); }}
              style={{
                padding: '10px 20px', background: 'none', border: 'none',
                color: activeTab === i ? '#b2000a' : '#888',
                fontSize: '0.75rem', fontFamily: 'monospace', cursor: 'pointer',
                borderBottom: activeTab === i ? '2px solid #b2000a' : '2px solid transparent',
                whiteSpace: 'nowrap', transition: 'all 0.2s'
              }}
            >{tab.label}</button>
          ))}
        </div>

        {/* Code Area */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <pre className="secret-modal-code" style={{
            margin: 0, padding: '20px 24px', overflow: 'auto',
            height: '100%', color: '#e0e0e0', fontSize: '0.78rem',
            lineHeight: 1.65, fontFamily: "'Fira Code', 'Consolas', monospace",
            background: '#111', whiteSpace: 'pre', tabSize: 2
          }}>
            {SECRET_TABS[activeTab].code}
          </pre>
        </div>

        {/* Copy Button */}
        <div style={{
          padding: '12px 24px', borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', justifyContent: 'flex-end'
        }}>
          <button
            onClick={handleCopy}
            style={{
              padding: '8px 28px', borderRadius: '6px', border: 'none',
              background: copied ? '#1a5c1a' : '#b2000a', color: '#fff',
              fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'monospace',
              transition: 'all 0.2s', letterSpacing: '0.1em'
            }}
          >{copied ? '✓ Copied!' : 'Copy Code'}</button>
        </div>
      </div>
    </div>
  );
};

const PROJECTS = [
  {
    id: 1,
    title: "Bachelor's Pad",
    location: "Dubai Marina",
    image: "/projectcarousel/BACHELOR'S PAD, MUMBAI.jpeg",
    style: "Modern Minimalist",
    scope: "FF&E Curation & Turnkey Delivery",
    year: "2025"
  },
  {
    id: 2,
    title: "Minimalist Apartment",
    location: "Downtown Dubai",
    image: "/projectcarousel/BUILDER APARTMENT, GURUGRAM.jpeg",
    style: "Warm Japandi",
    scope: "Space Planning & Styling",
    year: "2026"
  },
  {
    id: 3,
    title: "Classical Mansion",
    location: "Emirates Hills",
    image: "/projectcarousel/classical house, anand niketan.jpeg",
    style: "Neo-Classical Luxury",
    scope: "Complete Interior Design",
    year: "2026"
  },
  {
    id: 4,
    title: "Desert Oasis Villa",
    location: "Al Barari",
    image: "/projectcarousel/JAIPUR RETREAT.png",
    style: "Biophilic Organic",
    scope: "Full Architectural Interior",
    year: "2025"
  },
  {
    id: 5,
    title: "Palm Beach Villa",
    location: "Palm Jumeirah",
    image: "/projectcarousel/KAVERI HOUSE, CHENNAI.jpeg",
    style: "Contemporary Coastal",
    scope: "Curated Art & Curation",
    year: "2026"
  },
  {
    id: 6,
    title: "Jumeirah Manor",
    location: "Jumeirah Beach",
    image: "/projectcarousel/KRISHNA NIWAS, CHATTARPUR.jpeg",
    style: "Eclectic Grandeur",
    scope: "Interior Architecture",
    year: "2025"
  },
  {
    id: 7,
    title: "Lakeside Sanctuary",
    location: "Jumeirah Islands",
    image: "/projectcarousel/LAKE HOUSE, KOCHI.png",
    style: "Quiet Luxury Modern",
    scope: "Bespoke Fit-outs",
    year: "2026"
  },
  {
    id: 8,
    title: "Modern Villa",
    location: "Arabian Ranches",
    image: "/projectcarousel/MODERN HOUSE, LUCKNOW.jpeg",
    style: "Industrial Chic",
    scope: "Material Curation & Styling",
    year: "2025"
  },
  {
    id: 9,
    title: "Modern Luxury Penthouse",
    location: "Downtown Dubai",
    image: "/projectcarousel/MODERN LUXURY RESIDENCE, VASANT VIHAR.jpeg",
    style: "Ultra-Luxury Contemporary",
    scope: "Full Turnkey Curation",
    year: "2026"
  },
  {
    id: 10,
    title: "Scandinavian Holiday Home",
    location: "Jumeirah Golf Estates",
    image: "/projectcarousel/SCANDINAVIAN HOLIDAY HOME'.jpeg",
    style: "Nordic Minimalism",
    scope: "Soft Furnishings & Millwork",
    year: "2025"
  }
];

const CARD_W = 280;
const CARD_H = 420;

const ProjectsCarousel = ({ subtitle }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [secretOpen, setSecretOpen] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const splitLetters = (text) => {
    if (!text) return null;
    return text.split('').map((char, i) => (
      <span 
        key={i} 
        className="carousel-header-letter animate-letter" 
        style={{ 
          display: 'inline-block', 
          lineHeight: '1.2em', 
          transformOrigin: '0% 50%',
          perspective: '1000px',
          backfaceVisibility: 'hidden'
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;

    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const letters = gsap.utils.toArray('.carousel-header-letter');

        gsap.fromTo(letters,
          { 
            rotateY: -90,
            opacity: 0,
            scale: 0.8
          },
          { 
            rotateY: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.015,
            ease: "power2.out",
            duration: 1.0,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      });

      return () => ctx.revert();
    };

    initGSAP();

  }, []);

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const goTo = useCallback((idx) => {
    setActiveIdx(clamp(idx, 0, PROJECTS.length - 1));
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goTo(activeIdx + 1);
      if (e.key === 'ArrowLeft') goTo(activeIdx - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIdx, goTo]);

  const active = PROJECTS[activeIdx];

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#FAF8F5] py-16 md:py-24 overflow-hidden"
    >
      {/* Background blueprint grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:48px_48px] opacity-35 pointer-events-none z-0" />
      
      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem', padding: '0 2rem' }} className="z-10 relative">
        <p style={{
          fontFamily: "'Tenor Sans', sans-serif",
          fontSize: isMobile ? '0.65rem' : '0.75rem',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: '#b2000a',
          fontWeight: 700,
          borderBottom: '1px solid rgba(178, 0, 10, 0.2)',
          paddingBottom: '4px',
          display: 'inline-block',
          margin: '0 0 0.5rem 0',
        }}>
          {splitLetters(subtitle || "Exhibition Gallery")}
        </p>

        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400,
          fontSize: isMobile ? 'clamp(1.6rem, 5.5vw, 2.5rem)' : 'clamp(2.5rem, 6vw, 4rem)',
          color: '#2b2b2b',
          lineHeight: 1.05,
          marginBottom: '0.4rem',
        }}>
          {splitLetters("Curated Masterpieces")}
        </h2>
        <p style={{
          fontFamily: "'Tenor Sans', sans-serif",
          fontWeight: 300,
          fontSize: isMobile ? '0.9rem' : '1.2rem',
          color: '#6b6b6b',
          maxWidth: isMobile ? '90%' : '520px',
          lineHeight: 1.6,
          margin: '0.2rem auto 0',
        }}>
          {splitLetters("A testament to excellence. A collection of ")}
          <span
            onClick={() => setSecretOpen(true)}
            style={{ color: '#b2000a', fontWeight: 500, cursor: 'inherit' }}
          >
            {splitLetters("spaces brought to life")}
          </span>
          {splitLetters(" with thoughtful detail.")}
        </p>
      </div>

      {/* Main Split Grid */}
      <div className="max-w-[1100px] mx-auto px-6 flex flex-col md:flex-row gap-12 items-center z-10 relative">
        {/* Left Column: Arched Portal Frame */}
        <div className="w-full md:w-[45%] flex justify-center">
          <div className="relative w-[280px] md:w-[350px] h-[390px] md:h-[500px]">
            {/* Outer thin outline frame */}
            <div className="absolute inset-[-6px] rounded-t-full border border-[#d4c9be]/50 pointer-events-none z-20" />
            
            {/* Gold highlight accent frame */}
            <div className="absolute inset-[-3px] rounded-t-full border border-amber-600/15 pointer-events-none z-20" />

            {/* The primary white arch */}
            <div className="w-full h-full rounded-t-full border-[6px] border-white shadow-xl overflow-hidden relative bg-[#FAF8F5] z-10">
              {PROJECTS.map((project, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <div
                    key={project.id}
                    className="absolute inset-0 w-full h-full transition-all duration-700 ease-out"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'scale(1.03)' : 'scale(1.12)',
                      zIndex: isActive ? 10 : 0,
                    }}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                    {/* Faint black overlay inside portal for rich depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2b2b2b]/40 via-transparent to-transparent opacity-85 pointer-events-none" />
                  </div>
                );
              })}

              {/* Blueprint overlay curves on top of image */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 opacity-20" viewBox="0 0 100 150">
                <path d="M 10 60 A 40 40 0 0 1 90 60" stroke="#b2000a" strokeWidth="0.4" strokeDasharray="1.2,1.2" fill="none" />
                <line x1="50" y1="20" x2="50" y2="60" stroke="rgba(43,43,43,0.3)" strokeWidth="0.3" strokeDasharray="1,1" />
                <text x="50" y="16" className="font-mono text-[3px]" fill="#b2000a" textAnchor="middle">RAD = 1.80m</text>
                <text x="12" y="65" className="font-mono text-[2.5px]" fill="rgba(43,43,43,0.5)">PORTAL A-12</text>
                <text x="88" y="65" className="font-mono text-[2.5px]" fill="rgba(43,43,43,0.5)" textAnchor="end">GRID X-08</text>
              </svg>
            </div>
            
            {/* Museum Exhibit Label underneath the arch */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#b2000a] text-white text-[8px] font-mono tracking-[0.2em] px-2.5 py-1 uppercase rounded-sm z-30 shadow-md">
              EXHIBIT #0{(activeIdx + 1)}
            </div>
          </div>
        </div>

        {/* Right Column: Accordion List */}
        <div className="w-full md:w-[55%] flex flex-col gap-1 w-full text-left">
          {PROJECTS.map((project, idx) => {
            const isActive = idx === activeIdx;
            return (
              <div
                key={project.id}
                onClick={() => goTo(idx)}
                onMouseEnter={() => goTo(idx)}
                className={`border-b border-[#d4c9be]/30 py-3 md:py-4 transition-all duration-300 cursor-pointer ${
                  isActive ? 'border-[#b2000a]/40' : 'hover:border-[#2b2b2b]/35'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`font-mono text-xs md:text-sm font-bold tracking-widest transition-colors duration-300 ${
                      isActive ? 'text-[#b2000a]' : 'text-[#2b2b2b]/40'
                    }`}>
                      {project.id.toString().padStart(2, '0')}
                    </span>
                    <h3 className={`font-cormorant text-base md:text-lg tracking-wide uppercase transition-colors duration-300 ${
                      isActive ? 'text-[#2b2b2b]' : 'text-[#2b2b2b]/55'
                    }`}>
                      {project.title}
                    </h3>
                  </div>
                  {/* Arrow Indicator */}
                  <span className={`font-mono text-[#b2000a] text-sm font-bold transition-transform duration-300 ${
                    isActive ? 'translate-x-0 rotate-90' : '-translate-x-2 opacity-0'
                  }`}>
                    →
                  </span>
                </div>

                {/* Details Accordion Content */}
                <div
                  className="transition-all duration-500 ease-in-out"
                  style={{
                    maxHeight: isActive ? '180px' : '0px',
                    opacity: isActive ? 1 : 0,
                    overflow: 'hidden',
                  }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 pl-8 text-left">
                    {/* Style & Year */}
                    <div className="flex flex-col">
                      <span className="text-[8px] font-mono text-[#b2000a]/75 tracking-wider uppercase mb-0.5">Style / Year</span>
                      <span className="font-tenor text-xs text-[#2b2b2b] font-medium uppercase">{project.style} ({project.year})</span>
                    </div>
                    {/* Location */}
                    <div className="flex flex-col">
                      <span className="text-[8px] font-mono text-[#b2000a]/75 tracking-wider uppercase mb-0.5">Location</span>
                      <span className="font-tenor text-xs text-[#2b2b2b] font-medium">📍 {project.location}</span>
                    </div>
                    {/* Scope / Work */}
                    <div className="flex flex-col col-span-2 md:col-span-1">
                      <span className="text-[8px] font-mono text-[#b2000a]/75 tracking-wider uppercase mb-0.5">Scope</span>
                      <span className="font-tenor text-[11px] text-[#555] font-light leading-snug">{project.scope}</span>
                    </div>

                    {/* CTA Details Button */}
                    <div className="col-span-2 md:col-span-3 pt-2">
                      <a
                        href={`/projects#${project.id}`}
                        className="font-tenor relative overflow-hidden group inline-flex items-center gap-1.5 text-white bg-[#2b2b2b] hover:text-white text-[9px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full transition-colors duration-300 shadow-sm cursor-pointer"
                      >
                        <span className="absolute inset-0 w-full h-full bg-[#b2000a] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0" />
                        <span className="relative z-10 flex items-center gap-1.5">
                          Examine Project
                          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
      {/* Secret Code Vault Modal */}
      <SecretCodeModal isOpen={secretOpen} onClose={() => setSecretOpen(false)} />
    </section>
  );
};

export default ProjectsCarousel;
