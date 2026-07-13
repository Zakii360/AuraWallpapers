"use strict";

const { ipcMain } = require("electron");
const { reply, replyError } = require("./respond");
const EffectRuntime = require("../../core/effects/EffectRuntime");

function registerEffectsChannel(wallpaperManager, settingsService) {
  ipcMain.handle("effects.definitions", async () => {
    return reply(EffectRuntime.definitions());
  });

  ipcMain.handle("effects.get", async (_event, { wallpaperId }) => {
    try {
      return reply(settingsService.getEffects(wallpaperId));
    } catch (error) {
      return replyError(error);
    }
  });

  ipcMain.handle("effects.set", async (_event, { monitorId, wallpaperId, effects }) => {
    try {
      await wallpaperManager.setEffects(monitorId, wallpaperId, effects);
      return reply(effects);
    } catch (error) {
      return replyError(error);
    }
  });
}

module.exports = registerEffectsChannel;
