const fs = require("fs");
const path = require("path");


class WallpaperLoader {


    constructor(){


        this.wallpaperDirectory =
            path.join(
                __dirname
            );


    }





    loadAll(){


        if(!fs.existsSync(this.wallpaperDirectory)){

            return [];

        }



        const folders =
            fs.readdirSync(
                this.wallpaperDirectory,
                {
                    withFileTypes: true
                }
            )
            .filter(
                entry =>
                    entry.isDirectory()
            );



        return folders
            .map(
                folder =>
                    this.load(
                        folder.name
                    )
            )
            .filter(
                wallpaper =>
                    wallpaper !== null
            );


    }





    load(id){


        const folder =
            path.join(
                this.wallpaperDirectory,
                id
            );



        const configFile =
            path.join(
                folder,
                "wallpaper.json"
            );



        const htmlFile =
            path.join(
                folder,
                "wallpaper.html"
            );



        if(!fs.existsSync(htmlFile)){


            console.warn(
                `Skipping ${id}: missing wallpaper.html`
            );


            return null;


        }




        let config =
            {};



        if(fs.existsSync(configFile)){


            try {


                config =
                    JSON.parse(

                        fs.readFileSync(
                            configFile,
                            "utf8"
                        )

                    );


            } catch(error){


                console.error(
                    `Invalid wallpaper.json in ${id}`,
                    error
                );


            }


        }





        const image =
            config.image
                ? path.join(
                    folder,
                    config.image
                )
                : null;




        return {


            id,


            name:
                config.name ||
                id,



            author:
                config.author ||
                "Unknown",



            type:
                config.type ||
                "scene",



            path:
                folder,



            html:
                htmlFile,



            image,



            effects:
                config.effects ||
                {}

        };


    }




}



module.exports =
    WallpaperLoader;
