import Phaser from "phaser";
import Metrics from "../objects/metrics";

export default class MetricReport extends Phaser.Scene {
    report: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "MetricReport" });
    }

    create(sceneData: Metrics) {
        this.report = this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                `${sceneData.algo.toUpperCase()}\n
            Orders completed: ${sceneData.ticketsCompleted}\n
            Orders made correctly: ${sceneData.correctDishes}\n
            Orders scheduled correctly: ${sceneData.correctSchedules}\n

            Scheduling accuracy: ${
                parseFloat(
                    (
                        sceneData.correctSchedules / sceneData.ticketsCompleted
                    ).toFixed(3)
                ) * 100
            }%\n
            Average turnaround time: ${sceneData.avgTaT.toFixed(2)}s\n
            Average response time: ${sceneData.avgRT.toFixed(2)}s`,
                { color: "black" }
            )
            .setOrigin(0.5);
        this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 300,
                "CONTINUE",
                {
                    backgroundColor: "black",
                    padding: { top: 5, bottom: 5, left: 5, right: 5 },
                }
            )
            .setInteractive()
            .on("pointerdown", () => this.scene.start("CareerMenu"));
    }
}
