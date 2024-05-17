import Dish from "../dish";
import Phaser from "phaser";
import Station from "../station";

export default class Service extends Station {
    dish: Dish | null = null;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        super(scene, x, y, width, height);
        this.setName("service");
        this.timer.destroy();
    }

    setDish(newDish: Dish) {
        this.dish = newDish;
    }
}
