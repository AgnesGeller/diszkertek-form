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


// NEXT GOMB (VALIDÁCIÓ NÉLKÜL)
nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {

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
    currentStep = 0;
    showStep(currentStep);

    document.querySelector(".form-step.active").scrollIntoView({
    behavior: "smooth",
    block: "start"
    });
}

// SUBMIT
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

    // HIÁNYZÓ ADATOK KEZELÉSE
    if (!result.dokumentumok) result.dokumentumok = "nincs megadva";
    if (!result.funkcio) result.funkcio = "nincs megadva";
    if (!result.stilus) result.stilus = "nincs megadva";
    if (!result.fenntartas) result.fenntartas = "nincs megadva";
    if (!result.taroloTipus) result.taroloTipus = "nincs megadva";
    if (!result.alap) result.alap = "nincs megadva";
    if (!result.ontozes) result.ontozes = "nem";

    result.email = result.email?.trim().toLowerCase();

    console.log(result);

    // EMAIL VALIDÁCIÓ (CSAK ITT MARAD)
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

    // EMAIL KÜLDÉS
    emailjs.send("service_gi1vj2r", "template_m0utevq", result)
    .then(function() {

        emailjs.send("service_gi1vj2r", "template_ciz2tq2", result);

        showSuccessModal();
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


// SZÁLLÁS LOGIKA
function toggleSzallas(value) {
    const box = document.getElementById("szallasExtra");
    box.style.display = (value === "igen") ? "block" : "none";
}

function togglePihenes(value) {
    const box = document.getElementById("pihenesExtra");
    box.style.display = (value === "igen") ? "block" : "none";
}

function toggleSutes(value) {
    const box = document.getElementById("sutesExtra");
    box.style.display = (value === "igen") ? "block" : "none";
}

function toggleGyerek(value) {
    document.getElementById("gyerekExtra").style.display =
        (value === "igen") ? "block" : "none";
}

function toggleAllat(value) {
    document.getElementById("allatExtra").style.display =
        (value === "igen") ? "block" : "none";
}

function showSuccessModal() {
    document.getElementById("successModal").classList.add("show");
}

function closeModal() {
    document.getElementById("successModal").classList.remove("show");
}
document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.querySelector('input[name="datum"]');
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
});

function toggleTakaras(value) {
    const box = document.getElementById("takarasExtra");

    if (value === "igen") {
        box.style.display = "block";
    } else {
        box.style.display = "none";
    }
}


const stepDots = document.querySelectorAll(".step");

stepDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        currentStep = index;
        showStep(currentStep);

        window.scrollTo({
            top: document.querySelector("#surveyForm").offsetTop - 50,
            behavior: "smooth"
        });
    });
});

function toggleTarolo(value) {
    document.getElementById("taroloExtra").style.display =
        (value === "igen") ? "block" : "none";
}

function toggleTarolo(value) {
    const box = document.getElementById("taroloExtra");

    if (value === "igen") {
        box.style.display = "block";
    } else {
        box.style.display = "none";
    }
}