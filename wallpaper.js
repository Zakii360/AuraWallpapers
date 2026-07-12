const {
    BrowserWindow,
    screen
} = require("electron");

const path = require("path");


class WallpaperEngine {

    constructor(desktopManager = null) {

        this.window = null;
        this.currentWallpaper = null;
        this.desktopManager = desktopManager;

    }



    async start(wallpaper) {

        await this.stop();


        const display =
            screen.getPrimaryDisplay();


        const bounds =
            display.bounds;


        this.window =
            new BrowserWindow({

                x: bounds.x,
                y: bounds.y,

                width: bounds.width,
                height: bounds.height,

                frame: false,

                transparent: false,

                show: false,

                focusable: false,

                skipTaskbar: true,

                resizable: false,

                movable: false,


                webPreferences: {

                    sandbox: true,

                    contextIsolation: true

                }

            });



        this.window.setIgnoreMouseEvents(
            true
        );


        await this.window.loadFile(
            path.join(
                wallpaper.path,
                wallpaper.file
            )
        );


        this.window.once(
            "ready-to-show",
            () => {

                this.window.show();


                if(this.desktopManager) {

                    this.desktopManager.attach(
                        this.window
                    );

                }

            }
        );


        this.currentWallpaper = wallpaper;


        return true;

    }




    async stop() {

        if(!this.window) {

            return;

        }


        if(this.desktopManager) {

            this.desktopManager.detach();

        }


        this.window.close();

        this.window = null;

        this.currentWallpaper = null;

    }




    restart(wallpaper) {

        return this.start(
            wallpaper
        );

    }




    getCurrent() {

        return this.currentWallpaper;

    }



    isRunning() {

        return this.window !== null;

    }

}


module.exports = WallpaperEngine;
