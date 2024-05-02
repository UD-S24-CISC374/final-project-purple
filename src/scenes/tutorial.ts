import Phaser from "phaser";
import { CONFIG } from "../config";
import Ticket from "../objects/ticket";
import ShiftGUI from "./shiftGUI";
import Kitchen from "../objects/kitchen";
import Dish from "../objects/dish";
import DialogBox from "../objects/dialogBox";

const DIALOG1: Record<number, { text: string; face: number }> = {
    0: {
        text: "Welcome to Schedulsine soldier! Silicon valley's newest Michelin Star restaurant.",
        face: 2,
    },
    1: { text: "My name is The Manager, and I'll be managing you.", face: 2 },
    2: {
        text: "I run a tight ship! So don't think you can get any funny business by my line.",
        face: 1,
    },
    3: { text: "Anyways, let's see what you're made of.", face: 0 },
};

const DIALOG2: Record<number, { text: string; face: number }> = {
    0: {
        text: "To get started, you need to schedule a ticket. In any given shift, we'll have a lot of tickets, so choosing which to work on will directly impact how many we can get done in a night.",
        face: 0,
    },
};

const DIALOG3: Record<number, { text: string; face: number }> = {
    0: {
        text: "Luckily, we only have one waiting in the queue. Go ahead and drag it into the [current order] zone.",
        face: 0,
    },
};

const DIALOG4: Record<number, { text: string; face: number }> = {
    0: {
        text: "Now you can see the ingredients necessary to complete the order!",
        face: 2,
    },
    1: {
        text: "You'll notice the sous chef provides some qualifiers before the name of each ingredient. These tell you how to prepare it.",
        face: 2,
    },
};

const DIALOG5: Record<number, { text: string; face: number }> = {
    0: {
        text: "Here's a list of the stations and which qualifiers they apply to an ingredient.",
        face: 2,
    },
    1: {
        text: "Hopefully they're pretty intuitive, if not...",
        face: 0,
    },
    2: {
        text: "GET OUT OF MY KITCHEN!",
        face: 1,
    },
    3: {
        text: "Luckily most stations are labelled, so finding your way around shouldn't be an issue. Let's start making this dish, shall we?",
        face: 0,
    },
};

const DIALOG6: Record<number, { text: string; face: number }> = {
    0: {
        text: "First we need to grab our ingredients.",
        face: 2,
    },
};

const DIALOG7: Record<number, { text: string; face: number }> = {
    0: {
        text: "Click on the fridge or pantry, depending on the ingredient.",
        face: 0,
    },
    1: {
        text: "Then simply click on what you need.",
        face: 2,
    },
    2: {
        text: "Make sure to close the doors once you're done.",
        face: 0,
    },
};

const DIALOG8: Record<number, { text: string; face: number }> = {
    0: {
        text: "Time to cook chef!",
        face: 2,
    },
    1: {
        text: "It's best to setup your plating first. Click on the pile of plates above this dialog to spawn one.",
        face: 0,
    },
    2: {
        text: "Now drag it to the service table right beneath the serving bell.",
        face: 0,
    },
    3: {
        text: "This is where you will combine your final ingredients. Keep in mind you may only plate one dish at a time!",
        face: 2,
    },
    4: {
        text: "Now all that's left is to cook the ingredients. Simply drag what you grabbed onto a station, and place the newly qualified ingredient onto the service dish.",
        face: 0,
    },
    5: {
        text: "Once you think the dish matches the ticket, ring the bell and a waiter will serve it.",
        face: 0,
    },
    6: {
        text: "Good luck! And don't worry if you mess up (for now), we'll supply unlimited tickets until you get it right.",
        face: 2,
    },
};

// TUTORIAL
export default class Tutorial extends Phaser.Scene {
    tickets: Ticket[] = [];
    gui: ShiftGUI;
    nxtTicket: Ticket;
    bell: Phaser.GameObjects.Sprite;
    kitchen: Kitchen;
    tutIdx: number = 0;
    dialogBox: DialogBox;
    pointer: Phaser.GameObjects.Sprite;
    qualifiers: Phaser.GameObjects.Text; // going to convert to a cookbook/notebook feature which can be accessed anytime ingame

    constructor() {
        super({ key: "Tutorial" });
    }

    init() {
        this.scene.launch("ShiftGUI", { shift: this.scene.key });
        this.gui = this.scene.get("ShiftGUI") as ShiftGUI;
    }

    create() {
        const version = CONFIG.version;
        this.kitchen = new Kitchen(this);

        this.add
            .text(this.cameras.main.width - 15, 15, version, {
                color: "#000000",
                fontSize: "24px",
            })
            .setOrigin(1, 0);

        const tutTicket = this.kitchen.generateRandomTicket(2);
        this.tickets.push(tutTicket);

        this.dialogBox = new DialogBox(
            this,
            this.cameras.main.centerX - 20,
            this.cameras.main.height - 110
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
                },
                this
            );

        this.pointer = this.add
            .sprite(460, this.cameras.main.height, "pointer")
            .setScale(5)
            .setAlpha(0)
            .setDepth(999);

        this.qualifiers = this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                "OVEN -> BAKED\nPREP -> PREPPED\nSINK -> WASHED\nSTOVE -> COOKED\nNOTHING -> RAW",
                { fontSize: "2rem", backgroundColor: "black" }
            )
            .setOrigin(0.5)
            .setDepth(999)
            .setAlpha(0);

        this.updateState();
    }

    compareDishToTicket(dish: Dish, ticket: Ticket) {
        const res =
            dish.ingredients.every((ingrd) =>
                ticket.requirements.has(`${ingrd.state} ${ingrd.name}`)
            ) && dish.ingredients.length === ticket.requirements.size;
        return res;
    }

    // No scheduling algo in the tutorial
    compareTicketToAlgorithm(ticket: Ticket, tickets: Ticket[]) {
        const nxtTicket = tickets.reduce(
            (first, curr): Ticket =>
                curr.arrivalTime > first.arrivalTime ? curr : first,
            tickets[0]
        );
        return [true, nxtTicket];
    }

    moveNext() {
        this.tutIdx++;
        this.updateState();
    }

    updateState() {
        switch (this.tutIdx) {
            case 0:
                this.dialogBox.setDialog(DIALOG1);
                break;
            case 1:
                this.dialogBox.setDialog(DIALOG2);
                break;
            case 2:
                this.dialogBox.setDialog(DIALOG3);
                this.pointer.setAlpha(1);
                this.tweens.add({
                    targets: [this.pointer],
                    y: { from: 600, to: 200 },
                    duration: 700,
                });
                this.time.delayedCall(700, () => {
                    this.pointer.setFrame(1);
                    this.tweens.add({
                        targets: [this.pointer],
                        x: { from: this.pointer.x, to: 900 },
                        duration: 700,
                    });
                });
                break;
            case 3:
                this.pointer.setAlpha(0);
                this.dialogBox.setDialog(DIALOG4);
                break;
            case 4:
                this.qualifiers.setAlpha(1);
                this.dialogBox.setDialog(DIALOG5);
                break;
            case 5:
                this.qualifiers.setAlpha(0);
                this.dialogBox.setDialog(DIALOG6);
                // this can all be a method translateManager in DialogBox
                this.tweens.add({
                    targets: [this.dialogBox.manager],
                    x: { from: this.dialogBox.manager.x, to: 1100 },
                    duration: 300,
                });
                this.dialogBox.manager.setFlipX(false);
                break;
            case 6:
                this.pointer
                    .setY(this.cameras.main.centerY)
                    .setFrame(0)
                    .setAlpha(1);
                this.tweens.add({
                    targets: [this.pointer],
                    x: { from: this.pointer.x, to: this.kitchen.fridge.x + 30 },
                    duration: 700,
                });
                this.time.delayedCall(700, () => {
                    this.pointer.setFrame(1);
                });
                this.dialogBox.setDialog(DIALOG7);
                break;
            case 7:
                this.pointer.setAlpha(0);
                this.tweens.add({
                    targets: [this.dialogBox.manager],
                    x: {
                        from: this.dialogBox.manager.x,
                        to: this.dialogBox.x - 450,
                    },
                    duration: 300,
                });
                this.dialogBox.manager.setFlipX(true);
                this.dialogBox.setDialog(DIALOG8);
                break;
            case 8:
                this.dialogBox.hide();
                this.time.delayedCall(500, () => {
                    this.dialogBox.destroy();
                });
                break;
            default:
                break;
        }
    }

    update() {
        if (this.dialogBox.fin) this.moveNext();
    }
}
