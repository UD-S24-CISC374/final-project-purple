import Phaser from "phaser";
import Ticket from "./ticket";

export default class TicketHolder extends Phaser.GameObjects.Zone {
    public ticket: Ticket | null;
    clip: Phaser.GameObjects.Sprite;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        super(scene, x, y, width, height);
        this.setDropZone();
        this.clip = scene.add
            .sprite(x, y, "ticket-holder")
            .setScale(4)
            .setDepth(2);
        this.scene.add.rectangle(x, y + 60, width - 30, height - 160, 0x817faa);
        scene.add.existing(this);
    }
}
