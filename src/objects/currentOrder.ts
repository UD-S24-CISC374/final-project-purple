import Phaser from "phaser";
import Ticket from "./ticket";

export default class CurrentOrder extends Phaser.GameObjects.Zone {
    public ticket: Ticket | null;
    title: Phaser.GameObjects.Text;
    recipeTitle: Phaser.GameObjects.Text;
    recipeContents: Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        super(scene, x, y, width, height);
        this.setDropZone();
        this.title = scene.add.text(x, y - 90, "ORDER").setOrigin(0.5);
        this.recipeTitle = scene.add.text(x + 100, y - 60, `RECIPE`);
        this.recipeContents = scene.add
            .text(x + 110, y - 40, "- CONTENT")
            .setAlpha(0);
        scene.add.existing(this);
    }

    showRecipe() {
        if (this.ticket) {
            this.title.setText(this.ticket.name);
            let contents = "";
            for (let req of this.ticket.requirements) {
                contents += `- ${req}\n`;
            }
            this.recipeContents.setText(contents).setAlpha(1);
        }
    }

    hideRecipe() {
        this.title.setText("ORDER");
        this.recipeContents.setAlpha(0);
    }
}
