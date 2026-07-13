"use strict";

const { ipcMain } = require("electron");
const { reply, replyError } = require("./respond");

function registerMonitorChannel(monitorService) {
  ipcMain.handle("monitors.list", async () => {
    try {
      return reply(monitorService.list());
    } catch (error) {
      return replyError(error);
    }
  });
}

module.exports = registerMonitorChannel;
