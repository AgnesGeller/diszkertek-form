const steps = document.querySelectorAll(".form-step");
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");

let currentStep = 0;

function showStep(index) {
    steps.forEach((step, i) => {
        step.classList.toggle("active", i === index);
    });

    updateProgress(); // EZ ÚJ
}

nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    });
});

prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });
});

function startForm() {
    const form = document.querySelector("#surveyForm");

    form.scrollIntoView({
        behavior: "smooth"
    });

    form.style.transition = "opacity 0.5s";
form.style.opacity = 0;

setTimeout(() => {
    form.style.opacity = 1;
}, 100);

    setTimeout(() => {
        form.style.opacity = 1;
    }, 300);
}

// FORM SUBMIT
document.getElementById("surveyForm").addEventListener("submit", function(e){
    e.preventDefault();

    const data = new FormData(this);

    let result = {};
    data.forEach((value, key) => {
        result[key] = value;
    });

    console.log(result);

    alert("Sikeres beküldés!");
});

const progressBar = document.getElementById("progressBar");
const stepIndicators = document.querySelectorAll(".step");

function updateProgress() {
    let percent = ((currentStep + 1) / steps.length) * 100;
    progressBar.style.width = percent + "%";

    stepIndicators.forEach((step, i) => {
        step.classList.toggle("active", i <= currentStep);
    });
}