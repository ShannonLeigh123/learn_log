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

document.addEventListener("DOMContentLoaded", () => {
    const colorPicker = document.getElementById('page-color-picker');
    const pageId = colorPicker ? colorPicker.getAttribute('data-page-id') : null;

    const savedBgPhoto = localStorage.getItem('userBackgroundPhoto');
    const savedPageColor = pageId ? localStorage.getItem(`userPageColor-${pageId}`) : null;

    if (savedBgPhoto) {
        applyGlobalBackground(savedBgPhoto);
    } else if (savedPageColor) {
        applyPageColor(savedPageColor);
        if (colorPicker) colorPicker.value = savedPageColor;
    }

    document.querySelectorAll('.set-bg-btn').forEach(button => {
        button.addEventListener('click', function() {
            const newBgPath = this.getAttribute('data-bg');
            localStorage.setItem('userBackgroundPhoto', newBgPath);
            applyGlobalBackground(newBgPath);
        });
    });

    if (colorPicker) {
        colorPicker.addEventListener('input', function(event) {
            const chosenColor = event.target.value;
            localStorage.removeItem('userBackgroundPhoto');
            localStorage.setItem(`userPageColor-${pageId}`, chosenColor);
            applyPageColor(chosenColor);
        });
    }

    const resetBtn = document.getElementById('reset-bg-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('userBackgroundPhoto');
            if (pageId) {
                localStorage.removeItem(`userPageColor-${pageId}`);
            }
            document.body.style.backgroundImage = '';
            document.body.style.backgroundColor = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundPosition = '';
            document.body.style.backgroundAttachment = '';
            document.body.style.backgroundRepeat = '';
            if (colorPicker) colorPicker.value = "#ffffff";
            alert('Reset to page defaults!');
        });
    }
});

// Navbar scroll hide/show
let lastScrollTop = 0;
const navbar = document.getElementById('mainNavbar');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.classList.add('nav-hidden');
    } else {
        navbar.classList.remove('nav-hidden');
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});


