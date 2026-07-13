"use strict";

const POLL_INTERVAL_MS = 2000;

/**
 * Polls the platform desktop service for "is some other app currently
 * fullscreen and focused" and drives the PerformanceGuard's "fullscreen"
 * reason from it. Desktop services that have no way to answer this
 * (isFullscreenAppActive not implemented) simply never get polled, so
 * unsupported platforms pay no cost and never surface a fake positive.
 */
class FullscreenWatcher {
  constructor(desktopServiceFactory, settingsService, performanceGuard, monitorService) {
    this.desktopService = desktopServiceFactory.create();
    this.settingsService = settingsService;
    this.performanceGuard = performanceGuard;
    this.monitorService = monitorService;
    this.timer = null;
  }

  start() {
    if (this.timer || typeof this.desktopService.isFullscreenAppActive !== "function") return;
    this.timer = setInterval(() => this.tick(), POLL_INTERVAL_MS);
    this.timer.unref?.();
  }

  async tick() {
    if (!this.settingsService.get("pauseOnFullscreen")) {
      this.performanceGuard.resume("fullscreen");
      return;
    }

    try {
      const primary = this.monitorService.primary();
      const isFullscreen = await this.desktopService.isFullscreenAppActive(primary.bounds);

      if (isFullscreen) {
        this.performanceGuard.pause("fullscreen");
      } else {
        this.performanceGuard.resume("fullscreen");
      }
    } catch (error) {
      console.warn("Fullscreen detection failed:", error.message);
    }
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

module.exports = FullscreenWatcher;
