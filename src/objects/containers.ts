import Phaser from "phaser";
import Ingredient from "./ingredient";

export default class Container extends Phaser.GameObjects.Zone {
    public inside: Phaser.GameObjects.Image;
    ingredients: Ingredient[];

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        image: string,
        ingredients: Ingredient[]
    ) {
        super(scene, x, y, 150, 270);
        this.ingredients = ingredients;
        this.setInteractive().on("pointerdown", this.click);
        this.inside = scene.add.image(250, 450, image).setAlpha(0);
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
        this.ingredients.forEach((ingredient) => {
            if (ingredient.isInContainer) ingredient.setVisible(true);
        });
    }

    closeContainer() {
        this.inside.setAlpha(0);
        this.ingredients.forEach((ingredient) => {
            if (ingredient.isInContainer) ingredient.setVisible(false);
        });
    }
    setIngredients(ingredients: Ingredient[]) {
        this.ingredients = ingredients;
        this.ingredients.forEach((ingredient) => ingredient.setVisible(false));
    }
}
