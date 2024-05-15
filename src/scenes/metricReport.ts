import Phaser from "phaser";
import Metrics from "../objects/metrics";
import CareerData from "../data/careerData";
import Confetti from "../objects/confetti";

export default class MetricReport extends Phaser.Scene {
    report: Phaser.GameObjects.Text;
    passed: boolean = false;

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
        if (accuracy >= 60 && sceneData.ticketsCompleted >= 1)
            this.passed = true;

        if (this.passed) {
            CareerData.addMetrics(this, sceneData);
            new Confetti(this, 20);
        }

        this.nextButton(userShift);
    }

    nextButton(shift: number) {
        if (shift === 2 && this.passed) {
            this.add
                .text(
                    this.cameras.main.centerX,
                    this.cameras.main.centerY + 300,
                    "FINISH",
                    {
                        backgroundColor: "black",
                        padding: { top: 5, bottom: 5, left: 5, right: 5 },
                    }
                )
                .setInteractive()
                .on("pointerdown", () => {
                    const nextShift = this.passed ? shift + 1 : shift;
                    this.scene.start(`FinishWeek`);
                    CareerData.setShift(this, nextShift);
                    localStorage.setItem(
                        "career",
                        JSON.stringify(this.registry.get("career"))
                    );
                });
        } else {
            this.add
                .text(
                    this.cameras.main.centerX,
                    this.cameras.main.centerY + 300,
                    this.passed ? "CONTINUE" : "RETRY",
                    {
                        backgroundColor: "black",
                        padding: { top: 5, bottom: 5, left: 5, right: 5 },
                    }
                )
                .setInteractive()
                .on("pointerdown", () => {
                    const nextShift = this.passed ? shift + 1 : shift;
                    this.scene.start(`Shift${nextShift}`);
                    CareerData.setShift(this, nextShift);
                    localStorage.setItem(
                        "career",
                        JSON.stringify(this.registry.get("career"))
                    );
                });
        }
    }
}
