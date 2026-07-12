const WallpaperEngine =
    require("./engine");

const Wallpaper =
    require("./wallpaper");

const SettingsManager =
    require("./settings");



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



    }





    getWallpapers(){


        return this.engine.availableWallpapers;


    }





    applyWallpaper(id){


        const wallpaper =
            this.engine.loadScene(

                id,

                this.settings.getEffects(id)

            );



        if(!wallpaper){


            throw new Error(
                "Wallpaper not found"
            );


        }




        this.wallpaper.close();



        const running =
            this.wallpaper.create(
                wallpaper
            );



        this.settings.set(

            "currentWallpaper",

            id

        );



        return {


            id,


            running:
                !!running


        };


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





    updateSettings(values){


        return this.settings.update(
            values
        );


    }





    getWallpaperEffects(id){


        return this.settings.getEffects(
            id
        );


    }





    updateWallpaperEffects(
        id,
        effects
    ){


        return this.settings.setEffects(

            id,

            effects

        );


    }



}



module.exports =
    AuraController;
