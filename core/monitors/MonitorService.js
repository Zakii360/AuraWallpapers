"use strict";

/**
 * Thin wrapper around Electron's screen module, normalized into plain
 * objects so the rest of core/ never depends on Electron types directly.
 */
class MonitorService {
  constructor(screen) {
    this.screen = screen;
  }

  list() {
    return this.screen.getAllDisplays().map((display) => this.toMonitor(display));
  }

  get(monitorId) {
    return this.list().find((monitor) => monitor.id === monitorId) || null;
  }

  primary() {
    return this.toMonitor(this.screen.getPrimaryDisplay());
  }

  toMonitor(display) {
    return {
      id: String(display.id),
      bounds: display.bounds,
      scaleFactor: display.scaleFactor,
      isPrimary: display.id === this.screen.getPrimaryDisplay().id,
    };
  }

  onChange(callback) {
    this.screen.on("display-added", callback);
    this.screen.on("display-removed", callback);
    this.screen.on("display-metrics-changed", callback);
  }
}

module.exports = MonitorService;
