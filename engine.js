const WallpaperLoader =
    require("./wallpapers/loader");



class WallpaperEngine {


    constructor(){


        this.loader =
            new WallpaperLoader();



        this.availableWallpapers = [];


        this.current = null;


    }





    loadWallpapers(){


        this.availableWallpapers =
            this.loader.load();



        return this.availableWallpapers;


    }





    getWallpaper(id){


        return this.availableWallpapers.find(

            wallpaper =>
                wallpaper.id === id

        );


    }





    setWallpaper(id){


        const wallpaper =
            this.getWallpaper(id);



        if(!wallpaper){


            throw new Error(
                "Wallpaper does not exist"
            );


        }



        this.current =
            wallpaper;



        return wallpaper;


    }





    loadScene(
        id,
        effects = null
    ){


        const wallpaper =
            this.setWallpaper(id);



        return {


            ...wallpaper,


            effects:
                effects ||
                wallpaper.metadata.effects ||
                {}


        };


    }





    refresh(){


        return this.loadWallpapers();


    }





}



module.exports =
    WallpaperEngine;
