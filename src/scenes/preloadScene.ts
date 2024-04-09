import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        this.load.image("kitchen", "assets/img/kitchen.png");
        this.load.image("ticket", "assets/img/ticket.png");
        this.load.image("ticket-holder", "assets/img/ticket-holder.png");
        this.load.image("career", "assets/gui/career.png");
        this.load.image("exit", "assets/gui/exit.png");
        this.load.image("milk", "assets/img/milk.png");
        this.load.spritesheet("timer", "assets/img/timer.png", {
            frameWidth: 15,
            frameHeight: 15,
        });
        this.load.image("fridge-inside", "assets/img/fridge-inside.png");
        this.load.image("pantry-inside", "assets/img/pantry-inside.png");
        this.load.image("carrot.png", "assets/img/carrot.png");
        this.load.image("chicken.png", "assets/img/chicken.png");
        this.load.image("butter.png", "assets/img/butter.png");
    }

    create() {
        this.scene.start("MainMenu");
    }
}
