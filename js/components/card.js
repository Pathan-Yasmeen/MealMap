export function createRecipeCard(meal, isFavourite) {
    const category = meal.category || "";
    const area = meal.area || "";
    return `
        <article class="recipe-card" data-action="open-recipe" data-id="${meal.id}">
            <img src="${meal.image}" alt="${meal.name}">
            <div class="recipe-card-content">
                <h2>${meal.name}</h2>
                <p class="recipe-card-meta">
                    <span>${category}</span>
                    ${area ? `<span>${area}</span>` : ""}
                </p>
                <div class="recipe-card-actions">
                    <button type="button" data-action="toggle-favourite" data-id="${meal.id}">${isFavourite ? "♥ Favourited" : "♡ Favourite"}</button>
                    <button type="button" data-action="add-to-plan" data-id="${meal.id}">+ Plan</button>
                </div>
            </div>
        </article>
    `;
}