export default class CompetitiveData {
    id: string;
    username: string;
    best_profit: number;

    constructor(id: string, username: string, best_profit: number) {
        this.id = id;
        this.username = username;
        this.best_profit = best_profit;
    }
}
