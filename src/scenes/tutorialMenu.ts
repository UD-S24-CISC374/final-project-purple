import Phaser from "phaser";
import { CONFIG } from "../config";
import MenuButton from "../objects/menuButton";

export default class TutorialMenu extends Phaser.Scene {
    constructor() {
        super({ key: "TutorialMenu" });
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
            .text(this.cameras.main.centerX, 200, "TUTORIAL", {
                color: "#54d6d2",
                fontSize: "100px",
            })
            .setOrigin(0.5, 1);

        this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                "Learn the ropes!",
                {
                    color: "black",
                    fontSize: "24px",
                }
            )
            .setOrigin(0.5);

        new MenuButton(this, 200, 400, "play-button", "Tutorial");

        new MenuButton(
            this,
            this.cameras.main.width - 200,
            400,
            "exit",
            "MainMenu"
        );
    }
}
