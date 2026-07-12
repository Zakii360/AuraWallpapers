const ffi = require("ffi-napi");
const ref = require("ref-napi");


const user32 = ffi.Library(
    "user32",
    {

        "FindWindowW": [
            "long",
            [
                "string",
                "string"
            ]
        ],


        "FindWindowExW": [
            "long",
            [
                "long",
                "long",
                "string",
                "string"
            ]
        ],


        "SetParent": [
            "long",
            [
                "long",
                "long"
            ]
        ]

    }
);



class WindowsDesktop {


    constructor(){

        this.worker = null;

    }



    findDesktop(){

        const progman =
            user32.FindWindowW(
                "Progman",
                null
            );


        if(!progman){

            throw new Error(
                "Windows desktop window not found"
            );

        }


        return progman;

    }



    attach(hwnd){


        const desktop =
            this.findDesktop();


        user32.SetParent(
            hwnd,
            desktop
        );


        this.worker = hwnd;


        return true;

    }



    detach(){

        this.worker = null;

    }


}



module.exports = WindowsDesktop;
