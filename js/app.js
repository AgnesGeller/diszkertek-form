const EMAILJS_SERVICE_ID = "service_gi1vj2r";
const EMAILJS_TEMPLATE_CUSTOMER = "template_m0utevq";
const EMAILJS_TEMPLATE_INTERNAL = "template_ciz2tq2";

const form = document.getElementById("surveyForm");
const steps = Array.from(document.querySelectorAll(".form-step"));
const nextButtons = document.querySelectorAll(".next-btn");
const prevButtons = document.querySelectorAll(".prev-btn");
const stepIndicators = Array.from(document.querySelectorAll(".step"));
const progressBar = document.getElementById("progressBar");
const submitButton = document.getElementById("submitBtn");
const successModal = document.getElementById("successModal");

let currentStep = 0;
let isSubmitting = false;

const EMAIL_FIELD_LABELS = {
    nev: "Név",
    email: "Email",
    datum: "Dátum",
    cim: "Helyszín címe",
    ovezet: "Lakóövezeti besorolás",
    tavolsag: "Kiszállási távolság",
    szallas: "Szállás biztosított",
    szallasMegjegyzes: "Szállás részletei",
    telekMeret: "Telek mérete",
    kertTerulet: "Tervezési terület mérete",
    csaladLetszam: "Család létszáma",
    gyerek: "Van gyermek",
    gyerekKor: "Gyermek életkora",
    allat: "Van háziállat",
    allatTipus: "Háziállat típusa",
    funkcio: "Funkcionális igények",
    stilus: "Esztétikai stílus",
    egyediIgeny: "Egyedi igény",
    oldalTakaras: "Oldalsó takarás szükséges",
    takarasTipus: "Takarás típusa",
    takarasMegjegyzes: "Takarás megjegyzés",
    hatsoBelathato: "Hátsó telek belátható",
    kapcsolat: "Épület-kert kapcsolat",
    zavar: "Zavart okozó látvány",
    vizualMegjegyzes: "Vizuális megjegyzés",
    megjegyzes: "Térkapcsolati megjegyzés",
    koltseg: "Költségkeret",
    koltsegPontosan: "Pontos költség",
    terepHossz: "Tereprendezés hossza",
    terepSzelesseg: "Tereprendezés szélessége",
    terepTerulet: "Tereprendezési terület",
    szintkulonbseg: "Szintkülönbség",
    teruletJellemzes: "Terület jellemzése",
    talajJellemzes: "Talaj jellemzése",
    tobbletFold: "Többletföld",
    foldHiany: "Földhiány",
    terepMod: "Tereprendezési mód",
    gepesitettTerulet: "Gépesített terület",
    kezierosTerulet: "Kézierős terület",
    foldhordasGeppel: "Földhordás géppel",
    foldhordasTalicskaval: "Földhordás talicskával",
    foldhordasVodorrel: "Földhordás vödörrel",
    lepcsofokDb: "Lépcsőfokok száma",
    terepMegjegyzes: "Tereprendezési megjegyzés",
    fenntartasExtra: "Fenntartási megoldások",
    fenntartas: "Fenntartási szint",
    taroloVan: "Szeretne tárolót",
    taroloTipus: "Tároló típusa",
    hossz: "Tároló hossza",
    szelesseg: "Tároló szélessége",
    magassag: "Tároló magassága",
    terulet: "Tároló területe",
    alap: "Alaptípus",
    taroloMegjegyzes: "Tároló megjegyzés",
    fenntartasiMegjegyzes: "Fenntartási megjegyzés",
    fuHossz: "Füvesítés hossza",
    fuSzelesseg: "Füvesítés szélessége",
    fuTerulet: "Füvesítési terület",
    fuTipus: "Füvesítés típusa",
    fuMunka: "Füvesítési munkák",
    fuMegjegyzes: "Füvesítési megjegyzés",
    faDb: "Fa darabszám",
    faTeruletHossz: "Faültetés hossza",
    faTeruletSzelesseg: "Faültetés szélessége",
    faJellemzo: "Fa jellemzők",
    talajtakaro: "Talajtakarás",
    sovenyHossz: "Sövény hossza",
    sovenyTotav: "Sövény tőtáv",
    sovenySortav: "Sövény sortáv",
    agyasDb: "Ágyások száma",
    agyasMeret: "Ágyás mérete",
    novenyekSzama: "Növények száma",
    totav: "Tőtáv",
    sortav: "Sortáv",
    kedveltNovenyek: "Kedvelt növények",
    novenyzetMegjegyzes: "Növényzeti megjegyzés",
    gepek: "Szükséges gépek",
    egyebGepek: "Egyéb gép vagy jármű",
    bobcatTonna: "Bobcat tömege",
    forgoKotroTonna: "Forgó kotró tömege",
    anyagMozgatas: "Anyagmozgatás módja",
    mozgatasiTavGeppel: "Mozgatás géppel",
    mozgatasiTavTalicska: "Mozgatás talicskával",
    mozgatasiTavVodor: "Mozgatás vödörrel",
    foldElszallitas: "Föld elszállítás",
    termofold: "Termőföld",
    komposzt: "Komposzt",
    tragya: "Marhatrágya",
    anyagMozgatasMegjegyzes: "Anyagmozgatási megjegyzés",
    dokumentumok: "Átadott dokumentumok",
    egyebDokumentum: "Egyéb dokumentum",
    projektCel: "A megrendelő fő célja",
    foProblema: "Legfontosabb megoldandó probléma",
    megvalositasModja: "Megvalósítás módja",
    tervezettKezdes: "Tervezett kezdés",
    tervezettBefejezes: "Tervezett befejezés",
    heszEllenorzes: "HÉSZ ellenőrzés",
    megrendeloAlairasa: "Megrendelő aláírása",
    egyebMegjegyzes: "Egyéb megjegyzés"
};

const SUMMARY_SECTIONS = [
    {
        title: "Alapadatok",
        fields: ["nev", "email", "datum", "cim", "ovezet", "tavolsag", "szallas", "szallasMegjegyzes", "telekMeret", "kertTerulet"]
    },
    {
        title: "Funkcionális igények",
        fields: ["csaladLetszam", "gyerek", "gyerekKor", "allat", "allatTipus", "funkcio", "stilus", "egyediIgeny"]
    },
    {
        title: "Vizuális szempontok",
        fields: ["oldalTakaras", "takarasTipus", "takarasMegjegyzes", "hatsoBelathato", "kapcsolat", "zavar", "vizualMegjegyzes", "megjegyzes"]
    },
    {
        title: "Költségkeret",
        fields: ["koltseg", "koltsegPontosan"]
    },
    {
        title: "Tereprendezés",
        fields: ["terepHossz", "terepSzelesseg", "terepTerulet", "szintkulonbseg", "teruletJellemzes", "talajJellemzes", "tobbletFold", "foldHiany", "terepMod", "gepesitettTerulet", "kezierosTerulet", "foldhordasGeppel", "foldhordasTalicskaval", "foldhordasVodorrel", "lepcsofokDb", "terepMegjegyzes"]
    },
    {
        title: "Fenntartás és tároló",
        fields: ["fenntartasExtra", "fenntartas", "fenntartasiMegjegyzes", "taroloVan", "taroloTipus", "hossz", "szelesseg", "magassag", "terulet", "alap", "taroloMegjegyzes"]
    },
    {
        title: "Füvesítés",
        fields: ["fuHossz", "fuSzelesseg", "fuTerulet", "fuTipus", "fuMunka", "fuMegjegyzes"]
    },
    {
        title: "Növényzet",
        fields: ["faDb", "faTeruletHossz", "faTeruletSzelesseg", "faJellemzo", "talajtakaro", "sovenyHossz", "sovenyTotav", "sovenySortav", "agyasDb", "agyasMeret", "novenyekSzama", "totav", "sortav", "kedveltNovenyek", "novenyzetMegjegyzes"]
    },
    {
        title: "Anyagmozgatás és gépek",
        fields: ["gepek", "egyebGepek", "bobcatTonna", "forgoKotroTonna", "anyagMozgatas", "mozgatasiTavGeppel", "mozgatasiTavTalicska", "mozgatasiTavVodor", "foldElszallitas", "termofold", "komposzt", "tragya", "anyagMozgatasMegjegyzes"]
    },
    {
        title: "Véglegesítés",
        fields: ["dokumentumok", "egyebDokumentum", "projektCel", "foProblema", "megvalositasModja", "tervezettKezdes", "tervezettBefejezes", "heszEllenorzes", "megrendeloAlairasa", "egyebMegjegyzes"]
    }
];

function getCurrentStepElement() {
    return steps[currentStep];
}

function updateProgress() {
    const percent = ((currentStep + 1) / steps.length) * 100;
    progressBar.style.width = `${percent}%`;

    stepIndicators.forEach((indicator, index) => {
        indicator.classList.toggle("active", index <= currentStep);
    });
}

function showStep(index) {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));

    steps.forEach((step, stepIndex) => {
        step.classList.toggle("active", stepIndex === currentStep);
    });

    stepIndicators.forEach((indicator, indicatorIndex) => {
        indicator.classList.toggle("active", indicatorIndex <= currentStep);
    });

    updateProgress();
}

function scrollToForm() {
    form.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function validateCurrentStep() {
    const current = getCurrentStepElement();

    if (!current) {
        return true;
    }

    const fields = current.querySelectorAll("input, select, textarea");

    for (const field of fields) {
        if (field.offsetParent === null && field.type !== "hidden") {
            continue;
        }

        if (!field.checkValidity()) {
            field.reportValidity();
            field.focus();
            return false;
        }
    }

    return true;
}

function collectFormData() {
    const formData = new FormData(form);
    const result = {};

    formData.forEach((value, key) => {
        if (result[key]) {
            result[key] = `${result[key]}, ${value}`;
        } else {
            result[key] = value;
        }
    });

    const fallbackValues = {
        dokumentumok: "nincs megadva",
        funkcio: "nincs megadva",
        stilus: "nincs megadva",
        fenntartas: "nincs megadva",
        fenntartasExtra: "nincs megadva",
        terepMod: "nincs megadva",
        taroloTipus: "nincs megadva",
        alap: "nincs megadva",
        gepek: "nincs megadva",
        anyagMozgatas: "nincs megadva",
        talajtakaro: "nincs megadva",
        fuTipus: "nincs megadva",
        fuMunka: "nincs megadva",
        faJellemzo: "nincs megadva",
        takarasTipus: "nincs megadva"
    };

    Object.entries(fallbackValues).forEach(([key, fallback]) => {
        if (!result[key]) {
            result[key] = fallback;
        }
    });

    if (result.email) {
        result.email = result.email.trim().toLowerCase();
    }

    return result;
}

function formatFieldValue(value) {
    if (value == null || value === "") {
        return "nincs megadva";
    }

    return String(value).trim();
}

function formatSummary(result) {
    return SUMMARY_SECTIONS
        .map((section) => {
            const lines = section.fields
                .map((field) => {
                    const value = formatFieldValue(result[field]);

                    if (value === "nincs megadva") {
                        return null;
                    }

                    const label = EMAIL_FIELD_LABELS[field] || field;
                    return `- ${label}: ${value}`;
                })
                .filter(Boolean);

            if (!lines.length) {
                return null;
            }

            return `${section.title}\n${lines.join("\n")}`;
        })
        .filter(Boolean)
        .join("\n\n");
}

function buildEmailPayloads(result) {
    const submittedAt = new Date().toLocaleString("hu-HU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });

    const summary = formatSummary(result);
    const subjectBase = result.nev
        ? `Új helyszíni felmérés - ${result.nev}`
        : "Új helyszíni felmérés";

    const basePayload = {
        ...result,
        submitted_at: submittedAt,
        form_name: "Díszkertek helyszíni felmérő",
        customer_name: formatFieldValue(result.nev),
        customer_email: formatFieldValue(result.email),
        reply_to: formatFieldValue(result.email),
        project_address: formatFieldValue(result.cim),
        project_goal: formatFieldValue(result.projektCel)
    };

    const customerSummary = [
            `Név: ${formatFieldValue(result.nev)}`,
            `Email: ${formatFieldValue(result.email)}`,
            `Helyszín: ${formatFieldValue(result.cim)}`,
            `Fő cél: ${formatFieldValue(result.projektCel)}`,
            `Beküldés ideje: ${submittedAt}`
        ].join("\n");

    const internalPayload = {
        ...basePayload,
        email_subject: subjectBase,
        internal_subject: `${subjectBase} | belső értesítés`,
        summary,
        internal_summary: summary,
        intro_line: "Új helyszíni felmérő érkezett a weboldalról.",
        closing_line: "A teljes összefoglaló alább olvasható."
    };

    const customerPayload = {
        ...basePayload,
        email_subject: "Köszönjük a helyszíni felmérő kitöltését",
        customer_subject: "Köszönjük a helyszíni felmérő kitöltését",
        summary: customerSummary,
        customer_summary: customerSummary,
        customer_intro_line: "Köszönjük, hogy kitöltötted a Díszkertek helyszíni felmérő űrlapját.",
        customer_closing_line: "Hamarosan felvesszük veled a kapcsolatot a megadott elérhetőségen."
    };

    return { internalPayload, customerPayload };
}

function setConditionalVisibility(trigger) {
    const targetId = trigger.dataset.toggleTarget;

    if (!targetId) {
        return;
    }

    const target = document.getElementById(targetId);

    if (!target) {
        return;
    }

    const shouldShow = trigger.value === "igen";
    target.hidden = !shouldShow;
}

function initializeConditionals() {
    document.querySelectorAll("[data-toggle-target]").forEach((field) => {
        setConditionalVisibility(field);

        field.addEventListener("change", () => {
            setConditionalVisibility(field);
        });
    });
}

function initializeDropdownBehavior() {
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.addEventListener("click", (event) => {
            if (event.target.tagName === "INPUT" || event.target.tagName === "LABEL") {
                event.stopPropagation();
            }
        });
    });
}

function showSuccessModal() {
    successModal.classList.add("show");
    successModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
    successModal.classList.remove("show");
    successModal.setAttribute("aria-hidden", "true");
}

async function submitSurvey() {
    if (isSubmitting) {
        return;
    }

    if (!validateCurrentStep()) {
        return;
    }

    if (!form.reportValidity()) {
        return;
    }

    const result = collectFormData();

    if (!result.email || !result.email.includes("@")) {
        alert("Kérlek, adj meg egy érvényes email-címet.");
        return;
    }

    const { internalPayload, customerPayload } = buildEmailPayloads(result);

    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = "Küldés folyamatban...";

    try {
        await Promise.all([
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CUSTOMER, customerPayload),
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_INTERNAL, internalPayload)
        ]);

        showSuccessModal();
        form.reset();
        initializeConditionals();
        showStep(0);
    } catch (error) {
        console.error("EmailJS hiba:", error);
        alert("Hiba történt a küldés során. Kérlek, próbáld meg újra.");
    } finally {
        isSubmitting = false;
        submitButton.disabled = false;
        submitButton.textContent = "Küldés";
    }
}

function startForm() {
    showStep(0);
    scrollToForm();
}

nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (!validateCurrentStep()) {
            return;
        }

        showStep(currentStep + 1);
        scrollToForm();
    });
});

prevButtons.forEach((button) => {
    button.addEventListener("click", () => {
        showStep(currentStep - 1);
        scrollToForm();
    });
});

stepIndicators.forEach((indicator) => {
    indicator.addEventListener("click", () => {
        const targetIndex = Number(indicator.dataset.stepTarget);

        if (Number.isNaN(targetIndex)) {
            return;
        }

        if (targetIndex > currentStep && !validateCurrentStep()) {
            return;
        }

        showStep(targetIndex);
        scrollToForm();
    });
});

submitButton.addEventListener("click", submitSurvey);

document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.querySelector('input[name="datum"]');

    if (dateInput && !dateInput.value) {
        const today = new Date().toISOString().split("T")[0];
        dateInput.value = today;
    }

    initializeConditionals();
    initializeDropdownBehavior();
    updateProgress();
});

window.startForm = startForm;
window.closeModal = closeModal;
