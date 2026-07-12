const fs = require("fs");
const path = require("path");

const WallpaperLoader = require("./wallpapers/loader");


class WallpaperEngine {


    constructor(){


        this.loader =
            new WallpaperLoader();


        this.availableWallpapers =
            [];


        this.current =
            null;


    }





    loadWallpapers(){


        this.availableWallpapers =
            this.loader.loadAll();



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
                `Wallpaper not found: ${id}`
            );

        }



        this.current =
            wallpaper;



        return wallpaper;


    }





    getCurrent(){


        return this.current;


    }





    loadScene(id, userSettings = {}){


        const wallpaper =
            this.getWallpaper(id);



        if(!wallpaper){

            throw new Error(
                "Cannot load unknown wallpaper"
            );

        }




        const scene =
            JSON.parse(

                JSON.stringify(
                    wallpaper
                )

            );



        if(scene.effects){


            scene.effects =
                this.mergeEffects(

                    scene.effects,

                    userSettings

                );


        }



        return scene;


    }





    mergeEffects(
        defaults,
        overrides
    ){


        const result =
            {};



        for(
            const category
            of Object.keys(defaults)
        ){


            result[category] =
                {
                    ...defaults[category],
                    ...(overrides[category] || {})
                };


        }



        return result;


    }





    refresh(){


        return this.loadWallpapers();


    }



}



module.exports =
    WallpaperEngine;
