const {
    BrowserWindow,
    screen
} = require("electron");

const path = require("path");

const DesktopManager =
    require("./desktop");



class Wallpaper {


    constructor(){


        this.window =
            null;


        this.desktop =
            new DesktopManager();


        this.current =
            null;


    }





    create(wallpaper){


        this.close();



        this.current =
            wallpaper;



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


                resizable: false,


                movable: false,


                minimizable: false,


                maximizable: false,


                fullscreenable: false,


                show: false,


                skipTaskbar: true,


                focusable: false,


                webPreferences: {

                    nodeIntegration: false,

                    contextIsolation: true

                }

            });





        this.window.setIgnoreMouseEvents(
            true
        );



        this.window.loadFile(
            wallpaper.html
                ? wallpaper.html
                : wallpaper
        );



        this.window.once(
            "ready-to-show",
            () => {


                if(this.window){


                    this.window.show();


                    this.desktop.attach(

                        this.window.getNativeWindowHandle()

                    );


                }


            }
        );



        return this.window;


    }





    close(){


        if(this.window){


            this.desktop.detach();


            this.window.destroy();


            this.window =
                null;


        }


    }





    isRunning(){


        return this.window !== null;


    }



}



module.exports =
    Wallpaper;
