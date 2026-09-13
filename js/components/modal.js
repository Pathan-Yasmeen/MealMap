export function createRecipeModal(meal, isFavourite) {
    const ingredients = meal.ingredients
        .map((ingredient) => `
            <li>
                ${ingredient.measure} ${ingredient.name}
            </li>
        `)
        .join("");
    const steps = meal.steps
        .map((step) => `
            <li>${step}</li>
        `)
        .join("");
    return `
        <div class="recipe-modal-backdrop" data-action="close-recipe">
            <div
                class="recipe-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="recipe-modal-title"
            >
                <button
                    type="button"
                    class="recipe-modal-close"
                    data-action="close-recipe"
                    aria-label="Close recipe"
                >
                    ✕
                </button>
                <img
                    class="recipe-modal-image"
                    src="${meal.image}"
                    alt="${meal.name}"
                >
                <div class="recipe-modal-content">
                    <h2 id="recipe-modal-title">
                        ${meal.name}
                    </h2>
                    <p class="recipe-modal-tags">
                        ${meal.category || ""}
                        ${meal.area ? ` · ${meal.area}` : ""}
                    </p>
                    <div class="recipe-modal-actions">
                        <button
                            type="button"
                            class="recipe-modal-favourite"
                            data-action="toggle-favourite"
                            data-id="${meal.id}"
                    >
                           ${isFavourite ? "♥ Favourited" : "♡ Favourite"} 
                        </button>
                        <button
                         type="button"
                         class="recipe-modal-plan"
                         data-action="add-to-plan"
                         data-id="${meal.id}"
                        >
                         + Add to plan
                        </button>
                    </div>
                    <h3>Ingredients</h3>
                    <ul class="recipe-modal-ingredients">
                        ${ingredients}
                    </ul>
                    <h3>Method</h3>
                    <ol class="recipe-modal-steps">
                        ${steps}
                    </ol>
                    <div class="recipe-modal-links">
                        ${
                            meal.youtube
                                ? `<a href="${meal.youtube}" target="_blank" rel="noopener">▶ Watch video</a>`
                                : ""
                        }
                        ${
                            meal.source
                                ? `<a href="${meal.source}" target="_blank" rel="noopener">Source ↗</a>`
                                : ""
                        }
                    </div>
                </div>
            </div>
        </div>
    `;
}