import Phaser from "phaser";
import Stove from "../objects/stations/stove";
import Prep from "../objects/stations/prep";
import Oven from "../objects/stations/oven";
import Sink from "../objects/stations/sink";
import Service from "../objects/stations/service";
import Plating from "../objects/plating";
import TicketHolder from "./ticketHolder";
import CurrentOrder from "./currentOrder";
import Dish from "./dish";
import Ingredient, { INGREDIENTS, IngredientState } from "./ingredient";
import Ticket from "./ticket";
import Trash from "./trash";
import Metrics from "./metrics";
import Container from "./containers";
import Time from "../util/time";

// FOR HOLDING ALL STATIONS AS ONE KITCHEN OBJECT
export default class Kitchen extends Phaser.GameObjects.Image {
    stoves: Stove[] = new Array<Stove>(2);
    ovens: Oven[] = new Array<Oven>(4);
    preps: Prep[] = new Array<Prep>(5);
    sinks: Sink[] = new Array<Sink>(2);
    service: Service;
    plating: Plating;
    trash: Trash;
    metrics: Metrics;
    fridge: Container;
    pantry: Container;

    ticketHolders: TicketHolder[] = [];
    currentOrder: CurrentOrder;

    resImg: Phaser.GameObjects.Image;
    dishRes: Phaser.GameObjects.Text;
    scheduleRes: Phaser.GameObjects.Text;
    profitTracker: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        super(
            scene,
            scene.cameras.main.centerX,
            scene.cameras.main.centerY,
            "kitchen"
        );
        scene.add.existing(this);

        this.dishRes = scene.add
            .text(
                scene.cameras.main.centerX,
                scene.cameras.main.centerY + 330,
                "Right Dish",
                { backgroundColor: "black" }
            )
            .setDepth(999)
            .setOrigin(0.5)
            .setAlpha(0)
            .setScale(2);

        this.scheduleRes = scene.add
            .text(
                scene.cameras.main.centerX,
                scene.cameras.main.centerY + 280,
                "Right Schedule",
                { backgroundColor: "black" }
            )
            .setDepth(999)
            .setOrigin(0.5)
            .setAlpha(0)
            .setScale(2);

        this.resImg = scene.add
            .image(
                scene.cameras.main.centerX + 25,
                scene.cameras.main.centerY,
                "wrong-dish"
            )
            .setAlpha(0)
            .setDepth(999)
            .setInteractive()
            .on("pointerdown", () => {
                this.resImg.setAlpha(0);
                this.dishRes.setAlpha(0);
                this.scheduleRes.setAlpha(0);
            });

        this.metrics = new Metrics();
        this.initHolders();
        this.initIngredientHolders();
        this.initStations();
        this.trash = new Trash(scene, scene.cameras.main.width - 210, 280);
        this.profitTracker = scene.add
            .text(1000, 15, `Profit: $${this.metrics.shiftProfit.toFixed(2)}`, {
                color: "white",
            })
            .setOrigin(0);
    }

    submitDish(
        cmpFn1: (dish: Dish, ticket: Ticket) => boolean,
        cmpFn2: (
            ticket: Ticket,
            tickets: Ticket[]
        ) => (boolean | Ticket | undefined)[],
        tickets: Ticket[]
    ) {
        if (this.service.dish && this.currentOrder.ticket) {
            const currTicket = this.currentOrder.ticket;

            const dishRes = cmpFn1(this.service.dish, currTicket);
            const [scheduleRes, nxtTicket] = cmpFn2(currTicket, tickets);

            // cleanup
            const emptyHolderIdx = this.ticketHolders.findIndex(
                (th) => th.ticket === null
            );

            const tickIdx = tickets.findIndex(
                (tick) => tick.arrivalTime === currTicket.arrivalTime
            );

            tickets.splice(tickIdx, 1);

            this.scene.time.delayedCall(Phaser.Math.Between(800, 2300), () => {
                const newTick = this.generateRandomTicket(emptyHolderIdx);
                this.ticketHolders[emptyHolderIdx].ticket = newTick;
                tickets.push(newTick);
            });

            this.showResult(
                dishRes,
                scheduleRes as boolean,
                nxtTicket as Ticket
            );

            this.updateMetrics(scheduleRes as boolean, dishRes, currTicket);
            this.updateProfit(
                this.service.dish,
                scheduleRes as boolean,
                dishRes
            );
            this.cleanOrder(currTicket, this.service.dish);
        }
    }

    finishShift(algoName: string) {
        this.metrics.algo = algoName;
        this.scene.scene.stop("ShiftGUI");
        this.scene.scene.start("MetricReport", this.metrics);
    }

    updateMetrics(scheduleRes: boolean, dishRes: boolean, ticket: Ticket) {
        ticket.setTurnaroundTime();

        this.metrics.ticketsCompleted++;
        this.metrics.correctSchedules += scheduleRes ? 1 : 0;
        this.metrics.correctDishes += dishRes ? 1 : 0;

        // compute moving averages
        this.metrics.updateAvgerages(ticket);
    }

    updateProfit(dish: Dish, scheduleRes: boolean, dishRes: boolean) {
        let profit = dish.getCost() + (dish.ingredients.length > 2 ? 20 : 10);
        profit += scheduleRes ? profit * 0.2 : 0;
        if (dishRes) this.metrics.shiftProfit += profit;

        this.profitTracker
            .setText(`Profit: $${this.metrics.shiftProfit.toFixed(2)}`)
            .setColor(this.metrics.shiftProfit < 0 ? "red" : "green");
    }

    cleanOrder(ticket: Ticket, dish: Dish) {
        this.currentOrder.hideRecipe();
        ticket.details.destroy();
        ticket.destroy();
        this.currentOrder.ticket = null;

        dish.display.setAlpha(0);
        dish.display.destroy();
        dish.destroy();
        this.service.dish = null;
    }

    generateRandomTicket(idx: number) {
        const numIngrds = Phaser.Math.Between(1, 5);
        const ingredients = new Array<string>(numIngrds);

        for (let i = 0; i < numIngrds; i++) {
            let state = "";

            switch (Phaser.Math.Between(0, 4)) {
                case 0:
                    state = IngredientState.BAKED;
                    break;
                case 1:
                    state = IngredientState.COOKED;
                    break;
                case 2:
                    state = IngredientState.PREPPED;
                    break;
                case 3:
                    state = IngredientState.RAW;
                    break;
                case 4:
                    state = IngredientState.WASHED;
                    break;
            }

            ingredients[i] = `${state} ${
                INGREDIENTS[Phaser.Math.Between(0, INGREDIENTS.length - 1)]
            }`;
        }

        return new Ticket(
            this.scene,
            this.ticketHolders[idx],
            new Set<string>(ingredients)
        );
    }

    showResult(dishRes: boolean, scheduleRes: boolean, nextTicket: Ticket) {
        let tex = "";
        if (dishRes && scheduleRes) {
            tex = "right-dish";
        } else if (dishRes || scheduleRes) {
            tex = "mix-dish";
        } else {
            tex = "wrong-dish";
        }

        this.resImg.setTexture(tex);

        dishRes
            ? this.dishRes.setText(`Correct Ingredients`).setColor("green")
            : this.dishRes.setText(`Wrong Ingredients`).setColor("red");
        scheduleRes
            ? this.scheduleRes.setText(`Correctly Scheduled`).setColor("green")
            : this.scheduleRes
                  .setText(
                      `The right one arrived ${Time.toSec(
                          nextTicket.elapsedTime
                      )}s ago with a ${Time.toSec(
                          nextTicket.runtime
                      )}s runtime!`
                  )
                  .setColor("red");

        this.scene.tweens.add({
            targets: [this.dishRes],
            alpha: { from: 0, to: 1 },
            scale: { from: 0, to: 2 },
            duration: 200,
        });

        this.scene.tweens.add({
            targets: [this.scheduleRes],
            alpha: { from: 0, to: 1 },
            scale: { from: 0, to: 2 },
            duration: 200,
        });

        this.scene.tweens.add({
            targets: [this.resImg],
            alpha: { from: 0, to: 1 },
            scale: { from: 0, to: 5 },
            duration: 200,
        });

        this.scene.tweens.add({
            targets: [this.dishRes],
            scale: { from: 2, to: 2.3 },
            duration: 700,
            yoyo: true,
            repeat: -1,
        });

        this.scene.tweens.add({
            targets: [this.scheduleRes],
            scale: { from: 2, to: 2.3 },
            duration: 700,
            yoyo: true,
            repeat: -1,
        });

        this.scene.tweens.add({
            targets: [this.resImg],
            scale: { from: 5, to: 5.3 },
            duration: 700,
            yoyo: true,
            repeat: -1,
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
        this.fridge = new Container(
            this.scene,
            this.scene.cameras.main.x + 10,
            this.scene.cameras.main.height - 385,
            "fridge-inside",
            []
        );
        this.fridge.setIngredients([
            new Ingredient(
                this.scene,
                171,
                375,
                "milk",
                this.fridge,
                2,
                this.metrics
            ),
            new Ingredient(
                this.scene,
                328,
                380,
                "butter",
                this.fridge,
                1.5,
                this.metrics
            ),
            new Ingredient(
                this.scene,
                250,
                520,
                "chicken",
                this.fridge,
                4,
                this.metrics
            ),
        ]);

        this.pantry = new Container(
            this.scene,
            this.scene.cameras.main.x + 10,
            this.scene.cameras.main.height - 130,
            "pantry-inside",
            []
        );
        this.pantry.setIngredients([
            new Ingredient(
                this.scene,
                171,
                375,
                "carrot",
                this.pantry,
                1,
                this.metrics
            ),
        ]);
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
        this.ovens.forEach((oven) => {
            oven.setVolume(2); // Set volume for ovens
        });

        this.stoves.forEach((stove) => {
            stove.setVolume(0.08); // Set volume for stoves
        });

        this.preps.forEach((prep) => {
            prep.setVolume(0.3); // Set volume for prep
        });

        this.sinks.forEach((sink) => {
            sink.setVolume(0.08); // Set volume for sink
        });
    }
}
