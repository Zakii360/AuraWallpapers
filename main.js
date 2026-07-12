const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron");

const path = require("path");

const AuraController =
    require("./controller");


let mainWindow;
let controller;



function createWindow(){

    mainWindow =
        new BrowserWindow({

            width: 1100,
            height: 700,

            minWidth: 800,
            minHeight: 500,

            backgroundColor: "#1b1b1b",

            icon:
                path.join(
                    __dirname,
                    "assets",
                    "icon.png"
                ),

            webPreferences: {

                nodeIntegration: true,

                contextIsolation: false

            }

        });


    mainWindow.loadFile(
        path.join(
            __dirname,
            "ui",
            "index.html"
        )
    );


    mainWindow.on(
        "closed",
        () => {

            mainWindow = null;

        }
    );

}



function setupIPC(){


    ipcMain.handle(
        "wallpapers:list",
        () => {

            return controller.getWallpapers();

        }
    );



    ipcMain.handle(
        "wallpaper:apply",
        (event, id) => {

            return controller.applyWallpaper(id);

        }
    );



    ipcMain.handle(
        "wallpaper:close",
        () => {

            controller.closeWallpaper();

        }
    );



    ipcMain.handle(
        "settings:get",
        () => {

            return controller.getSettings();

        }
    );



    ipcMain.handle(
        "wallpapers:refresh",
        () => {

            return controller.refresh();

        }
    );


}



app.whenReady().then(() => {


    controller =
        new AuraController();


    try {

        controller.initialize();

    } catch(error) {

        console.error(
            "AuraWallpapers startup error:",
            error
        );

    }


    setupIPC();


    createWindow();


});



app.on(
    "window-all-closed",
    () => {

        if(process.platform !== "darwin"){

            app.quit();

        }

    }
);



app.on(
    "activate",
    () => {

        if(BrowserWindow.getAllWindows().length === 0){

            createWindow();

        }

    }
);
