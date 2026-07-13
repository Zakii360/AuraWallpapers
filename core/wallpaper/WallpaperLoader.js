"use strict";

const fs = require("fs");
const path = require("path");
const { WallpaperValidator, WallpaperValidationError } = require("./WallpaperValidator");

class WallpaperLoader {
  constructor(libraryDir, validator = new WallpaperValidator()) {
    this.libraryDir = libraryDir;
    this.validator = validator;
  }

  load() {
    if (!fs.existsSync(this.libraryDir)) {
      return [];
    }

    const entries = fs.readdirSync(this.libraryDir, { withFileTypes: true });
    const packages = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const wallpaperDir = path.join(this.libraryDir, entry.name);
      const manifestPath = path.join(wallpaperDir, "wallpaper.json");

      if (!fs.existsSync(manifestPath)) continue;

      try {
        packages.push(this.loadPackage(wallpaperDir, manifestPath));
      } catch (error) {
        if (error instanceof WallpaperValidationError) {
          console.warn(error.message);
        } else {
          console.warn(`Failed to load wallpaper at "${wallpaperDir}":`, error.message);
        }
      }
    }

    return packages;
  }

  loadPackage(wallpaperDir, manifestPath) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const { entryPath, previewPath } = this.validator.validate(manifest, wallpaperDir);

    return {
      id: manifest.id,
      name: manifest.name,
      author: manifest.author || "Unknown",
      version: manifest.version || "1.0.0",
      directory: wallpaperDir,
      entryPath,
      previewPath,
      defaultEffects: manifest.effects || {},
      manifest,
    };
  }

  findById(id) {
    return this.load().find((wallpaper) => wallpaper.id === id) || null;
  }
}

module.exports = WallpaperLoader;
