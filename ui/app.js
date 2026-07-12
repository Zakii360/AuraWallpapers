const wallpapersContainer =
    document.querySelector(
        ".wallpapers"
    );


const refreshButton =
    document.getElementById(
        "refresh"
    );


const fpsSelect =
    document.getElementById(
        "fps"
    );


const startupCheckbox =
    document.getElementById(
        "startup"
    );





async function loadWallpapers(){


    const wallpapers =
        await window.aura.wallpapers.list();



    wallpapersContainer.innerHTML =
        "";



    for(
        const wallpaper
        of wallpapers
    ){


        const card =
            document.createElement(
                "button"
            );



        card.className =
            "wallpaper-card";



        card.innerHTML = `

            <div class="title">
                ${wallpaper.name}
            </div>

            <div class="author">
                ${wallpaper.author}
            </div>

        `;



        card.onclick =
            ()=>applyWallpaper(
                wallpaper.id
            );



        wallpapersContainer.appendChild(
            card
        );


    }


}





async function applyWallpaper(id){


    const result =
        await window.aura.wallpapers.apply(
            id
        );



    if(
        result?.error
    ){


        console.error(
            result.error
        );


        alert(
            result.error
        );


    }


}





async function loadSettings(){


    const settings =
        await window.aura.settings.get();



    if(
        settings.fps
    ){

        fpsSelect.value =
            settings.fps;

    }



    if(
        settings.startup !== undefined
    ){

        startupCheckbox.checked =
            settings.startup;

    }


}





refreshButton.onclick =
    ()=>{


        loadWallpapers();


    };





fpsSelect.onchange =
    async()=>{


        await window.aura.settings.set(

            {

                fps:
                    Number(
                        fpsSelect.value
                    )

            }

        );


    };





startupCheckbox.onchange =
    async()=>{


        await window.aura.settings.set(

            {

                startup:
                    startupCheckbox.checked

            }

        );


    };





window.addEventListener(

    "DOMContentLoaded",

    ()=>{


        loadWallpapers();

        loadSettings();


    }

);
