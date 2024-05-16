import Phaser from "phaser";
import Metrics from "../objects/metrics";
import CareerData from "../data/careerData";
import Confetti from "../objects/confetti";
import Time from "../util/time";
import MetricMenuButton from "../objects/metricMenuButton";
import Title from "../objects/title";

export default class MetricReport extends Phaser.Scene {
    report: Phaser.GameObjects.Text;
    passed: boolean = false;
    userShift: number = 1;

    constructor() {
        super({ key: "MetricReport" });
    }

    create(sceneData: Metrics) {
        this.userShift = this.registry.get("career").shift;
        let accuracy =
            parseFloat(
                (
                    sceneData.correctSchedules / sceneData.ticketsCompleted
                ).toFixed(3)
            ) * 100;

        accuracy = isNaN(accuracy) ? 0 : accuracy;

        if (accuracy >= 60 && sceneData.ticketsCompleted >= 5)
            this.passed = true;

        if (this.passed) {
            CareerData.addMetrics(this, sceneData);
            new Confetti(this, 20);
        }

        new Title(this, sceneData.algo.toLowerCase());

        this.report = this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                `Orders completed: ${
                    sceneData.ticketsCompleted
                }\nOrders made correctly: ${
                    sceneData.correctDishes
                }\nOrders scheduled correctly: ${
                    sceneData.correctSchedules
                }\nScheduling accuracy: ${accuracy}%${
                    !this.passed ? " X" : ""
                }\nAverage turnaround time: ${Time.toSec(
                    sceneData.avgTaT
                )}s\nAverage response time: ${Time.toSec(
                    sceneData.avgRT
                )}s\nNight's profit: $${sceneData.shiftProfit.toFixed(2)}`,
                { color: "white", lineSpacing: 32 }
            )
            .setOrigin(0.5);

        this.nextButtons();
    }

    sendToScene(sceneKey: string) {
        this.scene.start(sceneKey);
        localStorage.setItem(
            "career",
            JSON.stringify(this.registry.get("career"))
        );
    }

    nextButtons() {
        let buttonContent = { text: "", onClick: () => {} };
        const nextShift = this.passed ? this.userShift + 1 : this.userShift;
        CareerData.setShift(this, nextShift);

        if (this.userShift === 2 && this.passed) {
            buttonContent.text = "FINISH";
            buttonContent.onClick = () => {
                this.sendToScene("FinishWeek");
            };
        } else {
            buttonContent.text = this.passed ? "CONTINUTE" : "RETRY";
            buttonContent.onClick = () => {
                this.sendToScene(`Shift${nextShift}`);
            };
        }

        new MetricMenuButton(
            this,
            this.cameras.main.centerX - 200,
            this.cameras.main.centerY + 250,
            buttonContent.text,
            buttonContent.onClick
        );

        new MetricMenuButton(
            this,
            this.cameras.main.centerX + 200,
            this.cameras.main.centerY + 250,
            "EXIT",
            () => {
                this.sendToScene("MainMenu");
            }
        );
    }
}
