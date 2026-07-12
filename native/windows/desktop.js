const ffi = require("ffi-napi");
const ref = require("ref-napi");



const user32 =
    ffi.Library(
        "user32",
        {


            FindWindowW: [
                "pointer",
                [
                    "string",
                    "string"
                ]
            ],



            FindWindowExW: [
                "pointer",
                [
                    "pointer",
                    "pointer",
                    "string",
                    "string"
                ]
            ],



            SendMessageTimeoutW: [
                "uint32",
                [
                    "pointer",
                    "uint32",
                    "uint64",
                    "pointer",
                    "uint32",
                    "uint32",
                    "pointer"
                ]
            ],



            SetParent: [
                "pointer",
                [
                    "pointer",
                    "pointer"
                ]
            ],



            EnumWindows: [
                "bool",
                [
                    "pointer",
                    "int32"
                ]
            ],



            GetClassNameW: [
                "int32",
                [
                    "pointer",
                    "pointer",
                    "int32"
                ]
            ]

        }
    );



const WM_SPAWN_WORKER =
    0x052C;



class WindowsDesktop {


    constructor(){


        this.worker =
            null;


    }





    findWorker(){


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



        user32.SendMessageTimeoutW(

            progman,

            WM_SPAWN_WORKER,

            0,

            null,

            0,

            1000,

            null

        );



        let worker =
            null;



        const callback =
            ffi.Callback(

                "bool",

                [
                    "pointer",
                    "int32"
                ],

                (hwnd)=>{


                    const shell =
                        user32.FindWindowExW(

                            hwnd,

                            null,

                            "SHELLDLL_DefView",

                            null

                        );



                    if(shell){


                        worker =
                            user32.FindWindowExW(

                                null,

                                hwnd,

                                "WorkerW",

                                null

                            );


                    }



                    return true;


                }

            );



        user32.EnumWindows(
            callback,
            0
        );



        if(!worker){


            worker =
                progman;


        }



        return worker;


    }





    attach(hwnd){


        const worker =
            this.findWorker();



        user32.SetParent(

            hwnd,

            worker

        );



        this.worker =
            worker;



        return true;


    }





    detach(){


        this.worker =
            null;


    }



}



module.exports =
    new WindowsDesktop();
