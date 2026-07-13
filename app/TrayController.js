"use strict";

const path = require("path");
const { Tray, Menu, app } = require("electron");

/**
 * window-all-closed intentionally leaves wallpapers running with no
 * regular window open, so the tray icon is the only way back into the
 * control panel (or to quit the app) after that point.
 */
class TrayController {
  constructor({ controlPanelWindow, performanceGuard }) {
    this.controlPanelWindow = controlPanelWindow;
    this.performanceGuard = performanceGuard;
    this.tray = null;
  }

  create() {
    this.tray = new Tray(path.join(__dirname, "..", "assets", "icon.png"));
    this.tray.setToolTip("AuraWallpapers");
    this.tray.on("click", () => this.controlPanelWindow.open());
    this.refreshMenu();
    return this.tray;
  }

  refreshMenu() {
    const paused = this.performanceGuard.isPaused();

    const menu = Menu.buildFromTemplate([
      { label: "Open AuraWallpapers", click: () => this.controlPanelWindow.open() },
      { type: "separator" },
      {
        label: paused ? "Resume wallpapers" : "Pause wallpapers",
        click: () => {
          if (paused) {
            this.performanceGuard.resume("manual");
          } else {
            this.performanceGuard.pause("manual");
          }
          this.refreshMenu();
        },
      },
      { type: "separator" },
      { label: "Quit", click: () => app.quit() },
    ]);

    this.tray.setContextMenu(menu);
  }

  destroy() {
    if (this.tray && !this.tray.isDestroyed()) {
      this.tray.destroy();
    }
  }
}

module.exports = TrayController;
