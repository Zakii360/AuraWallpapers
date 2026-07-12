const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron");

const path = require("path");


const AuraController =
    require("./controller");



let controller =
    null;



let mainWindow =
    null;





function createMainWindow(){


    mainWindow =
        new BrowserWindow({

            width: 1100,

            height: 700,

            minWidth: 900,

            minHeight: 600,


            backgroundColor: "#111111",


            icon:
                path.join(
                    __dirname,
                    "assets",
                    "icon.png"
                ),



            webPreferences: {

                preload:
                    path.join(
                        __dirname,
                        "preload.js"
                    ),


                contextIsolation: true,


                nodeIntegration: false

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





function setupIPC(){



    ipcMain.handle(

        "wallpapers:list",

        ()=>{


            return controller
                .getWallpapers();


        }

    );





    ipcMain.handle(

        "wallpapers:apply",

        async(
            event,
            id
        )=>{


            try{


                return controller
                    .applyWallpaper(id);


            }
            catch(error){


                console.error(
                    error
                );


                return {
                    error:
                        error.message
                };


            }


        }

    );





    ipcMain.handle(

        "wallpapers:close",

        ()=>{


            controller
                .closeWallpaper();



            return true;


        }

    );





    ipcMain.handle(

        "settings:get",

        ()=>{


            return controller
                .getSettings();


        }

    );



}







app.whenReady()
.then(()=>{


    controller =
        new AuraController();



    controller.initialize();



    setupIPC();



    createMainWindow();



});







app.on(
    "window-all-closed",
    ()=>{


        controller?.closeWallpaper();



        if(
            process.platform !== "darwin"
        ){

            app.quit();

        }


    }

);





app.on(
    "activate",
    ()=>{


        if(
            BrowserWindow
                .getAllWindows()
                .length === 0
        ){

            createMainWindow();

        }


    }

);
