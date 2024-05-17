import Phaser from "phaser";
import CompetitiveData from "../data/competitiveData";
import Title from "../objects/title";

export default class CompetitiveMenu extends Phaser.Scene {
    competitiveData: CompetitiveData;
    form: Phaser.GameObjects.DOMElement;

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
        this.form = this.add.dom(500, 500).createFromCache("login");

        this.form.addListener("submit");
        this.form.on("submit", (event: Event) => {
            this.login(event);
        });
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
            const data = await res.text();
            console.log(data);
        } catch (err) {
            console.error("Failed to login", err);
        }
    }
}
