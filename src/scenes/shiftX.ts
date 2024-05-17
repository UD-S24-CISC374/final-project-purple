import Phaser from "phaser";
import Ticket from "../objects/ticket";
import ShiftGUI from "./shiftGUI";
import Kitchen from "../objects/kitchen";
import Dish from "../objects/dish";
import ShiftTimer from "../objects/shiftTimer";
import ShowButton from "../objects/showButton";
import ShiftController from "../util/shiftController";

// COMPETITIVE
export default class ShiftX extends Phaser.Scene {
    tickets: Ticket[];
    gui: ShiftGUI;
    nxtTicket: Ticket;
    bell: Phaser.GameObjects.Sprite;
    kitchen: Kitchen;
    timer: ShiftTimer;

    constructor() {
        super({ key: "ShiftX" });
    }

    init() {
        this.scene.launch("ShiftGUI", { shift: this.scene.key });
        this.gui = this.scene.get("ShiftGUI") as ShiftGUI;
    }

    create() {
        this.kitchen = new Kitchen(this);
        this.tickets = [];

        this.timer = new ShiftTimer(
            this,
            this.cameras.main.width - 15,
            15,
            ShiftController.LENGTH
        );

        this.bell = this.add
            .sprite(
                this.kitchen.service.x,
                this.kitchen.service.y - 120,
                "bell"
            )
            .setScale(4)
            .setInteractive({ cursor: "pointer" })
            .on(
                "pointerdown",
                () => {
                    this.bell.anims.play("ring-bell", true);
                    this.kitchen.submitDish(
                        this.compareDishToTicket,
                        this.compareTicketToAlgorithm,
                        this.tickets
                    );
                    console.log(this.tickets);
                },
                this
            );

        const objSprite = this.add
            .sprite(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                "comp-obj"
            )
            .setScale(0.5);

        new ShowButton(
            this,
            this.cameras.main.width - 210,
            200,
            "OBJECTIVE",
            objSprite
        );

        const notes = this.add.sprite(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "notes"
        );

        new ShowButton(this, this.cameras.main.width - 90, 200, "HELP", notes);
        this.initFirstTickets();
    }

    initFirstTickets() {
        let holderIndices = [
            ...Array(this.kitchen.ticketHolders.length).keys(),
        ];
        // Initialize first 3 tickets
        this.kitchen.ticketHolders.forEach((holder, idx) => {
            const i = Phaser.Math.Between(0, holderIndices.length - 1);
            const ranIdx = holderIndices[i];
            holderIndices.splice(i, 1);
            this.time.delayedCall(idx * 1000, () => {
                const tick = this.kitchen.generateRandomTicket(ranIdx);
                this.tickets.push(tick);
            });
        });
    }

    update(time: number) {
        this.timer.updateTimer(time, this.time.startTime);

        if (time - this.time.startTime > this.timer.shiftLength)
            this.kitchen.finishShift("Competitive");
    }

    compareDishToTicket(dish: Dish, ticket: Ticket) {
        const res =
            dish.ingredients.every((ingrd) =>
                ticket.requirements.has(`${ingrd.state} ${ingrd.name}`)
            ) && dish.ingredients.length === ticket.requirements.size;
        return res;
    }

    compareTicketToAlgorithm(ticket: Ticket, tickets: Ticket[]) {
        const nxtTicket = tickets.reduce(
            (first, curr): Ticket =>
                curr.arrivalTime < first.arrivalTime ? curr : first,
            tickets[0]
        );
        return [true, nxtTicket];
    }
}
