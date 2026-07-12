const { ipcRenderer } = require("electron");


const wallpaperList =
    document.querySelector(".wallpapers");



async function loadWallpapers(){

    const wallpapers =
        await ipcRenderer.invoke(
            "wallpapers:list"
        );


    wallpaperList.innerHTML = "";


    wallpapers.forEach(wallpaper=>{

        const card =
            document.createElement("div");


        card.className = "card";


        card.innerHTML = `

            <h3>${wallpaper.name}</h3>

            <p>
                ${wallpaper.author || "Unknown"}
            </p>

            <button>
                Apply
            </button>

        `;


        const button =
            card.querySelector("button");


        button.addEventListener(
            "click",
            ()=>{

                applyWallpaper(
                    wallpaper.id
                );

            }
        );


        wallpaperList.appendChild(card);

    });


}



async function applyWallpaper(id){

    await ipcRenderer.invoke(
        "wallpaper:apply",
        id
    );

}



async function loadSettings(){

    const settings =
        await ipcRenderer.invoke(
            "settings:get"
        );


    const startup =
        document.querySelector(
            "#startup"
        );


    const fps =
        document.querySelector(
            "#fps"
        );


    if(startup){

        startup.checked =
            settings.startup;

    }


    if(fps){

        fps.value =
            settings.fps;

    }

}



window.addEventListener(
    "DOMContentLoaded",
    ()=>{

        loadWallpapers();

        loadSettings();

    }
);
