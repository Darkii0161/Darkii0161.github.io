"use strict";

// Enable the scroll reveal styles only when JavaScript is available.
document.documentElement.classList.add("js");

// A small, smooth movement follows the pointer while it is over the hero heading.
const heroTitle = document.querySelector(".hero-title");

if (heroTitle && window.matchMedia("(pointer: fine)").matches) {
    heroTitle.addEventListener("pointermove", (event) => {
        const bounds = heroTitle.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;

        // Keep the movement small so it feels responsive rather than distracting.
        heroTitle.style.setProperty("--title-x", `${(x * 5).toFixed(2)}px`);
        heroTitle.style.setProperty("--title-y", `${(y * 3).toFixed(2)}px`);
    });

    heroTitle.addEventListener("pointerleave", () => {
        heroTitle.style.setProperty("--title-x", "0px");
        heroTitle.style.setProperty("--title-y", "0px");
    });
}

// Reveal sections and tool tiles as they enter the viewport.
const revealItems = document.querySelectorAll(".reveal, .tool-card");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -24px 0px"
    });

    revealItems.forEach((item, index) => {
        if (item.classList.contains("tool-card")) {
            item.style.transitionDelay = `${(index % 4) * 45}ms`;
        }
        revealObserver.observe(item);
    });
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}
