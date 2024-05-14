import Phaser from "phaser";
import MenuButton from "../objects/menuButton";
import CareerData from "../data/careerData";

export default class CareerMenu extends Phaser.Scene {
    career: CareerData;

    constructor() {
        super({ key: "CareerMenu" });
    }

    create() {
        this.career = this.registry.get("career");

        this.add
            .text(this.cameras.main.centerX, 200, "CAREER", {
                color: "#54d6d2",
                fontSize: "100px",
            })
            .setOrigin(0.5, 1);

        this.add
            .text(
                200,
                370,
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

        new MenuButton(this, 200, 250, "continue", `Shift${this.career.shift}`);

        this.add
            .text(
                200,
                560,
                `Day: 1\nShift: First Come First Served\nProfit: 0`,
                {
                    color: "#54d6d2",
                    fontSize: "1.2rem",
                }
            )
            .setOrigin(0.5, 1);

        new MenuButton(this, 200, 450, "new", "Shift1").on(
            "pointerdown",
            () => {
                CareerData.init(this, true);
            }
        );

        new MenuButton(
            this,
            this.cameras.main.width - 200,
            400,
            "exit",
            "MainMenu"
        );

        const music = this.sound.add("menuAudio", { volume: 0.1 });
        music.play(), music.setVolume(0.1);

        this.events.on("shutdown", () => {
            music.stop();
        });
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
