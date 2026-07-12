const fs = require("fs");
const path = require("path");
const { app } = require("electron");



class SettingsManager {


    constructor(){


        this.settings = {};


        this.file = null;


    }





    getPath(){


        return path.join(

            app.getPath("userData"),

            "settings.json"

        );


    }





    load(){


        this.file =
            this.getPath();



        try {


            if(fs.existsSync(this.file)){


                this.settings =
                    JSON.parse(

                        fs.readFileSync(

                            this.file,

                            "utf8"

                        )

                    );


            }
            else {


                this.settings =
                {


                    currentWallpaper:null,


                    startup:false,


                    fps:60,


                    wallpapers:{}


                };



                this.save();


            }


        }
        catch(error){


            console.error(

                "Settings load failed:",
                error

            );



            this.settings = {};

            this.save();


        }



        return this.settings;


    }





    save(){


        if(!this.file)
            this.file =
                this.getPath();



        fs.writeFileSync(

            this.file,

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



        return value;


    }





    update(values){


        this.settings =
        {


            ...this.settings,

            ...values


        };



        this.save();



        return this.settings;


    }





    getEffects(id){


        if(!this.settings.wallpapers)

            this.settings.wallpapers = {};



        return (

            this.settings.wallpapers[id]

            ||

            null

        );


    }





    setEffects(id,effects){


        if(!this.settings.wallpapers)

            this.settings.wallpapers = {};



        this.settings.wallpapers[id] =
            effects;



        this.save();



        return effects;


    }





}



module.exports =
    SettingsManager;
