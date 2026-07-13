"use strict";

const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

/**
 * X11 desktop integration using wmctrl. Wayland compositors do not expose
 * the window-stacking primitives this depends on, so on Wayland the
 * wallpaper window is left as a normal always-behind window and the
 * limitation is surfaced once via a console warning.
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

  readWindowId(nativeWindowHandle) {
    if (!nativeWindowHandle || nativeWindowHandle.length < 4) return null;
    const id = nativeWindowHandle.readUInt32LE(0);
    return "0x" + id.toString(16);
  }
}

module.exports = LinuxDesktopService;
