// STEPS
const steps = document.querySelectorAll(".form-step");
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");

let currentStep = 0;
let isSubmitting = false;


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


// HERO → SCROLL
function startForm() {
    const form = document.querySelector("#surveyForm");

    form.scrollIntoView({
        behavior: "smooth"
    });

    form.style.opacity = 0;
    setTimeout(() => {
        form.style.opacity = 1;
    }, 100);
}


// SUBMIT GOMB (FONTOS: button id="submitBtn")
document.getElementById("submitBtn").addEventListener("click", function(){

    if (isSubmitting) return;
    isSubmitting = true;

    const form = document.getElementById("surveyForm");
    const data = new FormData(form);

    let result = {};

    data.forEach((value, key) => {
        if (result[key]) {
            result[key] += ", " + value;
        } else {
            result[key] = value;
        }
    });

    console.log(result);

    result.email = result.email?.trim().toLowerCase();

    if (!result.igeny) {
        result.igeny = "nincs megadva";
    }

    if (!result.email) {
        alert("Add meg az email címed!");
        isSubmitting = false;
        return;
    }

    if (!result.email.includes("@")) {
        alert("Érvénytelen email!");
        isSubmitting = false;
        return;
    }

    // ADMIN EMAIL
    emailjs.send("service_gi1vj2r", "template_m0utevq", result)
    .then(function() {

        // AUTO REPLY
        emailjs.send("service_gi1vj2r", "template_ciz2tq2", result);

        alert("Sikeresen elküldve!");
        isSubmitting = false;

    }, function() {
        alert("Hiba történt!");
        isSubmitting = false;
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

document.getElementById("surveyForm").addEventListener("submit", function(e){
    e.preventDefault();
});