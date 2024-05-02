import Phaser from "phaser";
import Dish from "./dish";

export default class Plating extends Phaser.GameObjects.Zone {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        super(scene, x, y, width, height);
        this.setInteractive({ cursor: "pointer" }).on(
            "pointerdown",
            this.createDish,
            this
        );
        scene.add.existing(this);
    }

    createDish(pointer: Phaser.Input.Pointer) {
        this.scene.add.existing(new Dish(this.scene, pointer.x, pointer.y));
    }
}
