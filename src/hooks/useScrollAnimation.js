/**
 * useScrollAnimation Hook
 * Synchronizes canvas frames with GSAP ScrollTrigger
 * Optimized for 60 FPS scrolling by clamping DPR and removing high-quality image smoothing
 */

import { useEffect, useRef } from 'react';

export const useScrollAnimation = (canvasRef, framePreloader, totalFrames = 361, isMobile = false) => {
  const scrollTriggerRef = useRef(null);
  const lastFrameRef = useRef(-1);

  useEffect(() => {
    if (typeof window === 'undefined' || !canvasRef.current || !framePreloader) return;

    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      
      gsap.registerPlugin(ScrollTrigger);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });

      // Optimize canvas rendering (avoid 'high' quality which causes heavy GPU jank on scroll)
      ctx.imageSmoothingEnabled = true;

      // Draw frame function with caching to avoid re-drawing same frame
      const drawFrame = (frameIndex) => {
        const floorIndex = Math.floor(frameIndex);

        // Skip if already drawn this frame
        if (lastFrameRef.current === floorIndex) return;
        lastFrameRef.current = floorIndex;

        const frame = framePreloader.getFrame(floorIndex);
        if (!frame || !frame.complete) return;

        // Clear canvas using fast clearing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const imgRatio = frame.width / frame.height;
        const canvasRatio = canvas.width / canvas.height;
        let dw, dh, dx, dy;

        if (imgRatio > canvasRatio) {
          dh = canvas.height;
          dw = dh * imgRatio;
          dx = (canvas.width - dw) / 2;
          dy = 0;
        } else {
          dw = canvas.width;
          dh = dw / imgRatio;
          dx = 0;
          dy = (canvas.height - dh) / 2;
        }

        ctx.drawImage(frame, dx, dy, dw, dh);
      };

      const setCanvasSize = () => {
        // Clamp Device Pixel Ratio to max 1.5 to prevent high-res rendering lag on Retina/4K screens
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        
        // CSS display size matches viewport
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        
        lastFrameRef.current = -1;
      };

      setCanvasSize();

      // Create ScrollTrigger
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        endTrigger: "#about-us",
        end: "top bottom",
        scrub: 0.08, // Subtle lag for smooth LERP feel
        fastScrollEnd: true,
        onUpdate: (self) => {
          const frameIndex = self.progress * (totalFrames - 1);
          // RequestAnimationFrame ensures rendering is synced to monitor refresh rate
          requestAnimationFrame(() => drawFrame(frameIndex));
        },
        onRefresh: (self) => {
          setCanvasSize();
          const frameIndex = self.progress * (totalFrames - 1);
          drawFrame(frameIndex);
        }
      });

      // Initial draw
      const initialFrame = isMobile ? 1 : 0;
      await framePreloader.loadFrame(initialFrame);
      drawFrame(initialFrame);
      ScrollTrigger.refresh();
    };

    initGSAP();

    return () => {
      if (scrollTriggerRef.current) scrollTriggerRef.current.kill();
    };
  }, [canvasRef, framePreloader, totalFrames, isMobile]);

  return { scrollTrigger: scrollTriggerRef.current };
};
