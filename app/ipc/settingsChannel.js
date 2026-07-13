"use strict";

const { ipcMain, app } = require("electron");
const { reply, replyError } = require("./respond");

function registerSettingsChannel(settingsService) {
  ipcMain.handle("settings.get", async () => {
    return reply(settingsService.getAll());
  });

  ipcMain.handle("settings.update", async (_event, partialSettings) => {
    try {
      const updated = await settingsService.update(partialSettings);

      if (Object.prototype.hasOwnProperty.call(partialSettings, "startup")) {
        app.setLoginItemSettings({ openAtLogin: Boolean(partialSettings.startup) });
      }

      return reply(updated);
    } catch (error) {
      return replyError(error);
    }
  });

  ipcMain.handle("settings.toggleFavorite", async (_event, { wallpaperId }) => {
    try {
      return reply(settingsService.toggleFavorite(wallpaperId));
    } catch (error) {
      return replyError(error);
    }
  });
}

module.exports = registerSettingsChannel;
