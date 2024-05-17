import Phaser from "phaser";
import CompetitiveData from "../data/competitiveData";

export default class CompetitiveMenu extends Phaser.Scene {
    competitiveData: CompetitiveData;

    constructor() {
        super({ key: "CompetitiveMenu" });
    }

    init() {
        // get comp data from local
        //      if can, then skip login
        //      else, show login
    }

    create() {}
}
