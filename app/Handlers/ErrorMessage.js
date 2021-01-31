const MISSED_PROPERTY = 'missed_property';
const ACCESS_VIOLATION = 'access_violation';

class ErrorMessage {
    status = 'error';
    reason;
    description;

    constructor(reason, description) {
        this.reason = reason;
        this.description = description;
    }
}

module.exports = ErrorMessage;
module.exports.MISSED_PROPERTY = MISSED_PROPERTY;
module.exports.ACCESS_VIOLATION = ACCESS_VIOLATION;