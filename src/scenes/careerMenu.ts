import Phaser from "phaser";
import { CONFIG } from "../config";

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

        const fcfsButton = this.add.image(200, 400, "shift1");
        const blurb = this.add
            .text(
                400,
                350,
                "Complete tickets in the order\nin which they arrive.",
                { color: "black" }
            )
            .setAlpha(0);
        fcfsButton
            .setInteractive()
            .on("pointerdown", () => this.scene.start("Shift1"))
            .on("pointerover", () => {
                fcfsButton.setScale(1.1);
                blurb.setAlpha(1);
            })
            .on("pointerout", () => {
                fcfsButton.setScale(1);
                blurb.setAlpha(0);
            });

        const backButton = this.add.image(
            this.cameras.main.width - 200,
            400,
            "exit"
        );
        backButton
            .setInteractive()
            .on("pointerdown", () => {
                this.scene.start("MainMenu");
            })
            .on("pointerover", () => backButton.setScale(1.1))
            .on("pointerout", () => backButton.setScale(1));
    }
}
