const {
    contextBridge,
    ipcRenderer
} = require("electron");



contextBridge.exposeInMainWorld(

    "aura",

    {


        wallpapers: {


            list(){

                return ipcRenderer.invoke(
                    "wallpapers:list"
                );

            },



            apply(id){

                return ipcRenderer.invoke(
                    "wallpapers:apply",
                    id
                );

            },



            close(){

                return ipcRenderer.invoke(
                    "wallpapers:close"
                );

            }


        },




        settings: {


            get(){

                return ipcRenderer.invoke(
                    "settings:get"
                );

            },


            set(settings){

                return ipcRenderer.invoke(
                    "settings:set",
                    settings
                );

            }


        }


    }

);
