// ==============================
// HELPERS
// ==============================

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];


// ==============================
// ELEMENT
// ==============================

const bootScreen = $("#bootScreen");
const welcomeScreen = $("#welcomeScreen");
const desktop = $("#desktop");

const enterBtn = $("#enterBtn");

const icons = $$(".icon");
const windows = $$(".window");

const clock = $("#clock");

const lightbox = $("#lightbox");
const bigImage = $("#bigImage");
const closeGallery = $("#closeGallery");

const videos = $$("video");

let highestZ = 10;


// ==============================
// BOOT SCREEN
// ==============================

window.addEventListener("load", () => {

    if (desktop) {
        desktop.style.display = "none";
    }

    setTimeout(() => {

        bootScreen?.classList.add("hidden");

        setTimeout(() => {

            if (bootScreen) {
                bootScreen.style.display = "none";
            }

            if (welcomeScreen) {
                welcomeScreen.style.display = "grid";
            }

        }, 500);

    }, 2600);

});


// ==============================
// ENTER DESKTOP
// ==============================

enterBtn?.addEventListener("click", () => {

    welcomeScreen.style.display = "none";

    if (desktop) {
        desktop.style.display = "block";
    }

});


// ==============================
// WINDOW SYSTEM
// ==============================

function focusWindow(win) {

    if (!win) return;

    win.style.zIndex = ++highestZ;

}


function openWindow(id) {

    const win = document.getElementById(id);

    if (!win) return;

    win.style.display = "block";

    requestAnimationFrame(() => {
        win.classList.add("active");
    });

    focusWindow(win);

}


function closeWindow(win) {

    if (!win) return;

    win.classList.remove("active");

    stopVideos(win);

    setTimeout(() => {

        win.style.display = "none";

    }, 250);

}


function stopVideos(container) {

    container.querySelectorAll("video")
        .forEach(video => video.pause());

}


// ==============================
// OPEN WINDOWS
// ==============================

icons.forEach(icon => {

    icon.addEventListener("click", () => {

        openWindow(icon.dataset.window);

    });

});


// ==============================
// CLOSE BUTTONS
// ==============================

document.addEventListener("click", e => {

    const closeButton = e.target.closest(".close");

    if (!closeButton) return;

    e.preventDefault();
    e.stopPropagation();

    const win = closeButton.closest(".window");

    closeWindow(win);

});


// ==============================
// WINDOW FOCUS
// ==============================

windows.forEach(win => {

    win.addEventListener("pointerdown", e => {

        if (e.target.closest(".close")) {
            return;
        }

        focusWindow(win);

    });

});


// ==============================
// DRAG WINDOWS
// ==============================

windows.forEach(win => {

    const titlebar = win.querySelector(".titlebar");

    if (!titlebar) return;


    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;


    titlebar.addEventListener("pointerdown", e => {

        if (e.target.closest(".close")) {
            return;
        }


        dragging = true;

        focusWindow(win);


        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;


        titlebar.setPointerCapture(e.pointerId);

    });



    titlebar.addEventListener("pointermove", e => {

        if (!dragging) return;


        win.style.left =
            `${e.clientX - offsetX}px`;


        win.style.top =
            `${e.clientY - offsetY}px`;

    });



    titlebar.addEventListener("pointerup", () => {

        dragging = false;

    });


});


// ==============================
// LIGHTBOX
// ==============================

$(".gallery")?.addEventListener("click", e => {

    const img = e.target.closest("img");

    if (!img) return;


    bigImage.src = img.src;

    lightbox.style.display = "grid";

});



function hideLightbox() {

    if (!lightbox) return;

    lightbox.style.display = "none";

}



closeGallery?.addEventListener(
    "click",
    hideLightbox
);



lightbox?.addEventListener("click", e => {

    if (e.target === lightbox) {

        hideLightbox();

    }

});


// ==============================
// ESC CLOSE
// ==============================

document.addEventListener("keydown", e => {

    if (e.key !== "Escape") return;


    hideLightbox();


    windows.forEach(win => {

        if (win.style.display === "block") {

            closeWindow(win);

        }

    });

});


// ==============================
// CLOCK
// ==============================

function updateClock() {

    if (!clock) return;


    clock.textContent =
        new Date().toLocaleTimeString("sv-SE", {

            hour: "2-digit",
            minute: "2-digit"

        });

}


updateClock();

setInterval(updateClock, 1000);


// ==============================
// VIDEO CONTROL
// ==============================

videos.forEach(video => {

    video.addEventListener("play", () => {


        videos.forEach(other => {

            if (other !== video) {

                other.pause();

            }

        });


    });

});