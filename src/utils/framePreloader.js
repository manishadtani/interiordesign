/**
 * Frame Preloader Utility
 * Efficiently loads image frames from CDN or local /frames/
 * Caches loaded images in memory for smooth playback
 */

class FramePreloader {
  constructor(totalFrames = 120, framePath = '/frames') {
    this.totalFrames = totalFrames;
    this.framePath = framePath;
    this.frames = [];
    this.loadedCount = 0;
    this.isLoading = false;
    this.padding = String(totalFrames).length; // For frame numbering (e.g. 5 digits)
    this.progressCallbacks = [];
  }

  // Register callback for progress updates
  onProgress(callback) {
    this.progressCallbacks.push(callback);
  }

  // Emit progress to all callbacks
  emitProgress(loaded, total) {
    const progress = (loaded / total) * 100;
    this.progressCallbacks.forEach(cb => cb(progress));
  }

  /**
   * Get the padded frame number (e.g., 00000, 00001)
   */
  getFrameNumber(index) {
    return String(index).padStart(5, '0');
  }

  /**
   * Preload all frames
   */
  async preloadFrames() {
    if (typeof window === 'undefined') return;
    if (this.isLoading) {
      console.log('⚠️ Already loading frames...');
      return;
    }
    this.isLoading = true;

    console.log(`🚀 Starting to load ${this.totalFrames} frames...`);

    const promises = [];

    for (let i = 0; i < this.totalFrames; i++) {
      promises.push(this.loadFrame(i));
    }

    // Use allSettled instead of all - doesn't stop on first failure
    const results = await Promise.allSettled(promises);

    // Count successful loads
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failCount = results.filter(r => r.status === 'rejected').length;

    console.log(`✅ Completed: ${successCount}/${this.totalFrames} frames loaded`);
    
    if (failCount > 0) {
      console.error(`❌ Failed: ${failCount} frames could not load`);
    }

    this.isLoading = false;
    return { successCount, failCount };
  }

  /**
   * Load a single frame
   */
  loadFrame(index) {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        resolve(null);
        return;
      }
      
      const frameNum = this.getFrameNumber(index);
      const imgPath = `${this.framePath}/Gd_${frameNum}.webp`;

      const img = new Image();
      img.onload = () => {
        this.frames[index] = img;
        this.loadedCount++;
        this.emitProgress(this.loadedCount, this.totalFrames);
        resolve(img);
      };
      img.onerror = (err) => {
        console.error(`  ✗ Frame ${index}: ${imgPath} - Error: ${err}`);
        this.loadedCount++; // Still count it to track progress
        this.emitProgress(this.loadedCount, this.totalFrames);
        reject(new Error(`Failed: ${imgPath}`));
      };
      img.src = imgPath;
    });
  }

  /**
   * Get frame by index
   */
  getFrame(index) {
    const clampedIndex = Math.max(0, Math.min(index, this.totalFrames - 1));
    return this.frames[clampedIndex];
  }

  /**
   * Get loading progress (0-100)
   */
  getProgress() {
    return (this.loadedCount / this.totalFrames) * 100;
  }

  /**
   * Check if all frames are loaded
   */
  isReady() {
    return this.loadedCount === this.totalFrames;
  }
}

export default FramePreloader;
