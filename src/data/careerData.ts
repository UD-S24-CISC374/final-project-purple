import Phaser from "phaser";
import Metrics from "../objects/metrics";

export default class CareerData {
    shift: number = 1;
    profit: number = 0;
    metricsList: Metrics[] = [];

    private constructor(shift: number = 1) {
        this.shift = shift;
    }

    static init(sceneRef: Phaser.Scene, overwrite: boolean) {
        let career = new CareerData(1);
        let localCareer;

        if (!overwrite && (localCareer = localStorage.getItem("career")))
            career = JSON.parse(localCareer);

        localStorage.setItem("career", JSON.stringify(career));
        sceneRef.registry.set("career", career);
    }

    static addProfit(sceneRef: Phaser.Scene, newProfit: number) {
        const newData = { ...sceneRef.registry.get("career") };
        newData.profit += newProfit;
        sceneRef.registry.set("career", newData);
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
}
