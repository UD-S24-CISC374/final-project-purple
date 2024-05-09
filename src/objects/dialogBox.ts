import Phaser from "phaser";

export type Dialog = Record<number, { text: string; face: number }>;

export default class DialogBox extends Phaser.GameObjects.Sprite {
    private text: Phaser.GameObjects.Text;
    manager: Phaser.GameObjects.Sprite;
    private click: Phaser.GameObjects.Text;
    private dialog: Dialog;
    private dialogPtr: number = 0;
    fin: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "textbox");
        this.setScale(7)
            .setOrigin(0.5)
            .setDepth(2)
            .setInteractive({ cursor: "pointer" })
            .on("pointerdown", this.updateDialog);

        this.text = scene.add
            .text(x, y, "", {
                fontSize: "1.2rem",
                wordWrap: { width: 620, useAdvancedWrap: true },
            })
            .setOrigin(0.5)
            .setDepth(this.depth + 1);

        this.manager = scene.add
            .sprite(x - 450, y - 50, "manager", 0)
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

    setDialog(dialog: Dialog) {
        this.dialogPtr = 0;
        this.fin = false;
        this.dialog = dialog;
        this.text.setText(dialog[this.dialogPtr].text);
        this.setFace(dialog[this.dialogPtr].face);
    }

    updateDialog() {
        if (!(++this.dialogPtr in this.dialog)) {
            this.fin = true;
            return;
        }

        this.text.setText(this.dialog[this.dialogPtr].text);
        this.setFace(this.dialog[this.dialogPtr].face);
        this.fin = false;
    }

    hide() {
        this.scene.tweens.add({
            targets: [this],
            y: { from: this.y, to: this.scene.cameras.main.height + 500 },
            duration: 500,
        });
        this.scene.tweens.add({
            targets: [this.manager],
            y: {
                from: this.manager.y,
                to: this.scene.cameras.main.height + 500,
            },
            duration: 500,
        });
        this.scene.tweens.add({
            targets: [this.text],
            y: { from: this.text.y, to: this.scene.cameras.main.height + 500 },
            duration: 500,
        });
        this.scene.tweens.add({
            targets: [this.click],
            y: { from: this.click.y, to: this.scene.cameras.main.height + 500 },
            duration: 500,
        });
    }
}
