import { read, write } from "./storage.js";
let state = {
    status: "idle",
    results: [],
    error: "",
    categories: [],
    cuisines: [],
    favourites: read("favourites", []),
    plan: read("plan", {})
};
const listeners = [];
export function getState() {
    return state;
}
export function setState(newState) {
    state = {
        ...state,
        ...newState
    };
    if ("favourites" in newState) {
        write("favourites", state.favourites);
    }
    if ("plan" in newState) {
        write("plan", state.plan);
    }
    listeners.forEach((listener) => {
        listener(state);
    });
}
export function subscribe(listener) {
    listeners.push(listener);
}
export function toggleFavourite(id) {
    const favourites = state.favourites;
    if (favourites.includes(id)) {
        const updatedFavourites = favourites.filter(
            (favouriteId) => favouriteId !== id
        );
        setState({
            favourites: updatedFavourites
        });
    } else {
        const updatedFavourites = [
            ...favourites,
            id
        ];
        setState({
            favourites: updatedFavourites
        });
    }
}
export function addToPlan(id) {
    const updatedPlan = {
        ...state.plan,
        pending: id
    };
    setState({
        plan: updatedPlan
    });
}