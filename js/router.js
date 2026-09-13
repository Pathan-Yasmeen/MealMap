export function getRoute() {
    const hash = window.location.hash;
    if (hash.startsWith("#/")) {
        return hash.slice(2) || "discover";
    }
    return hash.slice(1) || "discover";
}
export function onRouteChange(callback) {
    window.addEventListener("hashchange", callback);
}
export function updateView() {
    const route = getRoute();
    const views = document.querySelectorAll("main > section");
    const isRecipeRoute = route.startsWith("recipe/");
    views.forEach((view) => {
        if (isRecipeRoute) {
            if (
                view.id === "discover-view" ||
                view.id === "recipe-view"
            ) {
                view.hidden = false;
            } else {
                view.hidden = true;
            }
        } else if (view.id === `${route}-view`) {
            view.hidden = false;
        } else {
            view.hidden = true;
        }
    });
}
export function updateActiveNav(){
    const route=getRoute();
    const navLinks=document.querySelectorAll("header nav a");
    navLinks.forEach((link)=>{
        if(link.getAttribute("href")=== `#${route}`){
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}