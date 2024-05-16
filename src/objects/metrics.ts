import Ticket from "./ticket";

export default class Metrics {
    algo: string;
    ticketsCompleted: number;
    correctDishes: number;
    correctSchedules: number;
    avgTaT: number;
    avgRT: number;
    shiftProfit: number;

    private rollingTaT: number;
    private rollingRT: number;

    constructor() {
        this.algo = "";
        this.ticketsCompleted = 0;
        this.correctDishes = 0;
        this.correctSchedules = 0;
        this.avgTaT = 0;
        this.avgRT = 0;
        this.shiftProfit = 0;
        this.rollingTaT = 0;
        this.rollingRT = 0;
    }

    updateAvgerages(ticket: Ticket) {
        this.avgRT =
            (this.rollingRT += ticket.responseTime) / this.ticketsCompleted;
        this.avgTaT =
            (this.rollingTaT += ticket.turnaroundTime) / this.ticketsCompleted;
    }
}
