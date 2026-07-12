const { execSync } = require("child_process");


class LinuxDesktop {


    constructor(){

        this.window =
            null;

    }





    attach(windowHandle){


        if(
            process.env.XDG_SESSION_TYPE === "wayland"
        ){


            console.warn(
                "Wayland detected. Using fallback mode."
            );


            return false;


        }





        try {


            const id =
                Buffer
                    .from(windowHandle)
                    .readUInt32LE(0);



            this.window =
                id;



            // X11 window stacking
            // Keeps the wallpaper below normal windows

            execSync(

                `wmctrl -i -r ${id} -b add,below`

            );



            execSync(

                `wmctrl -i -r ${id} -b add,sticky`

            );



            return true;



        } catch(error){


            console.error(

                "Linux desktop attach failed:",
                error.message

            );



            return false;


        }


    }





    detach(){


        this.window =
            null;


    }



}



module.exports =
    new LinuxDesktop();
