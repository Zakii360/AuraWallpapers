const ffi = require("ffi-napi");
const ref = require("ref-napi");



const user32 =
    ffi.Library(
        "user32",
        {


            "FindWindowW":
            [
                "long",
                [
                    "string",
                    "string"
                ]
            ],



            "FindWindowExW":
            [
                "long",
                [
                    "long",
                    "long",
                    "string",
                    "string"
                ]
            ],



            "SendMessageTimeoutW":
            [
                "long",
                [
                    "long",
                    "int",
                    "int",
                    "int",
                    "int",
                    "int",
                    "long"
                ]
            ],



            "SetParent":
            [
                "long",
                [
                    "long",
                    "long"
                ]
            ],



            "ShowWindow":
            [
                "bool",
                [
                    "long",
                    "int"
                ]
            ]

        }

    );





class WindowsDesktop {



    constructor(){


        this.worker = null;


    }





    createWorker(){


        const progman =
            user32.FindWindowW(
                "Progman",
                null
            );



        if(!progman){

            throw new Error(
                "Progman not found"
            );

        }



        // Ask Explorer to create WorkerW layer

        user32.SendMessageTimeoutW(

            progman,

            0x052C,

            0,

            0,

            0,

            1000,

            0

        );





        let worker =
            user32.FindWindowExW(

                0,

                0,

                "WorkerW",

                null

            );



        if(!worker){


            worker =
                progman;


        }



        this.worker =
            worker;



        return worker;


    }





    attach(browserWindow){


        if(!this.worker){


            this.createWorker();


        }





        const hwnd =
            browserWindow.getNativeWindowHandle();



        const windowHandle =
            ref.readInt32(
                hwnd,
                0
            );




        user32.SetParent(

            windowHandle,

            this.worker

        );



        user32.ShowWindow(

            windowHandle,

            5

        );



        return true;


    }





    detach(){


        this.worker =
            null;


    }



}



module.exports =
    WindowsDesktop;
