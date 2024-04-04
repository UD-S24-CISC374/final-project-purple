import Phaser from "phaser";
import CurrentOrder from "./currentOrder";
import TicketHolder from "./ticketHolder";

export default class Ticket extends Phaser.GameObjects.Sprite {
    public length: number;
    ingredients: number[];
    arrivalTime: number;
    details: Phaser.GameObjects.Text;
    holder: TicketHolder | CurrentOrder;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        ingredients: number[],
        holder: TicketHolder | CurrentOrder
    ) {
        super(scene, x, y, "ticket");
        this.holder = holder;
        this.setScale(0.5)
            .setDepth(0)
            .setInteractive({ draggable: true })
            .setName("tricket")
            // attach input events
            .on("pointerover", this.showDetails)
            .on("pointerout", this.hideDetails)
            .on("drag", this.drag)
            .on("dragstart", this.dragStart)
            .on("dragend", this.dragEnd)
            .on("dragenter", this.dragEnter)
            .on("dragleave", this.dragLeave)
            .on("drop", this.drop);
        this.ingredients = ingredients.map((ingrd) => ingrd);
        this.length = this.ingredients.length;
        this.arrivalTime = Phaser.Math.FloatBetween(0, 30);
        this.details = scene.add
            .text(x, y + 120, `Arrived ${this.arrivalTime.toFixed(2)}s ago.`)
            .setAlpha(0)
            .setOrigin(0.5, 1);
        scene.events.on("update", this.update, this);
        scene.add.existing(this);
    }

    drag(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
        this.x = dragX;
        this.y = dragY;
    }

    dragStart() {
        // when the user starts dragging
        this.setScale(0.6);
        this.depth = 2;
    }

    dragEnd() {
        // when the user releases the ticket
        this.setScale(0.5);
        this.depth = 0;
        // snap back to holder
        if (this.holder.name === "holder") {
            this.setPosition(this.holder.x, this.holder.y + 60);
        } else if (this.holder.name === "current") {
            this.setPosition(this.holder.x, this.holder.y);
        }
    }

    dragEnter(ticket: Ticket, target: TicketHolder | CurrentOrder) {
        // make ticket bigger when above a droppable area
        console.log(`Entering ${target.name}`);
        target.ticket ? null : this.setScale(0.7);
    }

    dragLeave(ticket: Ticket, target: TicketHolder | CurrentOrder) {
        console.log(`Leaving ${target.name}`);
        // shrink back down to slight increase in scale when leaving droppable area
        this.setScale(0.6);
    }

    drop(ticket: Ticket, target: TicketHolder | CurrentOrder) {
        if (target.ticket) {
            // if holder is occupied, just end the drag event
            this.dragEnd();
            return;
        }

        if (target.name === "holder" || target.name === "current") {
            this.holder.ticket = null; // set prev holder to empty
            this.holder = target; // assign new holder
            this.holder.ticket = this; // set new holder's ticket to this
            target.name === "holder"
                ? this.setPosition(target.x, target.y + 60)
                : this.setPosition(target.x, target.y);
        }
    }

    showDetails() {
        this.scene.tweens.add({
            targets: [this.details],
            alpha: { from: 0, to: 1 },
            duration: 300,
        });
    }

    hideDetails() {
        this.details.setAlpha(0);
    }

    update() {
        this.details.setPosition(this.x, this.y + 100);
    }
}
