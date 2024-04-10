import Phaser from "phaser";

export default abstract class Station extends Phaser.GameObjects.Zone {
    duration: number;
    occupied: boolean;
    timer: Phaser.GameObjects.Sprite;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        super(scene, x, y, width, height);
        this.setDropZone();
        scene.add.rectangle(x, y, width, height, 0xff0000).setAlpha(0.4);
        scene.add.existing(this);

        this.timer = scene.add
            .sprite(x, y - 30, "timer")
            .setScale(5)
            .setAlpha(0)
            .setDepth(3);
        scene.events.on("update", this.update, this);
    }

    update() {
        if (this.occupied) {
            this.timer
                .setAlpha(1)
                .anims.play({ key: "countdown-timer", duration: 2000 }, true);
            console.log(this.name);
        } else {
            this.timer.setAlpha(0).anims.stop();
        }
    }
}
