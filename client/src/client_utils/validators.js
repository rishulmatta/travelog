export const regExValidator = function (reg, errorMsg, heading = "Validation Error") {
    return (elementName) => {
        return (state) => {
            if (reg.test(state[elementName])) {
                return true;
            } else {
                return {
                    msg: errorMsg.replace("${elementName}", elementName),
                    heading
                }
            }
        }

    };
};

export const nameValidator = regExValidator(/^[a-zA-Z\._0-9@]+$/, " \"${elementName}\" : can contain only alphabets, numbers,@, . and _ ");
export const optionalNameValidator = regExValidator(/^[a-zA-Z\._0-9]*$/, " \"${elementName}\" : can contain only alphabets, numbers, . and _ ");
export const optionalWithSpaceValidator = regExValidator(/^[a-zA-Z\._ 0-9]*$/, " \"${elementName}\" : can contain only alphabets, numbers, space, . and _ ");
export const passwordValidator = regExValidator(/^[a-zA-Z\._@!0-9]+$/, "${elementName} can contain only alphabets, numbers, . @ ! _ ");


export const dependentValidations = function (formEle1, formEle2, errorMsg, callBack, heading = "Validation Error") {
    // use this when two properties effect each other, they get passed the state of the ocmponent
    return (state) => {
        const value1 = state[formEle1];
        const value2 = state[formEle2];
        let validationStatus = callBack(value1, value2);
        if (validationStatus) {
            return true;
        } else {
            return {
                msg: errorMsg,
                heading
            };
        }
    }
}

export const validatorRunner = (validators, newState, contextState) => {
    let isValid = true;
    if (validators && validators.length > 0) {
        for (let validator of validators) {
            let res = validator(newState || contextState);
            if (res === true) {
                window.hideToast();
                continue;
            }
            const {msg, heading} = res;
            window.showToast(heading, msg);
            isValid = false;
            return isValid;
        }
    }
    return isValid;
};