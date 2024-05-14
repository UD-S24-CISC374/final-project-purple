import Phaser from "phaser";
import Service from "./stations/service";
import Ingredient from "./ingredient";
import Trash from "./trash";

export default class Dish extends Phaser.GameObjects.Sprite {
    ingredients: Ingredient[] = [];
    display: Phaser.GameObjects.Text;
    isOnTable: boolean = true;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "dish");
        this.setInteractive({ draggable: true, cursor: "pointer" })
            .setScale(3)
            .on("drag", this.drag, this)
            .on("dragstart", this.dragStart, this)
            .on("dragend", this.dragEnd, this)
            .on("dragenter", this.dragEnter, this)
            .on("dragleave", this.dragLeave, this)
            .on("drop", this.drop, this)
            .on(
                "pointerover",
                () => {
                    this.setDisplay();
                    scene.tweens.add({
                        targets: [this],
                        scale: { from: 3, to: 4 },
                        duration: 100,
                    });
                },
                this
            )
            .on(
                "pointerout",
                () => {
                    this.display.setAlpha(0);
                    scene.tweens.add({
                        targets: [this],
                        scale: { from: 4, to: 3 },
                        duration: 100,
                    });
                },
                this
            )
            .on("destroy", () => {
                this.display.destroy();
            });
        //this.platingRef = plating;
        this.display = scene.add
            .text(x + 35, y - 30, "", {
                backgroundColor: "dodgerblue",
                padding: { top: 2 },
            })
            .setAlpha(0);

        scene.events.on("update", this.update, this);
        scene.add.existing(this);
    }

    dragStart() {
        this.setDepth(this.depth + 1);
        if (this.isOnTable) {
            new Dish(this.scene, this.x, this.y);
            this.isOnTable = false;
        }
        this.setScale(4);
    }

    dragEnd() {
        this.setDepth(this.depth - 1);
        this.setScale(3);
    }

    drag(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
        this.setPosition(dragX, dragY);
    }

    dragEnter(dish: Dish, target: Phaser.GameObjects.Zone) {
        if (target instanceof Service || target instanceof Trash) {
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
        } else if (target instanceof Trash) {
            this.destroy();
        }
    }

    setDisplay() {
        const len = this.ingredients.length;
        const contents: string = this.ingredients.reduce(
            (str: string, ingrd: Ingredient, i) =>
                str +
                ingrd.state +
                " " +
                ingrd.name +
                (i !== len - 1 ? "\n" : ""),
            ""
        );
        this.display.setText(contents).setAlpha(1);
    }

    getCost() {
        return this.ingredients.reduce((cost, ingrd) => ingrd.cost + cost, 0);
    }

    update() {
        this.display.setPosition(this.x + 35, this.y - 30);
    }
}
