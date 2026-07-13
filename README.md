# AuraWallpapers

An open-source live wallpaper engine for Windows and Linux, built on Electron.

## Architecture

```
app/        Electron shell: windows, IPC registration, preload. Contains no business logic.
core/       Platform-agnostic runtime: wallpaper management, settings, effects, monitors.
native/     Per-platform desktop integration (Windows Node-API addon, Linux X11 service).
ui/         Control panel front end (gallery, effects editor, monitors, settings).
wallpapers/ Installed wallpaper packages.
assets/     Application icons and static assets.
```

`core/` has no dependency on Electron APIs beyond what is passed into it, so it can be
unit-tested in isolation. `app/` wires concrete Electron objects (`BrowserWindow`, `screen`,
`ipcMain`) into `core/` services and never contains wallpaper or settings logic itself.

## Wallpaper package format

Every folder under `wallpapers/` must contain a `wallpaper.json` manifest:

```json
{
  "id": "forest",
  "name": "Forest",
  "author": "Your Name",
  "version": "1.0.0",
  "entry": "wallpaper.html",
  "preview": "preview.png"
}
```

`entry` and `preview` are read from the manifest — filenames are never assumed. A package
typically also ships `style.css` and `script.js`, but that split is a convention, not a
requirement enforced by the loader.

Wallpapers are plain HTML/CSS/JS. Effects (rain, snow, blur, color grading, etc.) are layered
on top by the host application and do not need to be implemented by the wallpaper itself.

## Desktop integration

- **Windows**: `native/windows/addon` is a Node-API (N-API) C++ addon that locates the
  `WorkerW` window behind the desktop icons and reparents the wallpaper window into it. It
  replaces the previous `ffi-napi`-based implementation. Build it with:

  ```
  npm run build:addon
  ```

  This runs automatically on `npm install` on Windows. If the addon isn't built, the app
  still runs — the wallpaper window just won't be pinned to the desktop layer.

- **Linux**: `native/linux/LinuxDesktopService.js` uses `wmctrl` to keep the wallpaper window
  below other windows, sticky across workspaces, and hidden from the taskbar/pager. This only
  works on X11; on Wayland sessions the app logs a warning and falls back to a normal
  always-behind window, since Wayland compositors don't expose the required primitives.

## Effects

Effects live in `core/effects/runtime/` as small, independent scripts that get bundled and
injected into wallpaper windows via `webContents.executeJavaScript`. Each effect registers
itself with a shared runtime controller (`00-base.js`) and exposes `update()`/`dispose()` so
it can be toggled live from the control panel without reloading the wallpaper. Adding a new
effect means adding one file to that folder and one entry to
`core/effects/effectDefinitions.js` (which describes its UI controls).

## Development

```
npm install
npm start
```

## Building installers

```
npm run build:win     # Windows NSIS installer (run on Windows)
npm run build:linux    # Linux AppImage
```

GitHub Actions (`.github/workflows/build.yml`) runs these as separate jobs on
`windows-latest` and `ubuntu-latest` runners.

## Known limitations

- Multi-monitor "span" mode (one wallpaper stretched across all displays as a single canvas)
  is not implemented; each monitor currently gets its own independent wallpaper instance.
  "Clone" is achieved by applying the same wallpaper to every monitor.
- The Windows native addon is provided as source and build configuration; it needs to be
  compiled on a Windows machine (or via the CI workflow) before desktop attachment works.
