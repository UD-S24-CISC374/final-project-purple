import Phaser from "phaser";
//import Ingredient from "./ingredient";

export default class Fridge extends Phaser.GameObjects.Zone {
    public inside: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 150, 270);
        this.setInteractive().on("pointerdown", this.click);
        this.inside = scene.add.image(250, 450, "fridge-inside").setAlpha(0);
        scene.add.existing(this);
    }

    click() {
        //this.tmpInside.setAlpha(1);
        this.inside.alpha > 0
            ? this.inside.setAlpha(0)
            : this.inside.setAlpha(1);
    }
}
