export const SuccessMessage = (status, message, data) => {
    const succ = {
        status: status,
        message: message,
        data: data
    }
    return succ;
}