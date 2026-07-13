"use strict";

const WallpaperInstance = require("./WallpaperInstance");

/**
 * Coordinates the wallpaper library, per-monitor instances, settings
 * persistence and effect updates. This is the single entry point the
 * Electron shell talks to; it contains no Electron-window logic itself.
 */
class WallpaperManager {
  constructor({ loader, settingsService, monitorService, desktopServiceFactory, effectRuntime }) {
    this.loader = loader;
    this.settingsService = settingsService;
    this.monitorService = monitorService;
    this.desktopServiceFactory = desktopServiceFactory;
    this.effectRuntime = effectRuntime;

    this.library = [];
    this.instances = new Map();
  }

  async initialize() {
    await this.settingsService.load();
    this.refreshLibrary();
    await this.restoreSession();

    this.monitorService.onChange(() => this.handleMonitorChange());
  }

  refreshLibrary() {
    this.library = this.loader.load();
    return this.list();
  }

  list() {
    return this.library.map((wallpaperPackage) => ({
      id: wallpaperPackage.id,
      name: wallpaperPackage.name,
      author: wallpaperPackage.author,
      version: wallpaperPackage.version,
      previewPath: wallpaperPackage.previewPath,
    }));
  }

  findPackage(id) {
    const wallpaperPackage = this.library.find((item) => item.id === id);
    if (!wallpaperPackage) {
      throw new Error(`Wallpaper "${id}" was not found in the library.`);
    }
    return wallpaperPackage;
  }

  async restoreSession() {
    const assignments = this.settingsService.getMonitorAssignments();
    const monitors = this.monitorService.list();

    for (const monitor of monitors) {
      const wallpaperId = assignments[monitor.id];
      if (wallpaperId && this.library.some((item) => item.id === wallpaperId)) {
        await this.apply(wallpaperId, monitor.id).catch((error) => {
          console.error(`Failed to restore wallpaper "${wallpaperId}" on monitor "${monitor.id}":`, error.message);
        });
      }
    }
  }

  async apply(wallpaperId, monitorId) {
    const wallpaperPackage = this.findPackage(wallpaperId);
    const monitor = this.monitorService.get(monitorId);
    if (!monitor) {
      throw new Error(`Monitor "${monitorId}" was not found.`);
    }

    const instance = this.instances.get(monitorId) || this.createInstance(monitor);
    const savedEffects = this.settingsService.getEffects(wallpaperId);
    const effects = Object.keys(savedEffects).length > 0 ? savedEffects : wallpaperPackage.defaultEffects;

    await instance.load(wallpaperPackage, effects);
    this.instances.set(monitorId, instance);

    this.settingsService.setMonitorAssignment(monitorId, wallpaperId);
    return this.describeInstance(monitorId);
  }

  async applyToAllMonitors(wallpaperId) {
    const results = [];
    for (const monitor of this.monitorService.list()) {
      results.push(await this.apply(wallpaperId, monitor.id));
    }
    return results;
  }

  createInstance(monitor) {
    const desktopService = this.desktopServiceFactory.create();
    return new WallpaperInstance(monitor, desktopService, this.effectRuntime);
  }

  stop(monitorId) {
    const instance = this.instances.get(monitorId);
    if (!instance) return;

    instance.destroy();
    this.instances.delete(monitorId);
    this.settingsService.clearMonitorAssignment(monitorId);
  }

  stopAll() {
    for (const monitorId of this.instances.keys()) {
      this.stop(monitorId);
    }
  }

  async reload(monitorId) {
    const instance = this.instances.get(monitorId);
    if (!instance) return;
    await instance.reload();
  }

  async setEffects(monitorId, wallpaperId, effects) {
    this.settingsService.setEffects(wallpaperId, effects);

    const instance = this.instances.get(monitorId);
    if (instance) {
      await instance.setEffects(effects);
    }
  }

  pauseAll() {
    for (const instance of this.instances.values()) {
      instance.pause();
    }
  }

  resumeAll() {
    const fps = this.settingsService.get("fps");
    for (const instance of this.instances.values()) {
      instance.resume(fps);
    }
  }

  handleMonitorChange() {
    const monitors = this.monitorService.list();
    const activeMonitorIds = new Set(monitors.map((monitor) => monitor.id));

    for (const monitorId of this.instances.keys()) {
      if (!activeMonitorIds.has(monitorId)) {
        this.stop(monitorId);
      }
    }

    this.restoreSession();
  }

  describeInstance(monitorId) {
    const instance = this.instances.get(monitorId);
    if (!instance) return null;

    return {
      monitorId,
      wallpaperId: instance.wallpaperPackage ? instance.wallpaperPackage.id : null,
      running: instance.isRunning(),
      attached: instance.attached,
      effects: instance.effects,
    };
  }

  getActiveWallpapers() {
    return Array.from(this.instances.keys()).map((monitorId) => this.describeInstance(monitorId));
  }

  shutdown() {
    this.stopAll();
  }
}

module.exports = WallpaperManager;
