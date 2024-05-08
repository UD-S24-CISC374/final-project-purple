import Phaser from "phaser";
import Ticket from "../objects/ticket";
import ShiftGUI from "./shiftGUI";
import Kitchen from "../objects/kitchen";
import Dish from "../objects/dish";
import DialogBox from "../objects/dialogBox";

const DIALOG1: Record<number, { text: string; face: number }> = {
    0: {
        text: "Welcome to your first shift pigeon.",
        face: 2,
    },
    1: {
        text: "The boss wants us to schedule tickets [FIRST COME FIRST SERVE] tonight.",
        face: 0,
    },
    2: {
        text: "I hope you completed the tutorial, because this is the real thing!",
        face: 1,
    },
    3: {
        text: "Anyways, first come first serve is exactly what is sounds like. Complete the tickets that come in first.",
        face: 0,
    },
    4: {
        text: "It's so simple even a donut like you should be able to figure it out. Good luck!",
        face: 2,
    },
};

// FIRST COME FIRST SERVED
export default class Shift1 extends Phaser.Scene {
    tickets: Ticket[];
    gui: ShiftGUI;
    nxtTicket: Ticket;
    bell: Phaser.GameObjects.Sprite;
    kitchen: Kitchen;
    dialog: DialogBox | null;
    timer: Phaser.GameObjects.Text;
    length: number = 16000; // length of the shift

    constructor() {
        super({ key: "Shift1" });
    }

    init() {
        this.scene.launch("ShiftGUI", { shift: this.scene.key });
        this.gui = this.scene.get("ShiftGUI") as ShiftGUI;
    }

    create() {
        this.kitchen = new Kitchen(this);
        this.tickets = [];
        this.timer = this.add
            .text(this.cameras.main.width - 15, 15, "", {
                color: "#000000",
                fontSize: "24px",
            })
            .setOrigin(1, 0);

        // Initialize  first 3 tickets
        this.kitchen.ticketHolders.map((holder, idx) => {
            this.time.delayedCall(Phaser.Math.Between(3000, 10000), () => {
                holder.ticket = this.kitchen.generateRandomTicket(idx);
                this.tickets.push(holder.ticket);
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
        this.dialog.setDialog(DIALOG1);
    }

    update(time: number) {
        if (this.dialog && this.dialog.fin) {
            this.dialog.hide();
            this.dialog = null;
        }

        this.timer.setText(
            ((this.length - (time - this.time.startTime)) / 1000).toFixed(0)
        );
        if (time - this.time.startTime > this.length)
            // 2.5 minutes
            this.kitchen.finishShift("first come first served");
    }

    compareDishToTicket(dish: Dish, ticket: Ticket) {
        const res =
            dish.ingredients.every((ingrd) =>
                ticket.requirements.has(`${ingrd.state} ${ingrd.name}`)
            ) && dish.ingredients.length === ticket.requirements.size;
        return res;
    }

    // First come first served
    compareTicketToAlgorithm(ticket: Ticket, tickets: Ticket[]) {
        const nxtTicket = tickets.reduce(
            (first, curr): Ticket =>
                curr.arrivalTime < first.arrivalTime ? curr : first,
            tickets[0]
        );
        return [ticket === nxtTicket, nxtTicket];
    }
}
