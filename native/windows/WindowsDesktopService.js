"use strict";

const path = require("path");

let addon = null;
let loadError = null;

function loadAddon() {
  if (addon || loadError) return addon;

  try {
    addon = require(path.join(__dirname, "addon", "build", "Release", "aura_desktop.node"));
  } catch (error) {
    loadError = error;
  }

  return addon;
}

/**
 * Attaches wallpaper windows to the WorkerW layer behind desktop icons
 * using the native addon. If the addon has not been built, attach() fails
 * softly and the wallpaper window remains a regular (always-behind, but
 * not desktop-integrated) window instead of crashing the app.
 */
class WindowsDesktopService {
  async attach(nativeWindowHandle) {
    const native = loadAddon();
    if (!native) {
      console.warn(
        "aura_desktop native addon is not built. Run `npm run build:addon` on Windows to enable desktop integration.",
      );
      return false;
    }

    try {
      return native.attach(nativeWindowHandle);
    } catch (error) {
      console.error("Failed to attach wallpaper window to the desktop:", error.message);
      return false;
    }
  }

  detach(nativeWindowHandle) {
    const native = loadAddon();
    if (!native || !nativeWindowHandle) return false;

    try {
      return native.detach(nativeWindowHandle);
    } catch (error) {
      console.error("Failed to detach wallpaper window from the desktop:", error.message);
      return false;
    }
  }

  isAvailable() {
    const native = loadAddon();
    return Boolean(native && native.isWorkerWAvailable());
  }

  async isFullscreenAppActive() {
    const native = loadAddon();
    if (!native || typeof native.isForegroundFullscreen !== "function") return false;

    try {
      return native.isForegroundFullscreen();
    } catch (error) {
      console.error("Failed to check foreground fullscreen state:", error.message);
      return false;
    }
  }
}

module.exports = WindowsDesktopService;
