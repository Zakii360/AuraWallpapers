const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron");


const path =
    require("path");


const AuraController =
    require("./controller");



let mainWindow = null;


let controller = null;





function createWindow(){


    mainWindow =
        new BrowserWindow({

            width:1200,

            height:760,

            minWidth:900,

            minHeight:600,

            backgroundColor:"#111111",

            webPreferences:{


                nodeIntegration:true,

                contextIsolation:false


            }


        });



    mainWindow.loadFile(
        path.join(
            __dirname,
            "ui",
            "index.html"
        )
    );



}





app.whenReady()
.then(()=>{


    controller =
        new AuraController();



    controller.initialize();



    createWindow();



});






ipcMain.handle(
    "wallpapers:get",
    ()=>{


        return controller.getWallpapers();


    }
);





ipcMain.handle(
    "wallpaper:apply",
    (event,id)=>{


        return controller.applyWallpaper(
            id
        );


    }
);





ipcMain.handle(
    "wallpaper:close",
    ()=>{


        controller.closeWallpaper();


        return true;


    }
);





ipcMain.handle(
    "wallpapers:refresh",
    ()=>{


        return controller.refresh();


    }
);





ipcMain.handle(
    "settings:get",
    ()=>{


        return controller.getSettings();


    }
);





ipcMain.handle(
    "settings:update",
    (event,values)=>{


        return controller.updateSettings(
            values
        );


    }
);





ipcMain.handle(
    "effects:get",
    (event,id)=>{


        return controller.getWallpaperEffects(
            id
        );


    }
);





ipcMain.handle(
    "effects:update",
    (event,id,effects)=>{


        return controller.updateWallpaperEffects(
            id,
            effects
        );


    }
);





app.on(
    "window-all-closed",
    ()=>{


        controller?.closeWallpaper();



        if(process.platform !== "darwin"){

            app.quit();

        }


    }
);
