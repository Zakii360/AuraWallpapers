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

                fullscreen:true,

                frame:false,

                show:true,

                alwaysOnTop:false,

                webPreferences:{
                    backgroundThrottling:false
                }

            });


        this.window.loadFile(
            path.join(
                source.path,
                source.file
            )
        );


        return this.window;

    }



    close(){

        if(this.window){

            this.window.close();

            this.window=null;

        }

    }


}


module.exports = Wallpaper;
