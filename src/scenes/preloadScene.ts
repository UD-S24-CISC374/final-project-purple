import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        this.load.image("kitchen", "assets/img/kitchen.png");
        this.load.image("ticket", "assets/img/ticket.png");
        this.load.image("ticket-holder", "assets/img/ticket-holder.png");

        this.load.image("milk", "assets/img/milk.png");
        this.load.spritesheet("timer", "assets/img/timer.png", {
            frameWidth: 15,
            frameHeight: 15,
        });
        this.load.image("fridge-inside", "assets/img/fridge-inside.png");
        this.load.image("pantry-inside", "assets/img/pantry-inside.png");
        this.load.image("carrot", "assets/img/carrot.png");
        this.load.image("chicken", "assets/img/chicken.png");
        this.load.image("butter", "assets/img/butter.png");
        this.load.image("plate", "assets/img/plate.png");
        this.load.spritesheet("bell", "assets/img/bell.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("dish", "assets/img/dish.png", {
            frameWidth: 15,
            frameHeight: 15,
        });
        this.load.spritesheet("manager", "assets/img/manager.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("pointer", "assets/img/pointer.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.image("right-dish", "assets/img/right-dish.png");
        this.load.image("wrong-dish", "assets/img/wrong-dish.png");
        this.load.image("order-box", "assets/img/order-box.png");
        this.load.image("oven-status", "assets/img/oven-status.png");
        this.load.image("stove-status", "assets/img/stove-status.png");
        this.load.image("prep-status", "assets/img/prep-status.png");
        this.load.image("sink-status", "assets/img/sink-status.png");
        this.load.image("trash", "assets/img/trash.png");
        this.load.image("fcfs-obj", "assets/img/fcfs-obj.png");
        this.load.image("notes", "assets/img/notes.png");
        this.load.image("paycheck", "assets/img/paycheck.png");
        this.load.image("mix-dish", "assets/img/mix-dish.png");
        this.load.image("sjf-obj", "assets/img/sjf-obj.png");
        this.load.image("round-robin-obj", "assets/img/round-robin-obj.png");
        this.load.image("comp-obj", "assets/img/comp-obj.png");

        //Audios

        this.load.audio("sink", ["assets/audios/sinkNoise.mp3"]);
        this.load.audio("prep", ["assets/audios/chopping.mp3"]);
        this.load.audio("menuAudio", ["assets/audios/menuAudio.mp3"]);
        this.load.audio("stove", ["assets/audios/cooking.mp3"]);
        this.load.audio("oven", ["assets/audios/baking.mp3"]);

        // GUI Stuff
        this.load.image("play-button", "assets/gui/play-button.png");
        this.load.image("career", "assets/gui/career.png");
        this.load.image("tutorial", "assets/gui/tutorial.png");
        this.load.image("exit", "assets/gui/exit.png");
        this.load.image("textbox", "assets/gui/textbox.png");
        this.load.image("continue", "assets/img/continue.png");
        this.load.image("new", "assets/img/new.png");
        this.load.image("title", "assets/gui/title.png");
        this.load.image("career-title", "assets/gui/career-title.png");
        this.load.image("tutorial-title", "assets/gui/tutorial-title.png");
        this.load.image("competitive", "assets/gui/comp-title.png");
        this.load.image("report", "assets/img/report.png");
        this.load.image("first come first served", "assets/gui/fcfs.png");
        this.load.image("shortest job first", "assets/gui/sjf.png");
        this.load.image("round robin", "assets/gui/rr.png");
        this.load.image("finish", "assets/gui/fin.png");
        this.load.image("comp", "assets/gui/comp.png");
        this.load.html("login", "assets/html/login.html");
    }

    create() {
        this.anims.create({
            key: "ring-bell",
            frames: "bell",
            duration: 300,
            repeat: 0,
        });
        this.anims.create({
            key: "fill-dish",
            frames: "dish",
            frameRate: 20,
            repeat: 0,
        });
        this.scene.start("MainMenu");
    }
}
