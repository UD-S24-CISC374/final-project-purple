import Phaser from "phaser";
import { CONFIG } from "../config";
import MenuButton from "../objects/menuButton";
import CareerData from "../data/careerData";

export default class CareerMenu extends Phaser.Scene {
    career: CareerData;

    constructor() {
        super({ key: "CareerMenu" });
    }

    init() {
        let career;
        if ((career = localStorage.getItem("career"))) {
            this.career = JSON.parse(career);
            console.log("retrieved career");
        } else {
            this.career = new CareerData(1);
            console.log("new career");
            localStorage.setItem("career", JSON.stringify(this.career));
        }
        this.registry.set("career", this.career);
    }

    create() {
        const version = CONFIG.version;
        this.add
            .text(this.cameras.main.width - 15, 15, version, {
                color: "#000000",
                fontSize: "24px",
            })
            .setOrigin(1, 0);

        this.add
            .text(this.cameras.main.centerX, 200, "CAREER", {
                color: "#54d6d2",
                fontSize: "100px",
            })
            .setOrigin(0.5, 1);

        this.add
            .text(
                200,
                640,
                `Day: ${
                    this.career.shift
                }\nShift: ${this.getShiftName()}\nProfit: ${
                    this.career.profit
                }`,
                {
                    color: "#54d6d2",
                    fontSize: "1.2rem",
                }
            )
            .setOrigin(0.5, 1);

        new MenuButton(this, 200, 400, "continue", `Shift${this.career.shift}`);

        this.add
            .text(
                this.cameras.main.centerX,
                640,
                `Day: 1\nShift: First Come First Served\nProfit: 0`,
                {
                    color: "#54d6d2",
                    fontSize: "1.2rem",
                }
            )
            .setOrigin(0.5, 1);

        new MenuButton(
            this,
            this.cameras.main.centerX,
            400,
            "new",
            "Shift1"
        ).on("pointerdown", () => {
            const career = new CareerData(1);
            localStorage.setItem("career", JSON.stringify(career));
            this.registry.set("career", career);
        });

        new MenuButton(
            this,
            this.cameras.main.width - 200,
            400,
            "exit",
            "MainMenu"
        );
    }

    getShiftName() {
        switch (this.career.shift) {
            case 1:
                return "First Come First Served";
            case 2:
                return "Shortest Job First";
            case 3:
                return "Round Robin";
            default:
                return "Something went horribly wrong...";
        }
    }
}
