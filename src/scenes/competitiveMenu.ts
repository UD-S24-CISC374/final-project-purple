import Phaser from "phaser";
import CompetitiveData from "../data/competitiveData";
import Title from "../objects/title";

export default class CompetitiveMenu extends Phaser.Scene {
    competitiveData: CompetitiveData;

    constructor() {
        super({ key: "CompetitiveMenu" });
    }

    init() {
        // get comp data from local
        //      if can, then skip login
        //      else, show login
    }

    create() {
        new Title(this, "comp-title");
        const form = this.add.dom(500, 500).createFromCache("login");

        form.addListener("submit");
        form.on("submit", async (event: Event) => {
            event.preventDefault();
            const username = form.getChildByID("username") as HTMLInputElement;
            const password = form.getChildByID("password") as HTMLInputElement;

            const creds = { username, password };

            try {
                const res = await fetch("", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(creds),
                });

                if (!res.ok) console.log("res not ok");
            } catch (err) {
                console.error("Failed to login", err);
            }
            console.log(username.value + " " + password.value);
        });
    }
}
