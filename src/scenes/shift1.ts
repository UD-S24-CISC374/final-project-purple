import Phaser from "phaser";
import { CONFIG } from "../config";
import Ticket from "../objects/ticket";
import ShiftGUI from "./shiftGUI";
import { IngredientState } from "../objects/ingredient";
import Fridge from "../objects/fridge";
import Kitchen from "../objects/kitchen";

// FIRST COME FIRST SERVED
export default class Shift1 extends Phaser.Scene {
    tickets: Ticket[] = [];
    gui: ShiftGUI;
    nextTicket: Ticket;
    fridge: Fridge;
    bell: Phaser.GameObjects.Sprite;
    kitchen: Kitchen;

    constructor() {
        super({ key: "Shift1" });
    }

    init() {
        this.scene.launch("ShiftGUI", { shift: this.scene.key });
        this.gui = this.scene.get("ShiftGUI") as ShiftGUI;
    }

    create() {
        const version = CONFIG.version;

        this.add
            .text(this.cameras.main.width - 15, 15, version, {
                color: "#000000",
                fontSize: "24px",
            })
            .setOrigin(1, 0);

        // Initialize  first 3 tickets
        this.kitchen.ticketHolders.map((holder) => {
            holder.ticket = new Ticket(
                this,
                holder.x,
                134,
                holder,
                "Boiled Milk",
                new Set([`milk${IngredientState.COOKED}`])
            );
            this.tickets.push(holder.ticket);
        });

        this.kitchen = new Kitchen(this);
        this.setNextTicket();

        this.initIngredientHolders();

        this.bell = this.add
            .sprite(
                this.kitchen.service.x,
                this.kitchen.service.y - 120,
                "bell"
            )
            .setScale(4)
            .setInteractive()
            .on("pointerdown", this.submitDish, this);
    }

    submitDish() {
        this.bell.anims.play("ring-bell", true);
        if (this.kitchen.currentOrder.ticket && this.kitchen.service.dish) {
            this.compareDishToTicket();
            this.compareTicketToAlgorithm();
            //give feedback

            // cleanup
            this.kitchen.currentOrder.ticket.destroy();
            this.kitchen.currentOrder.ticket = null;
            this.kitchen.service.dish.destroy();
            this.kitchen.service.dish = null;
        }
    }

    compareDishToTicket() {
        console.log(this.kitchen.currentOrder.ticket?.requirements);
        console.log(
            this.kitchen.service.dish?.ingredients.map(
                (ingrd) => ingrd.name + ingrd.state
            )
        );
        const res =
            this.kitchen.service.dish?.ingredients.every((ingrd) =>
                this.kitchen.currentOrder.ticket?.requirements.has(
                    ingrd.name + ingrd.state
                )
            ) &&
            this.kitchen.service.dish.ingredients.length ===
                this.kitchen.currentOrder.ticket?.requirements.size;
        res ? console.log("RIGHT") : console.log("WRONG");
    }

    compareTicketToAlgorithm() {
        if (this.kitchen.currentOrder.ticket === this.nextTicket) {
            console.log("masterfully scheduled");
            this.setNextTicket();
        } else {
            console.log(
                `poorly scheduled, the right one was the ${
                    this.nextTicket.name
                }, which arrived ${this.nextTicket.arrivalTime.toFixed(2)}s ago`
            );
        }
    }

    initIngredientHolders() {
        this.fridge = new Fridge(
            this,
            this.cameras.main.x + 10,
            this.cameras.main.height - 385
        );
    }

    setNextTicket() {
        this.nextTicket = this.tickets.reduce(
            (first, curr): Ticket =>
                curr.arrivalTime < first.arrivalTime ? curr : first,
            this.tickets[0]
        );
        console.log(this.nextTicket);
    }
}
