"use strict";

const { BrowserWindow } = require("electron");

/**
 * Owns a single BrowserWindow rendering one wallpaper package on one
 * monitor. The window is reused across wallpaper switches on the same
 * monitor so the desktop attachment never has to be redone unnecessarily.
 */
class WallpaperInstance {
  constructor(monitor, desktopService, effectRuntime) {
    this.monitor = monitor;
    this.desktopService = desktopService;
    this.effectRuntime = effectRuntime;

    this.window = null;
    this.wallpaperPackage = null;
    this.effects = {};
    this.attached = false;
    this.paused = false;
  }

  async load(wallpaperPackage, effects = {}) {
    this.wallpaperPackage = wallpaperPackage;
    this.effects = effects;

    if (!this.window || this.window.isDestroyed()) {
      this.window = this.createWindow();
    } else {
      this.moveToMonitor(this.monitor);
    }

    await this.window.loadFile(wallpaperPackage.entryPath);
    await this.injectEffectRuntime();
    await this.attachToDesktop();

    this.window.showInactive();
  }

  createWindow() {
    const { x, y, width, height } = this.monitor.bounds;

    const window = new BrowserWindow({
      x,
      y,
      width,
      height,
      frame: false,
      transparent: false,
      fullscreenable: false,
      resizable: false,
      movable: false,
      minimizable: false,
      maximizable: false,
      closable: false,
      focusable: false,
      skipTaskbar: true,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        backgroundThrottling: false,
      },
    });

    window.setMenuBarVisibility(false);
    window.setIgnoreMouseEvents(true);
    window.setAlwaysOnTop(false);

    window.on("closed", () => {
      this.window = null;
      this.attached = false;
    });

    return window;
  }

  moveToMonitor(monitor) {
    this.monitor = monitor;
    const { x, y, width, height } = monitor.bounds;
    this.window.setBounds({ x, y, width, height });
  }

  async attachToDesktop() {
    if (!this.desktopService || this.window.isDestroyed()) return;

    const handle = this.window.getNativeWindowHandle();
    this.attached = await this.desktopService.attach(handle, this.monitor);
  }

  async injectEffectRuntime() {
    if (!this.effectRuntime || this.window.isDestroyed()) return;

    const script = this.effectRuntime.buildBootstrapScript(this.effects);
    await this.window.webContents.executeJavaScript(script);
  }

  async setEffects(effects) {
    this.effects = effects;
    if (!this.window || this.window.isDestroyed()) return;

    const script = this.effectRuntime.buildUpdateScript(effects);
    await this.window.webContents.executeJavaScript(script);
  }

  async reload() {
    if (!this.wallpaperPackage) return;
    await this.load(this.wallpaperPackage, this.effects);
  }

  pause() {
    if (!this.window || this.window.isDestroyed() || this.paused) return;
    this.window.webContents.setFrameRate(1);
    this.paused = true;
  }

  resume(targetFps) {
    if (!this.window || this.window.isDestroyed() || !this.paused) return;
    this.window.webContents.setFrameRate(targetFps || 60);
    this.paused = false;
  }

  hide() {
    if (this.window && !this.window.isDestroyed()) {
      this.window.hide();
    }
  }

  show() {
    if (this.window && !this.window.isDestroyed()) {
      this.window.showInactive();
    }
  }

  destroy() {
    if (this.desktopService && this.attached) {
      this.desktopService.detach(this.window ? this.window.getNativeWindowHandle() : null);
    }

    if (this.window && !this.window.isDestroyed()) {
      this.window.destroy();
    }

    this.window = null;
    this.wallpaperPackage = null;
    this.attached = false;
  }

  isRunning() {
    return this.window !== null && !this.window.isDestroyed();
  }
}

module.exports = WallpaperInstance;
