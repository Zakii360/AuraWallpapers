const fs = require("fs-extra");
const path = require("path");


class SettingsManager {


    constructor(){

        this.file =
            path.join(
                __dirname,
                "settings.json"
            );


        this.defaults = {

            version:"2.0.0",

            startup:false,

            fps:60,

            pauseFullscreen:true,

            hardwareAcceleration:true,

            currentWallpaper:null,

            monitors:{}

        };


        this.settings = {};

    }



    load(){

        if(
            !fs.existsSync(this.file)
        ){

            this.settings =
                this.defaults;


            this.save();

            return this.settings;

        }


        this.settings =
            fs.readJsonSync(
                this.file
            );


        return this.settings;

    }




    save(){

        fs.writeJsonSync(
            this.file,
            this.settings,
            {
                spaces:4
            }
        );

    }




    get(key){

        return this.settings[key];

    }




    set(key,value){

        this.settings[key]=value;

        this.save();

    }



    reset(){

        this.settings =
            this.defaults;

        this.save();

    }



}


module.exports = SettingsManager;
