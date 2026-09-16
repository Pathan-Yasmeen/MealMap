import { buildShoppingList } from "../shoppingList.js";
import { readSession, writeSession } from "../storage.js";
const checkedKey = "shopping-checked";
export function renderShopping(plan, recipes) {
    const shoppingList = document.querySelector("#shopping-list");
    const emptyMessage = document.querySelector("#shopping-empty");
    const progress = document.querySelector("#shopping-progress");
    const progressText = document.querySelector(
        "#shopping-progress-text"
    );
    if (!shoppingList) {
        return;
    }
    const items = buildShoppingList(plan, recipes);
    const checkedItems = readSession(checkedKey, []);
    if (items.length === 0) {
        shoppingList.innerHTML = "";
        emptyMessage.hidden = false;
        progress.value = 0;
        progress.max = 0;
        progressText.textContent =
            "0 of 0 items remaining";
        return;
    }
    emptyMessage.hidden = true;
    shoppingList.innerHTML = items
        .map((item) => {
            const checked =
                checkedItems.includes(item.key);
            const measures =
                item.measures.length > 0
                    ? item.measures.join(", ")
                    : "No measure";
            return `
                <li class="shopping-item">
                    <label>
                        <input
                            type="checkbox"
                            class="shopping-check"
                            data-key="${item.key}"
                            ${checked ? "checked" : ""}
                        >
                        <span class="shopping-item-name">
                            ${item.label}
                        </span>
                        <span class="shopping-item-measure">
                            ${measures}
                        </span>
                    </label>
                </li>
            `;
        })
        .join("");
    const remainingItems = items.filter(
        (item) => !checkedItems.includes(item.key)
    ).length;
    progress.max = items.length;
    progress.value =
        items.length - remainingItems;
    progressText.textContent =
        `${remainingItems} of ${items.length} items remaining`;
}
export function toggleShoppingItem(key) {
    const checkedItems = readSession(
        checkedKey,
        []
    );
    if (checkedItems.includes(key)) {
        const updatedItems =
            checkedItems.filter(
                (itemKey) => itemKey !== key
            );
        writeSession(
            checkedKey,
            updatedItems
        );
    } else {
        const updatedItems = [
            ...checkedItems,
            key
        ];
        writeSession(
            checkedKey,
            updatedItems
        );
    }
}
export function getShoppingListText(plan, recipes) {
    const items = buildShoppingList(
        plan,
        recipes
    );
    if (items.length === 0) {
        return "Shopping List\n\nNo items yet.";
    }
    const lines = items.map((item) => {
        const measures =
            item.measures.length > 0
                ? item.measures.join(", ")
                : "No measure";
        return `${item.label} — ${measures}`;
    });
    return [
        "Shopping List",
        "",
        ...lines
    ].join("\n");
}