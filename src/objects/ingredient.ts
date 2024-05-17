import Phaser from "phaser";
import Station from "./station";
import Service from "./stations/service";
import Trash from "./trash";
import Container from "./containers";
import Metrics from "./metrics";

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
    statusIcon: Phaser.GameObjects.Sprite;
    cost: number = 0;
    startX: number;
    startY: number;
    container: Container;
    isInContainer: boolean = true;
    costPopup: Phaser.GameObjects.Text;
    currMetrics: Metrics;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        name: string,
        container: Container,
        cost: number,
        currMetrics: Metrics
    ) {
        super(scene, x, y, name);
        this.startX = x;
        this.startY = y;
        this.container = container;
        this.setScale(0.2)
            .setDepth(2)
            .setInteractive({ draggable: true, cursor: "pointer" })
            .setName(name)
            .on("drag", this.drag)
            .on("dragstart", this.dragStart)
            .on("drop", this.drop)
            .on("dragenter", this.dragEnter)
            .on("dragleave", this.dragLeave)
            .on("dragend", this.dragEnd)
            .on("pointerover", () => {
                scene.tweens.add({
                    targets: [this],
                    scale: { from: 0.2, to: 0.3 },
                    duration: 100,
                });
            })
            .on("pointerout", () => {
                scene.tweens.add({
                    targets: [this],
                    scale: { from: 0.3, to: 0.2 },
                    duration: 100,
                });
            })
            .on("destroy", () => {
                this.statusIcon.destroy();
                this.costPopup.destroy();
            });

        this.cost = cost;
        this.currMetrics = currMetrics;

        this.statusIcon = scene.add
            .sprite(x, y, "sink-status")
            .setAlpha(0)
            .setDepth(this.depth + 1)
            .setOrigin(0.5, 1);

        this.costPopup = scene.add
            .text(x + 30, y - 40, `- $${cost.toFixed(2)}`, {
                color: "red",
                stroke: "black",
                strokeThickness: 3,
                fontSize: 28,
            })
            .setAlpha(0);

        scene.events.on("update", this.update, this);
        scene.add.existing(this);
    }

    dragStart() {
        if (this.isInContainer) {
            // make new ingredient
            const temp: Ingredient = new Ingredient(
                this.scene,
                this.startX,
                this.startY,
                this.name,
                this.container,
                this.cost,
                this.currMetrics
            );
            this.container.ingredients.push(temp);
            this.isInContainer = false;
            this.subtractCost();
        }
        this.setScale(0.3).setDepth(3);
    }

    dragEnter(ingrd: Ingredient, target: Station) {
        if (
            (target instanceof Service && target.dish) ||
            (target instanceof Station && !(target instanceof Service)) ||
            target instanceof Trash
        )
            this.setScale(0.4);
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
        this.setScale(0.2).setDepth(2);
        this.setInteractive();
    }

    drop(ingrd: Ingredient, target: Station | Service) {
        if (target instanceof Service) {
            if (target.dish) {
                target.dish.ingredients.push({ ...this });
                target.dish.play("fill-dish", true);
                this.destroy();
            }
        } else if (!target.occupied && target instanceof Station) {
            target.occupied = true;
            this.station = target;
            this.station.cook(this);
            this.setPosition(target.x, target.y);
        } else if (target instanceof Trash) {
            this.destroy();
        }
    }

    updateState(station: string) {
        this.state = stationState[station];
        this.statusIcon.setTexture(`${station}-status`).setAlpha(1);
    }

    updateTint(station: string) {
        switch (station) {
            case "sink":
                this.setTint(0x9cebff);
                break;
            case "stove":
                this.setTint(0xff6200);
                break;
            case "oven":
                this.setTint(0x4a1500);
                break;
            case "prep":
                this.setTint(0x6ffc7b);
                break;
            default:
                break;
        }
    }

    subtractCost() {
        this.currMetrics.shiftProfit -= this.cost;
        this.popupTweens();
    }

    popupTweens() {
        this.scene.add.tween({
            targets: [this.costPopup],
            alpha: { from: 0, to: 1 },
            duration: 200,
        });
        this.scene.add.tween({
            targets: [this.costPopup],
            y: { from: this.costPopup.y, to: this.costPopup.y - 100 },
            duration: 1500,
        });
        this.scene.add.tween({
            targets: [this.costPopup],
            alpha: { from: 1, to: 0 },
            delay: 1000,
            duration: 100,
        });
    }

    update() {
        this.statusIcon
            .setPosition(this.x - 25, this.y - 30)
            .setScale(this.scale * 9)
            .setDepth(this.depth + 1);
    }
}
