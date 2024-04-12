import Phaser from "phaser";
import Stove from "../objects/stations/stove";
import Prep from "../objects/stations/prep";
import Oven from "../objects/stations/oven";
import Sink from "../objects/stations/sink";
import Service from "../objects/stations/service";
import Plating from "../objects/plating";
import TicketHolder from "./ticketHolder";
import CurrentOrder from "./currentOrder";
import Fridge from "../objects/fridge";
import Pantry from "../objects/pantry";
import Dish from "./dish";
import { IngredientState } from "./ingredient";
import Ticket from "./ticket";

// FOR HOLDING ALL STATIONS AS ONE KITCHEN OBJECT
export default class Kitchen extends Phaser.GameObjects.Image {
    stoves: Stove[] = new Array<Stove>(2);
    ovens: Oven[] = new Array<Oven>(4);
    preps: Prep[] = new Array<Prep>(5);
    sinks: Sink[] = new Array<Sink>(2);
    service: Service;
    plating: Plating;
    fridge: Fridge;
    pantry: Pantry;

    ticketHolders: TicketHolder[] = [];
    currentOrder: CurrentOrder;

    dishRes: Phaser.GameObjects.Text;
    scheduleRes: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        super(
            scene,
            scene.cameras.main.centerX,
            scene.cameras.main.centerY,
            "kitchen"
        );
        scene.add.existing(this);

        this.dishRes = scene.add
            .text(scene.cameras.main.centerX, scene.cameras.main.centerY, "")
            .setDepth(999)
            .setOrigin(0.5)
            .setAlpha(0);

        this.scheduleRes = scene.add
            .text(
                scene.cameras.main.centerX,
                scene.cameras.main.centerY + 50,
                ""
            )
            .setDepth(999)
            .setOrigin(0.5)
            .setAlpha(0);

        this.initHolders();
        this.initIngredientHolders();
        this.initStations();
    }

    submitDish(
        cmpFn1: (dish: Dish, ticket: Ticket) => boolean,
        cmpFn2: (ticket: Ticket, tickets: Ticket[]) => (boolean | Ticket)[],
        tickets: Ticket[]
    ) {
        if (this.service.dish && this.currentOrder.ticket) {
            const dishRes = cmpFn1(this.service.dish, this.currentOrder.ticket);
            const [scheduleRes, nxtTicket] = cmpFn2(
                this.currentOrder.ticket,
                tickets
            );
            //give feedback

            // cleanup
            const emptyHolderIdx = this.ticketHolders.findIndex(
                (th) => th.ticket === null
            );

            this.ticketHolders[emptyHolderIdx].ticket = tickets[
                emptyHolderIdx
            ] = new Ticket(
                this.scene,
                this.ticketHolders[emptyHolderIdx],
                "Buttered Carrots",
                new Set<string>([
                    `${IngredientState.PREPPED} carrot`,
                    `${IngredientState.RAW} butter`,
                ])
            );

            this.showResult(
                dishRes!, // if condition implies this will always exist
                scheduleRes as boolean,
                (nxtTicket as Ticket).name,
                (nxtTicket as Ticket).arrivalTime
            );

            this.currentOrder.hideRecipe();
            this.currentOrder.ticket.destroy();
            this.currentOrder.ticket = null;

            this.service.dish.destroy();
            this.service.dish = null;
        }
    }

    showResult(
        dishRes: boolean,
        scheduleRes: boolean,
        nextTicketName: string,
        nextTicketTime: number
    ) {
        dishRes
            ? this.dishRes
                  .setText(`Great ${this.currentOrder.ticket?.name} chef!`)
                  .setColor("green")
            : this.dishRes
                  .setText(
                      `You call that ${this.currentOrder.ticket?.name}? You donut!!!`
                  )
                  .setColor("red");
        scheduleRes
            ? this.scheduleRes
                  .setText(`You scheduled it correctly.`)
                  .setColor("green")
            : this.scheduleRes
                  .setText(
                      `Poorly scheduled, the right one was the ${nextTicketName}, which arrived ${nextTicketTime.toFixed(
                          2
                      )}s ago.`
                  )
                  .setColor("red");

        this.dishRes.setAlpha(1);
        this.scheduleRes.setAlpha(1);

        this.currentOrder.scene.time.delayedCall(3000, () => {
            this.dishRes.setAlpha(0);
            this.scheduleRes.setAlpha(0);
        });
    }

    initHolders() {
        for (let i = 0; i < 3; i++) {
            this.ticketHolders.push(
                new TicketHolder(this.scene, 80 + 60 * i * 3, 75, 150, 320)
            );
        }
        this.currentOrder = new CurrentOrder(this.scene, 900, 110, 240, 240);
    }

    initIngredientHolders() {
        this.fridge = new Fridge(
            this.scene,
            this.scene.cameras.main.x + 10,
            this.scene.cameras.main.height - 385
        );

        this.pantry = new Pantry(
            this.scene,
            this.scene.cameras.main.x + 10,
            this.scene.cameras.main.height - 130
        );
    }

    initStations() {
        this.service = new Service(
            this.scene,
            this.scene.cameras.main.centerX + 16,
            190,
            200,
            100
        );
        this.plating = new Plating(
            this.scene,
            this.scene.cameras.main.centerX + 20,
            this.scene.cameras.main.centerY + 120,
            190,
            120
        );
        this.stoves[0] = new Stove(
            this.scene,
            this.scene.cameras.main.centerX + 204,
            this.scene.cameras.main.height - 30,
            100,
            120
        );
        this.stoves[1] = new Stove(
            this.scene,
            this.scene.cameras.main.width - 295,
            this.scene.cameras.main.height - 30,
            100,
            120
        );
        this.preps[0] = new Prep(
            this.scene,
            this.scene.cameras.main.centerX - 192,
            this.scene.cameras.main.centerY - 30,
            90,
            110
        );
        this.preps[1] = new Prep(
            this.scene,
            this.scene.cameras.main.centerX - 192,
            this.scene.cameras.main.centerY + 120,
            90,
            110
        );
        this.preps[2] = new Prep(
            this.scene,
            this.scene.cameras.main.centerX + 222,
            this.scene.cameras.main.centerY - 38,
            110,
            90
        );
        this.preps[3] = new Prep(
            this.scene,
            this.scene.cameras.main.centerX + 233,
            this.scene.cameras.main.centerY + 120,
            90,
            110
        );
        this.preps[4] = new Prep(
            this.scene,
            this.scene.cameras.main.centerX - 13,
            this.scene.cameras.main.centerY - 38,
            110,
            90
        );
        this.sinks[0] = new Sink(
            this.scene,
            this.scene.cameras.main.width - 45,
            this.scene.cameras.main.centerY - 40,
            90,
            140
        );
        this.sinks[1] = new Sink(
            this.scene,
            this.scene.cameras.main.width - 45,
            this.scene.cameras.main.height - 150,
            90,
            140
        );
        this.ovens[0] = new Oven(
            this.scene,
            175,
            this.scene.cameras.main.height - 35,
            110,
            75
        );
        this.ovens[1] = new Oven(
            this.scene,
            293,
            this.scene.cameras.main.height - 35,
            120,
            75
        );
        this.ovens[2] = new Oven(
            this.scene,
            418,
            this.scene.cameras.main.height - 35,
            120,
            75
        );
        this.ovens[3] = new Oven(
            this.scene,
            this.scene.cameras.main.centerX - 100,
            this.scene.cameras.main.height - 35,
            110,
            75
        );
    }
}
