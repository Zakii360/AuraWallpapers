const os = require("os");


class WindowsDesktop {


    constructor(){

        this.worker = null;

    }



    findDesktop(){


        if(os.platform() !== "win32"){

            throw new Error(
                "Windows desktop integration unavailable on this platform"
            );

        }


        const ffi = require("ffi-napi");


        const user32 = ffi.Library(
            "user32",
            {

                "FindWindowW":[
                    "long",
                    [
                        "string",
                        "string"
                    ]
                ],

                "SetParent":[
                    "long",
                    [
                        "long",
                        "long"
                    ]
                ]

            }
        );


        const progman =
            user32.FindWindowW(
                "Progman",
                null
            );


        if(!progman){

            throw new Error(
                "Windows desktop not found"
            );

        }


        return progman;

    }





    attach(hwnd){


        if(os.platform() !== "win32"){

            return false;

        }


        const desktop =
            this.findDesktop();



        const ffi =
            require("ffi-napi");


        const user32 =
            ffi.Library(
                "user32",
                {

                    "SetParent":[
                        "long",
                        [
                            "long",
                            "long"
                        ]
                    ]

                }
            );


        user32.SetParent(
            hwnd,
            desktop
        );


        this.worker =
            hwnd;



        return true;


    }





    detach(){

        this.worker = null;

    }


}



module.exports =
    WindowsDesktop;
