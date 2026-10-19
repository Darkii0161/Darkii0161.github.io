"use strict";

document.documentElement.classList.add("js");

// The hero heading follows the pointer just a little on desktop.
const heroTitle = document.querySelector(".hero-title");

if (heroTitle && window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroTitle.addEventListener("pointermove", (event) => {
        const bounds = heroTitle.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;

        heroTitle.style.setProperty("--title-x", `${(x * 4).toFixed(2)}px`);
        heroTitle.style.setProperty("--title-y", `${(y * 2.5).toFixed(2)}px`);
    });

    heroTitle.addEventListener("pointerleave", () => {
        heroTitle.style.setProperty("--title-x", "0px");
        heroTitle.style.setProperty("--title-y", "0px");
    });
}

// Slowly rotate the greeting between a small set of short translations.
// Each new deletion starts roughly five seconds after the previous one.
const greeting = document.querySelector("[data-greeting]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (greeting && !reduceMotion) {
    const greetings = ["Hey", "Hola", "Salut", "Hallo", "Привет"];
    const pause = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
    let greetingIndex = 0;

    async function runGreetingLoop() {
        // Let the opening line sit still before the first animation.
        await pause(5000);

        while (true) {
            const animationStart = performance.now();
            const currentText = greeting.textContent;

            for (let length = currentText.length; length > 0; length -= 1) {
                greeting.textContent = currentText.slice(0, length - 1);
                await pause(48);
            }

            greetingIndex = (greetingIndex + 1) % greetings.length;
            const nextText = greetings[greetingIndex];

            for (const character of nextText) {
                greeting.textContent += character;
                await pause(92);
            }

            const animationDuration = performance.now() - animationStart;
            await pause(Math.max(0, 5000 - animationDuration));
        }
    }

    runGreetingLoop();
}

// Fade sections and tool tiles in as they enter the viewport.
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
