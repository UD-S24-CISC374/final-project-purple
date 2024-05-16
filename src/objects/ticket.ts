import Phaser from "phaser";
import CurrentOrder from "./currentOrder";
import TicketHolder from "./ticketHolder";

export default class Ticket extends Phaser.GameObjects.Sprite {
    details: Phaser.GameObjects.Text;
    holder: TicketHolder | CurrentOrder;
    prevHolder: TicketHolder | CurrentOrder;
    requirements: Set<string>;
    turnaroundTime: number = 0; // in sec
    arrivalTime: number = 0; // in sec
    elapsedTime: number = 0;
    responseTime: number = 0;
    cookTime: number = 0;

    constructor(
        scene: Phaser.Scene,
        holder: TicketHolder | CurrentOrder,
        requirements: Set<string>
    ) {
        super(scene, holder.x, 134, "ticket");
        this.setScale(0.5)
            .setDepth(2)
            .setInteractive({ draggable: true, cursor: "pointer" })
            // attach input events
            .on("pointerover", this.showDetails)
            .on("pointerout", this.hideDetails)
            .on("drag", this.drag)
            .on("dragstart", this.dragStart)
            .on("dragend", this.dragEnd)
            .on("dragenter", this.dragEnter)
            .on("dragleave", this.dragLeave)
            .on("drop", this.drop);

        this.arrivalTime = scene.time.now / 1000;

        this.holder = holder;
        this.prevHolder = holder;
        this.holder.ticket = this;

        this.details = scene.add
            .text(
                this.x,
                this.y + 200,
                `Arrived ${this.elapsedTime.toFixed(2)}s ago.`,
                { backgroundColor: "tomato", padding: { top: 5, left: 5 } }
            )
            .setAlpha(0)
            .setOrigin(0.5, 1)
            .setDepth(10);

        this.requirements = requirements;

        // requirements.forEach((ingrd) => {
        //     switch (ingrd.split(" ")[0]) {
        //         case :
        //             break;

        //         default:
        //             break;
        //     }

        // }
        // );

        this.scene.add.tween({
            targets: [this],
            y: { from: 0, to: this.y },
            scale: { from: 0.6, to: this.scale },
            duration: 400,
        });

        this.scene.time.delayedCall(400, () => this.setDepth(1));

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
        this.details.setAlpha(0);
        if (this.holder instanceof CurrentOrder) this.holder.hideRecipe();
    }

    dragEnd() {
        // when the user releases the ticket
        this.setScale(0.5).setDepth(1);
        // snap back to holder
        if (this.holder instanceof CurrentOrder) this.holder.showRecipe();

        this.setPosition(
            this.holder.x,
            this.holder.y + (this.holder instanceof TicketHolder ? 60 : 0)
        );
    }

    dragEnter(ticket: Ticket, target: TicketHolder | CurrentOrder) {
        // make ticket bigger when above a droppable area
        if (
            !target.ticket &&
            (target instanceof TicketHolder || target instanceof CurrentOrder)
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
            !target.ticket &&
            (target instanceof TicketHolder || target instanceof CurrentOrder)
        ) {
            this.prevHolder = this.holder;
            this.holder.ticket = null; // set prev holder to empty
            this.holder = target; // assign new holder
            this.holder.ticket = this; // set new holder's ticket to this
            this.setPosition(
                this.holder.x,
                this.holder.y + (this.holder instanceof TicketHolder ? 60 : 0)
            ); // snap to new holder
            if (target instanceof CurrentOrder) this.setResponseTime();
        } else {
            this.dragEnd(); // if holder is occupied, just end the drag event
        }
    }

    showDetails() {
        this.details.setText(`Arrived ${this.elapsedTime.toFixed(2)}s ago`);
        this.details.setAlpha(1);
        this.setDepth(3);
        this.scene.tweens.add({
            targets: [this],
            scale: { from: 0.5, to: 0.6 },
            duration: 100,
        });
    }

    hideDetails() {
        this.details.setAlpha(0);
        this.setDepth(1);
        this.scene.tweens.add({
            targets: [this],
            scale: { from: 0.6, to: 0.5 },
            duration: 100,
        });
    }

    setTurnaroundTime() {
        this.turnaroundTime = this.scene.time.now / 1000 - this.arrivalTime;
    }

    setResponseTime() {
        this.responseTime = this.scene.time.now / 1000 - this.arrivalTime;
    }

    update(time: number) {
        this.details.setPosition(this.x, this.y + 120);
        this.elapsedTime = time / 1000 - this.arrivalTime;
    }
}
