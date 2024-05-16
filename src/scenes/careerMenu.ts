import Phaser from "phaser";
import MenuButton from "../objects/menuButton";
import CareerData from "../data/careerData";
import Title from "../objects/title";
import WeeklyReport from "../objects/weeklyReport";
import audioManager from "../objects/audioManager"; // Import the AudioManager
import ShiftController from "../util/shiftController";

export default class CareerMenu extends Phaser.Scene {
    career: CareerData;

    constructor() {
        super({ key: "CareerMenu" });
    }

    create() {
        this.career = this.registry.get("career");

        new Title(this, "career-title");

        this.add
            .text(
                200,
                380,
                `DAY: ${
                    this.career.shift
                }\nSHIFT: ${this.getShiftName()}\nTOTAL PROFIT: $${this.career.metricsList
                    .reduce((total, curr) => curr.shiftProfit + total, 0)
                    .toFixed(2)}`,
                {
                    color: "#000",
                    backgroundColor: "#f8f0ce",
                    padding: { left: 10, right: 10, top: 10, bottom: 10 },
                    fontSize: "1rem",
                }
            )
            .setOrigin(0.5, 1);

        new MenuButton(
            this,
            200,
            250,
            "continue",
            this.career.shift > ShiftController.LAST_SHIFT
                ? "FinishWeek"
                : `Shift${this.career.shift}`
        );

        this.add
            .text(
                200,
                580,
                `DAY: 1\nSHIFT: First Come First Served\nTOTAL PROFIT: $0.00`,
                {
                    color: "#000",
                    backgroundColor: "#f8f0ce",
                    padding: { left: 10, right: 10, top: 10, bottom: 10 },
                    fontSize: "1rem",
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

        new WeeklyReport(this, this.cameras.main.centerX, 450);

        audioManager.setVolume(0.1);

        this.events.on("shutdown", () => {
            audioManager.stopMusic();
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
                return "FINISHED";
        }
    }
}
