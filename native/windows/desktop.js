const ffi = require("ffi-napi");
const ref = require("ref-napi");


const HWND = ref.types.longlong;


const user32 = ffi.Library(
    "user32",
    {

        FindWindowW: [
            HWND,
            [
                "string",
                "string"
            ]
        ],


        FindWindowExW: [
            HWND,
            HWND,
            "string",
            "string"
        ],


        SendMessageTimeoutW: [
            HWND,
            [
                HWND,
                "uint",
                "uint64",
                "uint64",
                "uint",
                "uint",
                "pointer"
            ]
        ],


        SetParent: [
            HWND,
            [
                HWND,
                HWND
            ]
        ],


        GetShellWindow: [
            HWND,
            []
        ]

    }
);



class WindowsDesktop {


    constructor(){

        this.worker = null;

    }




    findWorker(){

        const progman =
            user32.FindWindowW(
                "Progman",
                null
            );


        if(!progman){

            throw new Error(
                "Could not find Progman"
            );

        }



        // Ask Explorer to create WorkerW

        user32.SendMessageTimeoutW(
            progman,
            0x052C,
            0,
            0,
            0,
            1000,
            null
        );



        let worker =
            user32.FindWindowExW(
                0,
                0,
                "WorkerW",
                null
            );


        if(!worker){

            throw new Error(
                "WorkerW desktop layer not found"
            );

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



        this.worker = worker;


        return true;

    }





    detach(hwnd){


        if(!hwnd || !this.worker){

            return;

        }



        user32.SetParent(
            hwnd,
            0
        );


        this.worker = null;

    }


}



module.exports = WindowsDesktop;
