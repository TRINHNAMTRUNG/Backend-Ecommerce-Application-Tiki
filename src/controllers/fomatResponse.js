const formatResBodySuscess = (success, message, data) => {
    return {
        success,
        message,
        data: data || {}
    }
}
const formatResBodyFailed = (success, message, errors) => {
    const errorsArray = errors ? (Array.isArray(errors) ? errors : [errors]) : [];
    return {
        success,
        message,
        errors: errorsArray,
    }
}

module.exports = {
    formatResBodySuscess,
    formatResBodyFailed
}