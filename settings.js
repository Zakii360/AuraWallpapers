const fs = require("fs");
const path = require("path");
const { app } = require("electron");


class SettingsManager {


    constructor() {


        this.basePath =
            path.join(
                app.getPath("userData"),
                "settings"
            );


        this.appFile =
            path.join(
                this.basePath,
                "app.json"
            );


        this.wallpaperPath =
            path.join(
                this.basePath,
                "wallpapers"
            );



        this.settings = {

            startup: false,

            fps: 60,

            currentWallpaper: null

        };



        this.ensureDirectories();

    }




    ensureDirectories(){


        if(!fs.existsSync(this.basePath)){

            fs.mkdirSync(
                this.basePath,
                {
                    recursive: true
                }
            );

        }



        if(!fs.existsSync(this.wallpaperPath)){

            fs.mkdirSync(
                this.wallpaperPath,
                {
                    recursive: true
                }
            );

        }


    }





    load(){


        try {


            if(fs.existsSync(this.appFile)){


                const data =
                    fs.readFileSync(
                        this.appFile,
                        "utf8"
                    );


                this.settings =
                    {
                        ...this.settings,
                        ...JSON.parse(data)
                    };


            }



        } catch(error){


            console.error(
                "Failed loading settings:",
                error
            );


        }



        return this.settings;


    }





    save(){


        fs.writeFileSync(

            this.appFile,

            JSON.stringify(
                this.settings,
                null,
                4
            )

        );


    }





    get(key){


        return this.settings[key];


    }





    set(key,value){


        this.settings[key] =
            value;


        this.save();


    }





    getWallpaperSettings(id){


        const file =
            path.join(
                this.wallpaperPath,
                `${id}.json`
            );



        if(!fs.existsSync(file)){


            return {};


        }



        try {


            return JSON.parse(
                fs.readFileSync(
                    file,
                    "utf8"
                )
            );


        } catch {


            return {};


        }


    }





    setWallpaperSettings(id, settings){


        const file =
            path.join(
                this.wallpaperPath,
                `${id}.json`
            );



        fs.writeFileSync(

            file,

            JSON.stringify(
                settings,
                null,
                4
            )

        );


    }




}



module.exports =
    SettingsManager;
