import Phaser from "phaser";
import Ticket from "../objects/ticket";
import ShiftGUI from "./shiftGUI";
import Kitchen from "../objects/kitchen";
import Dish from "../objects/dish";
import DialogBox from "../objects/dialogBox";
import ShiftTimer from "../objects/shiftTimer";
import ShowButton from "../objects/showButton";

const LENGTH = 60000;

const DIALOG3: Record<number, { text: string; face: number }> = {
    0: {
        text: "Welcome to your third shift pigeon.",
        face: 2,
    },
    1: {
        text: "The boss wants us to schedule tickets using the round robin algorithm tonight.",
        face: 0,
    },
    2: {
        text: "I hope you are ready, because this shift will be a bit different!",
        face: 1,
    },
    3: {
        text: "Round robin scheduling assigns tickets in a rotating order. Each ticket gets a turn regardless of its arrival time.",
        face: 0,
    },
    4: {
        text: "Make sure to follow this algorithm as closely as possible. Restaurant closes at 9PM, good luck!",
        face: 2,
    },
};

interface IQueue<T> {
    enqueue(ticket: T): void;
    dequeue(): T | undefined;
    size(): number;
}

class TicketQueue<T> implements IQueue<T> {
    private tickets: T[] = [];
    constructor(private capacity: number = Infinity) {}

    enqueue(ticket: T): void {
        if (this.size() === this.capacity) {
            throw Error("Queue is full.\n");
        }
        this.tickets.push(ticket);
    }
    dequeue(): T | undefined {
        return this.tickets.shift();
    }
    size(): number {
        return this.tickets.length;
    }
    removeTicket(predicate: (ticket: T) => boolean): T | undefined {
        const index = this.tickets.findIndex(predicate);
        if (index > -1) {
            return this.tickets.splice(index, 1)[0];
        }
        return undefined;
    }
}

const ticketQueue = new TicketQueue<Ticket>();

// ROUND ROBIN
export default class Shift3 extends Phaser.Scene {
    tickets: Ticket[];
    gui: ShiftGUI;
    nxtTicketIndex: number;
    bell: Phaser.GameObjects.Sprite;
    kitchen: Kitchen;
    dialog: DialogBox | null;
    timer: ShiftTimer;

    constructor() {
        super({ key: "Shift3" });
        this.nxtTicketIndex = 0;
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
                ticketQueue.enqueue(tick);
                console.log(ticketQueue.size());
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

        this.timer.updateTimer(time, this.time.startTime);

        if (time - this.time.startTime > this.timer.shiftLength)
            this.kitchen.finishShift("round robin");
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
        const num_ticets = tickets.length;
        console.log("void", num_ticets);
        console.log("Function call: ", ticketQueue.size());
        const nextTicket: Ticket | undefined = ticketQueue.removeTicket(
            (x) => x === ticket
        );
        console.log(nextTicket != null);
        return [ticket === nextTicket, nextTicket];
    }
}
