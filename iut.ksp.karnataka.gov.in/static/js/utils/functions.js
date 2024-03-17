export const validateEmail = (email) => {
    let pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const check = email.match(pattern);
    if (check) {
        return true;
    } else {
        return false;
    }
}

export const allowOnlyNumbers = (phone) => {
    let pattern = /^\d+$/;
    const check = phone.match(pattern);
    if (check) {
        return true;
    } else {
        return false;
    }
}

export const validatePhoneNumber = (phone) => {
    let pattern = /^[6-9]{1}[0-9]{9}$/;
    const check = phone.match(pattern);
    if (check) {
        return true;
    } else {
        return false;
    }
}

export const validateAadhaarNumber = (aadhaar) => {
    let pattern = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;
    const check = aadhaar.match(pattern);
    if (check) {
        return true;
    } else {
        return false;
    }
}

export const validatePassword = (password) => {
    const uppercaseRegExp = /(?=.*?[A-Z])/;
    const lowercaseRegExp = /(?=.*?[a-z])/;
    const digitsRegExp = /(?=.*?[0-9])/;
    const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
    const minLengthRegExp = /.{8,}/;
    const passwordLength = password.length;
    const uppercasePassword = uppercaseRegExp.test(password);
    const lowercasePassword = lowercaseRegExp.test(password);
    const digitsPassword = digitsRegExp.test(password);
    const specialCharPassword = specialCharRegExp.test(password);
    const minLengthPassword = minLengthRegExp.test(password);
    let errMsg = "";

    const isMinCharValid = minLengthPassword;
    const isDigitValid = digitsPassword;
    const isSpecialCharValid = specialCharPassword;
    const isUpperCaseValid = uppercasePassword;
    const isLowerCaseValid = lowercasePassword;
    const isEmptyPassword = passwordLength === 0 ? true : false;

    return {
        status: isMinCharValid && isDigitValid && isSpecialCharValid && isUpperCaseValid && isLowerCaseValid === true ? true : false,
        isMinCharValid,
        isDigitValid,
        isSpecialCharValid,
        isUpperCaseValid,
        isLowerCaseValid,
        isEmptyPassword
    }
}

export const disableSpecialCharacter = (e) => {
    let pattern = /^[a-zA-Z ]+$/;
    const check = e.match(pattern);
    if (check) {
        return true;
    } else {
        return false;
    }
}