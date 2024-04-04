import Phaser from "phaser";

export default class Ingredient extends Phaser.GameObjects.Sprite {
    name: string;

    constructor(scene: Phaser.Scene, x: number, y: number, image: Phaser.GameObjects.Sprite, name: string) 
    {
        
    super(scene, x, y, "imageKey");
    this.name = name;
        this.setScale(0.5)
        .setDepth(0)
        .setInteractive({ draggable: true })
        .setName(name)
        .on("pointerdown", this.dragStart, this) // Substituted for drag start
        .on("pointermove", this.drag, this) // Substituted for dragging
        .on("pointerup", this.dragEnd, this) // Substituted for drag end
        .on("drag", this.drag)
        .on("dragstart", this.dragStart)
        .on("drop", this.drop);
    scene.events.on("update", this.update, this);
    scene.add.existing(this);
    }

    dragStart(pointer: Phaser.Input.Pointer) {
    }

    private drag(pointer: Phaser.Input.Pointer) {
        if (this.getData('isDragging')) {
            this.x = pointer.worldX;
            this.y = pointer.worldY;
        }
    }

    dragEnd(pointer: Phaser.Input.Pointer) {
        this.setData('isDragging', false);
    }

}
