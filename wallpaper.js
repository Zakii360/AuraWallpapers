const {
    BrowserWindow,
    screen
} = require("electron");

const path = require("path");
const fs = require("fs");

const DesktopManager =
    require("./desktop");



class Wallpaper {


    constructor(){


        this.instances =
            new Map();


        this.desktop =
            new DesktopManager();


    }





    create(wallpaper){


        const displays =
            screen.getAllDisplays();



        const created = [];



        for(const display of displays){


            const window =
                this.createWindow(
                    wallpaper,
                    display
                );



            this.instances.set(
                display.id,
                window
            );


            created.push(window);


        }



        return created;


    }





    createWindow(
        wallpaper,
        display
    ){


        const bounds =
            display.bounds;



        const win =
            new BrowserWindow({


                x:
                    bounds.x,


                y:
                    bounds.y,


                width:
                    bounds.width,


                height:
                    bounds.height,



                frame:false,


                fullscreen:true,


                kiosk:true,


                show:false,


                transparent:false,


                skipTaskbar:true,


                focusable:false,



                webPreferences:{


                    contextIsolation:false,


                    nodeIntegration:true


                }


            });





        const data =
            Buffer.from(

                JSON.stringify({

                    id:
                        wallpaper.id,


                    name:
                        wallpaper.name,


                    path:
                        wallpaper.path,


                    image:
                        wallpaper.image,


                    effects:
                        wallpaper.effects || {}

                })

            )
            .toString(
                "base64"
            );





        win.loadFile(

            wallpaper.html,

            {

                query:{

                    aura:
                        data

                }

            }

        );





        win.once(

            "ready-to-show",

            ()=>{


                win.show();



                this.desktop.attach(

                    win.getNativeWindowHandle()

                );


            }

        );





        win.on(

            "closed",

            ()=>{


                this.instances.delete(
                    display.id
                );


            }

        );



        return win;


    }





    close(){


        for(
            const window
            of this.instances.values()
        ){


            if(!window.isDestroyed()){


                window.close();


            }


        }



        this.instances.clear();


    }





    isRunning(){


        return (
            this.instances.size > 0
        );


    }



}



module.exports =
    Wallpaper;
