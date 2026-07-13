"use strict";

const { execSync } = require("child_process");

if (process.platform !== "win32") {
  process.exit(0);
}

try {
  execSync("node-gyp rebuild", {
    cwd: require("path").join(__dirname, "..", "native", "windows", "addon"),
    stdio: "inherit",
  });
} catch (error) {
  console.warn(
    "Warning: failed to build the Windows desktop integration addon. " +
      "Desktop integration will be unavailable until `npm run build:addon` succeeds.",
  );
}
