"use strict";

/**
 * Tracks *why* wallpapers are paused (battery, suspend, fullscreen focus,
 * a manual tray toggle, ...) so that clearing one reason never resumes
 * rendering while another reason is still active. wallpaperManager's
 * pauseAll()/resumeAll() are only invoked on the 0->1 and 1->0 edges of
 * the active-reason set, not on every individual call.
 */
class PerformanceGuard {
  constructor(wallpaperManager) {
    this.wallpaperManager = wallpaperManager;
    this.activeReasons = new Set();
  }

  pause(reason) {
    const wasActive = this.activeReasons.size > 0;
    this.activeReasons.add(reason);
    if (!wasActive) {
      this.wallpaperManager.pauseAll();
    }
  }

  resume(reason) {
    this.activeReasons.delete(reason);
    if (this.activeReasons.size === 0) {
      this.wallpaperManager.resumeAll();
    }
  }

  isPaused() {
    return this.activeReasons.size > 0;
  }
}

module.exports = PerformanceGuard;
