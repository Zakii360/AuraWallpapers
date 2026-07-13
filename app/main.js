"use strict";

const path = require("path");
const { app, screen, powerMonitor } = require("electron");

const WallpaperManager = require("../core/wallpaper/WallpaperManager");
const WallpaperLoader = require("../core/wallpaper/WallpaperLoader");
const SettingsService = require("../core/settings/SettingsService");
const MonitorService = require("../core/monitors/MonitorService");
const EffectRuntime = require("../core/effects/EffectRuntime");
const DesktopServiceFactory = require("../native/DesktopServiceFactory");

const ControlPanelWindow = require("./windows/ControlPanelWindow");
const registerIpc = require("./ipc");

const WALLPAPER_LIBRARY_DIR = path.join(__dirname, "..", "wallpapers");

let wallpaperManager;
let controlPanelWindow;

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

  registerPerformanceGuards(settingsService);
}

function registerPerformanceGuards(settingsService) {
  powerMonitor.on("on-battery", () => {
    if (settingsService.get("pauseOnBattery")) {
      wallpaperManager.pauseAll();
    }
  });

  powerMonitor.on("on-ac", () => {
    wallpaperManager.resumeAll();
  });

  powerMonitor.on("suspend", () => wallpaperManager.pauseAll());
  powerMonitor.on("resume", () => wallpaperManager.resumeAll());
}

app.whenReady().then(bootstrap);

app.on("window-all-closed", () => {
  // The wallpaper windows are not counted as regular app windows; closing
  // the control panel should not stop the wallpapers from rendering.
});

app.on("activate", () => {
  if (controlPanelWindow && !controlPanelWindow.isOpen()) {
    controlPanelWindow.open();
  }
});

app.on("before-quit", () => {
  if (wallpaperManager) {
    wallpaperManager.shutdown();
  }
});
