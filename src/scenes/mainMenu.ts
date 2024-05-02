import Phaser from "phaser";
import { CONFIG } from "../config";
import MenuButton from "../objects/menuButton";

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

        new MenuButton(this, 200, 400, "career", "CareerMenu");

        new MenuButton(
            this,
            this.cameras.main.centerX,
            400,
            "tutorial",
            "TutorialMenu"
        );

        new MenuButton(this, this.cameras.main.width - 200, 400, "exit", "");
    }
}
