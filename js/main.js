import { getRoute, onRouteChange, updateView, updateActiveNav } from "./router.js";
const currentRoute=getRoute();
console.log("Current route:", currentRoute);
onRouteChange(()=>{
    console.log("Route changed to:", getRoute());
    updateView();
    updateActiveNav();
});
const themeToggle=document.querySelector("#theme-toggle");
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    document.documentElement.dataset.theme = savedTheme;
}
themeToggle.addEventListener("click",()=>{
    const currentTheme=document.documentElement.dataset.theme;
    if(currentTheme==="dark"){
        document.documentElement.dataset.theme="light";
    }else{
        document.documentElement.dataset.theme="dark";
    }
    localStorage.setItem(
        "theme",
        document.documentElement.dataset.theme
    );
});