export function createPicker(meals, slot) {
    const cards = meals.length
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
        : `
            <p>No recipes found.</p>
        `;
    return `
        <div class="pick-back" data-action="close-picker">
            <div
                class="pick-box"
                role="dialog"
                aria-modal="true"
                aria-labelledby="pick-title"
            >
                <button
                    type="button"
                    class="pick-close"
                    data-action="close-picker"
                    aria-label="Close picker"
                >
                    ✕
                </button>
                <h2 id="pick-title">
                    Choose a recipe
                </h2>
                <p>
                    Add a recipe to this slot.
                </p>
                <input
                    type="search"
                    id="pick-search"
                    placeholder="Search recipes"
                    aria-label="Search recipes"
                >
                <div
                    class="pick-list"
                    data-slot="${slot}"
                >
                    ${cards}
                </div>
            </div>
        </div>
    `;
}