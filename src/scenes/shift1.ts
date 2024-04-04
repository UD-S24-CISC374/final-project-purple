import Phaser from "phaser";
import { CONFIG } from "../config";
import Ticket from "../objects/ticket";
import TicketHolder from "../objects/ticketHolder";
import CurrentOrder from "../objects/currentOrder";
import ShiftGUI from "./shiftGUI";
import Stove from "../objects/stations/stove";
import Prep from "../objects/stations/prep";
import Oven from "../objects/stations/oven";
import Sink from "../objects/stations/sink";
import Service from "../objects/stations/service";
import Plating from "../objects/stations/plating";

// FIRST COME FIRST SERVED
export default class Shift1 extends Phaser.Scene {
    tickets: Ticket[] = [];
    ticketHolders: TicketHolder[] = [];
    currentOrder: CurrentOrder;
    gui: ShiftGUI;
    nextTicket: Ticket;
    stoves: Stove[] = new Array<Stove>(2);
    ovens: Oven[] = [];
    preps: Prep[] = new Array<Prep>(5);
    sinks: Sink[] = new Array<Sink>(2);
    service: Service;
    plating: Plating;

    constructor() {
        super({ key: "Shift1" });
    }

    init() {
        this.scene.launch("ShiftGUI", { shift: this.scene.key });
        this.gui = this.scene.get("ShiftGUI") as ShiftGUI;
    }

    create() {
        const version = CONFIG.version;
        this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "kitchen"
        );

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
        this.ticketHolders.map((holder) => {
            holder.ticket = new Ticket(this, holder.x, 134, [1, 2], holder);
            this.tickets.push(holder.ticket);
        });

        this.currentOrder = new CurrentOrder(this, 900, 110, 240, 240);
        this.initStations();
        this.setNextTicket();
    }

    initStations() {
        // will probably abstract this to a kitchen object and make them public fields
        this.service = new Service(
            this,
            this.cameras.main.centerX + 16,
            190,
            200,
            100
        );
        this.plating = new Plating(
            this,
            this.cameras.main.centerX + 20,
            this.cameras.main.centerY + 120,
            190,
            120
        );
        this.stoves[0] = new Stove(
            this,
            this.cameras.main.centerX + 204,
            this.cameras.main.height - 30,
            100,
            120
        );
        this.stoves[1] = new Stove(
            this,
            this.cameras.main.width - 295,
            this.cameras.main.height - 30,
            100,
            120
        );
        this.preps[0] = new Prep(
            this,
            this.cameras.main.centerX - 192,
            this.cameras.main.centerY - 30,
            90,
            110
        );
        this.preps[1] = new Prep(
            this,
            this.cameras.main.centerX - 192,
            this.cameras.main.centerY + 120,
            90,
            110
        );
        this.preps[2] = new Prep(
            this,
            this.cameras.main.centerX + 222,
            this.cameras.main.centerY - 38,
            110,
            90
        );
        this.preps[3] = new Prep(
            this,
            this.cameras.main.centerX + 233,
            this.cameras.main.centerY + 120,
            90,
            110
        );
        this.preps[4] = new Prep(
            this,
            this.cameras.main.centerX - 13,
            this.cameras.main.centerY - 38,
            110,
            90
        );
        this.sinks[0] = new Sink(
            this,
            this.cameras.main.width - 45,
            this.cameras.main.centerY - 40,
            90,
            140
        );
        this.sinks[1] = new Sink(
            this,
            this.cameras.main.width - 45,
            this.cameras.main.height - 150,
            90,
            140
        );
        this.ovens[0] = new Oven(
            this,
            175,
            this.cameras.main.height - 35,
            110,
            75
        );
        this.ovens[1] = new Oven(
            this,
            293,
            this.cameras.main.height - 35,
            120,
            75
        );
        this.ovens[2] = new Oven(
            this,
            418,
            this.cameras.main.height - 35,
            120,
            75
        );
        this.ovens[3] = new Oven(
            this,
            this.cameras.main.centerX - 100,
            this.cameras.main.height - 35,
            110,
            75
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

    update() {
        if (
            this.currentOrder.ticket &&
            this.currentOrder.ticket === this.nextTicket
        ) {
            console.log("RIGHT");
        } else if (this.currentOrder.ticket) {
            console.log("WRONG");
        }
    }
}
