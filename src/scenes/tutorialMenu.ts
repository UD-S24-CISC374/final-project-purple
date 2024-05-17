import Phaser from "phaser";
import MenuButton from "../objects/menuButton";
import Title from "../objects/title";
import audioManager from "../objects/audioManager"; // Import the AudioManager

export default class TutorialMenu extends Phaser.Scene {
    constructor() {
        super({ key: "TutorialMenu" });
    }

    create() {
        new Title(this, "tutorial-title");

        new MenuButton(this, 200, 400, "play-button", "Tutorial");

        new MenuButton(
            this,
            this.cameras.main.width - 200,
            400,
            "exit",
            "MainMenu"
        );

        audioManager.setVolume(0.1);
        this.events.on("shutdown", () => {
            audioManager.stopMusic();
        });
    }
}
