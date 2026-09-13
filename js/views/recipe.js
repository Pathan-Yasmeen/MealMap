import { createRecipeModal } from "../components/modal.js";
export function renderRecipe(meal, isFavourite) {
    const recipeView = document.querySelector("#recipe-view");
    recipeView.innerHTML = createRecipeModal(meal, isFavourite);
}
export function clearRecipe() {
    const recipeView = document.querySelector("#recipe-view");
    recipeView.innerHTML = "";
}