import Phaser from "phaser";

export default class ShiftTimer extends Phaser.GameObjects.Text {
    shiftLength: number;
    private hourLength: number;
    private minuteLength: number;
    private hour: number = 5;
    private minutes: number = 0;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        shiftLength: number
    ) {
        super(scene, x, y, "5:00PM", { fontSize: "24px", color: "#00000" });
        this.setOrigin(1, 0).setDepth(999);
        this.shiftLength = shiftLength;
        this.hourLength = shiftLength / 4;
        this.minuteLength = this.hourLength / 60;
        scene.events.on("update", this.update, this);
        scene.add.existing(this);
    }

    updateTimer(currTime: number, startTime: number) {
        this.updateHours(currTime, startTime);
        this.updateMinutes(currTime, startTime);
        this.setText(
            `${this.hour}:${this.minutes >= 10 ? "" : "0"}${this.minutes}PM`
        );
    }

    updateHours(currTime: number, startTime: number) {
        const elapsedTime = currTime - startTime;
        if (elapsedTime > this.hourLength * 3) {
            this.hour = 8;
        } else if (elapsedTime > this.hourLength * 2) {
            this.hour = 7;
        } else if (elapsedTime > this.hourLength) {
            this.hour = 6;
        } else {
            this.hour = 5;
        }
    }

    updateMinutes(currTime: number, startTime: number) {
        this.minutes = Phaser.Math.FloorTo(
            ((currTime - startTime) / this.minuteLength) % 60,
            0
        );
    }
}
