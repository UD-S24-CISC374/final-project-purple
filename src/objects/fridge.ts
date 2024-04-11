import Phaser from "phaser";

export default class Fridge extends Phaser.GameObjects.Zone {
    public inside: Phaser.GameObjects.Sprite;
    tmpInside: Phaser.GameObjects.Rectangle;
    rects: Phaser.GameObjects.Rectangle[] =
        new Array<Phaser.GameObjects.Rectangle>(6);

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 190, 320);
        this.setInteractive().on("pointerdown", this.click);
        this.tmpInside = scene.add
            .rectangle(250, 445, 250, 400, 0xc0c0c0)
            .setAlpha(0);
        scene.add.rectangle(x, y, 155, 200, 0xff0000).setAlpha(0.4);
        scene.add.existing(this);
        for (let i = 0; i < 6; i++) {
            if (i < 3) {
                this.rects[i] = scene.add
                    .rectangle(i + 80 + i * 70, 500, 50, 50, 0xff545)
                    .setAlpha(0);
            } else {
                this.rects[i] = scene.add
                    .rectangle(i - 133 + i * 70, 600, 50, 50, 0xff545)
                    .setAlpha(0);
            }
        }
    }

    click() {
        //this.tmpInside.setAlpha(1);
        if (this.tmpInside.alpha > 0) {
            this.tmpInside.setAlpha(0);
            this.rects.map((rect) => rect.setAlpha(0));
        } else {
            this.tmpInside.setAlpha(1);
            this.rects.map((rect) => rect.setAlpha(1));
        }
    }
}
