import {
    getState,
    subscribe,
    toggleFavourite,
    addToPlan,
    removeFromPlan,
    clearPlan,
    addOwnRecipe
} from "./state.js";
import { getMealById, searchMeals } from "./api.js";
import { renderRecipes } from "./views/discover.js";
import { renderRecipe } from "./views/recipe.js";
import { renderFavourites } from "./views/favourites.js";
import {
    renderShopping,
    toggleShoppingItem,
    getShoppingListText
} from "./views/shopping.js";
import {
    renderPlanner,
    openPicker,
    closePicker
} from "./views/planner.js";
import {
    onRouteChange,
    updateView,
    updateActiveNav
} from "./router.js";
import { showToast } from "./components/toast.js";
let savedScrollPosition = 0;
let savedBodyOverflow = "";
let savedOpener = null;
function openRecipe(id, opener) {
    savedScrollPosition = window.scrollY;
    savedBodyOverflow =
        document.body.style.overflow;
    savedOpener = opener;
    document.body.style.overflow =
        "hidden";
    window.location.hash =
        `#/recipe/${id}`;
    const ownRecipe =
        getState().ownRecipes.find(
            (recipe) => recipe.id === id
        );
    if (ownRecipe) {
        const isFavourite =
            getState().favourites.includes(id);
        renderRecipe(
            ownRecipe,
            isFavourite
        );
        const closeButton =
            recipeView.querySelector(
                ".recipe-modal-close"
            );
        if (closeButton) {
            closeButton.focus();
        }
        return;
    }
    getMealById(id)
        .then((meal) => {
            if (meal) {
                const isFavourite =
                    getState().favourites.includes(id);
                renderRecipe(
                    meal,
                    isFavourite
                );
                const closeButton =
                    recipeView.querySelector(
                        ".recipe-modal-close"
                    );
                if (closeButton) {
                    closeButton.focus();
                }
            }
        })
        .catch((error) => {
            console.error(error);
        });
}
async function updateShopping() {
    const plan =
        getState().plan || {};
    const recipeIds =
        Object.values(plan)
            .filter(Boolean);
    const recipes = [];
    for (const id of recipeIds) {
        const ownRecipe =
            getState().ownRecipes.find(
                (recipe) => recipe.id === id
            );
        if (ownRecipe) {
            recipes.push(ownRecipe);
            continue;
        }
        const meal =
            await getMealById(id);
        if (meal) {
            recipes.push(meal);
        }
    }
    renderShopping(
        plan,
        recipes
    );
}
function closeRecipe() {
    recipeView.innerHTML = "";
    document.body.style.overflow =
        savedBodyOverflow;
    window.scrollTo(
        0,
        savedScrollPosition
    );
    window.location.hash =
        "#discover";
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
        state.favourites || [],
        state.ownRecipes || []
    );
    renderPlanner();
    updateShopping();
});
const recipeGrid =
    document.querySelector(
        "#recipe-grid"
    );
recipeGrid.addEventListener(
    "click",
    (event) => {
        const clickedElement =
            event.target.closest(
                "[data-action]"
            );
        if (!clickedElement) {
            return;
        }
        const action =
            clickedElement.dataset.action;
        const id =
            clickedElement.dataset.id;
        if (action === "toggle-favourite") {
            toggleFavourite(id);
            return;
        }
        if (action === "add-to-plan") {
            addToPlan(id);
            showToast(
                "Added to plan"
            );
            return;
        }
        if (action === "open-recipe") {
            openRecipe(
                id,
                clickedElement
            );
        }
    }
);
const favouritesGrid =
    document.querySelector(
        "#favourites-grid"
    );
favouritesGrid.addEventListener(
    "click",
    (event) => {
        const clickedElement =
            event.target.closest(
                "[data-action]"
            );
        if (!clickedElement) {
            return;
        }
        const action =
            clickedElement.dataset.action;
        const id =
            clickedElement.dataset.id;
        if (action === "toggle-favourite") {
            toggleFavourite(id);
            return;
        }
        if (action === "add-to-plan") {
            addToPlan(id);
            showToast(
                "Added to plan"
            );
            return;
        }
        if (action === "open-recipe") {
            openRecipe(
                id,
                clickedElement
            );
        }
    }
);
const shoppingView =
    document.querySelector(
        "#shopping-view"
    );
shoppingView.addEventListener(
    "change",
    async (event) => {
        if (
            !event.target.classList.contains(
                "shopping-check"
            )
        ) {
            return;
        }
        const key =
            event.target.dataset.key;
        toggleShoppingItem(key);
        await updateShopping();
    }
);
const copyShoppingButton =
    document.querySelector(
        "#copy-shopping"
    );
copyShoppingButton.addEventListener(
    "click",
    async () => {
        const plan =
            getState().plan || {};
        const recipeIds =
            Object.values(plan)
                .filter(Boolean);
        const recipes = [];
        for (const id of recipeIds) {
            const ownRecipe =
                getState().ownRecipes.find(
                    (recipe) => recipe.id === id
                );
            if (ownRecipe) {
                recipes.push(
                    ownRecipe
                );
                continue;
            }
            const meal =
                await getMealById(id);
            if (meal) {
                recipes.push(meal);
            }
        }
        const text =
            getShoppingListText(
                plan,
                recipes
            );
        if (!recipeIds.length) {
            showToast(
                "Shopping list is empty"
            );
            return;
        }
        try {
            await navigator.clipboard.writeText(
                text
            );
            showToast(
                "Shopping list copied"
            );
        } catch (error) {
            showToast(
                "Unable to copy shopping list"
            );
        }
    }
);
const printShoppingButton =
    document.querySelector(
        "#print-shopping"
    );
printShoppingButton.addEventListener(
    "click",
    () => {
        window.print();
    }
);
const plannerView =
    document.querySelector(
        "#planner-view"
    );
plannerView.addEventListener(
    "click",
    async (event) => {
        const clickedElement =
            event.target.closest(
                "[data-action]"
            );
        if (clickedElement) {
            const action =
                clickedElement.dataset.action;
            const slot =
                clickedElement.dataset.slot;
            if (action === "replace") {
                const favourites =
                    getState().favourites || [];
                const ownRecipes =
                    getState().ownRecipes || [];
                const meals = [];
                for (const id of favourites) {
                    const meal =
                        await getMealById(id);
                    if (meal) {
                        meals.push(meal);
                    }
                }
                meals.push(
                    ...ownRecipes
                );
                openPicker(
                    meals,
                    slot
                );
                return;
            }
            if (action === "remove") {
                removeFromPlan(slot);
                return;
            }
            if (action === "close-picker") {
                const picker =
                    plannerView.querySelector(
                        ".pick-back"
                    );
                if (
                    event.target === picker ||
                    clickedElement.classList.contains(
                        "pick-close"
                    )
                ) {

                    closePicker();
                }
                return;
            }
            if (action === "pick") {
                const id =
                    clickedElement.dataset.id;
                const picker =
                    plannerView.querySelector(
                        ".pick-list"
                    );
                const pickerSlot =
                    picker.dataset.slot;
                addToPlan(
                    pickerSlot,
                    id
                );
                closePicker();
                return;
            }
        }
        const slot =
            event.target.closest(
                ".slot"
            );
        if (slot) {
            const favourites =
                getState().favourites || [];
            const meals = [];
            const ownRecipes =
                getState().ownRecipes || [];
            for (const id of favourites) {
                const meal =
                    await getMealById(id);
                if (meal) {
                    meals.push(meal);
                }
            }
            meals.push(
                ...ownRecipes
            );
            openPicker(
                meals,
                slot.dataset.slot
            );
            return;
        }
    }
);
document.addEventListener(
    "input",
    async (event) => {
        if (
            event.target.id !==
            "pick-search"
        ) {
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
            document.querySelector(
                ".pick-list"
            );
        if (!list) {
            return;
        }
        list.innerHTML =
            meals.length
                ? meals
                    .map(
                        (meal) => `
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
                        `
                    )
                    .join("")
                : `<p>No recipes found.</p>`;
    }
);
const clearButton =
    document.querySelector(
        "#clear-btn"
    );
clearButton.addEventListener(
    "click",
    () => {
        const plan =
            getState().plan;
        if (
            Object.keys(plan).length === 0
        ) {
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
    }
);
const recipeView =
    document.querySelector(
        "#recipe-view"
    );
recipeView.addEventListener(
    "click",
    (event) => {
        const clickedElement =
            event.target.closest(
                "[data-action]"
            );
        if (!clickedElement) {
            return;
        }
        const action =
            clickedElement.dataset.action;
        if (
            action ===
            "close-recipe"
        ) {
            const backdrop =
                recipeView.querySelector(
                    ".recipe-modal-backdrop"
                );
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
        if (
            action ===
            "toggle-favourite"
        ) {
            const id =
                clickedElement.dataset.id;
            toggleFavourite(id);
            return;
        }
        if (
            action ===
            "add-to-plan"
        ) {
            const id =
                clickedElement.dataset.id;
            addToPlan(id);
            showToast(
                "Added to plan"
            );
        }
    }
);
document.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "Escape") {
            if (
                !recipeView.hidden &&
                recipeView.innerHTML.trim() !== ""
            ) {
                closeRecipe();
            }
        }
    }
);
const themeToggle =
    document.querySelector(
        "#theme-button"
    );
const savedTheme =
    localStorage.getItem(
        "theme"
    );
if (savedTheme) {
    document.documentElement.dataset.theme =
        savedTheme;
}
themeToggle.addEventListener(
    "click",
    () => {
        const currentTheme =
            document.documentElement.dataset.theme;
        if (
            currentTheme === "dark"
        ) {
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
    }
);
const initialRoute =
    window.location.hash;
if (
    initialRoute.startsWith(
        "#/recipe/"
    )
) {
    const id =
        initialRoute.split("/")[2];
    if (id) {
        openRecipe(
            id,
            null
        );
    }
}
const ownRecipeForm =
    document.querySelector(
        "#own-recipe-form"
    );
const ingredientRows =
    document.querySelector(
        "#ingredient-rows"
    );
const addIngredientButton =
    document.querySelector(
        "#add-ingredient"
    );
function createIngredientRow() {
    const row =
        document.createElement(
            "div"
        );
    row.className =
        "ingredient-row";
    row.innerHTML = `
        <div class="form-field">
            <label>
                Ingredient
            </label>
            <input
                type="text"
                name="ingredient"
                required
            >
            <p class="ingredient-error"></p>
        </div>
        <div class="form-field">
            <label>
                Measure
            </label>
            <input
                type="text"
                name="measure"
                required
            >
            <p class="measure-error"></p>
        </div>
        <button
            type="button"
            class="remove-ingredient"
        >
            Remove
        </button>
    `;
    return row;
}
addIngredientButton.addEventListener(
    "click",
    () => {
        const row =
            createIngredientRow();
        ingredientRows.appendChild(
            row
        );
    }
);
ingredientRows.addEventListener(
    "click",
    (event) => {
        if (
            !event.target.classList.contains(
                "remove-ingredient"
            )
        ) {
            return;
        }
        const rows =
            ingredientRows.querySelectorAll(
                ".ingredient-row"
            );
        if (rows.length === 1) {
            return;
        }
        event.target
            .closest(
                ".ingredient-row"
            )
            .remove();
    }
);
function showFormError(
    input,
    errorElement,
    message
) {
    errorElement.textContent =
        message;
    input.setAttribute(
        "aria-describedby",
        errorElement.id
    );
}
function clearFormError(
    input,
    errorElement
) {
    errorElement.textContent =
        "";
    input.removeAttribute(
        "aria-describedby"
    );
}
function validateOwnRecipeForm() {
    let isValid = true;
    const nameInput =
        document.querySelector(
            "#own-name"
        );
    const nameError =
        document.querySelector(
            "#own-name-error"
        );
    const categoryInput =
        document.querySelector(
            "#own-category"
        );
    const categoryError =
        document.querySelector(
            "#own-category-error"
        );
    const imageInput =
        document.querySelector(
            "#own-image"
        );
    const imageError =
        document.querySelector(
            "#own-image-error"
        );
    const stepsInput =
        document.querySelector(
            "#own-steps"
        );
    const stepsError =
        document.querySelector(
            "#own-steps-error"
        );
    clearFormError(
        nameInput,
        nameError
    );
    clearFormError(
        categoryInput,
        categoryError
    );
    clearFormError(
        imageInput,
        imageError
    );
    clearFormError(
        stepsInput,
        stepsError
    );
    if (
        !nameInput.value.trim()
    ) {
        showFormError(
            nameInput,
            nameError,
            "Recipe name is required."
        );
        isValid = false;
    } else if (
        nameInput.value.trim().length < 2
    ) {
        showFormError(
            nameInput,
            nameError,
            "Recipe name must be at least 2 characters."
        );
        isValid = false;
    }
    if (
        !categoryInput.value.trim()
    ) {
        showFormError(
            categoryInput,
            categoryError,
            "Category is required."
        );
        isValid = false;
    } else if (
        categoryInput.value.trim().length < 2
    ) {
        showFormError(
            categoryInput,
            categoryError,
            "Category must be at least 2 characters."
        );
        isValid = false;
    }
    if (
        !imageInput.value.trim()
    ) {
        showFormError(
            imageInput,
            imageError,
            "Image URL is required."
        );
        isValid = false;
    } else if (
        !imageInput.validity.valid
    ) {
        showFormError(
            imageInput,
            imageError,
            "Please enter a valid image URL."
        );
        isValid = false;
    }
    if (
        !stepsInput.value.trim()
    ) {

        showFormError(
            stepsInput,
            stepsError,
            "Recipe steps are required."
        );

        isValid = false;

    } else if (
        stepsInput.value.trim().length < 10
    ) {
        showFormError(
            stepsInput,
            stepsError,
            "Steps must be at least 10 characters."
        );
        isValid = false;
    }
    const rows =
        ingredientRows.querySelectorAll(
            ".ingredient-row"
        );
    rows.forEach(
        (row, index) => {
            const ingredientInput =
                row.querySelector(
                    'input[name="ingredient"]'
                );
            const measureInput =
                row.querySelector(
                    'input[name="measure"]'
                );
            const ingredientError =
                row.querySelector(
                    ".ingredient-error"
                )
            const measureError =
                row.querySelector(
                    ".measure-error"
                );
            const ingredientErrorId =
                `ingredient-error-${index}`;
            const measureErrorId =
                `measure-error-${index}`;
            ingredientError.id =
                ingredientErrorId;
            measureError.id =
                measureErrorId;
            ingredientError.textContent =
                "";
            measureError.textContent =
                "";
            if (
                !ingredientInput.value.trim()
            ) {
                ingredientError.textContent =
                    "Please enter an ingredient.";
                ingredientInput.setAttribute(
                    "aria-describedby",
                    ingredientErrorId
                );
                isValid = false;
            }
            if (
                !measureInput.value.trim()
            ) {
                measureError.textContent =
                    "Please enter a measure.";
                measureInput.setAttribute(
                    "aria-describedby",
                    measureErrorId
                );
                isValid = false;
            }
        }
    );
    return isValid;
}
ownRecipeForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault();
        const isValid =
            validateOwnRecipeForm();
        if (!isValid) {
            return;
        }
        const ingredients = [];
        const rows =
            ingredientRows.querySelectorAll(
                ".ingredient-row"
            );
        rows.forEach(
            (row) => {
                const ingredient =
                    row.querySelector(
                        'input[name="ingredient"]'
                    ).value.trim();
                const measure =
                    row.querySelector(
                        'input[name="measure"]'
                    ).value.trim();
                ingredients.push({
                    name: ingredient,
                    measure: measure
                });
            }
        );
        const recipe = {
            id:
                `own-${Date.now()}`,
            name:
                document.querySelector(
                    "#own-name"
                ).value.trim(),
            category:
                document.querySelector(
                    "#own-category"
                ).value.trim(),
            area:
                "Yours",
            image:
                document.querySelector(
                    "#own-image"
                ).value.trim(),
            steps:
                document.querySelector(
                    "#own-steps"
                ).value.trim()
                    .split("\n")
                    .map(
                        (step) =>
                            step.trim()
                    )
                    .filter(Boolean),
            ingredients:
                ingredients,
            youtube:
                "",
            source:
                "",
            own:
                true
        };
        addOwnRecipe(
            recipe
        );
        showToast(
            "Recipe saved"
        );
        ownRecipeForm.reset();
        ingredientRows.innerHTML =
            "";
        ingredientRows.appendChild(
            createIngredientRow()
        );
    }
);