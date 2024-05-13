import Phaser from "phaser";
import Ingredient from "./ingredient";

export default class Container extends Phaser.GameObjects.Zone {
    public inside: Phaser.GameObjects.Image;
    ingredients: { name: string; x: number; y: number }[];
    ingredientSprites: Ingredient[] = [];

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        image: string,
        ingredients: { name: string; x: number; y: number }[]
    ) {
        super(scene, x, y, 150, 270);
        this.ingredients = ingredients;
        this.setInteractive().on("pointerdown", this.click);
        this.inside = scene.add.image(x, y, image).setAlpha(0);
        scene.add.zone(x, y, 155, 200);
        scene.add.existing(this);
    }

    click() {
        if (this.inside.alpha > 0) {
            this.closeContainer();
        } else {
            this.openContainer();
        }
    }

    openContainer() {
        this.inside.setAlpha(1);
        if (this.ingredientSprites.length === 0) {
            this.ingredients.forEach((ingredient) => {
                const ingredientSprite = new Ingredient(
                    this.scene,
                    ingredient.x,
                    ingredient.y,
                    ingredient.name,
                    this
                );
                this.ingredientSprites.push(ingredientSprite);
            });
        }
        this.ingredientSprites.forEach((sprite) => {
            sprite.setVisible(true);
        });
    }

    closeContainer() {
        this.inside.setAlpha(0);
        this.ingredientSprites.forEach((sprite) => {
            sprite.setVisible(false);
        });
    }
}
