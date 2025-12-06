export function structuredObject(obj) {
    return Object.entries(obj)
        .map(([key, value]) => `${key}=${typeof value === 'object' ? JSON.stringify(value) : value}`)
        .join(', ');
}