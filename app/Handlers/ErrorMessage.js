const MISSED_PROPERTY = 'missed_property';

class ErrorMessage {
    type = 'error';
    reason;
    description;

    constructor(reason, description) {
        this.reason = reason;
        this.description = description;
    }
}

module.exports = ErrorMessage;
module.exports.MISSED_PROPERTY = MISSED_PROPERTY;