const {
    BrowserWindow,
    screen
} = require("electron");

const path = require("path");

class Wallpaper {

    constructor() {

        this.window = null;
        this.currentWallpaper = null;

    }



    create(wallpaper) {

        if (!wallpaper) {
            return;
        }

        const display =
            screen.getPrimaryDisplay();

        const bounds =
            display.bounds;

        if (!this.window) {

            this.window =
                new BrowserWindow({

                    x: bounds.x,
                    y: bounds.y,

                    width: bounds.width,
                    height: bounds.height,

                    frame: false,

                    transparent: false,

                    fullscreen: false,

                    resizable: false,
                    movable: false,
                    minimizable: false,
                    maximizable: false,

                    focusable: false,

                    skipTaskbar: true,

                    show: false,

                    webPreferences: {

                        nodeIntegration: false,

                        contextIsolation: true

                    }

                });

            this.window.setMenuBarVisibility(false);

            this.window.setIgnoreMouseEvents(true);

            this.window.on("closed", () => {

                this.window = null;
                this.currentWallpaper = null;

            });

        }

        this.currentWallpaper = wallpaper.id;

        this.window.loadFile(

            path.join(
                __dirname,
                "wallpapers",
                wallpaper.id,
                "wallpaper.html"
            )

        );

        this.window.once("ready-to-show", () => {

            if (!this.window) {
                return;
            }

            this.window.showInactive();

            this.window.setAlwaysOnTop(false);

            this.window.blur();

        });

    }



    hide() {

        if (this.window) {

            this.window.hide();

        }

    }



    show() {

        if (this.window) {

            this.window.showInactive();

        }

    }



    isRunning() {

        return this.window !== null;

    }



    close() {

        if (!this.window) {
            return;
        }

        this.window.destroy();

        this.window = null;

        this.currentWallpaper = null;

    }

}

module.exports = Wallpaper;
