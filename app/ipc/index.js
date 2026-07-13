"use strict";

const registerWallpaperChannel = require("./wallpaperChannel");
const registerEffectsChannel = require("./effectsChannel");
const registerSettingsChannel = require("./settingsChannel");
const registerMonitorChannel = require("./monitorChannel");

function registerIpc({ wallpaperManager, settingsService, monitorService }) {
  registerWallpaperChannel(wallpaperManager);
  registerEffectsChannel(wallpaperManager, settingsService);
  registerSettingsChannel(settingsService);
  registerMonitorChannel(monitorService);
}

module.exports = registerIpc;
