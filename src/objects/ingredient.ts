import Phaser from "phaser";
import Station from "./station";
import Service from "./stations/service";

export enum IngredientState {
    BAKED = "Baked",
    PREPPED = "Prepped",
    WASHED = "Washed",
    COOKED = "Cooked",
    RAW = "Raw",
}

export const INGREDIENTS = ["milk", "butter", "chicken", "carrot"];

const stationState: Record<string, IngredientState> = {
    oven: IngredientState.BAKED,
    prep: IngredientState.PREPPED,
    sink: IngredientState.WASHED,
    stove: IngredientState.COOKED,
};

export default class Ingredient extends Phaser.GameObjects.Sprite {
    station: Station | null;
    state: IngredientState = IngredientState.RAW;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        name: string,
        image: string
    ) {
        super(scene, x, y, image);
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

    dragEnter(ingrd: Ingredient, target: Station) {
        if (target instanceof Station) this.setScale(0.4);
    }

    dragLeave() {
        this.setScale(0.3);
        if (this.station) {
            this.station.occupied = false;
            this.station = null;
        }
    }

    drag(pointer: Phaser.Input.Pointer) {
        this.x = pointer.worldX;
        this.y = pointer.worldY;
    }

    dragEnd() {
        this.setScale(0.2);
    }

    drop(ingrd: Ingredient, target: Station | Service) {
        if (target instanceof Service) {
            target.dish?.ingredients.push({ ...this });
            target.dish?.play("fill-dish", true);
            this.station?.setOccupied(false);
            this.destroy();
        } else if (!target.occupied && target instanceof Station) {
            console.log(target);
            target.occupied = true;
            this.station = target;
            this.station.cook(this);
            this.setPosition(target.x, target.y);
        } else {
            this.dragEnd();
        }
    }

    updateState(station: string) {
        this.state = stationState[station];
    }
}
