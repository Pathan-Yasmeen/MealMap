export function showToast(message) {
    let toast = document.querySelector("#toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.hidden = false;
    setTimeout(() => {
        toast.hidden = true;
    }, 2000);
}