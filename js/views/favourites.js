import { createRecipeCard } from "../components/card.js";
import { getMealById } from "../api.js";
export async function renderFavourites(meals, favourites) {
    const favouritesGrid = document.querySelector("#favourites-grid");
    if (favourites.length === 0) {
        favouritesGrid.innerHTML = `
            <p>No favourite recipes yet.</p>
        `;
        return;
    }
    favouritesGrid.innerHTML = `
        <p>Loading favourite recipes...</p>
    `;
    const favouriteMeals = [];
    for (const id of favourites) {
        const existingMeal = meals.find((meal) => meal.id === id);
        if (existingMeal) {
            favouriteMeals.push(existingMeal);
        } else {
            const meal = await getMealById(id);

            if (meal) {
                favouriteMeals.push(meal);
            }
        }
    }
    if (favouriteMeals.length === 0) {
        favouritesGrid.innerHTML = `
            <p>No favourite recipes found.</p>
        `;
        return;
    }
    favouritesGrid.innerHTML = favouriteMeals
        .map((meal) => createRecipeCard(meal, true))
        .join("");
}