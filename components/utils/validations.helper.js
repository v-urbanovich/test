export var Validations;
(function (Validations) {
    Validations["MAX_LENGTH"] = "max_length";
    Validations["REGEX"] = "regex";
    Validations["LOWER_THAN"] = "lt";
    Validations["GREATER_THAN"] = "gt";
})(Validations || (Validations = {}));
export function validate(validators, value) {
    let message = null;
    for (const validator of validators) {
        message = checkValidation(validator, value);
        if (message) {
            break;
        }
    }
    return message;
}
function checkValidation(validation, value) {
    switch (validation.name) {
        case Validations.MAX_LENGTH:
            const maxLength = Number(validation[Validations.MAX_LENGTH]);
            return String(value).length < maxLength ? null : `Text must be less than ${maxLength} character`;
        case Validations.REGEX:
            return null;
        case Validations.GREATER_THAN:
            const greaterThan = Number(validation[Validations.GREATER_THAN]) - Number(validation.allow_equality);
            return Number(value) > greaterThan ? null : `Number must be greater than ${greaterThan} character`;
        case Validations.LOWER_THAN:
            const lowerThan = Number(validation[Validations.LOWER_THAN]) + Number(validation.allow_equality);
            return Number(value) < lowerThan ? null : `Number must be lower than ${lowerThan} character`;
        default:
            return null;
    }
}
