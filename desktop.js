const { screen } = require("electron");


class DesktopManager {


    constructor(){

        this.monitors = [];

    }



    refresh(){

        this.monitors =
            screen.getAllDisplays();

        return this.monitors;

    }



    getPrimary(){

        return screen.getPrimaryDisplay();

    }



    getDisplays(){

        return this.monitors;

    }


}


module.exports = DesktopManager;
