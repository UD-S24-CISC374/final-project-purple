import Phaser from "phaser";
import Ingredient from "./ingredient";

export default class Pantry extends Phaser.GameObjects.Zone {
    public inside: Phaser.GameObjects.Image;
    ingredientSprites: Ingredient[] = [];
    ingredients = [{ name: "carrot", x: 328, y: 380 }];

   /* constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 150, 270);
        this.setInteractive().on("pointerdown", this.click);
        this.inside = scene.add.image(250, 450, "pantry-inside").setAlpha(0);
        scene.add.zone(x, y, 155, 200);
        scene.add.existing(this);

        /*this.ingredients.forEach((ingredient) => {
            const ingredientSprite = new Ingredient(
                scene,
                ingredient.x,
                ingredient.y,
                ingredient.name,
                null, // No fridge in the context of Pantry
                this // 'this' correctly refers to the Pantry
            );
            ingredientSprite.setVisible(false);
            this.ingredientSprites.push(ingredientSprite);
        });
    }

    spawnIngredient(ingrdName: string, x: number, y: number) {
        const ingredient = new Ingredient(
            this.scene,
            x,
            y,
            ingrdName,
            ingrdName
        );
        this.closePantry();
        return ingredient;
    }

    click() {
        if (this.inside.alpha > 0) {
            this.closePantry();
        } else {
            this.openPantry();
        }
    }

    openPantry() {
        this.inside.setAlpha(1);
        this.ingredientSprites.forEach((sprite) => {
            if (sprite.isInPantry) sprite.setVisible(true);
        });
    }

    closePantry() {
        this.inside.setAlpha(0);
        this.ingredientSprites.forEach((sprite) => {
            if (sprite.isInPantry) sprite.setVisible(false);
        });
    }
 */   
}
