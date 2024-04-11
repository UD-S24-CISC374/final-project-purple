import Phaser from "phaser";

export default class Pantry extends Phaser.GameObjects.Zone {
    public inside: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 190, 320);
        this.setInteractive().on("pointerdown", this.click);
        this.inside = scene.add.image(250, 450, "pantry-inside").setAlpha(0);
        scene.add.existing(this);
    }

    click() {
        //this.tmpInside.setAlpha(1);
        this.inside.alpha > 0
            ? this.inside.setAlpha(0)
            : this.inside.setAlpha(1);
    }

    create() {}
}
