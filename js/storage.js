export function read(key, fallback) {
    try {
        const savedData = localStorage.getItem(key);
        if (!savedData) {
            return fallback;
        }
        return JSON.parse(savedData);
    } catch (error) {
        return fallback;
    }
}
export function write(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error("Unable to save data.");
    }
}
export function readSession(key, fallback) {
    try {
        const savedData = sessionStorage.getItem(key);
        if (!savedData) {
            return fallback;
        }
        return JSON.parse(savedData);
    } catch (error) {
        return fallback;
    }
}
export function writeSession(key, value) {
    try {
        sessionStorage.setItem(
            key,
            JSON.stringify(value)
        );
    } catch (error) {
        console.error("Unable to save session data.");
    }
}