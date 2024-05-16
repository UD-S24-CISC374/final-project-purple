import Phaser from "phaser";
import Ticket from "../objects/ticket";
import ShiftGUI from "./shiftGUI";
import Kitchen from "../objects/kitchen";
import Dish from "../objects/dish";
import DialogBox from "../objects/dialogBox";
import ShiftTimer from "../objects/shiftTimer";
import ShowButton from "../objects/showButton";
import TicketHolder from "../objects/ticketHolder";

const LENGTH = 16000;
const QUANTUM = LENGTH / 1.5;

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
        text: "Round robin scheduling assigns tickets in a rotating order. Much like first come first serve however you have a limited amount of time to work on the ticket before it goes back to queue. Then you go to the next.",
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
            LENGTH
        );

        // Initialize first 3 tickets
        this.kitchen.ticketHolders.map((holder, idx) => {
            this.time.delayedCall(Phaser.Math.Between(3000, 10000), () => {
                const tick = this.kitchen.generateRandomTicket(idx);
                this.tickets.push(tick);
            });
        });

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

    update(time: number) {
        if (this.dialog && this.dialog.fin) {
            this.dialog.hide();
            this.dialog = null;
        }

        if (Math.floor(time / 1000) % Math.floor(QUANTUM / 1000) === 0) {
            console.log(
                `Quantum ${this.currentQuantum} started at ${this.quantumTimeStart}`
            );
            this.quantumTimeStart = time;
            this.currentQuantum++;

            // Return all tickets to their original holders
            this.tickets.forEach((ticket) => {
                console.log(`Returning ticket to original holder:`, ticket);
                ticket.holder.ticket = null; // Clear current holder
                ticket.holder = ticket.prevHolder; // Set holder to original holder
                ticket.holder.ticket = ticket; // Set original holder's ticket to this
                ticket.setPosition(
                    ticket.holder.x,
                    ticket.holder.y +
                        (ticket.holder instanceof TicketHolder ? 60 : 0)
                ); // Snap back to original holder
                console.error(
                    `Ticket holder or original holder is undefined:`,
                    ticket
                );
            });
        }

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
