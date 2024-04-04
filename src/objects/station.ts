import Phaser from "phaser";

export default abstract class Station extends Phaser.GameObjects.Zone {
    duration: number;
    timer: Phaser.GameObjects.Sprite; // will be the dial timer
    // needs to hold reference to current task/ingredient on station

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        super(scene, x, y, width, height);
        this.setInteractive().setDropZone();
        scene.add.rectangle(x, y, width, height, 0xff0000).setAlpha(0.4);
        scene.add.existing(this);
    }
}
