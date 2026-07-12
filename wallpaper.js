const {
    BrowserWindow,
    screen
} = require("electron");

const path = require("path");


class Wallpaper {


    constructor(){

        this.window = null;

    }



    create(wallpaper){


        this.close();



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


                frame:false,

                transparent:false,


                fullscreen:false,


                resizable:false,


                movable:false,


                minimizable:false,


                maximizable:false,


                closable:false,


                focusable:false,


                skipTaskbar:true,


                show:false,


                webPreferences:{

                    nodeIntegration:false,

                    contextIsolation:true

                }


            });



        this.window.setIgnoreMouseEvents(
            true
        );


        this.window.loadFile(

            path.join(

                __dirname,

                "wallpapers",

                wallpaper.id,

                "wallpaper.html"

            )

        );



        this.window.once(
            "ready-to-show",
            ()=>{


                this.window.show();


                this.window.setAlwaysOnTop(
                    false
                );


            }
        );


        return this.window;

    }





    close(){


        if(this.window){


            this.window.destroy();


            this.window=null;


        }


    }


}


module.exports =
    Wallpaper;
