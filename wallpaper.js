const { BrowserWindow } = require("electron");
const path = require("path");

const DesktopManager =
    require("./desktop");



class Wallpaper {


    constructor(){


        this.window = null;


        this.desktop =
            new DesktopManager();


    }





    create(scene){


        this.close();



        if(!scene || !scene.html){

            throw new Error(
                "Invalid wallpaper scene"
            );

        }



        this.window =
            new BrowserWindow({


                width:
                    1920,


                height:
                    1080,


                frame:false,


                transparent:false,


                fullscreen:true,


                show:false,


                resizable:false,


                movable:false,


                webPreferences:{


                    nodeIntegration:false,


                    contextIsolation:true


                }



            });





        this.window.setIgnoreMouseEvents(
            true
        );



        this.window.loadFile(
            scene.html
        );




        this.window.once(
            "ready-to-show",
            ()=>{


                this.window.show();



                try {


                    this.desktop.attach(
                        this.window
                    );


                }
                catch(error){


                    console.error(
                        "Desktop attach failed:",
                        error
                    );


                }


            }

        );




        this.window.on(
            "closed",
            ()=>{


                this.window =
                    null;


            }

        );



        return this.window;


    }





    close(){


        if(this.window){


            this.window.removeAllListeners();


            this.window.destroy();


            this.window =
                null;


        }


    }





}



module.exports =
    Wallpaper;
