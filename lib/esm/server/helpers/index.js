export function Success(data) {
    return {
        success: true,
        data,
    };
}
export function Exception(error) {
    return {
        success: false,
        error: error,
    };
}
