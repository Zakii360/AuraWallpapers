"use strict";

const fs = require("fs");
const path = require("path");

const REQUIRED_FIELDS = ["id", "name", "entry"];

class WallpaperValidationError extends Error {
  constructor(wallpaperDir, reason) {
    super(`Invalid wallpaper package at "${wallpaperDir}": ${reason}`);
    this.name = "WallpaperValidationError";
    this.wallpaperDir = wallpaperDir;
  }
}

class WallpaperValidator {
  validate(manifest, wallpaperDir) {
    if (!manifest || typeof manifest !== "object") {
      throw new WallpaperValidationError(wallpaperDir, "wallpaper.json did not contain an object");
    }

    for (const field of REQUIRED_FIELDS) {
      if (!manifest[field] || typeof manifest[field] !== "string") {
        throw new WallpaperValidationError(wallpaperDir, `missing required field "${field}"`);
      }
    }

    const entryPath = path.join(wallpaperDir, manifest.entry);
    if (!fs.existsSync(entryPath)) {
      throw new WallpaperValidationError(wallpaperDir, `entry file "${manifest.entry}" does not exist`);
    }

    const previewName = manifest.preview || "preview.png";
    const previewPath = path.join(wallpaperDir, previewName);
    if (!fs.existsSync(previewPath)) {
      throw new WallpaperValidationError(wallpaperDir, `preview file "${previewName}" does not exist`);
    }

    return { entryPath, previewPath };
  }
}

module.exports = { WallpaperValidator, WallpaperValidationError };
