import Station from "../station";
import Phaser from "phaser";

export default class Prep extends Station {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        super(scene, x, y, width, height);
    }
}
