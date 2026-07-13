"use strict";

const fs = require("fs");
const path = require("path");
const { EFFECT_DEFINITIONS } = require("./effectDefinitions");

const RUNTIME_DIR = path.join(__dirname, "runtime");

/**
 * Builds the plain-JavaScript payload injected into wallpaper windows via
 * webContents.executeJavaScript. The runtime has no module system of its
 * own, so files are concatenated in a fixed order (base controller first).
 */
class EffectRuntime {
  constructor() {
    this.bundle = this.buildBundle();
  }

  buildBundle() {
    const files = fs
      .readdirSync(RUNTIME_DIR)
      .filter((file) => file.endsWith(".js"))
      .sort();

    return files.map((file) => fs.readFileSync(path.join(RUNTIME_DIR, file), "utf8")).join("\n;\n");
  }

  buildBootstrapScript(effects) {
    return `${this.bundle}\n;window.__AURA__.applyConfig(${JSON.stringify(effects || {})});`;
  }

  buildUpdateScript(effects) {
    return `window.__AURA__ && window.__AURA__.applyConfig(${JSON.stringify(effects || {})});`;
  }

  static definitions() {
    return EFFECT_DEFINITIONS;
  }
}

module.exports = EffectRuntime;
