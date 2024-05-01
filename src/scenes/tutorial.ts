import Phaser from "phaser";
import { CONFIG } from "../config";
import Ticket from "../objects/ticket";
import ShiftGUI from "./shiftGUI";
import Kitchen from "../objects/kitchen";
import Dish from "../objects/dish";

// TUTORIAL
export default class Tutorial extends Phaser.Scene {
    tickets: Ticket[] = [];
    gui: ShiftGUI;
    nxtTicket: Ticket;
    bell: Phaser.GameObjects.Sprite;
    kitchen: Kitchen;
    tutIdx: number = 0;
    tutText: Phaser.GameObjects.Text;

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

        this.tutText = this.add.text(
            220,
            this.cameras.main.height - 150,
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et tortor cursus, rhoncus lorem ut, eleifend sem. Mauris sit amet ante pulvinar, posuere dui eu, iaculis purus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis nec tristique erat.",
            {
                fontSize: "1.2rem",
                wordWrap: { width: 620, useAdvancedWrap: true },
            }
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

    step1() {}

    moveNext() {
        this.tutIdx++;
    }
}
