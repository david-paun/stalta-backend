export const ErrorMessage = (status, message, stack) => {
    const err = {
        status: status,
        message: message,
        stack: stack
    }
    return err;
}