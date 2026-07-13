"use strict";

const path = require("path");
const { BrowserWindow } = require("electron");

class ControlPanelWindow {
  constructor() {
    this.window = null;
  }

  open() {
    if (this.window && !this.window.isDestroyed()) {
      this.window.focus();
      return this.window;
    }

    this.window = new BrowserWindow({
      width: 1180,
      height: 760,
      minWidth: 860,
      minHeight: 560,
      title: "AuraWallpapers",
      backgroundColor: "#111318",
      icon: path.join(__dirname, "..", "..", "assets", "icon.png"),
      webPreferences: {
        preload: path.join(__dirname, "..", "preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
      },
    });

    this.window.setMenuBarVisibility(false);
    this.window.loadFile(path.join(__dirname, "..", "..", "ui", "index.html"));

    this.window.on("closed", () => {
      this.window = null;
    });

    return this.window;
  }

  close() {
    if (this.window && !this.window.isDestroyed()) {
      this.window.close();
    }
  }

  isOpen() {
    return this.window !== null && !this.window.isDestroyed();
  }
}

module.exports = ControlPanelWindow;
