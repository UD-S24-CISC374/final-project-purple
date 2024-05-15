import Phaser from "phaser";
export default class Confetti {
    confettiPieces: Phaser.GameObjects.Rectangle[] = [];

    constructor(scene: Phaser.Scene, pieces: number) {
        this.confettiPieces = new Array(pieces);
        for (let i = 0; i < pieces; i++) {
            if (i < pieces / 2) {
                this.confettiPieces[i] = scene.add
                    .rectangle(
                        Phaser.Math.Between(
                            0,
                            scene.cameras.main.centerX - 300
                        ),
                        -100,
                        30,
                        50,
                        Phaser.Math.Between(0x000000, 0xffffff)
                    )
                    .setRotation(Phaser.Math.Between(0, 360));
                scene.add.tween({
                    targets: [this.confettiPieces[i]],
                    x: {
                        from: this.confettiPieces[i].x,
                        to:
                            this.confettiPieces[i].x +
                            Phaser.Math.Between(10, 20),
                    },
                    yoyo: true,
                    repeat: -1,
                });
                scene.add.tween({
                    targets: [this.confettiPieces[i]],
                    y: {
                        from: this.confettiPieces[i].y,
                        to:
                            scene.cameras.main.height +
                            this.confettiPieces[i].height,
                    },
                    duration: Phaser.Math.Between(2000, 4000),
                });
            } else {
                this.confettiPieces[i] = scene.add
                    .rectangle(
                        Phaser.Math.Between(
                            scene.cameras.main.centerX + 300,
                            scene.cameras.main.width
                        ),
                        -100,
                        30,
                        50,
                        Phaser.Math.Between(0x000000, 0xffffff)
                    )
                    .setRotation(Phaser.Math.Between(0, 360));
                scene.add.tween({
                    targets: [this.confettiPieces[i]],
                    x: {
                        from: this.confettiPieces[i].x,
                        to:
                            this.confettiPieces[i].x -
                            Phaser.Math.Between(10, 20),
                    },
                    yoyo: true,
                    repeat: -1,
                });

                scene.add.tween({
                    targets: [this.confettiPieces[i]],
                    y: {
                        from: this.confettiPieces[i].y,
                        to:
                            scene.cameras.main.height +
                            this.confettiPieces[i].height,
                    },
                    duration: Phaser.Math.Between(2000, 4000),
                });
            }
        }
    }
}
