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
        this.setInteractive().on("pointerdown", this.click.bind(this));
        this.inside = scene.add.image(250, 450, "fridge-inside").setAlpha(0);
        scene.add.zone(x, y, 155, 200);
        scene.add.existing(this);

        // Instantiate each ingredient as an Ingredient object
        this.ingredients.forEach((ingredient) => {
            const ingredientSprite = new Ingredient(
                scene,
                ingredient.x,
                ingredient.y,
                ingredient.name,
<<<<<<< HEAD
                this,
                null
=======
                ingredient.name // Assuming the image is named the same as the ingredient
>>>>>>> parent of 3913df7 (fixed fridge)
            );
            ingredientSprite.setVisible(false); // Initially invisible
            this.ingredientSprites.push(ingredientSprite);
            this.scene.input.setDraggable(ingredientSprite);
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
        this.ingredientSprites.forEach((sprite) => sprite.setVisible(true));
    }

    closeFridge() {
        this.inside.setAlpha(0);
        this.ingredientSprites.forEach((sprite) => sprite.setVisible(true));
    }
}
