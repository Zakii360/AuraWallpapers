const fs = require("fs");
const path = require("path");


class WallpaperLoader {


    constructor(){


        this.directory =
            __dirname;


    }





    load(){


        const wallpapers = [];



        const folders =
            fs.readdirSync(
                this.directory,
                {
                    withFileTypes:true
                }
            );



        for(const folder of folders){


            if(!folder.isDirectory())
                continue;



            const folderPath =
                path.join(
                    this.directory,
                    folder.name
                );



            const configPath =
                path.join(
                    folderPath,
                    "wallpaper.json"
                );



            if(!fs.existsSync(configPath))
                continue;



            try {


                const config =
                    JSON.parse(
                        fs.readFileSync(
                            configPath,
                            "utf8"
                        )
                    );



                const html =
                    path.join(
                        folderPath,
                        config.file || "wallpaper.html"
                    );



                if(!fs.existsSync(html))
                    continue;



                wallpapers.push({


                    id:
                        folder.name,


                    path:
                        folderPath,


                    html,


                    preview:
                        path.join(
                            folderPath,
                            config.preview || "image.png"
                        ),


                    metadata:
                        config


                });



            }
            catch(error){


                console.error(

                    "Failed loading wallpaper:",
                    folder.name,
                    error

                );


            }


        }



        return wallpapers;


    }



}



module.exports =
    WallpaperLoader;
