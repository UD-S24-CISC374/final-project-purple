import Phaser from "phaser";

export default class ShowButton extends Phaser.GameObjects.Text {
    content: Phaser.GameObjects.Sprite;
    closeZone: Phaser.GameObjects.Zone;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        text: string,
        contentKey: string
    ) {
        super(scene, x, y, text, {
            color: "black",
            backgroundColor: "#f8f0ce",
            fontSize: "24px",
        });

        this.content = scene.add
            .sprite(
                scene.cameras.main.centerX,
                scene.cameras.main.centerY,
                contentKey
            )
            .setVisible(false)
            .setScale(0.5)
            .setDepth(999);

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
                console.log("here");
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
