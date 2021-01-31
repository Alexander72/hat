const MISSED_PROPERTY = 'missed_property';
const ACCESS_VIOLATION = 'access_violation';
const GAME_FLOW_ERROR = 'game_flow_error';

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
module.exports.GAME_FLOW_ERROR = GAME_FLOW_ERROR;