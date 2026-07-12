const fs = require("fs");
const path = require("path");
const { app } = require("electron");



class SettingsManager {


    constructor(){


        this.file =
            path.join(

                app.getPath(
                    "userData"
                ),

                "settings.json"

            );



        this.settings = {


            currentWallpaper:
                null,


            fps:
                60,


            startup:
                false,


            effects:
                {}


        };


    }





    load(){


        try {


            if(
                fs.existsSync(
                    this.file
                )
            ){


                const saved =
                    JSON.parse(

                        fs.readFileSync(
                            this.file,
                            "utf8"
                        )

                    );



                this.settings =
                    {

                        ...this.settings,

                        ...saved

                    };


            }

            else {


                this.save();


            }



        }

        catch(error){


            console.error(

                "Failed loading settings:",
                error

            );


            this.save();


        }



        return this.settings;


    }





    save(){


        const directory =
            path.dirname(
                this.file
            );



        if(
            !fs.existsSync(
                directory
            )
        ){


            fs.mkdirSync(

                directory,

                {
                    recursive:true
                }

            );


        }



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



        return true;


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


        return (

            this.settings.effects[id]

            ||

            {}

        );


    }





    setEffects(
        id,
        effects
    ){


        this.settings.effects[id] =
            effects;



        this.save();


    }





}



module.exports =
    SettingsManager;
