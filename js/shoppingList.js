export function buildShoppingList(plan, recipes) {
    const recipeIds = Object.values(plan)
        .filter(Boolean);
    const plannedRecipes = recipes.filter((recipe) =>
        recipeIds.includes(recipe.id)
    );
    const ingredients = plannedRecipes.flatMap(
        (recipe) => recipe.ingredients
    );
    const groupedIngredients = ingredients.reduce(
        (groups, ingredient) => {
            const key = ingredient.name
                .trim()
                .toLowerCase();
            if (!groups.has(key)) {
                groups.set(key, {
                    key: key,
                    label: ingredient.name.trim(),
                    measures: [],
                    count: 0
                });
            }
            const item = groups.get(key);
            if (ingredient.measure) {
                item.measures.push(
                    ingredient.measure
                );
            }
            item.count += 1;
            return groups;
        },
        new Map()
    );
    return Array.from(groupedIngredients.values())
        .sort((a, b) =>
            a.label.localeCompare(b.label)
        );
}