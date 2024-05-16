import Phaser from "phaser";
import Ticket from "../objects/ticket";
import ShiftGUI from "./shiftGUI";
import Kitchen from "../objects/kitchen";
import Dish from "../objects/dish";
import DialogBox from "../objects/dialogBox";
import { Dialog } from "../objects/dialogBox";
import CareerData from "../data/careerData";
import ShowButton from "../objects/showButton";

const DIALOG1: Dialog = {
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

const DIALOG2: Dialog = {
    0: {
        text: "To get started, you need to schedule a ticket. In any given shift, we'll have a lot of tickets, so choosing which to work on will directly impact how many we can get done in a night.",
        face: 0,
    },
};

const DIALOG3: Dialog = {
    0: {
        text: "To schedule a ticket, go ahead and drag it into the [current order] zone.",
        face: 0,
    },
};

const DIALOG4: Dialog = {
    0: {
        text: "Now you can see the ingredients necessary to complete the order!",
        face: 2,
    },
    1: {
        text: "You'll notice the sous chef provides some qualifiers before the name of each ingredient. These tell you how to prepare it.",
        face: 2,
    },
};

const DIALOG5: Dialog = {
    0: {
        text: "Here's a list of the stations and which qualifiers they apply to an ingredient.",
        face: 2,
    },
    1: {
        text: "Hopefully they're pretty intuitive, if not you can refer to them anytime by clicking [HELP].",
        face: 0,
    },
};

const DIALOG6: Dialog = {
    0: {
        text: "To make a dish we first need to grab our ingredients.",
        face: 2,
    },
};

const DIALOG7: Dialog = {
    0: {
        text: "Click on the fridge or pantry, depending on the ingredient.",
        face: 0,
    },
    1: {
        text: "Then simply drag out what you need.",
        face: 2,
    },
};

const DIALOG8: Dialog = {
    0: {
        text: "Time to cook chef!",
        face: 2,
    },
    1: {
        text: "Drag a plate up to the service table (beneath the bell).",
        face: 0,
    },
    2: {
        text: "This is where you will combine your final ingredients (you may only plate one dish at a time)!",
        face: 2,
    },
    3: {
        text: "Next, drag your raw ingredient onto a station, then drag the newly qualified ingredient onto the plate",
        face: 0,
    },
    4: {
        text: "Once you think the dish matches the ticket, ring the bell and a waiter will serve it.",
        face: 0,
    },
    5: {
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
    tutIdx: number;
    dialogBox: DialogBox;
    pointer: Phaser.GameObjects.Sprite;
    notes: Phaser.GameObjects.Sprite;
    oldCareerData: CareerData;

    constructor() {
        super({ key: "Tutorial" });
    }

    init() {
        this.scene.launch("ShiftGUI", { shift: this.scene.key });
        this.gui = this.scene.get("ShiftGUI") as ShiftGUI;
        this.oldCareerData = this.registry.get("career");
    }

    create() {
        this.events.on("shutdown", () => {
            localStorage.setItem("career", JSON.stringify(this.oldCareerData));
        });

        this.kitchen = new Kitchen(this);
        this.tickets = [];

        this.tickets.push(this.kitchen.generateRandomTicket(2));

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

        this.notes = this.add
            .sprite(
                this.cameras.main.centerX,
                this.cameras.main.centerY - 100,
                "notes"
            )
            .setOrigin(0.5)
            .setDepth(999)
            .setVisible(false);

        const notes = this.add.sprite(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "notes"
        );

        new ShowButton(this, this.cameras.main.width - 90, 200, "HELP", notes);

        this.tutIdx = 0;
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
                this.notes.setVisible(true);
                this.dialogBox.setDialog(DIALOG5);
                break;
            case 5:
                this.notes.setVisible(false);
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
