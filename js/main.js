import { getState, setState, subscribe } from "./state.js";
import { renderRecipes } from "./views/discover.js";
import {
    getRoute,
    onRouteChange,
    updateView,
    updateActiveNav
} from "./router.js";
onRouteChange(() => {
    updateView();
    updateActiveNav();
});
subscribe((state) => {
    renderRecipes(
        state.results || [],
        state.status,
        state.error
    );
});
const themeToggle = document.querySelector("#theme-button");
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    document.documentElement.dataset.theme = savedTheme;
}
themeToggle.addEventListener("click", () => {
    const currentTheme =
        document.documentElement.dataset.theme;
    if (currentTheme === "dark") {
        document.documentElement.dataset.theme = "light";
    } else {
        document.documentElement.dataset.theme = "dark";
    }
    localStorage.setItem(
        "theme",
        document.documentElement.dataset.theme
    );
});