import Phaser from "phaser";
import MenuButton from "../objects/menuButton";
import CareerData from "../data/careerData";
import Title from "../objects/title";
import audioManager from "../objects/audioManager";

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

        this.add
            .sprite(130, this.cameras.main.height / 7, "manager", 1)
            .setOrigin(0.5, 0.5)
            .setScale(2.5)
            .setFlipX(true);

        this.add
            .sprite(
                this.cameras.main.width - 130,
                this.cameras.main.height / 7,
                "manager",
                2
            )
            .setOrigin(0.5, 0.5)
            .setScale(2.5);
        new MenuButton(this, 200, 400, "career", "CareerMenu");

        new MenuButton(
            this,
            this.cameras.main.centerX,
            400,
            "tutorial",
            "TutorialMenu"
        );

        new MenuButton(
            this,
            this.cameras.main.width - 200,
            400,
            "comp",
            "CompetitiveMenu"
        );

        audioManager.playMusic(this, "menuAudio", { volume: 0.15 }); // Play music using AudioManager
    }
}
