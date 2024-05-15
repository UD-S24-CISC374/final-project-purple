import Phaser from "phaser";

export default class FinishWeek extends Phaser.Scene {
    confetti: Phaser.GameObjects.Rectangle[] = [];

    constructor() {
        super({ key: "FinishWeek" });
    }

    create() {
        this.confetti = new Array(20);
        for (let i = 0; i < this.confetti.length; i++) {
            if (i < this.confetti.length / 2) {
                this.confetti[i] = this.add.rectangle(
                    Phaser.Math.Between(0, this.cameras.main.centerX - 300),
                    -100,
                    30,
                    50,
                    Phaser.Math.Between(0x000000, 0xffffff)
                );
                this.add.tween({
                    targets: [this.confetti[i]],
                    x: {
                        from: this.confetti[i].x,
                        to: this.confetti[i].x + Phaser.Math.Between(10, 20),
                    },
                    yoyo: true,
                    repeat: -1,
                });
                this.add.tween({
                    targets: [this.confetti[i]],
                    y: {
                        from: this.confetti[i].y,
                        to: this.cameras.main.height + this.confetti[i].height,
                    },
                    duration: Phaser.Math.Between(2000, 4000),
                });
            } else {
                this.confetti[i] = this.add.rectangle(
                    Phaser.Math.Between(
                        this.cameras.main.centerX + 300,
                        this.cameras.main.width
                    ),
                    -100,
                    30,
                    50,
                    Phaser.Math.Between(0x000000, 0xffffff)
                );
                this.add.tween({
                    targets: [this.confetti[i]],
                    x: {
                        from: this.confetti[i].x,
                        to: this.confetti[i].x - Phaser.Math.Between(10, 20),
                    },
                    yoyo: true,
                    repeat: -1,
                });

                this.add.tween({
                    targets: [this.confetti[i]],
                    y: {
                        from: this.confetti[i].y,
                        to: this.cameras.main.height + this.confetti[i].height,
                    },
                    duration: Phaser.Math.Between(2000, 4000),
                });
            }
        }
    }
}
