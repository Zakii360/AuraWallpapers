"use strict";

const WindowsDesktopService = require("./windows/WindowsDesktopService");
const LinuxDesktopService = require("./linux/LinuxDesktopService");

class NullDesktopService {
  async attach() {
    return false;
  }
  async detach() {
    return false;
  }
  isAvailable() {
    return false;
  }
}

class DesktopServiceFactory {
  create() {
    switch (process.platform) {
      case "win32":
        return new WindowsDesktopService();
      case "linux":
        return new LinuxDesktopService();
      default:
        console.warn(`Desktop integration is not implemented for platform "${process.platform}".`);
        return new NullDesktopService();
    }
  }
}

module.exports = DesktopServiceFactory;
