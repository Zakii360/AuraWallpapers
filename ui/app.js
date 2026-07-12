const {
    ipcRenderer
} = require("electron");



const wallpaperList =
    document.getElementById(
        "wallpaper-list"
    );


const refreshButton =
    document.getElementById(
        "refresh"
    );



async function loadWallpapers(){


    const wallpapers =
        await ipcRenderer.invoke(
            "wallpapers:list"
        );



    renderWallpapers(
        wallpapers
    );

}





function renderWallpapers(
    wallpapers
){


    if(!wallpaperList){

        return;

    }



    wallpaperList.innerHTML =
        "";



    wallpapers.forEach(
        wallpaper => {


            const card =
                document.createElement(
                    "div"
                );



            card.className =
                "wallpaper-card";



            card.innerHTML = `

                <h3>
                    ${wallpaper.name}
                </h3>

                <button>
                    Apply
                </button>

            `;



            const button =
                card.querySelector(
                    "button"
                );



            button.addEventListener(
                "click",
                async () => {


                    button.disabled =
                        true;



                    try {


                        await ipcRenderer.invoke(
                            "wallpaper:apply",
                            wallpaper.id
                        );


                    } catch(error){


                        console.error(
                            "Failed to apply wallpaper:",
                            error
                        );


                    }



                    button.disabled =
                        false;


                }
            );



            wallpaperList.appendChild(
                card
            );


        }

    );

}





async function refresh(){


    await ipcRenderer.invoke(
        "wallpapers:refresh"
    );



    loadWallpapers();


}





if(refreshButton){


    refreshButton.addEventListener(
        "click",
        refresh
    );


}





window.addEventListener(
    "DOMContentLoaded",
    () => {

        loadWallpapers();

    }
);
