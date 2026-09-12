const API_URL = "https://www.themealdb.com/api/json/v1/1/";
function normaliseMeal(meal) {
    const {
        idMeal,
        strMeal,
        strMealThumb,
        strCategory,
        strArea
    } = meal;
    return {
        id: idMeal,
        name: strMeal,
        image: strMealThumb,
        category: strCategory,
        area: strArea
    };
}
export async function searchMeals(query, signal) {
    const response = await fetch(
        `${API_URL}search.php?s=${encodeURIComponent(query)}`,
        { signal }
    );
    if (!response.ok) {
        throw new Error("Failed to fetch recipes");
    }
    const data = await response.json();
    return (data.meals || []).map(normaliseMeal);
}
export async function filterMeals(type, value, signal) {
    const response = await fetch(
        `${API_URL}filter.php?${type}=${value}`,
        { signal }
    );
    if (!response.ok) {
        throw new Error("Failed to fetch recipes");
    }
    const data = await response.json();
    return (data.meals || []).map((meal) => ({
        id: meal.idMeal,
        name: meal.strMeal,
        image: meal.strMealThumb,
        category: type === "c" ? value : "",
        area: type === "a" ? value : ""
    }));
}
export async function getMealById(id, signal) {
    const response = await fetch(
        `${API_URL}lookup.php?i=${id}`,
        { signal }
    );
    if (!response.ok) {
        throw new Error("Failed to fetch recipe");
    }
    const data = await response.json();
    if (!data.meals) {
        return null;
    }
    return normaliseMeal(data.meals[0]);
}
export async function getCategories() {
    const response = await fetch(
        `${API_URL}list.php?c=list`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }
    const data = await response.json();
    return data.meals || [];
}
export async function getCuisines() {
    const response = await fetch(
        `${API_URL}list.php?a=list`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch cuisines");
    }
    const data = await response.json();
    return data.meals || [];
}

