import Phaser from "phaser";
import Ingredient from "./ingredient";

export default class Fridge extends Phaser.GameObjects.Zone {
    public inside: Phaser.GameObjects.Image;
    ingredientSprites: Ingredient[] = [];
    ingredients = [
        { name: "milk", x: 171, y: 375 },
        { name: "butter", x: 328, y: 380 },
        { name: "chicken", x: 250, y: 520 },
    ];

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 150, 270);
        this.setInteractive().on("pointerdown", this.click);
        this.inside = scene.add.image(250, 450, "fridge-inside").setAlpha(0);
        scene.add.zone(x, y, 155, 200);
        scene.add.existing(this);

        this.ingredients.forEach((ingredient) => {
            const ingredientSprite = new Ingredient(
                scene,
                ingredient.x,
                ingredient.y,
                ingredient.name,
                this,
                null
            );
            ingredientSprite.setVisible(false);
            this.ingredientSprites.push(ingredientSprite);
        });
    }

    click() {
        if (this.inside.alpha > 0) {
            this.closeFridge();
        } else {
            this.openFridge();
        }
    }

    openFridge() {
        this.inside.setAlpha(1);
        this.ingredientSprites.forEach((sprite) => {
            if (sprite.isInFridge) sprite.setVisible(true);
        });
    }

    closeFridge() {
        this.inside.setAlpha(0);
        this.ingredientSprites.forEach((sprite) => {
            if (sprite.isInFridge) sprite.setVisible(false);
        });
    }
}
