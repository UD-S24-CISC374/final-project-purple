import Phaser from "phaser";

export default class Title extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, texKey: string) {
        super(scene, scene.cameras.main.centerX, 120, texKey);
        this.setScale(13);
        scene.add.existing(this);
    }
}
