import Phaser from "phaser";

export default class Ingredient extends Phaser.GameObjects.Sprite {
    name: string;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        image: string,
        name: string
    ) {
        super(scene, x, y, image);
        this.name = name;
        this.setScale(0.2)
            .setDepth(2)
            .setInteractive({ draggable: true })
            .setName(name)
            .on("drag", this.drag)
            .on("dragstart", this.dragStart)
            .on("drop", this.drop)
            .on("dragenter", this.dragEnter)
            .on("dragleave", this.dragLeave)
            .on("dragend", this.dragEnd);
        scene.events.on("update", this.update, this);
        scene.add.existing(this);
    }

    dragStart() {
        this.setScale(0.3);
    }

    dragEnter(ingrd: Ingredient, target: Phaser.GameObjects.Zone) {
        if (target.name === "station") this.setScale(0.4);
    }

    dragLeave() {
        this.setScale(0.3);
    }

    drag(pointer: Phaser.Input.Pointer) {
        this.x = pointer.worldX;
        this.y = pointer.worldY;
    }

    dragEnd() {
        this.setScale(0.2);
    }

    drop(ingrd: Ingredient, target: Phaser.GameObjects.Zone) {
        if (target.name === "station") {
            this.setPosition(target.x, target.y);
        }
    }
}
