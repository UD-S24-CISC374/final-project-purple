import Phaser from "phaser";
import { CONFIG } from "../config";
import Ticket from "../objects/ticket";
import TicketHolder from "../objects/ticketHolder";
import CurrentOrder from "../objects/currentOrder";
import ShiftGUI from "./shiftGUI";
import Ingredient, { IngredientState } from "../objects/ingredient";
import Fridge from "../objects/fridge";
import Kitchen from "../objects/kitchen";

// FIRST COME FIRST SERVED
export default class Shift1 extends Phaser.Scene {
    tickets: Ticket[] = [];
    ticketHolders: TicketHolder[] = [];
    currentOrder: CurrentOrder;
    gui: ShiftGUI;
    nextTicket: Ticket;
    milk: Ingredient;
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

        for (let i = 0; i < 3; i++) {
            this.ticketHolders.push(
                new TicketHolder(this, 80 + 60 * i * 3, 75, 150, 320)
            );
        }

        // Initialize holders and first 3 tickets
        this.ticketHolders.map((holder) => {
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
        this.currentOrder = new CurrentOrder(this, 900, 110, 240, 240);

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
        if (this.currentOrder.ticket && this.kitchen.service.dish) {
            this.compareDishToTicket();
            this.compareTicketToAlgorithm();
            //give feedback

            // cleanup
            this.currentOrder.ticket.destroy();
            this.currentOrder.ticket = null;
            this.kitchen.service.dish.destroy();
            this.kitchen.service.dish = null;
        }
    }

    compareDishToTicket() {
        console.log(this.currentOrder.ticket?.requirements);
        console.log(
            this.kitchen.service.dish?.ingredients.map(
                (ingrd) => ingrd.name + ingrd.state
            )
        );
        const res =
            this.kitchen.service.dish?.ingredients.every((ingrd) =>
                this.currentOrder.ticket?.requirements.has(
                    ingrd.name + ingrd.state
                )
            ) &&
            this.kitchen.service.dish.ingredients.length ===
                this.currentOrder.ticket?.requirements.size;
        res ? console.log("RIGHT") : console.log("WRONG");
    }

    compareTicketToAlgorithm() {
        if (this.currentOrder.ticket === this.nextTicket) {
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

    update() {}
}
