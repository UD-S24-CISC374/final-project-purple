import Phaser from "phaser";
import Ingredient from "./ingredient";

export default class StorageContainer extends Phaser.GameObjects.Zone {
    public inside: Phaser.GameObjects.Image;
    ingredientSprites: Ingredient[] = [];
    ingredients = [];

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        imageKey: string
    ) {
        super(scene, x, y, width, height);
        this.setInteractive().on("pointerdown", this.click);
        this.inside = scene.add
            .image(x + width / 2, y + height / 2, imageKey)
            .setAlpha(0);
        scene.add.existing(this);
    }

    click() {
        if (this.inside.alpha > 0) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.inside.setAlpha(1);
        this.ingredientSprites.forEach((sprite) => {
            if (sprite.isInFridge) sprite.setVisible(true);
        });
    }

    close() {
        this.inside.setAlpha(0);
        this.ingredientSprites.forEach((sprite) => {
            if (sprite.isInFridge) sprite.setVisible(false);
        });
    }

    addIngredient(ingredientData: { x: number; y: number; name: string }) {
        const ingredientSprite = new Ingredient(
            this.scene,
            ingredientData.x,
            ingredientData.y,
            ingredientData.name,
            this
        );
        ingredientSprite.setVisible(false);
        this.ingredientSprites.push(ingredientSprite);
    }
}
