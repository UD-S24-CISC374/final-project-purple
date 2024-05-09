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
                localStorage.setItem(
                    "career",
                    JSON.stringify(this.registry.get("career"))
                );
                this.scene.stop(sceneData.shift);
                this.scene.start("MainMenu");
            });
    }
}
