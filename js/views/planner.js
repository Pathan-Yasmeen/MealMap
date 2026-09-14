import { getState } from "../state.js";
import { getMealById } from "../api.js";
import { createPicker } from "../components/picker.js";
const days = [
    {
        key: "mon",
        name: "Monday"
    },
    {
        key: "tue",
        name: "Tuesday"
    },
    {
        key: "wed",
        name: "Wednesday"
    },
    {
        key: "thu",
        name: "Thursday"
    },
    {
        key: "fri",
        name: "Friday"
    },
    {
        key: "sat",
        name: "Saturday"
    },
    {
        key: "sun",
        name: "Sunday"
    }
];
const meals = [
    "breakfast",
    "lunch",
    "dinner"
];
export async function renderPlanner() {
    const plannerTable = document.querySelector(".planner-table");
    if (!plannerTable) {
        return;
    }
    const plan = getState().plan;
    const plannedCount =
    Object.keys(plan).length;
    const recipeIds = Object.values(plan);
    const recipeResults = await Promise.all(
        recipeIds.map((id) => getMealById(id))
    );
    const recipes = {};
    recipeResults.forEach((meal) => {
        if (meal) {
            recipes[meal.id] = meal;
        }
    });
    const rows = days
        .map((day) => {
            return `
                <tr>
                    <th scope="row">${day.name}</th>
                    ${meals
                        .map((meal) => {
                            const slot = `${day.key}-${meal}`;
                            const recipeId = plan[slot] || "";
                            const recipe = recipes[recipeId];
                            if (!recipe) {
                                return `
                                    <td>
                                        <button
                                            type="button"
                                            class="slot"
                                            data-slot="${slot}"
                                        >
                                            +
                                        </button>
                                    </td>
                                `;
                            }
                            return `
                                <td>
                                    <button
                                        type="button"
                                        class="slot"
                                        data-slot="${slot}"
                                    >
                                        <img
                                            class="slot-image"
                                            src="${recipe.image}"
                                            alt="${recipe.name}"
                                        >
                                        <span class="slot-name">
                                            ${recipe.name}
                                        </span>
                                    </button>
                                    <div class="slot-actions">
                                        <button
                                            type="button"
                                            data-action="replace"
                                            data-slot="${slot}"
                                        >
                                            Replace
                                        </button>
                                        <button
                                            type="button"
                                            data-action="remove"
                                            data-slot="${slot}"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </td>
                            `;
                        })
                        .join("")}
                </tr>
            `;
        })
        .join("");
    plannerTable.querySelector("tbody").innerHTML = rows;
    const planCount =
    document.querySelector("#plan-count");
if (planCount) {
    planCount.textContent =
        `Planned: ${plannedCount}`;
}
}
export function openPicker(meals, slot) {
    const plannerView =
        document.querySelector("#planner-view");
    plannerView.insertAdjacentHTML(
        "beforeend",
        createPicker(meals, slot)
    );
    const searchInput =
        document.querySelector("#pick-search");
    searchInput.focus();
}
export function closePicker() {
    const picker =
        document.querySelector(".pick-back");
    if (picker) {
        picker.remove();
    }
}
