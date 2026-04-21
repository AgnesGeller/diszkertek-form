const steps = document.querySelectorAll(".form-step");
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");

let currentStep = 0;

function showStep(index) {
    steps.forEach((step, i) => {
        step.classList.toggle("active", i === index);
    });
}

nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        currentStep++;
        showStep(currentStep);
    });
});

prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        currentStep--;
        showStep(currentStep);
    });
});

function startForm() {
    document.querySelector("#surveyForm").scrollIntoView({
        behavior: "smooth"
    });
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