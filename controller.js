const WallpaperEngine = require("./engine");
const Wallpaper = require("./wallpaper");
const SettingsManager = require("./settings");


class AuraController {


    constructor(){

        this.engine =
            new WallpaperEngine();


        this.wallpaper =
            new Wallpaper();


        this.settings =
            new SettingsManager();

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
                this.engine.getWallpaper(saved);


            if(wallpaper){

                this.current =
                    wallpaper;

            }

        }

    }



    getWallpapers(){

        return this.engine.availableWallpapers;

    }



    applyWallpaper(id){

        const wallpaper =
            this.engine.setWallpaper(id);


        this.wallpaper.create(
            wallpaper
        );


        this.settings.set(
            "currentWallpaper",
            id
        );


        return wallpaper;

    }



    closeWallpaper(){

        this.wallpaper.close();

    }



    refresh(){

        return this.engine.refresh();

    }



    getSettings(){

        return this.settings.settings;

    }



}


module.exports = AuraController;
