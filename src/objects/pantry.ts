import Phaser from "phaser";
import Ingredient from "./ingredient";

export default class Pantry extends Phaser.GameObjects.Zone {
    public inside: Phaser.GameObjects.Image;
    sprites: Phaser.GameObjects.Sprite[] = [];
    ingredients = [{ name: "carrot", x: 171, y: 375 }];

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 150, 270);
        this.setInteractive().on("pointerdown", this.click.bind(this));
        this.inside = scene.add.image(250, 450, "pantry-inside").setAlpha(0);
        scene.add.zone(x, y, 155, 200);
        scene.add.existing(this);

        this.ingredients.forEach((ingredient) => {
            const sprite = scene.add
                .sprite(ingredient.x, ingredient.y, ingredient.name)
                .setInteractive()
                .setVisible(false)
                .setScale(0.2, 0.2)
                .on("pointerover", () => {
                    sprite.setScale(0.3, 0.24);
                })
                .on("pointerout", () => {
                    sprite.setScale(0.2, 0.2);
                })
                .on("pointerdown", (pointer: { x: number; y: number }) => {
                    this.spawnIngredient(ingredient.name, pointer.x, pointer.y);
                });
            this.sprites.push(sprite);

            scene.input.setDraggable(sprite);
            sprite
                .on("drag", (dragX: number, dragY: number) => {
                    sprite.x = dragX;
                    sprite.y = dragY;
                })
                .on("dragend", () => {
                    this.resetIngredients();
                });
        });
    }

    spawnIngredient(ingrdName: string, x: number, y: number) {
        // const ingredient = new Ingredient(
        //     this.scene,
        //     x,
        //     y,
        //     ingrdName,
        //     ingrdName,

        // );
        // this.closePantry();
        return 0;
        // return ingredient;
    }

    click() {
        if (this.inside.alpha > 0) {
            this.closePantry();
        } else {
            this.openPantry();
        }
    }

    closePantry() {
        this.inside.setAlpha(0);
        this.sprites.forEach((sprite) => sprite.setVisible(false));
    }

    openPantry() {
        this.inside.setAlpha(1);
        this.sprites.forEach((sprite) => sprite.setVisible(true));
    }
    resetIngredients() {
        this.sprites.forEach((sprite, index) => {
            sprite.x = this.ingredients[index].x;
            sprite.y = this.ingredients[index].y;
        });
    }
}
