const fs = require("fs-extra");
const path = require("path");
const { app } = require("electron");


class SettingsManager {


    constructor(){

        this.file =
            path.join(
                app.getPath("userData"),
                "settings.json"
            );


        this.defaults = {

            version: "2.0.0",

            startup: false,

            fps: 60,

            pauseFullscreen: true,

            hardwareAcceleration: true,

            currentWallpaper: null

        };


        this.settings = {};

    }



    load(){

        if(!fs.existsSync(this.file)){

            this.settings = {
                ...this.defaults
            };

            this.save();

            return this.settings;

        }


        this.settings = {

            ...this.defaults,

            ...fs.readJsonSync(this.file)

        };


        return this.settings;

    }



    save(){

        fs.ensureDirSync(
            path.dirname(this.file)
        );


        fs.writeJsonSync(

            this.file,

            this.settings,

            {
                spaces: 4
            }

        );

    }



    get(key){

        return this.settings[key];

    }



    set(key,value){

        this.settings[key] = value;

        this.save();

    }



    getAll(){

        return this.settings;

    }



    reset(){

        this.settings = {
            ...this.defaults
        };

        this.save();

    }


}


module.exports = SettingsManager;
