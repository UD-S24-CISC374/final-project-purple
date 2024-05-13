/*
import Phaser from "phaser";
import Ingredient from "./ingredient";

export default class Fridge extends Phaser.GameObjects.Zone {
    public inside: Phaser.GameObjects.Image;
    sprites: Phaser.GameObjects.Sprite[] = [];
    ingredients = [
        // Now a class property
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

        /*this.ingredients.forEach((ingredient) => {
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
        const ingredient = new Ingredient(
            this.scene,
            x,
            y,
            ingrdName,
            ingrdName
        );
        ingredient.setVisible(true); // Make the ingredient visible upon creation
        return ingredient;
    }

    click() {
        if (this.inside.alpha > 0) {
            this.closeFridge();
        } else {
            this.openFridge();
        }
    }

    closeFridge() {
        this.inside.setAlpha(0);
        this.sprites.forEach((sprite) => sprite.setVisible(false));
        this.sprites = [];
    }

    openFridge() {
        this.inside.setAlpha(1);
        this.ingredients.forEach((ingredient) => {
            const sprite = this.spawnIngredient(
                ingredient.name,
                ingredient.x,
                ingredient.y
            );
            sprite.setScale(0.2, 0.2);
            this.sprites.push(sprite);

            this.scene.input.setDraggable(sprite);
            sprite
                .on("drag", (dragX: number, dragY: number) => {
                    sprite.x = dragX;
                    sprite.y = dragY;
                })
                .on("dragend", () => {
                    sprite.x = ingredient.x;
                    sprite.y = ingredient.y;
                });
        });
    }
     resetIngredients() 
        this.sprites.forEach((sprite, index) => {
            sprite.x = this.ingredients[index].x;
            sprite.y = this.ingredients[index].y;
        });
        
}
*/