const wallpapers =
    document.querySelector(".wallpapers");


const refreshButton =
    document.querySelector("#refresh");


const fps =
    document.querySelector("#fps");


const startup =
    document.querySelector("#startup");





async function loadWallpapers(){


    wallpapers.innerHTML =
        "";



    const list =
        await window.electronAPI?.getWallpapers?.()
        ||
        await require("electron")
            .ipcRenderer
            .invoke(
                "wallpapers:get"
            );



    for(const wallpaper of list){


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "wallpaper-card";



        const image =
            document.createElement(
                "img"
            );


        image.src =
            wallpaper.preview;



        image.onerror =
            ()=>{

                image.style.display =
                    "none";

            };



        const title =
            document.createElement(
                "div"
            );


        title.className =
            "title";


        title.textContent =
            wallpaper.metadata.name
            ||
            wallpaper.id;




        const author =
            document.createElement(
                "div"
            );


        author.className =
            "author";


        author.textContent =
            wallpaper.metadata.author
            ||
            "Unknown";



        card.appendChild(
            image
        );


        card.appendChild(
            title
        );


        card.appendChild(
            author
        );



        card.onclick =
            async()=>{


                await require("electron")
                    .ipcRenderer
                    .invoke(

                        "wallpaper:apply",

                        wallpaper.id

                    );


            };



        wallpapers.appendChild(
            card
        );


    }



}





refreshButton.onclick =
    ()=>{


        require("electron")
        .ipcRenderer
        .invoke(
            "wallpapers:refresh"
        )
        .then(
            loadWallpapers
        );


    };





fps.onchange =
    ()=>{


        require("electron")
        .ipcRenderer
        .invoke(

            "settings:update",

            {

                fps:
                    Number(
                        fps.value
                    )

            }

        );


    };





startup.onchange =
    ()=>{


        require("electron")
        .ipcRenderer
        .invoke(

            "settings:update",

            {

                startup:
                    startup.checked

            }

        );


    };





loadWallpapers();
