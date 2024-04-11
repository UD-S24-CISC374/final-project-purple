import Phaser from "phaser";
import Stove from "../objects/stations/stove";
import Prep from "../objects/stations/prep";
import Oven from "../objects/stations/oven";
import Sink from "../objects/stations/sink";
import Service from "../objects/stations/service";
import Plating from "../objects/plating";
import TicketHolder from "./ticketHolder";
import CurrentOrder from "./currentOrder";

// FOR HOLDING ALL STATIONS AS ONE KITCHEN OBJECT
export default class Kitchen {
    stoves: Stove[] = new Array<Stove>(2);
    ovens: Oven[] = new Array<Oven>(4);
    preps: Prep[] = new Array<Prep>(5);
    sinks: Sink[] = new Array<Sink>(2);
    service: Service;
    plating: Plating;

    ticketHolders: TicketHolder[] = [];
    currentOrder: CurrentOrder;

    constructor(scene: Phaser.Scene) {
        scene.add.image(
            scene.cameras.main.centerX,
            scene.cameras.main.centerY,
            "kitchen"
        );

        this.initHolders(scene);
        this.initStations(scene);
    }

    initHolders(scene: Phaser.Scene) {
        for (let i = 0; i < 3; i++) {
            this.ticketHolders.push(
                new TicketHolder(scene, 80 + 60 * i * 3, 75, 150, 320)
            );
        }
        this.currentOrder = new CurrentOrder(scene, 900, 110, 240, 240);
    }

    initStations(scene: Phaser.Scene) {
        // will probably abstract this to a kitchen object and make them public fields
        this.service = new Service(
            scene,
            scene.cameras.main.centerX + 16,
            190,
            200,
            100
        );
        this.plating = new Plating(
            scene,
            scene.cameras.main.centerX + 20,
            scene.cameras.main.centerY + 120,
            190,
            120
        );
        this.stoves[0] = new Stove(
            scene,
            scene.cameras.main.centerX + 204,
            scene.cameras.main.height - 30,
            100,
            120
        );
        this.stoves[1] = new Stove(
            scene,
            scene.cameras.main.width - 295,
            scene.cameras.main.height - 30,
            100,
            120
        );
        this.preps[0] = new Prep(
            scene,
            scene.cameras.main.centerX - 192,
            scene.cameras.main.centerY - 30,
            90,
            110
        );
        this.preps[1] = new Prep(
            scene,
            scene.cameras.main.centerX - 192,
            scene.cameras.main.centerY + 120,
            90,
            110
        );
        this.preps[2] = new Prep(
            scene,
            scene.cameras.main.centerX + 222,
            scene.cameras.main.centerY - 38,
            110,
            90
        );
        this.preps[3] = new Prep(
            scene,
            scene.cameras.main.centerX + 233,
            scene.cameras.main.centerY + 120,
            90,
            110
        );
        this.preps[4] = new Prep(
            scene,
            scene.cameras.main.centerX - 13,
            scene.cameras.main.centerY - 38,
            110,
            90
        );
        this.sinks[0] = new Sink(
            scene,
            scene.cameras.main.width - 45,
            scene.cameras.main.centerY - 40,
            90,
            140
        );
        this.sinks[1] = new Sink(
            scene,
            scene.cameras.main.width - 45,
            scene.cameras.main.height - 150,
            90,
            140
        );
        this.ovens[0] = new Oven(
            scene,
            175,
            scene.cameras.main.height - 35,
            110,
            75
        );
        this.ovens[1] = new Oven(
            scene,
            293,
            scene.cameras.main.height - 35,
            120,
            75
        );
        this.ovens[2] = new Oven(
            scene,
            418,
            scene.cameras.main.height - 35,
            120,
            75
        );
        this.ovens[3] = new Oven(
            scene,
            scene.cameras.main.centerX - 100,
            scene.cameras.main.height - 35,
            110,
            75
        );
    }
}
