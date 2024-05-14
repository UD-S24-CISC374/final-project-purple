import Ticket from "./ticket";

export default class Metrics {
    algo: string;
    ticketsCompleted: number;
    correctDishes: number;
    correctSchedules: number;
    avgTaT: number;
    avgRT: number;

    constructor() {
        this.algo = "";
        this.ticketsCompleted = 0;
        this.correctDishes = 0;
        this.correctSchedules = 0;
        this.avgTaT = 0;
        this.avgRT = 0;
    }

    updateAvgerages(ticket: Ticket) {
        this.avgRT += ticket.responseTime / this.ticketsCompleted;
        this.avgTaT += ticket.turnaroundTime / this.ticketsCompleted;
    }
}
