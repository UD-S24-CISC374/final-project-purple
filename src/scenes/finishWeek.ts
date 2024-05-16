import Phaser from "phaser";
import Confetti from "../objects/confetti";
import WeeklyReport from "../objects/weeklyReport";
import Metrics from "../objects/metrics";
import MetricMenuButton from "../objects/metricMenuButton";

export default class FinishWeek extends Phaser.Scene {
    constructor() {
        super({ key: "FinishWeek" });
    }

    create() {
        const career = this.registry.get("career");
        new Confetti(this, 50);
        new WeeklyReport(this, 200, this.cameras.main.centerY);

        this.add
            .sprite(850, 400, "paycheck")
            .setScale(6.5)
            .setRotation(Phaser.Math.DegToRad(15));

        this.add
            .text(
                1150,
                510,
                career
                    ? career.metricsList
                          .reduce(
                              (total: number, curr: Metrics) =>
                                  curr.shiftProfit + total,
                              0
                          )
                          .toFixed(2)
                    : "0.00",
                { color: "black", fontSize: 45 }
            )
            .setRotation(Phaser.Math.DegToRad(15))
            .setOrigin(1);

        new MetricMenuButton(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 300,
            "EXIT",
            () => {
                this.scene.start("MainMenu");
            }
        );
    }
}
