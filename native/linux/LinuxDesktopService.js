"use strict";

const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

/**
 * X11 desktop integration using wmctrl (and xprop for fullscreen
 * detection). Wayland compositors do not expose the window-stacking
 * primitives this depends on, so on Wayland the wallpaper window is left
 * as a normal always-behind window and the limitation is surfaced once
 * via a console warning; fullscreen detection is silently skipped.
 */
class LinuxDesktopService {
  constructor() {
    this.warnedAboutWayland = false;
  }

  isWayland() {
    return process.env.XDG_SESSION_TYPE === "wayland" || Boolean(process.env.WAYLAND_DISPLAY);
  }

  async attach(nativeWindowHandle, monitor) {
    if (this.isWayland()) {
      if (!this.warnedAboutWayland) {
        console.warn(
          "Wayland session detected. Desktop-level wallpaper attachment is not supported; " +
            "the wallpaper window will render as a borderless always-behind window instead.",
        );
        this.warnedAboutWayland = true;
      }
      return false;
    }

    const windowId = this.readWindowId(nativeWindowHandle);
    if (!windowId) return false;

    try {
      await execFileAsync("wmctrl", ["-i", "-r", windowId, "-b", "add,below,sticky,skip_taskbar,skip_pager"]);
      return true;
    } catch (error) {
      console.error("Failed to attach wallpaper window via wmctrl:", error.message);
      return false;
    }
  }

  async detach(nativeWindowHandle) {
    if (this.isWayland()) return false;

    const windowId = this.readWindowId(nativeWindowHandle);
    if (!windowId) return false;

    try {
      await execFileAsync("wmctrl", ["-i", "-r", windowId, "-b", "remove,below,sticky"]);
      return true;
    } catch (error) {
      return false;
    }
  }

  async isFullscreenAppActive(monitorBounds) {
    if (this.isWayland() || !monitorBounds) return false;

    try {
      const { stdout: activeIdRaw } = await execFileAsync("xprop", ["-root", "_NET_ACTIVE_WINDOW"]);
      const activeId = (activeIdRaw.match(/0x[0-9a-fA-F]+/) || [])[0];
      if (!activeId) return false;

      const { stdout: listRaw } = await execFileAsync("wmctrl", ["-l", "-G"]);
      const line = listRaw.split("\n").find((entry) => entry.startsWith(activeId));
      if (!line) return false;

      // wmctrl -l -G columns: id desktop x y width height client host title...
      const [, , x, y, width, height] = line.trim().split(/\s+/);
      const windowBounds = { x: Number(x), y: Number(y), width: Number(width), height: Number(height) };

      return (
        windowBounds.x <= monitorBounds.x &&
        windowBounds.y <= monitorBounds.y &&
        windowBounds.x + windowBounds.width >= monitorBounds.x + monitorBounds.width &&
        windowBounds.y + windowBounds.height >= monitorBounds.y + monitorBounds.height
      );
    } catch (error) {
      return false;
    }
  }

  readWindowId(nativeWindowHandle) {
    if (!nativeWindowHandle || nativeWindowHandle.length < 4) return null;
    const id = nativeWindowHandle.readUInt32LE(0);
    return "0x" + id.toString(16);
  }
}

module.exports = LinuxDesktopService;
