import Phaser from "phaser";
import Ticket from "./ticket";

export default class CurrentOrder extends Phaser.GameObjects.Zone {
    public ticket: Ticket | null;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        super(scene, x, y, width, height);
        this.setDropZone();
        scene.add.existing(this);
    }
}
