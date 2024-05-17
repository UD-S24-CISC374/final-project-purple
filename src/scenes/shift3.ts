import Phaser from "phaser";
import Ticket from "../objects/ticket";
import ShiftGUI from "./shiftGUI";
import Kitchen from "../objects/kitchen";
import Dish from "../objects/dish";
import DialogBox from "../objects/dialogBox";
import ShiftTimer from "../objects/shiftTimer";
import ShowButton from "../objects/showButton";
import TicketHolder from "../objects/ticketHolder";
import CurrentOrder from "../objects/currentOrder";
import ShiftController from "../util/shiftController";

const QUANTUM = 15000;

const DIALOG3: Record<number, { text: string; face: number }> = {
    0: {
        text: "Welcome to your third shift pigeon.",
        face: 2,
    },
    1: {
        text: "The boss wants us to schedule tickets using the Round Robin algorithm tonight.",
        face: 0,
    },
    2: {
        text: "I hope you are ready, because this shift will be a bit different!",
        face: 1,
    },
    3: {
        text: "Round Robin is much like first come first serve. You choose the first ticket, but you have a limited amount of time to complete it until it goes to the end of the queue. Then you proceed to the next ticket",
        face: 0,
    },
    4: {
        text: "Make sure to follow this algorithm as closely as possible. Restaurant closes at 9PM, good luck!",
        face: 2,
    },
};

export default class Shift3 extends Phaser.Scene {
    tickets: Ticket[];
    gui: ShiftGUI;
    nxtTicketIndex: number;
    bell: Phaser.GameObjects.Sprite;
    kitchen: Kitchen;
    dialog: DialogBox | null;
    timer: ShiftTimer;
    quantumTimeStart: number;
    currentQuantum: number;

    constructor() {
        super({ key: "Shift3" });
        this.nxtTicketIndex = 0;
        this.quantumTimeStart = 0;
        this.currentQuantum = 0;
        this.tickets = []; // Initialize the tickets array
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

        this.dialog = new DialogBox(
            this,
            this.cameras.main.centerX - 20,
            this.cameras.main.height - 110
        );
        this.dialog.setDialog(DIALOG3);

        const objSprite = this.add
            .sprite(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                "round-robin-obj"
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
        if (this.dialog && this.dialog.fin) {
            this.dialog.hide();
            this.initFirstTickets();
            this.dialog = null;
        }

        // Return all tickets to their original holders
        this.tickets.forEach((ticket) => {
            if (ticket.holder instanceof CurrentOrder && ticket.holder.ticket) {
                console.log("quant", QUANTUM);
                console.log(
                    "calculation",
                    time - ticket.holder.ticket.holderArrivalTime
                );
                if (
                    Math.abs(
                        time - ticket.holder.ticket.holderArrivalTime - QUANTUM
                    ) <= 100
                ) {
                    if (ticket.holder instanceof CurrentOrder) {
                        ticket.holder.hideRecipe();
                        ticket.holder.ticket.arrivalTime = time;
                    }
                    console.log(`Returning ticket to original holder:`, ticket);
                    ticket.holder.ticket = null; // Clear current holder
                    ticket.holder = ticket.prevHolder; // Set holder to original holder
                    ticket.holder.ticket = ticket; // Set original holder's ticket to this
                    ticket.setPosition(
                        ticket.holder.x,
                        ticket.holder.y +
                            (ticket.holder instanceof TicketHolder ? 60 : 0)
                    ); // Snap back to original holder
                }
            }
        });

        this.timer.updateTimer(time, this.time.startTime);

        if (time - this.time.startTime > this.timer.shiftLength) {
            this.kitchen.finishShift("round robin");
        }
    }

    compareDishToTicket(dish: Dish, ticket: Ticket) {
        const res =
            dish.ingredients.every((ingrd) =>
                ticket.requirements.has(`${ingrd.state} ${ingrd.name}`)
            ) && dish.ingredients.length === ticket.requirements.size;
        return res;
    }

    // Round robin scheduling
    compareTicketToAlgorithm(ticket: Ticket, tickets: Ticket[]) {
        const nxtTicket = tickets.reduce(
            (first, curr): Ticket =>
                curr.arrivalTime < first.arrivalTime ? curr : first,
            tickets[0]
        );
        return [ticket === nxtTicket, nxtTicket];
    }
}
