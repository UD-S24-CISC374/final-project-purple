export default class Time {
    // takes in a time in ms and retunrs formatted seconds string
    static toSec(time: number) {
        return (time / 1000).toFixed(2);
    }
}
