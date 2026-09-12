import { debounce } from "../utils.js";
import { createRecipeCard } from "../components/card.js";
import {
    searchMeals,
    filterMeals,
    getCategories,
    getCuisines
} from "../api.js";
import { setState } from "../state.js";
export function debounce(callback, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}
export function renderRecipes(meals, status, error) {
    const recipeGrid = document.querySelector("#recipe-grid");
    if (status === "idle") {
        recipeGrid.innerHTML = "";
        return;
    }
    if (status === "loading") {
        recipeGrid.innerHTML = `
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
        `;
        return;
    }
    if (status === "empty") {
        recipeGrid.innerHTML = `
            <p>No recipes found. Try another search.</p>
        `;
        return;
    }
if (status === "error") {
    recipeGrid.innerHTML = `
        <p>${error}</p>
        <button type="button" id="retry-button">
            Retry
        </button>
    `;
    const retryButton = document.querySelector("#retry-button");
    retryButton.addEventListener("click", () => {
        runSearch();
    });
    return;
}
    if (status === "success") {
        recipeGrid.innerHTML = meals
            .map((meal) => createRecipeCard(meal))
            .join("");
        return;
    }
}
const searchInput =
    document.querySelector("#recipe-search");
const categorySelect =
    document.querySelector("#recipe-category");
const cuisineSelect =
    document.querySelector("#recipe-cuisine");
let controller;
async function loadFilters() {
    try {
        const categories = await getCategories();
        const cuisines = await getCuisines();
        setState({
            categories: categories,
            cuisines: cuisines
        });
        categories.forEach((item) => {
            categorySelect.innerHTML += `
                <option value="${item.strCategory}">
                    ${item.strCategory}
                </option>
            `;
        });
        cuisines.forEach((item) => {
            cuisineSelect.innerHTML += `
                <option value="${item.strCountry}">
                    ${item.strArea}
                </option>
            `;
        });
    } catch (error) {
        console.error(error);
    }
}
async function runSearch() {
    const query = searchInput.value.trim();
    const category = categorySelect.value;
    const cuisine = cuisineSelect.value;
    if (controller) {
        controller.abort();
    }
    controller = new AbortController();
    if (!query && !category && !cuisine) {
        setState({
            status: "idle",
            results: [],
            error: ""
        });
        return;
    }
    setState({
        status: "loading",
        results: [],
        error: ""
    });
    try {
        let meals = [];
        if (query) {
            meals = await searchMeals(
                query,
                controller.signal
            );
            if (category) {
                meals = meals.filter(
                    (meal) =>
                        meal.category === category
                );
            }
            if (cuisine) {
                meals = meals.filter(
                    (meal) =>
                        meal.area === cuisine
                );
            }
        }
        else if (category && cuisine) {
            const categoryMeals =
                await filterMeals(
                    "c",
                    category,
                    controller.signal
                );
            const cuisineMeals =
                await filterMeals(
                    "a",
                    cuisine,
                    controller.signal
                );
            const cuisineNames = new Set(
                cuisineMeals.map(
                    (meal) => meal.name
                )
            );
            meals = categoryMeals
                .filter(
                    (meal) =>
                        cuisineNames.has(meal.name)
                )
                .map((meal) => ({
                    id: meal.id,
                    name: meal.name,
                    image: meal.image,
                    category: category,
                    area: cuisine
                }));
        }
        else if (category) {
            meals = await filterMeals(
                "c",
                category,
                controller.signal
            );
        }
        else if (cuisine) {
            meals = await filterMeals(
                "a",
                cuisine,
                controller.signal
            );
        }
        if (meals.length === 0) {
            setState({
                status: "empty",
                results: [],
                error: ""
            });
            return;
        }
        setState({
            status: "success",
            results: meals,
            error: ""
        });
    } catch (error) {

        if (error.name === "AbortError") {
            return;
        }
        setState({
            status: "error",
            results: [],
            error: "Unable to load recipes. Please try again."
        });
    }
}
const debouncedSearch =
    debounce(runSearch, 400);
searchInput.addEventListener("input", () => {
    debouncedSearch();
});
categorySelect.addEventListener("change", () => {
    runSearch();
});
cuisineSelect.addEventListener("change", () => {
    runSearch();
});
loadFilters();
const retryButton = document.querySelector("#retry-button");
if (retryButton) {
    retryButton.addEventListener("click", () => {
        runSearch();
    });
}