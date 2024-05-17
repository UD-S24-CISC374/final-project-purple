import Phaser from "phaser";
import Ingredient from "./ingredient";

const GREEN = 0x67eb34;
const RED = 0xeb4334;
const NORMALIZED_VOLUME = 0.09;

export default abstract class Station extends Phaser.GameObjects.Zone {
    duration: number;
    occupied: boolean;
    timer: Phaser.GameObjects.Sprite;
    highlight: Phaser.GameObjects.Rectangle;
    namePopup: Phaser.GameObjects.Text;
    private stationMusic: Phaser.Sound.WebAudioSound | null = null;
    private volume: number;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        super(scene, x, y, width, height);
        this.volume = NORMALIZED_VOLUME; // Default volume level
        this.setDropZone()
            .on("pointerover", this.highlightStation)
            .on("pointerout", this.unhighlightStation);

        scene.add.existing(this);

        this.timer = scene.add
            .sprite(x, y - 30, "timer")
            .setScale(5)
            .setAlpha(0)
            .setDepth(4);

        // debug drop zone identifier
        this.highlight = scene.add
            .rectangle(x, y, width, height, GREEN)
            .setAlpha(0);

        this.namePopup = scene.add.text(x, y, "").setDepth(2).setOrigin(0.5);

        scene.events.on("shutdown", this.stopStationMusic, this);
    }

    cook(ingrd: Ingredient) {
        this.highlight.fillColor = RED;
        this.setTimer();
        ingrd.setScale(0.2).disableInteractive();

        this.stationMusic = this.scene.sound.add(this.name, {
            volume: this.volume, // Use the set volume level
        }) as Phaser.Sound.WebAudioSound;
        this.stationMusic.play();
        this.stationMusic.setVolume(this.volume);

        // each station provides its own time (might switch to ingredient wise)
        this.scene.time.delayedCall(this.duration, () => {
            ingrd.updateState(this.name); // set to new state
            ingrd.updateTint(this.name); // sets tint to reflect cooking status
            ingrd.setInteractive({ draggable: true, cursor: "pointer" });
            this.timer.setAlpha(0); // remove timer
            this.highlight.fillColor = GREEN;
            this.stopStationMusic();
        });
    }

    setTimer() {
        this.timer.setAlpha(1).anims.play(`${this.name}-timer`, true);
    }

    setOccupied(newStatus: boolean) {
        this.occupied = newStatus;
    }

    highlightStation() {
        this.namePopup.setText(this.name.toUpperCase());
        this.scene.add.tween({
            targets: [this.highlight],
            alpha: { from: 0, to: 0.3 },
            duration: 200,
        });
    }

    unhighlightStation() {
        this.namePopup.setText("");
        this.scene.add.tween({
            targets: [this.highlight],
            alpha: { from: 0.3, to: 0 },
            duration: 200,
        });
    }

    private stopStationMusic() {
        if (this.stationMusic && this.stationMusic.isPlaying) {
            this.stationMusic.stop();
            this.stationMusic = null;
        }
    }

    setVolume(volume: number) {
        this.volume = volume;
    }
}
