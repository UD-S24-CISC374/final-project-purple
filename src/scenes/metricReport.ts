import Phaser from "phaser";

export default class MetricReport extends Phaser.Scene {
    report: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "MetricReport" });
    }

    create(sceneData: {
        algorithm: string;
        ticketsCompleted: number;
        avgTaT: number;
        avgRT: number;
    }) {
        this.report = this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                `${sceneData.algorithm.toUpperCase()}\n
            Orders completed: ${sceneData.ticketsCompleted}\n
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
