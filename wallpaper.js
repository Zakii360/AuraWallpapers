const {
    BrowserWindow,
    screen
} = require("electron");

const path = require("path");


class WallpaperEngine {


    constructor(){

        this.window = null;
        this.current = null;

    }



    async load(wallpaper){

        this.unload();


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

                fullscreen: false,

                show: false,

                focusable: false,

                skipTaskbar: true,


                webPreferences: {

                    contextIsolation: true,

                    sandbox: true

                }

            });



        this.window.setIgnoreMouseEvents(
            true
        );


        this.window.loadFile(

            path.join(
                wallpaper.path,
                wallpaper.file
            )

        );



        await new Promise(
            resolve => {

                this.window.once(
                    "ready-to-show",
                    resolve
                );

            }
        );



        this.window.show();


        this.current = wallpaper;



        return true;

    }




    unload(){

        if(this.window){

            this.window.destroy();

            this.window = null;

        }


        this.current = null;

    }




    getCurrent(){

        return this.current;

    }


}



module.exports = WallpaperEngine;
