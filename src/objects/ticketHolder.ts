import Phaser from "phaser";
import Ticket from "./ticket";

export default class TicketHolder extends Phaser.GameObjects.Zone {
    clip: Phaser.GameObjects.Sprite;
    public ticket: Ticket | null;
    occ: Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        super(scene, x, y, width, height);
        this.setDropZone().setName("holder");
        this.clip = scene.add
            .sprite(x, y, "ticket-holder")
            .setScale(4)
            .setDepth(1);
        scene.add.existing(this);
        this.occ = scene.add.text(
            this.x,
            this.y + 150,
            this.ticket ? "occupied" : "empty"
        );
        scene.events.on("update", this.update, this);
    }

    update() {
        this.occ.text = this.ticket ? "occupied" : "empty";
    }
}
