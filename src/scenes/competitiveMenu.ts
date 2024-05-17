import Phaser from "phaser";
import CompetitiveData from "../data/competitiveData";
import Title from "../objects/title";
import MetricMenuButton from "../objects/metricMenuButton";

export default class CompetitiveMenu extends Phaser.Scene {
    competitiveData: CompetitiveData;
    form: Phaser.GameObjects.DOMElement;
    leaderboardNames: Phaser.GameObjects.Text;
    leaderboardProfits: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "CompetitiveMenu" });
    }

    init() {
        if (localStorage.getItem("competitive")) {
            this.form.setAlpha(0);
        }
        // get comp data from local
        //      if can, then skip login
        //      else, show login
    }

    create() {
        new Title(this, "competitive");
        this.form = this.add
            .dom(350, this.cameras.main.centerY + 100)
            .createFromCache("login");

        this.form.addListener("submit");
        this.form.on("submit", (event: Event) => {
            this.login(event);
        });

        this.leaderboardNames = this.add
            .text(800, this.cameras.main.centerY - 50, "loading...", {
                lineSpacing: 10,
                fontSize: 24,
            })
            .setOrigin(0.5, 0);

        this.leaderboardProfits = this.add
            .text(1100, this.cameras.main.centerY - 50, "", {
                align: "center",
                lineSpacing: 10,
                fontSize: 24,
            })
            .setOrigin(0.5, 0);

        this.add
            .text(
                (this.leaderboardNames.x + this.leaderboardProfits.x) / 2 - 20,
                this.cameras.main.centerY - 100,
                "LEADERBOARD",
                {
                    color: "#c7f0ff",
                    align: "center",
                    fontSize: 64,
                }
            )
            .setOrigin(0.5);

        this.updateLeaderBoard();

        new MetricMenuButton(this, 100, 500, "REFRESH", () => {
            this.updateLeaderBoard();
        });
    }

    updateLeaderBoard() {
        this.getLeaderboardUsers().then((users) => {
            this.leaderboardNames.setText(
                users.reduce(
                    (
                        ranking,
                        user: {
                            _id: string;
                            username: string;
                            best_profit: number;
                        },
                        idx
                    ) => ranking + `${idx + 1}. ${user.username}\n`,
                    "USER\n"
                )
            );
            this.leaderboardProfits.setText(
                users.reduce(
                    (
                        ranking,
                        user: {
                            _id: string;
                            username: string;
                            best_profit: number;
                        }
                    ) => ranking + `$${user.best_profit.toFixed(2)}\n`,
                    "PROFIT\n"
                )
            );
        });
    }

    async getLeaderboardUsers() {
        const res = await fetch("http://localhost:3000/users/leaderboard");
        const users: [] = await res.json();
        return users;
    }

    async login(event: Event) {
        event.preventDefault();
        const username = this.form.getChildByID("username") as HTMLInputElement;
        const password = this.form.getChildByID("password") as HTMLInputElement;

        const creds = {
            username: username.value,
            password: password.value,
        };

        try {
            const res = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(creds),
            });
            const data = await (res.status === 200 ? res.json() : res.text());
            console.log(data);
        } catch (err) {
            console.error("Failed to login", err);
        }
    }
}
