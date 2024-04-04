import Phaser from "phaser";


export default class Fridge extends Phaser.GameObjects.Zone {
    
    public inside: Phaser.GameObjects.Sprite;
    tmpInside: Phaser.GameObjects.Rectangle;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
    ) {
        super(scene, x, y, 190, 320);
        this.setInteractive()
        .on("pointerdown", this.click)
        this.tmpInside = scene.add.rectangle(250, 445, 250, 400, 0xc0c0c0).setAlpha(0);
        scene.add.rectangle(x, y, 155, 200, 0xff0000).setAlpha(0.4);
        scene.add.existing(this);
    }

    click(pointer: Phaser.Input.Pointer){
        console.log("hey michyyyy") 
        //this.tmpInside.setAlpha(1);
        this.tmpInside.alpha > 0 ? this.tmpInside.setAlpha(0) : this.tmpInside.setAlpha(1);
    }
}
