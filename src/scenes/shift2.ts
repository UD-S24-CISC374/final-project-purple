import Phaser from "phaser";
import Ticket from "../objects/ticket";
import ShiftGUI from "./shiftGUI";
import Kitchen from "../objects/kitchen";
import Dish from "../objects/dish";
import DialogBox from "../objects/dialogBox";
import ShiftTimer from "../objects/shiftTimer";
import ShowButton from "../objects/showButton";
import ShiftController from "../util/shiftController";

const DIALOG1: Record<number, { text: string; face: number }> = {
    0: {
        text: "Tonight we're doing [SHORTEST JOB FISRT] scheduling...",
        face: 2,
    },
    1: {
        text: "This means that you should be scheduling tickets that with the shortest [RUNTIME] first.",
        face: 0,
    },
    2: {
        text: "A job's runtime is a measure of how long it will execute for",
        face: 0,
    },
    3: {
        text: "Break ties by arrival time!",
        face: 1,
    },
    4: {
        text: "Same deal; as long as you schedule at least 60% of your tickets this way before closing, we should be fine.",
        face: 2,
    },
};

// SHORTEST JOB FIRST
export default class Shift2 extends Phaser.Scene {
    tickets: Ticket[];
    gui: ShiftGUI;
    nxtTicket: Ticket;
    bell: Phaser.GameObjects.Sprite;
    kitchen: Kitchen;
    dialog: DialogBox | null;
    timer: ShiftTimer;

    constructor() {
        super({ key: "Shift2" });
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
        this.dialog.setDialog(DIALOG1);

        const objSprite = this.add
            .sprite(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                "sjf-obj"
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

        this.timer.updateTimer(time, this.time.startTime);

        if (time - this.time.startTime > this.timer.shiftLength)
            this.kitchen.finishShift("Shortest Job First");
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
                curr.runtime < first.runtime ? curr : first,
            tickets[0]
        );
        return [ticket === nxtTicket, nxtTicket];
    }
}
