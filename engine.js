const WallpaperLoader =
    require("./wallpapers/loader");


class WallpaperEngine {


    constructor(){


        this.loader =
            new WallpaperLoader();



        this.availableWallpapers =
            [];


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





    refresh(){


        this.availableWallpapers =
            this.loader.load();



        return this.availableWallpapers;

    }





}


module.exports = WallpaperEngine;
