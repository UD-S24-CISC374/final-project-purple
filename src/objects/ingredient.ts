import Phaser from "phaser";

export default class Ingredient extends Phaser.GameObjects.Sprite {
    name: string;

    constructor(scene: Phaser.Scene, x: number, y: number, image: string , name: string) 
    {
        
    super(scene, x, y, image);
    this.name = name;
        this.setScale(0.5)
        .setDepth(0)
        .setInteractive({ draggable: true })
        .setName(name)
        .on("drag", this.drag)
        .on("dragstart", this.dragStart)
        .on("drop", this.dragEnd);
    scene.events.on("update", this.update, this);
    scene.add.existing(this);
    }

    dragStart(pointer: Phaser.Input.Pointer) {
    }

     drag(pointer: Phaser.Input.Pointer) {
            this.x = pointer.worldX;
            this.y = pointer.worldY;
    }

    dragEnd(pointer: Phaser.Input.Pointer) {
    }


}
