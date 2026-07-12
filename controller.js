const WallpaperEngine =
    require("./engine");

const WallpaperRenderer =
    require("./wallpaper");

const DesktopManager =
    require("./desktop");

const SettingsManager =
    require("./settings");



class AuraController {


    constructor(){


        this.desktop =
            new DesktopManager();



        this.renderer =
            new WallpaperRenderer(
                this.desktop
            );



        this.engine =
            new WallpaperEngine();



        this.settings =
            new SettingsManager();



        this.current =
            null;

    }




    initialize(){


        this.settings.load();



        this.engine.loadWallpapers();



        const saved =
            this.settings.get(
                "currentWallpaper"
            );



        if(saved){


            const wallpaper =
                this.engine.getWallpaper(
                    saved
                );


            if(wallpaper){

                this.current =
                    wallpaper;

            }

        }


    }





    getWallpapers(){

        return this.engine.availableWallpapers;

    }





    async applyWallpaper(id){


        const wallpaper =
            this.engine.getWallpaper(
                id
            );



        if(!wallpaper){

            throw new Error(
                "Wallpaper not found: " + id
            );

        }



        await this.renderer.start(
            wallpaper
        );



        this.settings.set(
            "currentWallpaper",
            id
        );



        this.current =
            wallpaper;



        return wallpaper;

    }





    closeWallpaper(){


        this.renderer.stop();


    }





    refresh(){

        return this.engine.refresh();

    }





    getSettings(){

        return this.settings.settings;

    }


}



module.exports = AuraController;
