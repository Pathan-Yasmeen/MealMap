export function createRecipeCard(meal) {
    const category = meal.category || "";
    const area = meal.area || "";
    return `
        <article class="recipe-card">
            <img src="${meal.image}" alt="${meal.name}">
            <div class="recipe-card-content">
                <h2>${meal.name}</h2>
                <p class="recipe-card-meta">
                    <span>${category}</span>
                    ${area ? `<span>${area}</span>` : ""}
                </p>
                <div class="recipe-card-actions">
                    <button type="button">♡ Favourite</button>
                    <button type="button">+ Plan</button>
                </div>
            </div>
        </article>
    `;
}