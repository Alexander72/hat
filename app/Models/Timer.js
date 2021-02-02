const EventEmitter = require('events');

class Timer extends EventEmitter {
    endsAt;
    internalTimerId;

    constructor(endsAt, emitterOptions) {
        super(emitterOptions);
        if (endsAt instanceof Date) {
            this.endsAt = endsAt;
        } else {
            const argumentType = typeof endsAt === 'object' ? endsAt.constructor.name : endsAt;
            throw new Error(`endsAt parameter expected to be instance of Date, got ${argumentType}`)
        }
    }

    start() {
        let self = this;
        this.internalTimerId = setInterval(function () {
            if (self.millisecondsLeft() === 0) {
                self.emit('time_is_up');
                self.stop();
            }
        }, 100);
    }

    millisecondsLeft() {
        return Math.max(this.endsAt.getTime() - new Date().getTime(), 0)
    }

    stop() {
        if (this.internalTimerId) {
            clearTimeout(this.internalTimerId);
            this.internalTimerId = null;
        }
    }
}

module.exports = Timer;