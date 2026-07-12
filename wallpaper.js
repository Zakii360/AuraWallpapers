const { BrowserWindow } = require("electron");
const path = require("path");


class Wallpaper {


    constructor(){

        this.window = null;

    }



    create(source){

        this.close();


        this.window =
            new BrowserWindow({

                fullscreen: true,

                frame: false,

                transparent: false,

                show: false,

                skipTaskbar: true,

                webPreferences: {

                    nodeIntegration: false,

                    contextIsolation: true,

                    backgroundThrottling: false

                }

            });



        this.window.loadFile(
            path.join(
                source.path,
                source.file
            )
        );


        this.window.once(
            "ready-to-show",
            () => {

                this.window.show();

            }
        );



        this.window.on(
            "closed",
            () => {

                this.window = null;

            }
        );


        return this.window;

    }




    close(){

        if(this.window){

            this.window.destroy();

            this.window = null;

        }

    }



}


module.exports = Wallpaper;
