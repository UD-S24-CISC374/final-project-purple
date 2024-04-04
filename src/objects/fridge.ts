import Phaser from "phaser";


export default class Fridge extends Phaser.GameObjects.Zone {
    
    public fridge: Phaser.GameObjects.Sprite;
    occ: Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
    ) {
        super(scene, x, y, 190, 320);
        this.setInteractive()
        .on("pointerdown", this.click)
        scene.add.rectangle(x, y, 190, 320, 0xff0000).setAlpha(0.4);
        scene.add.existing(this);
    }

    click(){

    }
}
