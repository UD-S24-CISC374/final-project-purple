import Station from "../station";
import Phaser from "phaser";

export default class Sink extends Station {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        super(scene, x, y, width, height);
        this.setName("sink");
        this.duration = 3000;
    }
}
