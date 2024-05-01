import Phaser from "phaser";

export default class DialogBox extends Phaser.GameObjects.Sprite {
    private text: Phaser.GameObjects.Text;
    private manager: Phaser.GameObjects.Sprite;
    private click: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "textbox");
        this.setScale(7).setOrigin(0.5).setDepth(2);
        this.text = scene.add
            .text(x, y, "", {
                fontSize: "1.2rem",
                wordWrap: { width: 620, useAdvancedWrap: true },
            })
            .setOrigin(0.5)
            .setDepth(this.depth + 1);
        this.manager = scene.add
            .sprite(x - 450, y - 50, "manager", 2)
            .setScale(6)
            .setDepth(this.depth + 1)
            .setFlipX(true);
        this.click = scene.add
            .text(x + 230, y + 60, "continue")
            .setDepth(this.depth + 1);

        scene.add.tween({
            targets: [this.click],
            alpha: { from: 0.2, to: 0.8 },
            yoyo: true,
            duration: 500,
            repeat: -1,
        });
        scene.add.existing(this);
    }

    setFace(frame: number) {
        this.manager.setFrame(frame);
    }

    setDialog(text: string) {
        this.text.setText(text);
    }
}
