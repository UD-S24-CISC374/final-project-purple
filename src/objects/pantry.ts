import Phaser from "phaser";
import Ingredient from "./ingredient";

export default class Pantry extends Phaser.GameObjects.Zone {
    public inside: Phaser.GameObjects.Image;
    sprites: Phaser.GameObjects.Sprite[] = new Array<Phaser.GameObjects.Sprite>(
        6
    );

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 150, 270);
        this.setInteractive().on("pointerdown", this.click);
        this.inside = scene.add.image(250, 450, "pantry-inside").setAlpha(0);
        scene.add.zone(x, y, 155, 200);
        scene.add.existing(this);
        this.sprites[0] = scene.add
            .sprite(160, 380, "carrot")
            .setInteractive()
            .setVisible(false)
            .setScale(0.2, 0.2)
            .on("pointerdown", () => {
                this.spawnIngredeint("carrot");
            });
    }

    spawnIngredeint(ingrdName: string) {
        new Ingredient(
            this.scene,
            this.scene.cameras.main.width - 200,
            this.scene.cameras.main.centerY,
            ingrdName,
            ingrdName
        );
    }

    click() {
        if (this.inside.alpha > 0) {
            this.inside.setAlpha(0);
            this.sprites.map((sprite) => sprite.setVisible(false));
        } else {
            this.inside.setAlpha(1);
            this.sprites.map((sprite) => sprite.setVisible(true));
        }
    }
}
