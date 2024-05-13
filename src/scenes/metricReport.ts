import Phaser from "phaser";
import Metrics from "../objects/metrics";
import CareerData from "../data/careerData";

export default class MetricReport extends Phaser.Scene {
    report: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "MetricReport" });
    }

    create(sceneData: Metrics) {
        const userShift = this.registry.get("career").shift;
        let accuracy =
            parseFloat(
                (
                    sceneData.correctSchedules / sceneData.ticketsCompleted
                ).toFixed(3)
            ) * 100;
        accuracy = isNaN(accuracy) ? 0 : accuracy;
        this.report = this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                `${sceneData.algo.toUpperCase()}\n
            Orders completed: ${sceneData.ticketsCompleted}\n
            Orders made correctly: ${sceneData.correctDishes}\n
            Orders scheduled correctly: ${sceneData.correctSchedules}\n

            Scheduling accuracy: ${accuracy}%\n
            Average turnaround time: ${sceneData.avgTaT.toFixed(2)}s\n
            Average response time: ${sceneData.avgRT.toFixed(2)}s`,
                { color: "black" }
            )
            .setOrigin(0.5);
        this.nextButton(userShift, accuracy >= 60);
    }

    nextButton(shift: number, passed: boolean) {
        this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 300,
                passed ? "CONTINUE" : "RETRY",
                {
                    backgroundColor: "black",
                    padding: { top: 5, bottom: 5, left: 5, right: 5 },
                }
            )
            .setInteractive()
            .on("pointerdown", () => {
                const nextShift = passed ? shift + 1 : shift;
                this.scene.start(`Shift${nextShift}`);
                CareerData.setShift(this, nextShift);
            });
    }
}
