import Phaser from "phaser";

export default class Trash extends Phaser.GameObjects.Zone {
    trashSprite: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 32, 32);
        this.setScale(2.7)
            .setDropZone()
            .on("pointerover", () =>
                scene.add.tween({
                    targets: [this.trashSprite],
                    scale: { from: 2.5, to: 3 },
                    rotation: { from: 0, to: Phaser.Math.DegToRad(360) },
                    duration: 100,
                })
            )
            .on("pointerout", () =>
                scene.add.tween({
                    targets: [this.trashSprite],
                    scale: { from: 3, to: 2.5 },
                    duration: 100,
                })
            );
        this.trashSprite = scene.add.sprite(x, y, "trash").setScale(2.5);
        scene.add.existing(this);
    }
}
