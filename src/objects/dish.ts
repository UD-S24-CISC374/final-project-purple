import Phaser from "phaser";
import Service from "./stations/service";
import Ingredient from "./ingredient";

export default class Dish extends Phaser.GameObjects.Sprite {
    ingredients: Ingredient[] = [];
    display: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "dish");
        this.setInteractive({ draggable: true })
            .setScale(3)
            .on("drag", this.drag, this)
            .on("dragstart", this.dragStart, this)
            .on("dragend", this.dragEnd, this)
            .on("dragenter", this.dragEnter, this)
            .on("dragleave", this.dragLeave, this)
            .on("drop", this.drop, this)
            .on("pointerover", this.setDisplay, this)
            .on("pointerout", () => this.display.setAlpha(0), this);
        this.display = scene.add.text(x + 35, y - 20, "").setAlpha(0);
    }

    dragStart() {
        this.setScale(4);
    }

    dragEnd() {
        this.setScale(3);
    }

    drag(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
        this.setPosition(dragX, dragY);
    }

    dragEnter(dish: Dish, target: Service) {
        if (target instanceof Service) {
            this.setScale(5);
        }
    }

    dragLeave(dish: Dish, target: Service) {
        if (target instanceof Service) {
            target.dish = null;
            this.setScale(4);
        }
    }

    drop(dish: Dish, target: Service) {
        if (target instanceof Service && !target.dish) {
            this.setPosition(target.x, target.y);
            target.setDish(this);
        } else if (target.dish === this) {
            this.setPosition(target.x, target.y);
        } else {
            this.destroy();
        }
    }

    setDisplay() {
        const contents: string = this.ingredients.reduce(
            (str: string, ingrd: Ingredient) =>
                str + ingrd.state + " " + ingrd.name + "\n",
            ""
        );
        this.display
            .setText(contents)
            .setAlpha(1)
            .setPosition(this.x + 35, this.y - 30);
    }
}
