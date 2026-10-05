// ===============================
// Background Helpers
// ===============================
function applyGlobalBackground(imagePath) {
    document.body.style.backgroundImage = `url('${imagePath}')`;
    document.body.style.backgroundColor = '';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundRepeat = 'no-repeat';
}

function applyPageColor(colorCode) {
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = colorCode;
}

// ===============================
// DOM Ready
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    // ---------- Elements ----------
    const bgUpload = document.getElementById("bg-upload");
    const clearBgBtn = document.getElementById("reset-bg-btn");
    const colorPicker = document.getElementById("page-color-picker");
    const pageId = colorPicker ? colorPicker.getAttribute("data-page-id") : null;

    // ---------- Storage Keys ----------
    const perPageKey = pageId ? `userPageColor-${pageId}` : null;
    const globalPhotoKey = "userBackgroundPhoto";
    const uploadKey = `custom_bg_${window.location.pathname}`;

    // ---------- Load Saved Backgrounds ----------
    const savedUploadBg = localStorage.getItem(uploadKey);
    const savedGlobalPhoto = localStorage.getItem(globalPhotoKey);
    const savedPageColor = perPageKey ? localStorage.getItem(perPageKey) : null;

    if (savedUploadBg) {
        document.body.style.backgroundImage = `url('${savedUploadBg}')`;
    } else if (savedGlobalPhoto) {
        applyGlobalBackground(savedGlobalPhoto);
    } else if (savedPageColor) {
        applyPageColor(savedPageColor);
        if (colorPicker) colorPicker.value = savedPageColor;
    }

    // ---------- Upload Background ----------
    if (bgUpload) {
        bgUpload.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;

                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    const MAX_WIDTH = 1920;
                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);

                    try {
                        localStorage.setItem(uploadKey, compressedBase64);
                        document.body.style.backgroundImage = `url('${compressedBase64}')`;
                    } catch (error) {
                        alert("Even after compression, this image is too large.");
                        console.error("Storage error:", error);
                    }
                };
            };

            reader.readAsDataURL(file);
        });
    }

    // ---------- Gallery Background Buttons ----------
    document.querySelectorAll(".set-bg-btn").forEach((button) => {
        button.addEventListener("click", function () {
            const newBgPath = this.getAttribute("data-bg");
            localStorage.setItem(globalPhotoKey, newBgPath);
            applyGlobalBackground(newBgPath);
        });
    });

    // ---------- Page Color Picker ----------
    if (colorPicker) {
        colorPicker.addEventListener("input", (event) => {
            const chosenColor = event.target.value;

            localStorage.removeItem(globalPhotoKey);
            localStorage.removeItem(uploadKey);

            if (perPageKey) {
                localStorage.setItem(perPageKey, chosenColor);
            }

            applyPageColor(chosenColor);
        });
    }

    // ---------- Reset Background ----------
    if (clearBgBtn) {
        clearBgBtn.addEventListener("click", (e) => {
            e.preventDefault();

            localStorage.removeItem(globalPhotoKey);
            localStorage.removeItem(uploadKey);
            if (perPageKey) localStorage.removeItem(perPageKey);

            document.body.style.backgroundImage = "";
            document.body.style.backgroundColor = "";
            document.body.style.backgroundSize = "";
            document.body.style.backgroundPosition = "";
            document.body.style.backgroundAttachment = "";
            document.body.style.backgroundRepeat = "";

            if (colorPicker) colorPicker.value = "#ffffff";

            if (bgUpload) bgUpload.value = "";

            alert("Reset to page defaults!");
        });
    }
});

// ===============================
// Navbar Hide on Scroll
// ===============================
let lastScrollTop = 0;
const navbar = document.getElementById("mainNavbar");

window.addEventListener("scroll", function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.classList.add("nav-hidden");
    } else {
        navbar.classList.remove("nav-hidden");
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});


