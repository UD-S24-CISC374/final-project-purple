import Phaser from "phaser";

export default class CareerData {
    shift: number = 1;
    profit: number = 0;

    constructor(shift: number) {
        this.shift = shift;
    }

    static setProfit(sceneRef: Phaser.Scene, newProfit: number) {
        const newData = { ...sceneRef.registry.get("career") };
        newData.profit += newProfit;
        sceneRef.registry.set("career", newData);
    }
}
