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
        scene.add.existing(this);
        new Dish(scene, x - 50, y - 20);
        new Dish(scene, x + 50, y - 20);
        new Dish(scene, x, y + 20);
    }
}
