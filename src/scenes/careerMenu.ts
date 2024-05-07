import Phaser from "phaser";
import { CONFIG } from "../config";
import MenuButton from "../objects/menuButton";

export default class CareerMenu extends Phaser.Scene {
    constructor() {
        super({ key: "CareerMenu" });
    }

    create() {
        const version = CONFIG.version;
        this.add
            .text(this.cameras.main.width - 15, 15, version, {
                color: "#000000",
                fontSize: "24px",
            })
            .setOrigin(1, 0);

        this.add
            .text(this.cameras.main.centerX, 200, "CAREER", {
                color: "#54d6d2",
                fontSize: "100px",
            })
            .setOrigin(0.5, 1);

        new MenuButton(this, 200, 400, "play-button", "Shift1");

        new MenuButton(
            this,
            this.cameras.main.width - 200,
            400,
            "exit",
            "MainMenu"
        );

        const music = this.sound.add("menuAudio", { volume: 0.1 });
        music.play(), music.setVolume(0.1);

        this.events.on("shutdown", () => {
            music.stop();
        });
    }
}
