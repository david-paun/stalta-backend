export const SuccessMessage = (status, message, data, cookies) => {
    const succ = {
        status: status,
        message: message,
        data: data,
        cookies: cookies
    }
    return succ;
}