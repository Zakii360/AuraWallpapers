"use strict";

const { ipcMain } = require("electron");
const { reply, replyError } = require("./respond");

function registerWallpaperChannel(wallpaperManager) {
  ipcMain.handle("wallpaper.list", async () => {
    try {
      return reply(wallpaperManager.list());
    } catch (error) {
      return replyError(error);
    }
  });

  ipcMain.handle("wallpaper.refresh", async () => {
    try {
      return reply(wallpaperManager.refreshLibrary());
    } catch (error) {
      return replyError(error);
    }
  });

  ipcMain.handle("wallpaper.apply", async (_event, { wallpaperId, monitorId }) => {
    try {
      return reply(await wallpaperManager.apply(wallpaperId, monitorId));
    } catch (error) {
      return replyError(error);
    }
  });

  ipcMain.handle("wallpaper.applyToAll", async (_event, { wallpaperId }) => {
    try {
      return reply(await wallpaperManager.applyToAllMonitors(wallpaperId));
    } catch (error) {
      return replyError(error);
    }
  });

  ipcMain.handle("wallpaper.stop", async (_event, { monitorId }) => {
    try {
      wallpaperManager.stop(monitorId);
      return reply(true);
    } catch (error) {
      return replyError(error);
    }
  });

  ipcMain.handle("wallpaper.reload", async (_event, { monitorId }) => {
    try {
      await wallpaperManager.reload(monitorId);
      return reply(true);
    } catch (error) {
      return replyError(error);
    }
  });

  ipcMain.handle("wallpaper.active", async () => {
    try {
      return reply(wallpaperManager.getActiveWallpapers());
    } catch (error) {
      return replyError(error);
    }
  });
}

module.exports = registerWallpaperChannel;
