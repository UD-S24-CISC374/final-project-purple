import Phaser from "phaser";
import { CONFIG } from "../config";
import MenuButton from "../objects/menuButton";
import UserData from "../data/userData";

export default class CareerMenu extends Phaser.Scene {
    usr: UserData;

    constructor() {
        super({ key: "CareerMenu" });
    }

    init() {
        let usr;
        if ((usr = localStorage.getItem("usr"))) {
            this.usr = JSON.parse(usr);
            console.log("retrieved usr");
        } else {
            this.usr = new UserData(1);
            console.log("new usr");
            localStorage.setItem("usr", JSON.stringify(this.usr));
        }
        this.registry.set("user", this.usr);
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
                    this.usr.shift
                }\nShift: ${this.getShiftName()}\nProfit: ${this.usr.profit}`,
                {
                    color: "#54d6d2",
                    fontSize: "1.2rem",
                }
            )
            .setOrigin(0.5, 1);

        new MenuButton(this, 200, 400, "continue", `Shift${this.usr.shift}`);

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
            localStorage.setItem("usr", JSON.stringify(new UserData(1)));
            this.registry.set("user", this.usr);
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
        switch (this.usr.shift) {
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
