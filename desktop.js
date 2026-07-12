const { exec } = require("child_process");


class DesktopManager {


    constructor(){

        this.wallpaperWindow = null;

    }



    attach(window){

        this.wallpaperWindow = window;

    }



    setBehindDesktop(){

        if(!this.wallpaperWindow){
            return false;
        }


        if(process.platform !== "win32"){

            console.log(
                "Desktop attachment is only available on Windows."
            );

            return false;

        }


        /*
            Windows desktop embedding placeholder.

            The actual WorkerW attachment requires a native
            Win32 bridge. This keeps the engine architecture
            clean so the native layer can be added later.
        */


        console.log(
            "Preparing AuraWallpapers desktop layer..."
        );


        this.wallpaperWindow.setAlwaysOnTop(
            false
        );


        this.wallpaperWindow.setSkipTaskbar(
            true
        );


        return true;

    }



    detach(){

        this.wallpaperWindow = null;

    }


}


module.exports = DesktopManager;
