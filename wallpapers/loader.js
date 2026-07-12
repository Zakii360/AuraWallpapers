const fs = require("fs-extra");
const path = require("path");


class WallpaperLoader {


    constructor(directory){

        this.directory = directory;

    }



    load(){

        if(!fs.existsSync(this.directory)){

            fs.ensureDirSync(
                this.directory
            );

        }


        const wallpapers = [];


        const entries =
            fs.readdirSync(
                this.directory
            );



        entries.forEach(entry=>{


            const folder =
                path.join(
                    this.directory,
                    entry
                );


            if(
                !fs.statSync(folder).isDirectory()
            ){

                return;

            }



            const manifest =
                path.join(
                    folder,
                    "wallpaper.json"
                );



            if(
                !fs.existsSync(manifest)
            ){

                return;

            }



            const data =
                fs.readJsonSync(
                    manifest
                );



            wallpapers.push({

                id: entry,

                path: folder,

                name:
                    data.name || entry,

                author:
                    data.author || "Unknown",

                type:
                    data.type || "web",

                file:
                    data.file || "wallpaper.html"

            });


        });



        return wallpapers;

    }



    get(id){

        return this.load()
            .find(
                wallpaper =>
                    wallpaper.id === id
            );

    }


}


module.exports = WallpaperLoader;
