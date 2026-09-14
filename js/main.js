import {
    getState,
    subscribe,
    toggleFavourite,
    addToPlan,
    removeFromPlan,
    clearPlan
} from "./state.js";
import { getMealById, searchMeals } from "./api.js";
import { renderRecipes } from "./views/discover.js";
import { renderRecipe } from "./views/recipe.js";
import { renderFavourites } from "./views/favourites.js";
import { renderPlanner, openPicker, closePicker} from "./views/planner.js";
import {onRouteChange, updateView, updateActiveNav} from "./router.js";
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
        renderPlanner();
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
const plannerView =
    document.querySelector("#planner-view");
plannerView.addEventListener("click", async (event) => {
    const clickedElement =
        event.target.closest("[data-action]");
    if (clickedElement) {
        const action = clickedElement.dataset.action;
        const slot = clickedElement.dataset.slot;
        if (action === "replace") {
    const favourites =
        getState().favourites || [];
    const meals = [];
    for (const id of favourites) {
        const meal = await getMealById(id);
        if (meal) {
            meals.push(meal);
        }
    }
    openPicker(meals, slot);
    return;
}
        if (action === "remove") {
            removeFromPlan(slot);
            return;
        }
        if (action === "close-picker") {
            const picker =
                plannerView.querySelector(".pick-back");
            if (
                event.target === picker ||
                clickedElement.classList.contains("pick-close")
            ) {
                closePicker();
            }
            return;
        }
        if (action === "pick") {
            const id = clickedElement.dataset.id;
            const picker =
                plannerView.querySelector(".pick-list");
            const pickerSlot = picker.dataset.slot;
            addToPlan(pickerSlot, id);
            closePicker();
            return;
        }
    }
    const slot = event.target.closest(".slot");
if (slot) {
    const favourites =
        getState().favourites || [];
    const meals = [];
    for (const id of favourites) {
        const meal = await getMealById(id);
        if (meal) {
            meals.push(meal);
        }
    }
    openPicker(meals, slot.dataset.slot);
}
});
document.addEventListener("input", async (event) => {
    if (event.target.id !== "pick-search") {
        return;
    }
    const query =
        event.target.value.trim();
    if (!query) {
        return;
    }
    const meals =
        await searchMeals(query);
    const list =
        document.querySelector(".pick-list");
    if (!list) {
        return;
    }
    list.innerHTML = meals.length
        ? meals.map((meal) => `
            <button
                type="button"
                class="pick"
                data-action="pick"
                data-id="${meal.id}"
            >
                <img
                    src="${meal.image}"
                    alt="${meal.name}"
                >
                <span>${meal.name}</span>
            </button>
        `).join("")
        : `<p>No recipes found.</p>`;
});
const clearButton =
    document.querySelector("#clear-btn");
clearButton.addEventListener("click", () => {
    const plan =
        getState().plan;
    if (Object.keys(plan).length === 0) {
        return;
    }
    const confirmed =
        window.confirm(
            "Are you sure you want to clear this week's plan?"
        );
    if (!confirmed) {
        return;
    }
    clearPlan();
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