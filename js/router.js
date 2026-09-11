export function getRoute() {
    return window.location.hash.slice(1) || "discover";
}
export function onRouteChange(callback) {
    window.addEventListener("hashchange", callback);
}
export function updateView(){
    const route=getRoute();
    const views=document.querySelectorAll("main>section");
    views.forEach((view) => {
        if (view.id === `${route}-view`) {
            view.hidden=false;
        } 
        else {
            view.hidden=true;
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