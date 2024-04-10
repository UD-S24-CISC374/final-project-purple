import Phaser from "phaser";
import Service from "./stations/service";
import Ingredient from "./ingredient";

export default class Dish extends Phaser.GameObjects.Sprite {
    ingredients: Ingredient[] = [];

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "plate");
        this.setInteractive({ draggable: true })
            .setScale(0.3)
            .on("drag", this.drag, this)
            .on("dragstart", this.dragStart, this)
            .on("dragend", this.dragEnd, this)
            .on("dragenter", this.dragEnter, this)
            .on("dragleave", this.dragLeave, this)
            .on("drop", this.drop, this);

        scene.events.on("update", this.update, this);
    }

    dragStart() {
        this.setScale(0.4);
    }

    dragEnd() {
        this.setScale(0.3);
    }

    drag(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
        this.setPosition(dragX, dragY);
    }

    dragEnter(dish: Dish, target: Service) {
        if (target instanceof Service) {
            this.setScale(0.5);
        }
    }

    dragLeave(dish: Dish, target: Service) {
        if (target instanceof Service) {
            this.setScale(0.4);
        }
    }

    drop(dish: Dish, target: Service) {
        if (target instanceof Service && !target.dish) {
            this.setPosition(target.x, target.y);
        } else {
            this.destroy();
        }
    }
}
