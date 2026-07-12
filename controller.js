const WallpaperEngine = require("./engine");
const Wallpaper = require("./wallpaper");
const SettingsManager = require("./settings");

class AuraController {

    constructor() {

        this.engine = new WallpaperEngine();
        this.wallpaper = new Wallpaper();
        this.settings = new SettingsManager();

        this.current = null;

    }



    initialize() {

        this.settings.load();

        this.engine.loadWallpapers();

        const saved = this.settings.get("currentWallpaper");

        if (saved) {

            const wallpaper = this.engine.getWallpaper(saved);

            if (wallpaper) {

                this.current = wallpaper;

            }

        }

    }



    getWallpapers() {

        return this.engine.availableWallpapers;

    }



    applyWallpaper(id) {

        const wallpaper =
            this.engine.setWallpaper(id);

        if (!wallpaper) {

            throw new Error(`Wallpaper "${id}" not found.`);

        }

        this.closeWallpaper();

        this.wallpaper.create(wallpaper);

        this.current = wallpaper;

        this.settings.set(
            "currentWallpaper",
            id
        );

        return wallpaper;

    }



    closeWallpaper() {

        this.wallpaper.close();

        this.current = null;

    }



    toggleWallpaper() {

        if (this.current) {

            this.closeWallpaper();

            return false;

        }

        const saved =
            this.settings.get("currentWallpaper");

        if (!saved) {

            return false;

        }

        return !!this.applyWallpaper(saved);

    }



    refresh() {

        this.engine.loadWallpapers();

        return this.engine.availableWallpapers;

    }



    getSettings() {

        return this.settings.settings;

    }



    updateSettings(values) {

        return this.settings.update(values);

    }



    getWallpaperEffects(id) {

        return this.settings.getEffects(id);

    }



    updateWallpaperEffects(id, effects) {

        return this.settings.setEffects(
            id,
            effects
        );

    }



    getCurrentWallpaper() {

        return this.current;

    }



    isWallpaperRunning() {

        return this.current !== null;

    }

}

module.exports = AuraController;
