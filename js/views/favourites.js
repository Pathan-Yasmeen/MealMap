import { createRecipeCard } from "../components/card.js";
import { getMealById } from "../api.js";
export async function renderFavourites(
    meals,
    favourites,
    ownRecipes
) {
    const favouritesGrid =
        document.querySelector("#favourites-grid");
    const favouriteMeals = [];
    for (const id of favourites) {
        const existingMeal =
            meals.find((meal) => meal.id === id);
        if (existingMeal) {
            favouriteMeals.push(existingMeal);
        } else {
            const meal =
                await getMealById(id);
            if (meal) {
                favouriteMeals.push(meal);
            }
        }
    }
    const allMeals = [
        ...favouriteMeals,
        ...ownRecipes
    ];
    if (allMeals.length === 0) {
        favouritesGrid.innerHTML = `
            <p>No favourite recipes yet.</p>
        `;
        return;
    }
    favouritesGrid.innerHTML =
        allMeals
            .map((meal) =>
                createRecipeCard(
                    meal,
                    true
                )
            )
            .join("");
}