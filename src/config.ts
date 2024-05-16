import Phaser from "phaser";
import Shift1 from "./scenes/shift1";
import Shift3 from "./scenes/shift3";
import PreloadScene from "./scenes/preloadScene";
import MainMenu from "./scenes/mainMenu";
import ShiftGUI from "./scenes/shiftGUI";
import TutorialMenu from "./scenes/tutorialMenu";
import CareerMenu from "./scenes/careerMenu";
import Tutorial from "./scenes/tutorial";
import MetricReport from "./scenes/metricReport";
import Shift2 from "./scenes/shift2";
import FinishWeek from "./scenes/finishWeek";

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;

export const CONFIG = {
    title: "Schedulsine",
    version: "beta",
    type: Phaser.AUTO,
    backgroundColor: "903",
    scale: {
        parent: "phaser-game",
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
    },
    scene: [
        PreloadScene,
        MainMenu,
        TutorialMenu,
        CareerMenu,
        Tutorial,
        MetricReport,
        Shift1,
        Shift3,
        Shift2,
        FinishWeek,
        ShiftGUI,
    ],
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: { y: 300 },
        },
    },
    input: {
        keyboard: true,
        mouse: true,
        touch: true,
        gamepad: false,
    },
    render: {
        pixelArt: true,
        antialias: true,
    },
};
