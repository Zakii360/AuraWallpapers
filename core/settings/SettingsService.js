"use strict";

const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");
const { DEFAULT_SETTINGS } = require("./SettingsSchema");

/**
 * Reads and writes settings.json inside the Electron userData directory.
 * Never touches files inside the packaged app.asar.
 */
class SettingsService {
  constructor(userDataDir) {
    this.filePath = path.join(userDataDir, "settings.json");
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveQueue = Promise.resolve();
  }

  async load() {
    try {
      if (fsSync.existsSync(this.filePath)) {
        const raw = await fs.readFile(this.filePath, "utf8");
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
      } else {
        await this.save();
      }
    } catch (error) {
      console.error("Failed to load settings, falling back to defaults:", error.message);
      this.settings = { ...DEFAULT_SETTINGS };
    }

    return this.settings;
  }

  save() {
    this.saveQueue = this.saveQueue.then(() => this.writeToDisk());
    return this.saveQueue;
  }

  async writeToDisk() {
    const tempPath = `${this.filePath}.${process.pid}.tmp`;
    const payload = JSON.stringify(this.settings, null, 2);
    await fs.writeFile(tempPath, payload, "utf8");
    await fs.rename(tempPath, this.filePath);
  }

  getAll() {
    return this.settings;
  }

  get(key) {
    return this.settings[key];
  }

  async update(partialSettings) {
    this.settings = { ...this.settings, ...partialSettings };
    await this.save();
    return this.settings;
  }

  getEffects(wallpaperId) {
    return this.settings.wallpaperEffects[wallpaperId] || {};
  }

  setEffects(wallpaperId, effects) {
    this.settings.wallpaperEffects[wallpaperId] = effects;
    this.save().catch((error) => console.error("Failed to persist effects:", error.message));
  }

  getMonitorAssignments() {
    return this.settings.monitorAssignments;
  }

  setMonitorAssignment(monitorId, wallpaperId) {
    this.settings.monitorAssignments[monitorId] = wallpaperId;
    this.save().catch((error) => console.error("Failed to persist monitor assignment:", error.message));
  }

  clearMonitorAssignment(monitorId) {
    delete this.settings.monitorAssignments[monitorId];
    this.save().catch((error) => console.error("Failed to persist monitor assignment:", error.message));
  }

  toggleFavorite(wallpaperId) {
    const favorites = new Set(this.settings.favorites);
    if (favorites.has(wallpaperId)) {
      favorites.delete(wallpaperId);
    } else {
      favorites.add(wallpaperId);
    }
    this.settings.favorites = Array.from(favorites);
    this.save().catch((error) => console.error("Failed to persist favorites:", error.message));
    return this.settings.favorites;
  }
}

module.exports = SettingsService;
