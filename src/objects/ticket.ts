import Phaser from "phaser";
import CurrentOrder from "./currentOrder";
import TicketHolder from "./ticketHolder";

export default class Ticket extends Phaser.GameObjects.Sprite {
    arrivalTime: number;
    details: Phaser.GameObjects.Text;
    holder: TicketHolder | CurrentOrder;
    requirements: Set<string>;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        holder: TicketHolder | CurrentOrder,
        dishName: string,
        requirements: Set<string>
    ) {
        super(scene, x, y, "ticket");
        this.holder = holder;
        this.setScale(0.5)
            .setDepth(1)
            .setInteractive({ draggable: true })
            .setName(dishName)
            // attach input events
            .on("pointerover", this.showDetails)
            .on("pointerout", this.hideDetails)
            .on("drag", this.drag)
            .on("dragstart", this.dragStart)
            .on("dragend", this.dragEnd)
            .on("dragenter", this.dragEnter)
            .on("dragleave", this.dragLeave)
            .on("drop", this.drop);

        this.arrivalTime = Phaser.Math.FloatBetween(0, 30);

        this.details = scene.add
            .text(x, y + 120, `Arrived ${this.arrivalTime.toFixed(2)}s ago.`)
            .setAlpha(0)
            .setOrigin(0.5, 1);

        this.requirements = requirements;

        scene.events.on("update", this.update, this);
        scene.add.existing(this);
    }

    drag(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
        this.x = dragX;
        this.y = dragY;
    }

    dragStart() {
        // when the user starts dragging
        this.setScale(0.6).setDepth(3);
    }

    dragEnd() {
        // when the user releases the ticket
        this.setScale(0.5).setDepth(1);
        // snap back to holder
        this.setPosition(
            this.holder.x,
            this.holder.y + (this.holder instanceof TicketHolder ? 60 : 0)
        );
    }

    dragEnter(ticket: Ticket, target: TicketHolder | CurrentOrder) {
        // make ticket bigger when above a droppable area
        if (
            (target instanceof TicketHolder ||
                target instanceof CurrentOrder) &&
            !target.ticket
        )
            this.setScale(0.7);
    }

    dragLeave(ticket: Ticket, target: TicketHolder | CurrentOrder) {
        // shrink back down to slight increase in scale when leaving droppable area
        if (target instanceof TicketHolder || target instanceof CurrentOrder)
            this.setScale(0.6);
    }

    drop(ticket: Ticket, target: TicketHolder | CurrentOrder) {
        if (
            (target instanceof TicketHolder ||
                target instanceof CurrentOrder) &&
            !target.ticket
        ) {
            this.holder.ticket = null; // set prev holder to empty
            this.holder = target; // assign new holder
            this.holder.ticket = this; // set new holder's ticket to this
            this.setPosition(
                this.holder.x,
                this.holder.y + (this.holder instanceof TicketHolder ? 60 : 0)
            ); // snap to new holder
        } else {
            this.dragEnd(); // if holder is occupied, just end the drag event
        }
    }

    showDetails() {
        this.details.setAlpha(1);
        /* we'll add tweens later
        this.scene.tweens.add({
            targets: [this.details],
            alpha: { from: 0, to: 1 },
            duration: 300,
        });
        */
    }

    hideDetails() {
        this.details.setAlpha(0);
    }

    update() {
        this.details.setPosition(this.x, this.y + 100);
    }
}
