import Phaser from "phaser";

export default class ShowButton extends Phaser.GameObjects.Text {
    content: Phaser.GameObjects.Sprite;
    closeZone: Phaser.GameObjects.Zone;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        text: string,
        content: Phaser.GameObjects.Sprite
    ) {
        super(scene, x, y, text, {
            color: "black",
            backgroundColor: "#f8f0ce",
            fontSize: "24px",
        });
        this.content = content;
        this.content.setVisible(false).setDepth(999);

        this.closeZone = scene.add
            .zone(
                scene.cameras.main.centerX,
                scene.cameras.main.centerY,
                scene.cameras.main.width,
                scene.cameras.main.width
            )
            .setInteractive()
            .setVisible(false)
            .on("pointerdown", () => {
                this.content.setVisible(false);
                this.closeZone.setVisible(false);
            });

        this.setInteractive({ cursor: "pointer" })
            .setOrigin(0.5)
            .on("pointerdown", () => {
                this.content.setVisible(!this.content.visible);
                this.closeZone.setVisible(!this.closeZone.visible);
            })
            .on("pointerover", () =>
                scene.add.tween({
                    targets: [this],
                    scale: { from: this.scale, to: 1.2 },
                    duration: 100,
                })
            )
            .on("pointerout", () =>
                scene.add.tween({
                    targets: [this],
                    scale: { from: this.scale, to: 1 },
                    duration: 100,
                })
            );

        scene.add.existing(this);
    }
}
