import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        this.load.image("kitchen", "assets/img/kitchen.png");
        this.load.image("ticket", "assets/img/ticket.png");
        this.load.image("ticket-holder", "assets/img/ticket-holder.png");
    }

    create() {
        this.scene.start("MainMenu");
    }
}
