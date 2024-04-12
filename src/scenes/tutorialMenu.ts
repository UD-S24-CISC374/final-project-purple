import Phaser from "phaser";
import { CONFIG } from "../config";

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
            .text(this.cameras.main.centerX, 200, "SCHEDULSINE", {
                color: "#54d6d2",
                fontSize: "100px",
            })
            .setOrigin(0.5, 1);

        this.add.text(100, 200, "How to play:", {
            color: "black",
            fontSize: "30px",
        });
        this.add.text(
            160,
            235,
            "- drag the appropriate ticket to the `ORDER` \n\t\tzone based on the scheduling algorithm\n- click on the table of plates to spawn a dish\n- drag the empty dish to the service station\n\t\t(beneath bell)\n- click on the fridge or pantry \n\t\t(left-hand side of kitchen)\n- click on an ingredient to spawn it\n- drag the ingredient to the appropriate station\n\t\t(as specified under the ticket's recipe)\n- once finished, drag ingredient to dish on service\n- click bell to serve the dish\n- profit",
            {
                color: "black",
                fontSize: "24px",
            }
        );

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
