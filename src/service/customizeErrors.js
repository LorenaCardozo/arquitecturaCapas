
import {errorMessages} from './errorMessages.js';

function customizeError(errorCode, additionalMessage = '') {
    const defaultMessage = errorMessages[errorCode] || 'Error desconocido.';
    const customMessage = `${defaultMessage} ${additionalMessage}`;
    const error = new Error(customMessage);

    error.code = errorCode;

    return {code: error.code, message: error.message} ;
}

export {customizeError};