import Phaser from "phaser";

export default class MetricMenuButton extends Phaser.GameObjects.Text {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        text: string,
        onClick: () => void
    ) {
        super(scene, x, y, text, {
            backgroundColor: "black",
            padding: { top: 6, bottom: 6, left: 6, right: 6 },
            fontSize: 32,
        });

        this.setOrigin(0.5)
            .setInteractive({ cursor: "pointer" })
            .on("pointerdown", onClick)
            .on("pointerover", () => {
                scene.add.tween({
                    targets: [this],
                    scale: { from: 1, to: 1.2 },
                    duration: 100,
                });
            })
            .on("pointerout", () => {
                scene.add.tween({
                    targets: [this],
                    scale: { from: 1.2, to: 1 },
                    duration: 100,
                });
            });

        scene.add.existing(this);
    }
}
