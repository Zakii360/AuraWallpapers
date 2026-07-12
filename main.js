const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const AuraController = require("./controller");


let mainWindow;
let controller;



function createWindow(){

    mainWindow = new BrowserWindow({

        width: 1100,
        height: 700,

        minWidth: 800,
        minHeight: 500,

        backgroundColor: "#1e1e1e",

        webPreferences: {

            nodeIntegration: true,
            contextIsolation: false

        }

    });


    mainWindow.loadFile(
        path.join(
            __dirname,
            "ui/index.html"
        )
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
        (event,id)=>{

            return controller.applyWallpaper(id);

        }
    );


    ipcMain.handle(
        "wallpaper:close",
        ()=>{

            controller.closeWallpaper();

        }
    );


    ipcMain.handle(
        "settings:get",
        ()=>{

            return controller.getSettings();

        }
    );

}



app.whenReady().then(()=>{


    controller =
        new AuraController();


    controller.initialize();


    setupIPC();


    createWindow();


});



app.on(
    "window-all-closed",
    ()=>{

        if(process.platform !== "darwin"){

            app.quit();

        }

    }
);
