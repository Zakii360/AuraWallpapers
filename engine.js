const fs = require("fs-extra");
const path = require("path");


class WallpaperEngine {

    constructor() {

        this.wallpaperDirectory = path.join(
            __dirname,
            "wallpapers"
        );

        this.currentWallpaper = null;
        this.availableWallpapers = [];

    }


    // Scan wallpaper folder
    loadWallpapers() {

        if(!fs.existsSync(this.wallpaperDirectory)){
            fs.ensureDirSync(this.wallpaperDirectory);
        }


        const folders = fs.readdirSync(
            this.wallpaperDirectory
        );


        this.availableWallpapers = [];


        folders.forEach(folder => {

            const folderPath =
                path.join(
                    this.wallpaperDirectory,
                    folder
                );


            if(
                fs.statSync(folderPath).isDirectory()
            ){

                const config =
                    path.join(
                        folderPath,
                        "wallpaper.json"
                    );


                if(fs.existsSync(config)){

                    const data =
                        fs.readJsonSync(config);


                    this.availableWallpapers.push({

                        id: folder,

                        path: folderPath,

                        ...data

                    });

                }

            }

        });


        return this.availableWallpapers;

    }



    // Get wallpaper by ID
    getWallpaper(id){

        return this.availableWallpapers.find(
            wallpaper =>
                wallpaper.id === id
        );

    }



    // Apply wallpaper
    setWallpaper(id){

        const wallpaper =
            this.getWallpaper(id);


        if(!wallpaper){

            throw new Error(
                "Wallpaper not found"
            );

        }


        this.currentWallpaper =
            wallpaper;


        console.log(
            "Applied wallpaper:",
            wallpaper.name
        );


        return wallpaper;

    }



    // Current wallpaper
    getCurrent(){

        return this.currentWallpaper;

    }



    // Import .awp packages later
    async importWallpaper(){

        console.log(
            "Wallpaper importing coming in v2.1"
        );

    }


}


module.exports = WallpaperEngine;
