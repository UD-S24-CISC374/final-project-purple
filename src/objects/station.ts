import Phaser from "phaser";
import Ingredient from "./ingredient";

export default abstract class Station extends Phaser.GameObjects.Zone {
    duration: number;
    occupied: boolean;
    timer: Phaser.GameObjects.Sprite;
    shield: Phaser.GameObjects.Rectangle; // shield to block player from dragging out in-progress ingredient

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        super(scene, x, y, width, height);
        this.setDropZone();
        //scene.add.rectangle(x, y, width, height, 0xff0000).setAlpha(0.4); // debug drop zone identifier
        scene.add.existing(this);

        this.timer = scene.add
            .sprite(x, y - 30, "timer")
            .setScale(5)
            .setAlpha(0)
            .setDepth(3);

        this.shield = scene.add
            .rectangle(x, y, width + 10, height + 10, 0x0ff000)
            .setAlpha(0.4)
            .setDepth(0)
            .setInteractive();
    }

    cook(ingrd: Ingredient) {
        this.setTimer();
        this.shield.setDepth(ingrd.depth + 1); // don't let player remove while cooking
        // each station provides its own time (might switch to ingredient wise)
        this.scene.time.delayedCall(this.duration, () => {
            ingrd.updateState(this.name); // set to new state
            this.timer.setAlpha(0); // remove timer
            this.shield.setDepth(ingrd.depth - 1);
        });
    }

    setTimer() {
        this.timer.setAlpha(1).anims.play(
            `${this.name}-timer`,

            true
        );
    }

    setOccupied(newStatus: boolean) {
        this.occupied = newStatus;
    }
}
