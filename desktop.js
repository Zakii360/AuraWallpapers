const WindowsDesktop =
    require("./native/windows/desktop");


class DesktopManager {


    constructor(){

        this.platformHandler = null;

        this.attachedWindow = null;


        if(process.platform === "win32") {

            this.platformHandler =
                new WindowsDesktop();

        }

    }



    attach(window){

        if(!window) {

            throw new Error(
                "Cannot attach empty wallpaper window"
            );

        }


        this.attachedWindow = window;


        if(this.platformHandler) {

            return this.platformHandler.attach(
                window
            );

        }


        return false;

    }




    detach(){

        if(this.platformHandler) {

            this.platformHandler.detach();

        }


        this.attachedWindow = null;

    }




    isAttached(){

        return this.attachedWindow !== null;

    }



}



module.exports = DesktopManager;
