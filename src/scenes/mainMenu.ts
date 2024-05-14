import Phaser from "phaser";
import MenuButton from "../objects/menuButton";
import CareerData from "../data/careerData";
import Title from "../objects/title";

export default class MainMenu extends Phaser.Scene {
    career: CareerData;

    constructor() {
        super({ key: "MainMenu" });
    }

    init() {
        CareerData.init(this, false);
    }

    create() {
        new Title(this, "title");

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
