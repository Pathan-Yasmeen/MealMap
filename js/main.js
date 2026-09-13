import {
    getState,
    subscribe,
    toggleFavourite,
    addToPlan
} from "./state.js";
import { getMealById } from "./api.js";
import { renderRecipes } from "./views/discover.js";
import { renderRecipe } from "./views/recipe.js";
import { renderFavourites } from "./views/favourites.js";
import {
    onRouteChange,
    updateView,
    updateActiveNav
} from "./router.js";
import { showToast } from "./components/toast.js";
let savedScrollPosition = 0;
let savedBodyOverflow = "";
let savedOpener = null;
function openRecipe(id, opener) {
    savedScrollPosition = window.scrollY;
    savedBodyOverflow = document.body.style.overflow;
    savedOpener = opener;
    document.body.style.overflow = "hidden";
    window.location.hash = `#/recipe/${id}`;
    getMealById(id)
        .then((meal) => {
            if (meal) {
                const isFavourite =
                    getState().favourites.includes(id);
                renderRecipe(meal, isFavourite);
                const closeButton =
                    recipeView.querySelector(".recipe-modal-close");
                if (closeButton) {
                    closeButton.focus();
                }
            }
        })
        .catch((error) => {
            console.error(error);
        });
}
function closeRecipe() {
    recipeView.innerHTML = "";
    document.body.style.overflow = savedBodyOverflow;
    window.scrollTo(0, savedScrollPosition);
    window.location.hash = "#discover";
    if (savedOpener) {
        savedOpener.focus();
        savedOpener = null;
    }
}
onRouteChange(() => {
    updateView();
    updateActiveNav();
});
updateView();
updateActiveNav();
subscribe((state) => {
    renderRecipes(
        state.results || [],
        state.status,
        state.error,
        state.favourites || []
    );
    renderFavourites(
        state.results || [],
        state.favourites || []
    );
});
const recipeGrid =
    document.querySelector("#recipe-grid");
recipeGrid.addEventListener("click", (event) => {
    const clickedElement =
        event.target.closest("[data-action]");
    if (!clickedElement) {
        return;
    }
    const action = clickedElement.dataset.action;
    const id = clickedElement.dataset.id;
    if (action === "toggle-favourite") {
        toggleFavourite(id);
        return;
    }
    if (action === "add-to-plan") {
        addToPlan(id);
        showToast("Added to plan");
        return;
    }
    if (action === "open-recipe") {
        openRecipe(id, clickedElement);
    }
});
const favouritesGrid =
    document.querySelector("#favourites-grid");
favouritesGrid.addEventListener("click", (event) => {
    const clickedElement =
        event.target.closest("[data-action]");
    if (!clickedElement) {
        return;
    }
    const action = clickedElement.dataset.action;
    const id = clickedElement.dataset.id;
    if (action === "toggle-favourite") {
        toggleFavourite(id);
        return;
    }
    if (action === "add-to-plan") {
        addToPlan(id);
        showToast("Added to plan");
        return;
    }
    if (action === "open-recipe") {
        openRecipe(id, clickedElement);
    }
});
const recipeView =
    document.querySelector("#recipe-view");
recipeView.addEventListener("click", (event) => {
    const clickedElement =
        event.target.closest("[data-action]");
    if (!clickedElement) {
        return;
    }
    const action = clickedElement.dataset.action;
    if (action === "close-recipe") {
        const backdrop =
            recipeView.querySelector(".recipe-modal-backdrop");
        if (
            event.target === backdrop ||
            clickedElement.classList.contains(
                "recipe-modal-close"
            )
        ) {
            closeRecipe();
        }
        return;
    }
    if (action === "toggle-favourite") {
        const id = clickedElement.dataset.id;
        toggleFavourite(id);
        return;
     }
    if (action === "add-to-plan") {
        const id = clickedElement.dataset.id;
        addToPlan(id);
        showToast("Added to plan");
    }
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        if (
            !recipeView.hidden &&
            recipeView.innerHTML.trim() !== ""
        ) {
            closeRecipe();
        }
    }
});
const themeToggle =
    document.querySelector("#theme-button");
const savedTheme =
    localStorage.getItem("theme");
if (savedTheme) {
    document.documentElement.dataset.theme =
        savedTheme;
}
themeToggle.addEventListener("click", () => {
    const currentTheme =
        document.documentElement.dataset.theme;
    if (currentTheme === "dark") {
        document.documentElement.dataset.theme =
            "light";
    } else {
        document.documentElement.dataset.theme =
            "dark";
    }
    localStorage.setItem(
        "theme",
        document.documentElement.dataset.theme
    );
});
const initialRoute =
    window.location.hash;
if (initialRoute.startsWith("#/recipe/")) {
    const id = initialRoute.split("/")[2];
    if (id) {
        openRecipe(id, null);
    }
}