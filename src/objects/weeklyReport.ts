import Phaser from "phaser";
import CareerData from "../data/careerData";
import Metrics from "./metrics";
import Time from "../util/time";

export default class WeeklyReport {
    backdrop: Phaser.GameObjects.Sprite;
    careerData: CareerData;
    bestTaT: Metrics;
    bestRT: Metrics;
    bestProfit: Metrics;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.careerData = scene.registry.get("career");

        let baseComp = new Metrics();
        baseComp.avgTaT = Phaser.Math.MAX_SAFE_INTEGER;
        baseComp.avgRT = Phaser.Math.MAX_SAFE_INTEGER;
        baseComp.shiftProfit = Phaser.Math.MIN_SAFE_INTEGER;

        if (this.careerData.metricsList.length > 0) {
            this.bestTaT = this.careerData.metricsList.reduce(
                (min: Metrics, curr) =>
                    curr.avgTaT <= min.avgTaT ? curr : min,
                baseComp
            );
            this.bestRT = this.careerData.metricsList.reduce(
                (min: Metrics, curr) => (curr.avgRT <= min.avgRT ? curr : min),
                baseComp
            );
            this.bestProfit = this.careerData.metricsList.reduce(
                (min: Metrics, curr) =>
                    curr.shiftProfit >= min.shiftProfit ? curr : min,
                baseComp
            );
        } else {
            this.bestTaT = new Metrics();
            this.bestTaT.algo = "n/a";
            this.bestRT = new Metrics();
            this.bestRT.algo = "n/a";
            this.bestProfit = new Metrics();
            this.bestProfit.algo = "n/a";
        }

        this.backdrop = scene.add.sprite(x, y, "report").setScale(13);

        scene.add
            .text(this.backdrop.x, this.backdrop.y - 100, `BEST SCORES`, {
                color: "black",
                fontSize: 24,
            })
            .setOrigin(0.5, 0);

        scene.add
            .text(
                this.backdrop.x,
                this.backdrop.y - 60,
                `Avg. Runtime Time: ${Time.toSec(
                    this.bestRT.avgRT
                )}s\n\tAlgorithm:\n\t${this.bestRT.algo.toUpperCase()}`,
                {
                    color: "black",
                    wordWrap: { width: 300 },
                    fixedWidth: 300,
                    align: "left",
                }
            )
            .setOrigin(0.5, 0);

        scene.add
            .text(
                this.backdrop.x,
                this.backdrop.y + 20,
                `Avg. Turnaround Time: ${Time.toSec(
                    this.bestTaT.avgTaT
                )}s\n\tAlgorithm:\n\t${this.bestTaT.algo.toUpperCase()}`,
                {
                    color: "black",
                    wordWrap: { width: 300 },
                    fixedWidth: 300,
                    align: "left",
                }
            )
            .setOrigin(0.5, 0);

        scene.add
            .text(
                this.backdrop.x,
                this.backdrop.y + 100,
                `Profit: $${this.bestProfit.shiftProfit.toFixed(
                    2
                )}\n\tAlgorithm:\n\t${this.bestProfit.algo.toUpperCase()}`,
                {
                    color: "black",
                    wordWrap: { width: 300 },
                    fixedWidth: 300,
                    align: "left",
                }
            )
            .setOrigin(0.5, 0);
    }
}
