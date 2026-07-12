const { BrowserWindow } = require("electron");
const path = require("path");


class Wallpaper {

    constructor() {
        this.window = null;
    }


    create(source) {

        this.close();


        this.window = new BrowserWindow({

            fullscreen: true,

            frame: false,

            transparent: true,

            skipTaskbar: true,

            focusable: false,

            webPreferences: {
                backgroundThrottling: false
            }

        });


        this.window.setIgnoreMouseEvents(true);


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

            this.window = null;

        }

    }



    setVisible(value){

        if(this.window){

            value
            ? this.window.show()
            : this.window.hide();

        }

    }


}


module.exports = Wallpaper;
