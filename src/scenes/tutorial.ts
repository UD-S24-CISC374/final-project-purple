import Phaser from "phaser";
import { CONFIG } from "../config";
import Ticket from "../objects/ticket";
import ShiftGUI from "./shiftGUI";
import Kitchen from "../objects/kitchen";
import Dish from "../objects/dish";
import DialogBox from "../objects/dialogBox";

// TUTORIAL
export default class Tutorial extends Phaser.Scene {
    tickets: Ticket[] = [];
    gui: ShiftGUI;
    nxtTicket: Ticket;
    bell: Phaser.GameObjects.Sprite;
    kitchen: Kitchen;
    tutIdx: number = 0;
    dialogBox: DialogBox;

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

        this.dialogBox.setDialog(
            "Welcome to Schedulsine soldier! Silicon valley's newest Michelin Star restaurant."
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

    update() {
        switch (this.tutIdx) {
            case 0:
                this.step1();
                break;
            default:
                break;
        }
    }

    // intro dialogue
    step1() {
        this.tickets[0].disableInteractive();
        this.kitchen.fridge.disableInteractive();
        this.kitchen.pantry.disableInteractive();
        this.kitchen.plating.disableInteractive();
    }

    moveNext() {
        this.tutIdx++;
    }
}
