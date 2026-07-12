const path = require("path");
const WallpaperLoader = require("./wallpapers/loader");


class WallpaperEngine {


    constructor(){

        this.loader =
            new WallpaperLoader(
                path.join(
                    __dirname,
                    "wallpapers"
                )
            );


        this.availableWallpapers = [];

        this.currentWallpaper = null;

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
                "Wallpaper not found: " + id
            );

        }



        this.currentWallpaper =
            wallpaper;


        return wallpaper;

    }



    getCurrent(){

        return this.currentWallpaper;

    }



    refresh(){

        return this.loadWallpapers();

    }


}


module.exports = WallpaperEngine;
