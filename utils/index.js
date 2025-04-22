export const isObjectNullOrEmpty = data => {
    return !data || Object.keys(data).length === 0;
}