import Phaser from "phaser";
import Ticket from "./ticket";

export default class CurrentOrder extends Phaser.GameObjects.Zone {
    public ticket: Ticket | null;
    recipeTitle: Phaser.GameObjects.Text;
    recipeContents: Phaser.GameObjects.Text;
    orderContainer: Phaser.GameObjects.Image;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        super(scene, x, y, width, height);
        this.setDropZone();
        this.recipeTitle = scene.add
            .text(x + 100, y - 60, "RECIPE")
            .setAlpha(0);
        this.recipeContents = scene.add
            .text(x + 110, y - 40, "- CONTENT")
            .setAlpha(0);
        this.orderContainer = scene.add.image(x, y, "order-box").setScale(0.5);
        scene.add.existing(this);
    }

    showRecipe() {
        if (this.ticket) {
            let contents = "";
            for (let req of this.ticket.requirements) {
                contents += `- ${req}\n`;
            }
            this.recipeContents.setText(contents).setAlpha(1);
            this.recipeTitle.setAlpha(1);
        }
    }

    hideRecipe() {
        this.recipeContents.setAlpha(0);
        this.recipeTitle.setAlpha(0);
    }
}
