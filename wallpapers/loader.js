const fs = require("fs");
const path = require("path");



class WallpaperLoader {


    constructor(){


        this.directory =
            path.join(
                __dirname
            );


    }




    load(){


        if(!fs.existsSync(this.directory)){


            return [];

        }



        return fs.readdirSync(
            this.directory,
            {
                withFileTypes: true
            }

        )

        .filter(
            entry =>
                entry.isDirectory()
        )

        .map(
            entry => {


                const folder =
                    path.join(
                        this.directory,
                        entry.name
                    );



                const file =
                    path.join(
                        folder,
                        "wallpaper.html"
                    );



                if(!fs.existsSync(file)){

                    return null;

                }



                return {

                    id:
                        entry.name
                            .toLowerCase()
                            .replace(
                                /[^a-z0-9]+/g,
                                "-"
                            ),



                    name:
                        entry.name,



                    path:
                        folder,



                    file:
                        "wallpaper.html"


                };


            }

        )

        .filter(Boolean);


    }



}



module.exports = WallpaperLoader;
