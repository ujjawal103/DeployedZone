
    const avatar = document.getElementById("avatar");
    const popup = document.getElementById("popup");
    const closePopup = document.getElementById("closeBtn");

    // Open popup
    avatar.addEventListener("click", () => {
        popup.classList.remove("hidden"); // Show popup
        popup.style.display="flex";
    });

    // Close popup
    closePopup.addEventListener("click", () => {
        popup.classList.add("hidden"); // Hide popup
        popup.style.display="none";
    });





let file;
let image = document.querySelector("#newAvatar")
image.addEventListener("change",function(event){
// console.log(event.target.files[0]);
file = event.target.files[0];
const fileURL = URL.createObjectURL(file);
document.querySelector(".large-avatar").src = fileURL;
console.log(fileURL);
})