import Phaser from "phaser";
import { CONFIG } from "../config";

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenu" });
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
            .text(this.cameras.main.centerX, 200, "SCHEDULSINE", {
                color: "#54d6d2",
                fontSize: "100px",
            })
            .setOrigin(0.5, 1);

        const careerButton = this.add.image(200, 400, "career");
        careerButton
            .setInteractive()
            .on("pointerdown", () => this.scene.start("CareerMenu"))
            .on("pointerover", () => careerButton.setScale(1.1))
            .on("pointerout", () => careerButton.setScale(1));

        const tutorialButton = this.add.image(
            this.cameras.main.centerX,
            400,
            "tutorial"
        );

        tutorialButton
            .setInteractive()
            .on("pointerdown", () => this.scene.start("TutorialMenu"))
            .on("pointerover", () => tutorialButton.setScale(1.1))
            .on("pointerout", () => tutorialButton.setScale(1));

        const exitButton = this.add.image(
            this.cameras.main.width - 200,
            400,
            "exit"
        );
        exitButton
            .setInteractive()
            .on("pointerdown", () => {
                window.close();
            })
            .on("pointerover", () => exitButton.setScale(1.1))
            .on("pointerout", () => exitButton.setScale(1));
    }
}
