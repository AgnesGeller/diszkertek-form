// STEPS
const steps = document.querySelectorAll(".form-step");
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");

let currentStep = 0;


// STEP MEGJELENÍTÉS
function showStep(index) {
    steps.forEach((step, i) => {
        step.classList.toggle("active", i === index);
    });

    updateProgress();
}


// NEXT GOMB + VALIDÁCIÓ
nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {

        const currentInputs = steps[currentStep].querySelectorAll("input, select");

        let valid = true;

        currentInputs.forEach(input => {
            if (input.hasAttribute("required") && !input.value) {
                input.style.border = "2px solid red";
                valid = false;
            } else {
                input.style.border = "";
            }
        });

        if (!valid) return;

        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    });
});


// PREV GOMB
prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });
});


// HERO GOMB → FORM SCROLL
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
}


// FORM SUBMIT
document.getElementById("surveyForm").addEventListener("submit", function(e){
    e.preventDefault();

    const data = new FormData(this);

    let result = {};

   data.forEach((value, key) => {
    if (result[key]) {
        result[key] += ", " + value;
    } else {
        result[key] = value;
    }
});

    console.log(result);
    if (!result.igeny) {
    result.igeny = "nincs megadva";
}

    emailjs.send("service_gi1vj2r", "template_m0utevq", result)
.then(function(response) {
    alert("Sikeresen elküldve!");
}, function(error) {
    alert("Hiba történt!");
});
});


// PROGRESS BAR
const progressBar = document.getElementById("progressBar");
const stepIndicators = document.querySelectorAll(".step");

function updateProgress() {
    let percent = ((currentStep + 1) / steps.length) * 100;
    progressBar.style.width = percent + "%";

    stepIndicators.forEach((step, i) => {
        step.classList.toggle("active", i <= currentStep);
    });
}