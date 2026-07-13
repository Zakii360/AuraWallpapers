"use strict";

const path = require("path");
const { app, screen, powerMonitor } = require("electron");

const WallpaperManager = require("../core/wallpaper/WallpaperManager");
const WallpaperLoader = require("../core/wallpaper/WallpaperLoader");
const SettingsService = require("../core/settings/SettingsService");
const MonitorService = require("../core/monitors/MonitorService");
const EffectRuntime = require("../core/effects/EffectRuntime");
const DesktopServiceFactory = require("../native/DesktopServiceFactory");
const PerformanceGuard = require("../core/performance/PerformanceGuard");
const FullscreenWatcher = require("../core/performance/FullscreenWatcher");

const ControlPanelWindow = require("./windows/ControlPanelWindow");
const TrayController = require("./TrayController");
const registerIpc = require("./ipc");

const WALLPAPER_LIBRARY_DIR = path.join(__dirname, "..", "wallpapers");

let wallpaperManager;
let controlPanelWindow;
let fullscreenWatcher;

async function bootstrap() {
  const settingsService = new SettingsService(app.getPath("userData"));
  const monitorService = new MonitorService(screen);
  const loader = new WallpaperLoader(WALLPAPER_LIBRARY_DIR);
  const desktopServiceFactory = new DesktopServiceFactory();
  const effectRuntime = new EffectRuntime();

  wallpaperManager = new WallpaperManager({
    loader,
    settingsService,
    monitorService,
    desktopServiceFactory,
    effectRuntime,
  });

  await wallpaperManager.initialize();

  registerIpc({ wallpaperManager, settingsService, monitorService });

  controlPanelWindow = new ControlPanelWindow();
  controlPanelWindow.open();

  const performanceGuard = new PerformanceGuard(wallpaperManager);
  registerPerformanceGuards(settingsService, performanceGuard);

  fullscreenWatcher = new FullscreenWatcher(desktopServiceFactory, settingsService, performanceGuard, monitorService);
  fullscreenWatcher.start();

  const trayController = new TrayController({ controlPanelWindow, performanceGuard });
  trayController.create();
}

/**
 * Battery, sleep/wake and fullscreen focus can each independently want
 * wallpapers paused. Routing all of them through one PerformanceGuard
 * means clearing one condition (e.g. plugging back in) never resumes
 * rendering while another (e.g. still in a fullscreen game) is active.
 */
function registerPerformanceGuards(settingsService, performanceGuard) {
  powerMonitor.on("on-battery", () => {
    if (settingsService.get("pauseOnBattery")) {
      performanceGuard.pause("battery");
    }
  });

  powerMonitor.on("on-ac", () => performanceGuard.resume("battery"));

  powerMonitor.on("suspend", () => performanceGuard.pause("suspend"));
  powerMonitor.on("resume", () => performanceGuard.resume("suspend"));
}

app.whenReady().then(bootstrap);

app.on("window-all-closed", () => {
  // The wallpaper windows are not counted as regular app windows; closing
  // the control panel should not stop the wallpapers from rendering.
  // The tray icon is the way back into the control panel, or to quit.
});

app.on("activate", () => {
  if (controlPanelWindow && !controlPanelWindow.isOpen()) {
    controlPanelWindow.open();
  }
});

app.on("before-quit", () => {
  if (fullscreenWatcher) {
    fullscreenWatcher.stop();
  }
  if (wallpaperManager) {
    wallpaperManager.shutdown();
  }
});
