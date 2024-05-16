import Phaser from "phaser";

export default class ShiftGUI extends Phaser.Scene {
    exitButton: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "ShiftGUI" });
    }

    create(sceneData: { shift: string }) {
        this.exitButton = this.add
            .text(this.cameras.main.width - 115, 670, "EXIT", {
                color: "black",
                backgroundColor: "#f8f0ce",
                fontSize: "38px",
            })
            .setInteractive()
            .on("pointerdown", () => { 
                this.scene.stop(sceneData.shift);
                this.scene.start("MainMenu");
            });
    }
}
