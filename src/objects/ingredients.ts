import Phaser from "phaser";

export default class ingredient extends Phaser.GameObjects.Sprite {
}

constructor(
    image : string;
) 
{
    super(scene, x, y, "image");
    this.ingredient = ingredient;
    this.setScale(0.5)
        .setDepth(0)
        .setInteractive({ draggable: true })
        .setName("foodItem")
        .on("pointerover", this.showDetails)
        .on("pointerout", this.hideDetails)
        .on("drag", this.drag)
        .on("dragstart", this.dragStart)
        .on("dragend", this.dragEnd)
        .on("dragenter", this.dragEnter)
        .on("dragleave", this.dragLeave)
        .on("drop", this.drop);
    this.ingredients = ingredients.map((ingrd) => ingrd);
    this.length = this.ingredients.length;
    this.arrivalTime = Phaser.Math.FloatBetween(0, 30);
    this.details = scene.add
        .text(x, y + 120, `Arrived ${this.arrivalTime.toFixed(2)}s ago.`)
        .setAlpha(0)
        .setOrigin(0.5, 1);
    scene.events.on("update", this.update, this);
    scene.add.existing(this);
}