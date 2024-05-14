import Phaser from "phaser";
import MenuButton from "../objects/menuButton";
import CareerData from "../data/careerData";

export default class MainMenu extends Phaser.Scene {
    career: CareerData;

    constructor() {
        super({ key: "MainMenu" });
    }

    init() {
        CareerData.init(this, false);
    }

    create() {
        this.add
            .text(this.cameras.main.centerX, 200, "SCHEDULSINE", {
                color: "#54d6d2",
                fontSize: "100px",
            })
            .setOrigin(0.5, 1);

        new MenuButton(this, 200, 400, "career", "CareerMenu");

        new MenuButton(
            this,
            this.cameras.main.centerX,
            400,
            "tutorial",
            "TutorialMenu"
        );

        new MenuButton(this, this.cameras.main.width - 200, 400, "exit", "");

        const music = this.sound.add("menuAudio", { volume: 0.1 });
        music.play(), music.setVolume(0.1);

        this.events.on("shutdown", () => {
            music.stop();
        });
    }
}
