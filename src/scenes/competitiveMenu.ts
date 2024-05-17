import Phaser from "phaser";
import CompetitiveData from "../data/competitiveData";
import Title from "../objects/title";
//import MetricMenuButton from "../objects/metricMenuButton";
import MenuButton from "../objects/menuButton";
import CareerData from "../data/careerData";
import MetricMenuButton from "../objects/metricMenuButton";

export default class CompetitiveMenu extends Phaser.Scene {
    competitiveData: CompetitiveData;
    form: Phaser.GameObjects.DOMElement;
    play: MenuButton;
    error: Phaser.GameObjects.Text;
    leaderboardNames: Phaser.GameObjects.Text;
    leaderboardProfits: Phaser.GameObjects.Text;
    logout: MetricMenuButton;

    constructor() {
        super({ key: "CompetitiveMenu" });
    }

    create() {
        new Title(this, "competitive");

        this.error = this.add
            .text(350, this.cameras.main.centerY - 100, "")
            .setOrigin(0.5)
            .setDepth(999)
            .setFontSize(24)
            .setAlpha(0);

        this.play = new MenuButton(
            this,
            200,
            400,
            "play-button",
            "ShiftX"
        ).setAlpha(0);

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

        if (this.registry.get("competitive")) {
            this.play.setAlpha(1);
            this.form.setAlpha(0);
        }

        new MetricMenuButton(
            this,
            70,
            this.cameras.main.height - 50,
            "EXIT",
            () => this.scene.start("MainMenu")
        );

        this.logout = new MetricMenuButton(this, 90, 50, "LOGOUT", () => {
            this.registry.remove("competitive");
            this.play.setAlpha(0);
            this.form.setAlpha(1);
            this.error.setAlpha(0);
            this.logout.setAlpha(0);
        }).setAlpha(this.registry.get("competitive") ? 1 : 0);
        /*new MetricMenuButton(this, 100, 500, "REFRESH", () => {
            this.updateLeaderBoard();
        });*/
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
        const res = await fetch(
            "https://schedulsine-api.onrender.com/users/leaderboard"
        );
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
            const res = await fetch(
                "https://schedulsine-api.onrender.com/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(creds),
                }
            );

            if (res.status === 200) {
                const data = await res.json();
                this.registry.set("competitive", data as CareerData);
                console.log(this.registry.get("competitive"));
                this.play.setAlpha(1);
                this.form.setAlpha(0);
                this.error.setAlpha(0);
                this.logout.setAlpha(1);
            } else {
                const msg = await res.text();
                this.error.setAlpha(1);
                this.error.setText(msg);
            }
        } catch (err) {
            console.error("Failed to login", err);
        }
    }
}
