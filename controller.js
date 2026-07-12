const WallpaperEngine = require("./engine");
const Wallpaper = require("./wallpaper");
const SettingsManager = require("./settings");


class AuraController {

    constructor(){

        this.engine = new WallpaperEngine();
        this.wallpaper = new Wallpaper();
        this.settings = new SettingsManager();

    }



    initialize(){

        this.settings.load();

        this.engine.loadWallpapers();

    }



    getWallpapers(){

        return this.engine.availableWallpapers;

    }



    applyWallpaper(id){

        const wallpaper =
            this.engine.setWallpaper(id);


        this.wallpaper.create({
            path: wallpaper.path,
            file: wallpaper.file
        });


        this.settings.set(
            "currentWallpaper",
            id
        );


        return wallpaper;

    }



    closeWallpaper(){

        this.wallpaper.close();

    }



    getSettings(){

        return this.settings.settings;

    }


}


module.exports = AuraController;
