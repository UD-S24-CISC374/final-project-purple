import Phaser from "phaser";

export default class MenuButton extends Phaser.GameObjects.Sprite {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        tex: string,
        nextSceneKey: string
    ) {
        super(scene, x, y, tex);

        this.setScale(10)
            .setInteractive()
            .on("pointerdown", () => {
                nextSceneKey ? scene.scene.start(nextSceneKey) : window.close();
            })
            .on("pointerover", () =>
                scene.add.tween({
                    targets: [this],
                    scale: { from: 10, to: 10.7 },
                    duration: 100,
                })
            )
            .on("pointerout", () =>
                scene.add.tween({
                    targets: [this],
                    scale: { from: 10.7, to: 10 },
                    duration: 100,
                })
            );

        scene.add.existing(this);
    }
}
