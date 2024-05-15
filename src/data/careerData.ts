import Phaser from "phaser";
import Metrics from "../objects/metrics";

export default class CareerData {
    shift: number = 1;
    metricsList: Metrics[] = [];

    private constructor(shift: number = 1) {
        this.shift = shift;
        this.metricsList = [];
    }

    static init(sceneRef: Phaser.Scene, overwrite: boolean) {
        let career: CareerData = new CareerData(1);
        let localCareer;

        if (!overwrite && (localCareer = localStorage.getItem("career")))
            career = JSON.parse(localCareer);

        localStorage.setItem("career", JSON.stringify(career));
        sceneRef.registry.set("career", career);
    }

    static setShift(sceneRef: Phaser.Scene, newShift: number) {
        const newData = { ...sceneRef.registry.get("career") };
        newData.shift = newShift;
        sceneRef.registry.set("career", newData);
    }

    static addMetrics(sceneRef: Phaser.Scene, metrics: Metrics) {
        const newData = { ...sceneRef.registry.get("career") };
        newData.metricsList.push(metrics);
        sceneRef.registry.set("career", newData);
    }

    getTotalProfit() {
        return this.metricsList.reduce(
            (total: number, metrics: Metrics) => total + metrics.shiftProfit,
            0
        );
    }
}
