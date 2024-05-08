import Phaser from "phaser";
import { CONFIG } from "../config";
import MenuButton from "../objects/menuButton";
import UserData from "../data/userData";

export default class CareerMenu extends Phaser.Scene {
    user: UserData;

    constructor() {
        super({ key: "CareerMenu" });
    }

    init() {
        let user;
        if ((user = localStorage.getItem("user"))) {
            this.user = JSON.parse(user);
            console.log("retrieved user");
        } else {
            this.user = new UserData(1);
            console.log("new user");
            localStorage.setItem("user", JSON.stringify(this.user));
        }
        this.registry.set("user", this.user);
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
                    this.user.shift
                }\nShift: ${this.getShiftName()}\nProfit: ${this.user.profit}`,
                {
                    color: "#54d6d2",
                    fontSize: "1.2rem",
                }
            )
            .setOrigin(0.5, 1);

        new MenuButton(this, 200, 400, "continue", `Shift${this.user.shift}`);

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
            const user = new UserData(1);
            localStorage.setItem("user", JSON.stringify(user));
            this.registry.set("user", user);
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
        switch (this.user.shift) {
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
