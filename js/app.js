const EMAILJS_SERVICE_ID = "service_gi1vj2r";
const EMAILJS_TEMPLATE_CUSTOMER = "template_m0utevq";
const EMAILJS_TEMPLATE_INTERNAL = "template_ciz2tq2";

const currencyFormatter = new Intl.NumberFormat("hu-HU");

const SERVICES = [
    {
        id: "ontozorendszer",
        name: "Öntözőrendszer",
        badge: "Automata öntözés",
        description: "Automata öntözés gyephez, ágyásokhoz és sövényekhez, zónázással és kiegészítőkkel.",
        startingPrice: 320000,
        note: "A kalkuláció a zónaszám, a vízforrás és a vezérlés alapján becsül. A végleges ajánlatot a víznyomás és a hálózat kiosztása pontosítja.",
        fields: [
            { id: "area", type: "number", label: "Öntözött terület", suffix: "m²", min: 0, step: 1, placeholder: "pl. 250" },
            { id: "zones", type: "number", label: "Tervezett zónák száma", min: 0, step: 1, placeholder: "pl. 6" },
            {
                id: "waterSource",
                type: "select",
                label: "Vízforrás",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "halozat", label: "Hálózati víz" },
                    { value: "kut", label: "Kút" },
                    { value: "ciszterna", label: "Ciszterna / esővíz" }
                ]
            },
            {
                id: "automation",
                type: "choice",
                label: "Vezérlés",
                full: true,
                options: [
                    { value: "", label: "Még nem döntöttem" },
                    { value: "nincs", label: "Kézi indítás", note: "Egyszerűbb rendszer" },
                    { value: "alap", label: "Alap automata", note: "Időzített vezérlés" },
                    { value: "okos", label: "Okos vezérlés", note: "Applikáció és időjárás alapú vezérlés" }
                ]
            },
            { id: "drip", type: "toggle", label: "Csepegtető köröket is szeretnék az ágyásokhoz", full: true },
            { id: "rainSensor", type: "toggle", label: "Esőérzékelőt is kérek", showWhen: { field: "automation", oneOf: ["alap", "okos"] }, full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Meglévő rendszer, kiállások, külön igények..." }
        ],
        shopProducts: [
            { name: "Hunter vezérlő", priceLabel: "induló ár: 69 900 Ft", description: "Időzített vagy okos vezérléshez.", url: "" },
            { name: "Csepegtető csomag", priceLabel: "induló ár: 24 900 Ft", description: "Ágyások és sövények célzott öntözéséhez.", url: "" }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const zones = numberValue(values.zones);
            const sourceFee = lookupValue(values.waterSource, {
                halozat: 0,
                kut: 90000,
                ciszterna: 65000
            });
            const automationFee = lookupValue(values.automation, {
                nincs: 0,
                alap: 38000,
                okos: 76000
            });
            const dripFee = isChecked(values.drip) ? 48000 : 0;
            const rainFee = isChecked(values.rainSensor) ? 28000 : 0;
            const raw = area * 2300 + zones * 16000 + sourceFee + automationFee + dripFee + rainFee;
            return withStartingPrice(320000, raw);
        }
    },
    {
        id: "burkolatok",
        name: "Burkolatok",
        badge: "Terasz, járda, beálló",
        description: "Kerti járdák, teraszok, beállók és burkolt közlekedők előkészítő kalkulációja.",
        startingPrice: 220000,
        note: "A burkolat végső ára a rétegrendtől, a választott terméktől és az alépítménytől is függ.",
        fields: [
            { id: "area", type: "number", label: "Burkolandó felület", suffix: "m²", min: 0, step: 1, placeholder: "pl. 85" },
            {
                id: "usage",
                type: "select",
                label: "Felhasználás",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "setany", label: "Kerti járda / sétány" },
                    { value: "terasz", label: "Terasz" },
                    { value: "beallo", label: "Autóbeálló" }
                ]
            },
            {
                id: "material",
                type: "choice",
                label: "Anyagkategória",
                full: true,
                options: [
                    { value: "", label: "Még nem döntöttem" },
                    { value: "standard", label: "Standard térkő", note: "Klasszikus megoldás" },
                    { value: "premium", label: "Prémium lap vagy térkő", note: "Finomabb megjelenés" },
                    { value: "termesko", label: "Terméskő vagy nagylap", note: "Magasabb anyagköltség" }
                ]
            },
            { id: "edging", type: "toggle", label: "Szegélyezést is kérek", full: true },
            { id: "demolition", type: "toggle", label: "Meglévő burkolat bontása is szükséges", full: true },
            { id: "drainage", type: "toggle", label: "Vízelvezetést is kérek a burkolathoz", full: true },
            {
                id: "drainageType",
                type: "select",
                label: "Vízelvezetés típusa",
                showWhen: { field: "drainage", equals: true },
                options: [
                    { value: "", label: "Válassz" },
                    { value: "pont", label: "Pontszerű összefolyó" },
                    { value: "folyoka", label: "Folyóka" },
                    { value: "komplex", label: "Komplex lejtés- és vízelvezetés" }
                ]
            },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Burkolattípus, meglévő szintkülönbség, képek..." }
        ],
        shopProducts: [
            { name: "Prémium térkő", priceLabel: "induló ár: 12 900 Ft / m²", description: "Teraszhoz és közlekedőhöz.", url: "" },
            { name: "Kerti lap", priceLabel: "induló ár: 16 500 Ft / m²", description: "Nagyobb formátumú kültéri lap.", url: "" }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const baseRate = lookupValue(values.material, {
                standard: 27000,
                premium: 36000,
                termesko: 48000
            });
            const usageAdd = lookupValue(values.usage, {
                setany: 0,
                terasz: 2500,
                beallo: 6500
            });
            const edgingFee = isChecked(values.edging) ? 65000 : 0;
            const demolitionFee = isChecked(values.demolition) ? 115000 : 0;
            const drainageFee = isChecked(values.drainage)
                ? lookupValue(values.drainageType, { pont: 85000, folyoka: 125000, komplex: 185000 }, 85000)
                : 0;
            const raw = area * (baseRate + usageAdd) + edgingFee + demolitionFee + drainageFee;
            return withStartingPrice(220000, raw);
        }
    },
    {
        id: "pergolak",
        name: "Pergolák",
        badge: "Fedett kültéri tér",
        description: "Pergola, árnyékolt kiülő vagy részben fedett kültéri élettér kalkulációja.",
        startingPrice: 890000,
        note: "A pergolák ára a méret, a szerkezet, az árnyékolás és a kiegészítők alapján változik.",
        fields: [
            { id: "area", type: "number", label: "Becsült méret", suffix: "m²", min: 0, step: 1, placeholder: "pl. 24" },
            {
                id: "type",
                type: "choice",
                label: "Pergola típusa",
                full: true,
                options: [
                    { value: "", label: "Még nem döntöttem" },
                    { value: "fa", label: "Fa pergola", note: "Melegebb természetes hatás" },
                    { value: "aluminium", label: "Alumínium pergola", note: "Tisztább, modern megjelenés" },
                    { value: "bioklimatikus", label: "Bioklimatikus rendszer", note: "Forgatható lamellás tető" }
                ]
            },
            { id: "sideShade", type: "toggle", label: "Oldalárnyékolást vagy zárható oldalfalat is szeretnék", full: true },
            {
                id: "shadeType",
                type: "select",
                label: "Oldalárnyékolás típusa",
                showWhen: { field: "sideShade", equals: true },
                options: [
                    { value: "", label: "Válassz" },
                    { value: "textil", label: "Textil árnyékoló" },
                    { value: "screen", label: "Zip-screen" },
                    { value: "lamellas", label: "Lamellás vagy fix oldalfal" }
                ]
            },
            { id: "lighting", type: "toggle", label: "Beépített világítást is kérek", full: true },
            { id: "heating", type: "toggle", label: "Kültéri fűtést vagy komfortkiegészítőt is szeretnék", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Elhelyezés, homlokzati csatlakozás, egyedi elképzelés..." }
        ],
        shopProducts: [
            { name: "Alumínium pergola rendszer", priceLabel: "induló ár: 1 190 000 Ft", description: "Közepes méretű modern pergola csomag.", url: "" },
            { name: "Zip-screen árnyékoló", priceLabel: "induló ár: 189 000 Ft / oldal", description: "Oldalárnyékoló kiegészítő pergolához.", url: "" }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const typeRate = lookupValue(values.type, {
                fa: 115000,
                aluminium: 155000,
                bioklimatikus: 235000
            });
            const sideFee = isChecked(values.sideShade)
                ? area * lookupValue(values.shadeType, { textil: 16000, screen: 26000, lamellas: 42000 }, 16000)
                : 0;
            const lightingFee = isChecked(values.lighting) ? 90000 : 0;
            const heatingFee = isChecked(values.heating) ? 160000 : 0;
            const raw = area * typeRate + sideFee + lightingFee + heatingFee;
            return withStartingPrice(890000, raw);
        }
    },
    {
        id: "jatszoteri-elemek",
        name: "Játszótéri elemek",
        badge: "Családi kerthez",
        description: "Játszótorony, hinta, homokozó vagy más játszótéri elemek kalkulációja.",
        startingPrice: 240000,
        note: "A játszótéri elemek ára a kiválasztott csomagtól, az aljzattól és a telepítés módjától függ.",
        fields: [
            {
                id: "package",
                type: "choice",
                label: "Milyen csomag érdekel?",
                full: true,
                options: [
                    { value: "", label: "Még nem döntöttem" },
                    { value: "alap", label: "Alap csomag", note: "Hinta vagy kisebb játékzóna" },
                    { value: "kozepes", label: "Közepes csomag", note: "Több elem kombinációja" },
                    { value: "nagy", label: "Nagy csomag", note: "Komplex játszótér" }
                ]
            },
            {
                id: "surface",
                type: "select",
                label: "Ütéscsillapító felület",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "nem", label: "Nem szükséges" },
                    { value: "mulcs", label: "Kéregmulcs vagy laza takarás" },
                    { value: "gumi", label: "Gumiburkolat" }
                ]
            },
            { id: "install", type: "toggle", label: "Telepítéssel együtt kérem", full: true },
            { id: "fence", type: "toggle", label: "Biztonsági elhatárolás is szükséges", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Korosztály, kedvenc elemek, elhelyezés..." }
        ],
        shopProducts: [
            { name: "Játszótorony csomag", priceLabel: "induló ár: 299 000 Ft", description: "Hinta és csúszda kombináció.", url: "" },
            { name: "Prémium hintaállvány", priceLabel: "induló ár: 169 000 Ft", description: "Kisebb kertekhez is jól illeszthető.", url: "" }
        ],
        calculate(values) {
            const packageFee = lookupValue(values.package, {
                alap: 220000,
                kozepes: 420000,
                nagy: 690000
            });
            const surfaceFee = lookupValue(values.surface, {
                nem: 0,
                mulcs: 90000,
                gumi: 240000
            });
            const installFee = isChecked(values.install) ? 65000 : 0;
            const fenceFee = isChecked(values.fence) ? 115000 : 0;
            const raw = packageFee + surfaceFee + installFee + fenceFee;
            return withStartingPrice(240000, raw);
        }
    },
    {
        id: "agyasok",
        name: "Ágyások",
        badge: "Díszágyás és ültetőfelület",
        description: "Új díszágyások kialakítása, rétegrenddel, talajjavítással és növénykiültetéssel.",
        startingPrice: 160000,
        note: "Az ágyások ára a felület, a növénysűrűség és a kiválasztott stílus szerint változik.",
        fields: [
            { id: "area", type: "number", label: "Ágyások becsült felülete", suffix: "m²", min: 0, step: 1, placeholder: "pl. 28" },
            {
                id: "style",
                type: "choice",
                label: "Ágyástípus",
                full: true,
                options: [
                    { value: "", label: "Még nem döntöttem" },
                    { value: "evelo", label: "Évelőágyás", note: "Gazdagabb virágzási váltással" },
                    { value: "cserjes", label: "Cserjés ágyás", note: "Tartósabb szerkezet" },
                    { value: "vegyes", label: "Vegyes, rétegzett ágyás", note: "Évelők és cserjék együtt" }
                ]
            },
            {
                id: "density",
                type: "select",
                label: "Növénysűrűség",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "laza", label: "Lazább" },
                    { value: "kozepes", label: "Közepes" },
                    { value: "suru", label: "Sűrű, gyorsabb összezárás" }
                ]
            },
            { id: "irrigationPrep", type: "toggle", label: "Öntözési előkészítést is kérek", full: true },
            { id: "mulch", type: "toggle", label: "Talajtakarást is kérek", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Színvilág, kedvelt növények, meglévő állomány..." }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const styleRate = lookupValue(values.style, {
                evelo: 18000,
                cserjes: 21000,
                vegyes: 26000
            });
            const densityAdd = lookupValue(values.density, {
                laza: 0,
                kozepes: 2200,
                suru: 5200
            });
            const irrigationFee = isChecked(values.irrigationPrep) ? 38000 : 0;
            const mulchFee = isChecked(values.mulch) ? area * 1200 : 0;
            const raw = area * (styleRate + densityAdd) + irrigationFee + mulchFee;
            return withStartingPrice(160000, raw);
        }
    },
    {
        id: "sovenyek",
        name: "Sövények",
        badge: "Lehatárolás és intimitás",
        description: "Új sövény telepítése, egyszeres vagy kétsoros kialakításban.",
        startingPrice: 140000,
        note: "A végleges ár a növényválasztástól, a tőtávtól és az elérhető ültetési sáv adottságaitól függ.",
        fields: [
            { id: "length", type: "number", label: "Sövény hossza", suffix: "fm", min: 0, step: 1, placeholder: "pl. 18" },
            {
                id: "plantSize",
                type: "select",
                label: "Növényméret",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "kicsi", label: "Kisebb konténeres" },
                    { value: "kozepes", label: "Közepes méret" },
                    { value: "nagy", label: "Nagyobb, takaró hatású" }
                ]
            },
            {
                id: "privacy",
                type: "choice",
                label: "Milyen takarást szeretnél?",
                full: true,
                options: [
                    { value: "", label: "Még nem döntöttem" },
                    { value: "alap", label: "Alap takarás" },
                    { value: "kozepes", label: "Közepes takarás" },
                    { value: "magas", label: "Erős intimitás" }
                ]
            },
            { id: "doubleRow", type: "toggle", label: "Kétsoros ültetést is vállalhatunk", showWhen: { field: "privacy", equals: "magas" }, full: true },
            { id: "drip", type: "toggle", label: "Csepegtető öntözést is kérek a sövényhez", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Örökzöld vagy lombhullató, milyen magasság, színek..." }
        ],
        calculate(values) {
            const length = numberValue(values.length);
            const rate = lookupValue(values.plantSize, {
                kicsi: 9000,
                kozepes: 15000,
                nagy: 25000
            });
            const privacyAdd = lookupValue(values.privacy, {
                alap: 0,
                kozepes: 2200,
                magas: 4600
            });
            const doubleRowFee = isChecked(values.doubleRow) ? length * 7000 : 0;
            const dripFee = isChecked(values.drip) ? 42000 : 0;
            const raw = length * (rate + privacyAdd) + doubleRowFee + dripFee;
            return withStartingPrice(140000, raw);
        }
    },
    {
        id: "fa-ultetes",
        name: "Fa ültetés",
        badge: "Magányos vagy csoportos fák",
        description: "Faültetés fiatalabb vagy nagyobb méretű növényanyaggal, kiemelt talajjavítással.",
        startingPrice: 95000,
        note: "Az ár a darabszám, a fa mérete és a rögzítési vagy öntözési kiegészítők szerint változik.",
        fields: [
            { id: "count", type: "number", label: "Darabszám", min: 0, step: 1, placeholder: "pl. 3" },
            {
                id: "size",
                type: "choice",
                label: "Fa mérete",
                full: true,
                options: [
                    { value: "", label: "Még nem döntöttem" },
                    { value: "fiatal", label: "Fiatalabb fa" },
                    { value: "kozepes", label: "Közepes méretű fa" },
                    { value: "nagy", label: "Nagyobb, karakteresebb fa" }
                ]
            },
            { id: "anchoring", type: "toggle", label: "Karózást és rögzítést is kérek", full: true },
            { id: "wateringBag", type: "toggle", label: "Öntözőzsákot is szeretnék", full: true },
            { id: "soilImprovement", type: "toggle", label: "Talajjavítást is kérek", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Fafaj, meglévő közművek, ültetési hely..." }
        ],
        calculate(values) {
            const count = numberValue(values.count);
            const unit = lookupValue(values.size, {
                fiatal: 65000,
                kozepes: 135000,
                nagy: 290000
            });
            const anchoringFee = isChecked(values.anchoring) ? count * 12000 : 0;
            const wateringFee = isChecked(values.wateringBag) ? count * 9000 : 0;
            const soilFee = isChecked(values.soilImprovement) ? count * 20000 : 0;
            const raw = count * unit + anchoringFee + wateringFee + soilFee;
            return withStartingPrice(95000, raw);
        }
    },
    {
        id: "szegely-epites",
        name: "Szegély építés",
        badge: "Burkolat vagy ágyás lezárása",
        description: "Ágyások, gyepfelületek és burkolatok szegélyezése különböző anyagokkal.",
        startingPrice: 120000,
        note: "A végösszeg a hossz, a vonalvezetés és az anyagválasztás alapján változik.",
        fields: [
            { id: "length", type: "number", label: "Szegély hossza", suffix: "fm", min: 0, step: 1, placeholder: "pl. 32" },
            {
                id: "material",
                type: "choice",
                label: "Szegély típusa",
                full: true,
                options: [
                    { value: "", label: "Még nem döntöttem" },
                    { value: "muanyag", label: "Műanyag vagy rejtett szegély" },
                    { value: "fem", label: "Fém szegély" },
                    { value: "corten", label: "Corten acél szegély" },
                    { value: "ko", label: "Kő vagy beton szegély" }
                ]
            },
            { id: "curves", type: "toggle", label: "Íves vonalvezetés is lesz", full: true },
            { id: "foundation", type: "toggle", label: "Betonalapozást is kérek", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Hol fut majd a szegély, milyen stílusban..." }
        ],
        calculate(values) {
            const length = numberValue(values.length);
            const rate = lookupValue(values.material, {
                muanyag: 1800,
                fem: 4200,
                corten: 7800,
                ko: 9800
            });
            const curveFee = isChecked(values.curves) ? length * 900 : 0;
            const foundationFee = isChecked(values.foundation) ? 45000 : 0;
            const raw = length * rate + curveFee + foundationFee;
            return withStartingPrice(120000, raw);
        }
    },
    {
        id: "fuvesites",
        name: "Füvesítés",
        badge: "Új gyepfelület",
        description: "Fűmagos vagy tekercses gyep telepítése, tereprendezéssel és talajelőkészítéssel.",
        startingPrice: 135000,
        note: "A végső ár a gyep típusától, a talajállapottól és a tereprendezési igénytől is függ.",
        fields: [
            { id: "area", type: "number", label: "Füvesítendő terület", suffix: "m²", min: 0, step: 1, placeholder: "pl. 180" },
            {
                id: "type",
                type: "choice",
                label: "Füvesítés típusa",
                full: true,
                options: [
                    { value: "", label: "Még nem döntöttem" },
                    { value: "mag", label: "Fűmagvetés" },
                    { value: "mag-premium", label: "Prémium fűmagkeverék" },
                    { value: "tekercs", label: "Tekercses gyep" }
                ]
            },
            {
                id: "soilPrep",
                type: "select",
                label: "Talajelőkészítés mértéke",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "alap", label: "Alap előkészítés" },
                    { value: "kozepes", label: "Közepes javítás" },
                    { value: "komplex", label: "Komplex talajjavítás" }
                ]
            },
            { id: "irrigationPrep", type: "toggle", label: "Öntözési előkészítést is kérek", full: true },
            { id: "levelling", type: "toggle", label: "Külön finom tereprendezés is szükséges", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Meglévő talaj, használat, gyerekek, állatok..." }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const typeRate = lookupValue(values.type, {
                mag: 1900,
                "mag-premium": 2400,
                tekercs: 5200
            });
            const prepRate = lookupValue(values.soilPrep, {
                alap: 400,
                kozepes: 900,
                komplex: 1600
            });
            const irrigationFee = isChecked(values.irrigationPrep) ? 45000 : 0;
            const levellingFee = isChecked(values.levelling) ? 65000 : 0;
            const raw = area * (typeRate + prepRate) + irrigationFee + levellingFee;
            return withStartingPrice(135000, raw);
        }
    },
    {
        id: "bontas",
        name: "Bontás",
        badge: "Előkészítő munkák",
        description: "Meglévő szerkezetek, burkolatok, régi kertépítési elemek bontása és elszállítása.",
        startingPrice: 180000,
        note: "A bontási ár a bontandó anyagtól, a megközelíthetőségtől és a sittkezeléstől függ.",
        fields: [
            { id: "area", type: "number", label: "Érintett felület", suffix: "m²", min: 0, step: 1, placeholder: "pl. 45" },
            {
                id: "material",
                type: "choice",
                label: "Mi kerül bontásra?",
                full: true,
                options: [
                    { value: "", label: "Még nem döntöttem" },
                    { value: "zold", label: "Növényzet / könnyű szerkezet" },
                    { value: "burkolat", label: "Burkolat vagy beton" },
                    { value: "falazat", label: "Falazott elem vagy támfal" },
                    { value: "vegyes", label: "Vegyes bontás" }
                ]
            },
            { id: "debris", type: "toggle", label: "Elszállítással együtt kérem", full: true },
            { id: "manualAccess", type: "toggle", label: "Nehezen megközelíthető, kézi kihordás kell", full: true },
            {
                id: "carryDistance",
                type: "number",
                label: "Kihordási távolság",
                suffix: "m",
                min: 0,
                step: 1,
                showWhen: { field: "manualAccess", equals: true },
                placeholder: "pl. 25"
            },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Milyen anyag, milyen vastagság, gépbejárás..." }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const rate = lookupValue(values.material, {
                zold: 3500,
                burkolat: 12500,
                falazat: 18000,
                vegyes: 15500
            });
            const debrisFee = isChecked(values.debris) ? 95000 : 0;
            const manualFee = isChecked(values.manualAccess) ? 80000 : 0;
            const carryFee = isChecked(values.manualAccess) ? numberValue(values.carryDistance) * 600 : 0;
            const raw = area * rate + debrisFee + manualFee + carryFee;
            return withStartingPrice(180000, raw);
        }
    },
    {
        id: "tamfal-epites",
        name: "Támfal építés",
        badge: "Szintkülönbség kezelése",
        description: "Támfal építése különböző rendszerekkel, rétegrenddel, drénnel és alapozással.",
        startingPrice: 260000,
        note: "A támfal végső ára az anyag, a magasság, az alapozás és a terepmegközelítés szerint változik.",
        fields: [
            { id: "length", type: "number", label: "Támfal hossza", suffix: "fm", min: 0, step: 1, placeholder: "pl. 12" },
            { id: "height", type: "number", label: "Átlagos magasság", suffix: "m", min: 0, step: 0.1, placeholder: "pl. 1.2" },
            {
                id: "system",
                type: "choice",
                label: "Támfal rendszer",
                full: true,
                options: [
                    { value: "", label: "Még nem döntöttem" },
                    { value: "betonblokk", label: "Beton támfalblokk" },
                    { value: "termesko", label: "Terméskő" },
                    { value: "gabion", label: "Gabion rendszer" }
                ]
            },
            {
                id: "foundation",
                type: "select",
                label: "Alapozás szintje",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "alap", label: "Alapozott" },
                    { value: "erositett", label: "Erősített alapozás" }
                ]
            },
            { id: "drainage", type: "toggle", label: "Drénrendszert is kérek", full: true },
            {
                id: "backfill",
                type: "select",
                label: "Háttöltés igénye",
                showWhen: { field: "drainage", equals: true },
                options: [
                    { value: "", label: "Válassz" },
                    { value: "normal", label: "Normál háttöltés" },
                    { value: "erositett", label: "Erősített háttöltés és geotextil" }
                ]
            },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Mennyire meredek a terep, van-e hely gépnek..." }
        ],
        shopProducts: [
            { name: "Támfalblokk rendszer", priceLabel: "induló ár: 18 500 Ft / m²", description: "Rendszerkő támfal építéshez.", url: "" },
            { name: "Gabion kosár", priceLabel: "induló ár: 42 000 Ft / db", description: "Modern, szellős támfalszerkezethez.", url: "" },
            { name: "Dréncső csomag", priceLabel: "induló ár: 19 900 Ft", description: "Vízelvezetéshez és háttöltéshez.", url: "" }
        ],
        calculate(values) {
            const length = numberValue(values.length);
            const height = numberValue(values.height);
            const systemRate = lookupValue(values.system, {
                betonblokk: 85000,
                termesko: 115000,
                gabion: 92000
            });
            const foundationFee = lookupValue(values.foundation, {
                alap: 65000,
                erositett: 140000
            });
            const drainageFee = isChecked(values.drainage) ? 85000 : 0;
            const backfillFee = isChecked(values.drainage)
                ? lookupValue(values.backfill, { normal: 45000, erositett: 92000 }, 45000)
                : 0;
            const raw = length * height * systemRate + foundationFee + drainageFee + backfillFee;
            return withStartingPrice(260000, raw);
        }
    },
    {
        id: "kerti-vilagitas",
        name: "Kerti világítás",
        badge: "Hangulat és biztonság",
        description: "Kerti hangulatvilágítás, útvilágítás vagy kiemelő fények telepítése.",
        startingPrice: 145000,
        note: "A végösszeg a lámpatestek számától, a kábelezési nyomvonaltól és az automatizálástól függ.",
        fields: [
            { id: "points", type: "number", label: "Világítási pontok száma", min: 0, step: 1, placeholder: "pl. 8" },
            {
                id: "type",
                type: "choice",
                label: "Világítás típusa",
                full: true,
                options: [
                    { value: "", label: "Még nem döntöttem" },
                    { value: "hangulat", label: "Hangulatvilágítás" },
                    { value: "setany", label: "Járda- vagy útvilágítás" },
                    { value: "vegyes", label: "Vegyes rendszer" },
                    { value: "premium", label: "Prémium kiemelő világítás" }
                ]
            },
            { id: "smart", type: "toggle", label: "Okos vezérlést is szeretnék", full: true },
            {
                id: "sceneCount",
                type: "number",
                label: "Programozott jelenetek száma",
                min: 0,
                step: 1,
                showWhen: { field: "smart", equals: true },
                placeholder: "pl. 3"
            },
            { id: "trench", type: "number", label: "Kábelárok hossza", suffix: "fm", min: 0, step: 1, placeholder: "pl. 26" },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Milyen hangulatot, milyen zónákat szeretnél kiemelni..." }
        ],
        shopProducts: [
            { name: "Kerti leszúrható lámpa", priceLabel: "induló ár: 14 900 Ft", description: "Ágyások és kis fák kiemeléséhez.", url: "" },
            { name: "Járdavilágító oszlop", priceLabel: "induló ár: 22 900 Ft", description: "Biztonságos közlekedéshez.", url: "" }
        ],
        calculate(values) {
            const points = numberValue(values.points);
            const pointRate = lookupValue(values.type, {
                hangulat: 28000,
                setany: 36000,
                vegyes: 42000,
                premium: 56000
            });
            const smartFee = isChecked(values.smart) ? 95000 : 0;
            const scenesFee = isChecked(values.smart) ? numberValue(values.sceneCount) * 18000 : 0;
            const trenchFee = numberValue(values.trench) * 1800;
            const raw = points * pointRate + smartFee + scenesFee + trenchFee;
            return withStartingPrice(145000, raw);
        }
    },
    {
        id: "kerti-aramforras",
        name: "Kerti áramforrás",
        badge: "Kültéri kiállások",
        description: "Kerti konnektorok, kültéri kiállások és áramvételi pontok tervezése és telepítése.",
        startingPrice: 165000,
        note: "A végleges ár függ a nyomvonal hosszától, a fogyasztási igénytől és az elosztó kialakításától.",
        fields: [
            { id: "points", type: "number", label: "Kültéri kiállások száma", min: 0, step: 1, placeholder: "pl. 4" },
            {
                id: "circuit",
                type: "choice",
                label: "Terhelési kategória",
                full: true,
                options: [
                    { value: "", label: "Még nem döntöttem" },
                    { value: "standard", label: "Standard kerti áram" },
                    { value: "terasz", label: "Terasz és kerti gépek" },
                    { value: "nagy", label: "Nagyobb teljesítményű kiállás" }
                ]
            },
            { id: "weatherproof", type: "toggle", label: "Prémium időjárásálló szerelvényeket kérek", full: true },
            { id: "outdoorKitchen", type: "toggle", label: "Kültéri konyhához vagy speciális fogyasztóhoz is kell kiállás", full: true },
            {
                id: "highLoad",
                type: "select",
                label: "Speciális fogyasztó típusa",
                showWhen: { field: "outdoorKitchen", equals: true },
                options: [
                    { value: "", label: "Válassz" },
                    { value: "grill", label: "Elektromos grill vagy konyhai eszköz" },
                    { value: "jacuzzi", label: "Jacuzzi vagy nagy fogyasztó" }
                ]
            },
            { id: "trench", type: "number", label: "Kábelárok hossza", suffix: "fm", min: 0, step: 1, placeholder: "pl. 18" },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Milyen eszközökhöz kell kiállás, honnan indul a hálózat..." }
        ],
        calculate(values) {
            const points = numberValue(values.points);
            const pointRate = lookupValue(values.circuit, {
                standard: 45000,
                terasz: 65000,
                nagy: 110000
            });
            const weatherFee = isChecked(values.weatherproof) ? points * 18000 : 0;
            const kitchenFee = isChecked(values.outdoorKitchen)
                ? lookupValue(values.highLoad, { grill: 95000, jacuzzi: 160000 }, 95000)
                : 0;
            const trenchFee = numberValue(values.trench) * 2200;
            const raw = points * pointRate + weatherFee + kitchenFee + trenchFee;
            return withStartingPrice(165000, raw);
        }
    },
    {
        id: "telektisztitas",
        name: "Telektisztítás",
        badge: "Előkészítés nulláról",
        description: "Elburjánzott vagy gondozatlan terület kitisztítása kertépítés előtt.",
        startingPrice: 110000,
        note: "A terület sűrűsége, a hulladék mennyisége és a tuskózás igénye erősen befolyásolja az árat.",
        fields: [
            { id: "area", type: "number", label: "Érintett terület", suffix: "m²", min: 0, step: 1, placeholder: "pl. 320" },
            {
                id: "density",
                type: "choice",
                label: "Mennyire benőtt a terület?",
                full: true,
                options: [
                    { value: "", label: "Még nem döntöttem" },
                    { value: "enyhe", label: "Enyhén benőtt" },
                    { value: "kozepes", label: "Közepesen sűrű" },
                    { value: "suru", label: "Erősen benőtt" }
                ]
            },
            { id: "removal", type: "toggle", label: "Zöldhulladék elszállítással együtt kérem", full: true },
            { id: "stumps", type: "toggle", label: "Tuskózásra is szükség lesz", full: true },
            {
                id: "stumpCount",
                type: "number",
                label: "Tuskók száma",
                min: 0,
                step: 1,
                showWhen: { field: "stumps", equals: true },
                placeholder: "pl. 4"
            },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Elhanyagolt terület, bozót, régi anyagmaradványok..." }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const rate = lookupValue(values.density, {
                enyhe: 550,
                kozepes: 1100,
                suru: 1900
            });
            const removalFee = isChecked(values.removal) ? 65000 : 0;
            const stumpFee = isChecked(values.stumps) ? numberValue(values.stumpCount) * 22000 : 0;
            const raw = area * rate + removalFee + stumpFee;
            return withStartingPrice(110000, raw);
        }
    },
    {
        id: "terep-rendezes",
        name: "Tereprendezés",
        badge: "Szintezés és földmunka",
        description: "Földmunkák, terepszintek kialakítása, finom és gépi tereprendezés.",
        startingPrice: 180000,
        note: "A tereprendezés végleges díját a szintkülönbségek, a gépi hozzáférés és a földpótlás határozza meg.",
        fields: [
            { id: "area", type: "number", label: "Érintett terület", suffix: "m²", min: 0, step: 1, placeholder: "pl. 210" },
            {
                id: "difficulty",
                type: "choice",
                label: "Munka intenzitása",
                full: true,
                options: [
                    { value: "", label: "Még nem döntöttem" },
                    { value: "enyhe", label: "Kisebb korrekció" },
                    { value: "kozepes", label: "Átlagos szintezés" },
                    { value: "eros", label: "Komolyabb földmunka" }
                ]
            },
            { id: "topsoil", type: "toggle", label: "Termőföld pótlásra is szükség lesz", full: true },
            {
                id: "topsoilQty",
                type: "number",
                label: "Becsült termőföld mennyiség",
                suffix: "m³",
                min: 0,
                step: 0.5,
                showWhen: { field: "topsoil", equals: true },
                placeholder: "pl. 12"
            },
            {
                id: "machineAccess",
                type: "select",
                label: "Gépbejárás",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "jo", label: "Jó gépi hozzáférés" },
                    { value: "korlatozott", label: "Korlátozott hozzáférés" },
                    { value: "nehez", label: "Nehéz megközelítés" }
                ]
            },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Lejtés, töltés, rézsű, szűk átjáró, fal melletti sáv..." }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const rate = lookupValue(values.difficulty, {
                enyhe: 3200,
                kozepes: 5200,
                eros: 8200
            });
            const topsoilFee = isChecked(values.topsoil) ? numberValue(values.topsoilQty) * 18000 : 0;
            const accessFee = lookupValue(values.machineAccess, {
                jo: 0,
                korlatozott: 65000,
                nehez: 125000
            });
            const raw = area * rate + topsoilFee + accessFee;
            return withStartingPrice(180000, raw);
        }
    },
    {
        id: "sziklakert-epites",
        name: "Sziklakert építés",
        badge: "Természetes kőkompozíció",
        description: "Sziklakerti felületek kialakítása kőanyaggal, rétegrenddel és opcionális növénykiültetéssel.",
        startingPrice: 150000,
        note: "A végső ár a kőanyag, a növényezés és a domborzat kialakítása szerint alakul.",
        fields: [
            { id: "area", type: "number", label: "Sziklakert felülete", suffix: "m²", min: 0, step: 1, placeholder: "pl. 16" },
            {
                id: "stone",
                type: "choice",
                label: "Kőanyag típusa",
                full: true,
                options: [
                    { value: "", label: "Még nem döntöttem" },
                    { value: "andezit", label: "Andezit" },
                    { value: "meszko", label: "Mészkő" },
                    { value: "diszko", label: "Dekoratív vegyes kő" }
                ]
            },
            { id: "planting", type: "toggle", label: "Növényekkel együtt kérem", full: true },
            {
                id: "plantStyle",
                type: "select",
                label: "Növényezés jellege",
                showWhen: { field: "planting", equals: true },
                options: [
                    { value: "", label: "Válassz" },
                    { value: "visszafogott", label: "Visszafogott" },
                    { value: "kozepes", label: "Közepes" },
                    { value: "gazdag", label: "Gazdag növényesítés" }
                ]
            },
            { id: "weedBarrier", type: "toggle", label: "Gyomfogó réteget is kérek", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Napfény, stílus, kedvelt kőszínek..." }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const rate = lookupValue(values.stone, {
                andezit: 22000,
                meszko: 26000,
                diszko: 34000
            });
            const plantingFee = isChecked(values.planting)
                ? area * lookupValue(values.plantStyle, { visszafogott: 4000, kozepes: 6500, gazdag: 9500 }, 4000)
                : 0;
            const weedFee = isChecked(values.weedBarrier) ? 38000 : 0;
            const raw = area * rate + plantingFee + weedFee;
            return withStartingPrice(150000, raw);
        }
    },
    {
        id: "diszkavics-agyas",
        name: "Díszkavics ágyás építés",
        badge: "Karbantartható dekorfelület",
        description: "Kavicsos, dekorburkolt ágyások és sávok kialakítása gyomvédelemmel és szegéllyel.",
        startingPrice: 120000,
        note: "A végösszeg a kavics típusa, a geotextil és az esetleges szegélyezés alapján változik.",
        fields: [
            { id: "area", type: "number", label: "Kavicságyás felülete", suffix: "m²", min: 0, step: 1, placeholder: "pl. 22" },
            {
                id: "gravel",
                type: "choice",
                label: "Kavics típusa",
                full: true,
                options: [
                    { value: "", label: "Még nem döntöttem" },
                    { value: "folyami", label: "Folyami kavics" },
                    { value: "feher", label: "Fehér díszkavics" },
                    { value: "bazalt", label: "Bazalt vagy sötét dekor" }
                ]
            },
            { id: "geotextile", type: "toggle", label: "Geotextillel együtt kérem", full: true },
            { id: "edging", type: "toggle", label: "Szegélyezést is kérek", full: true },
            {
                id: "edgingMaterial",
                type: "select",
                label: "Szegély anyaga",
                showWhen: { field: "edging", equals: true },
                options: [
                    { value: "", label: "Válassz" },
                    { value: "muanyag", label: "Rejtett szegély" },
                    { value: "fem", label: "Fém szegély" },
                    { value: "corten", label: "Corten szegély" }
                ]
            },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Szín, szemcseméret, növényekkel vagy anélkül..." }
        ],
        shopProducts: [
            { name: "Fehér díszkavics", priceLabel: "induló ár: 8 900 Ft / zsák", description: "Világos, dekoratív felületekhez.", url: "" },
            { name: "Bazalt dekor", priceLabel: "induló ár: 9 900 Ft / zsák", description: "Kontrasztos, modern megjelenéshez.", url: "" }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const rate = lookupValue(values.gravel, {
                folyami: 9500,
                feher: 14500,
                bazalt: 16500
            });
            const geotextileFee = isChecked(values.geotextile) ? area * 650 : 0;
            const edgingFee = isChecked(values.edging)
                ? lookupValue(values.edgingMaterial, { muanyag: 45000, fem: 72000, corten: 98000 }, 45000)
                : 0;
            const raw = area * rate + geotextileFee + edgingFee;
            return withStartingPrice(120000, raw);
        }
    },
    {
        id: "kerites-epites",
        name: "Kerítés építés",
        badge: "Lehatárolás és védelem",
        description: "Új kerítés építése panelből, WPC-ből, léces vagy falazott rendszerrel.",
        startingPrice: 240000,
        note: "A kerítés ára a típus, a hossz, a kapu és a bontási igény szerint változik.",
        fields: [
            { id: "length", type: "number", label: "Kerítés hossza", suffix: "fm", min: 0, step: 1, placeholder: "pl. 26" },
            {
                id: "type",
                type: "choice",
                label: "Kerítés típusa",
                full: true,
                options: [
                    { value: "", label: "Még nem döntöttem" },
                    { value: "panel", label: "Fém panelkerítés" },
                    { value: "wpc", label: "WPC vagy kompozit" },
                    { value: "leces", label: "Léces vagy dizájnkerítés" },
                    { value: "falazott", label: "Falazott kerítés" }
                ]
            },
            { id: "gate", type: "toggle", label: "Kaput is kérek", full: true },
            {
                id: "gateType",
                type: "select",
                label: "Kaputípus",
                showWhen: { field: "gate", equals: true },
                options: [
                    { value: "", label: "Válassz" },
                    { value: "szemely", label: "Személykapu" },
                    { value: "kert", label: "Kétszárnyú kapu" },
                    { value: "tolokapu", label: "Tolókapu" }
                ]
            },
            { id: "demolition", type: "toggle", label: "Meglévő kerítés bontása is kell", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Belátásvédelem, stílus, szomszédos oldal, alapozás..." }
        ],
        shopProducts: [
            { name: "Panelkerítés szett", priceLabel: "induló ár: 24 900 Ft / panel", description: "Gyorsan telepíthető klasszikus rendszer.", url: "" },
            { name: "WPC kerítésrendszer", priceLabel: "induló ár: 39 900 Ft / panel", description: "Magasabb privát szinthez.", url: "" }
        ],
        calculate(values) {
            const length = numberValue(values.length);
            const rate = lookupValue(values.type, {
                panel: 24000,
                wpc: 42000,
                leces: 38000,
                falazott: 65000
            });
            const gateFee = isChecked(values.gate)
                ? lookupValue(values.gateType, { szemely: 180000, kert: 260000, tolokapu: 420000 }, 180000)
                : 0;
            const demolitionFee = isChecked(values.demolition) ? 95000 : 0;
            const raw = length * rate + gateFee + demolitionFee;
            return withStartingPrice(240000, raw);
        }
    },
    {
        id: "kerti-to-epites",
        name: "Kerti tó építés",
        badge: "Vizes díszelem",
        description: "Kerti tó, díszmedence vagy kisebb vízfelület kialakítása szűréssel és kiegészítőkkel.",
        startingPrice: 480000,
        note: "A tó ára a méret, a technológia, a szűrés és a különleges effektek alapján változik.",
        fields: [
            { id: "area", type: "number", label: "Vízfelület mérete", suffix: "m²", min: 0, step: 1, placeholder: "pl. 9" },
            {
                id: "type",
                type: "choice",
                label: "Tó típusa",
                full: true,
                options: [
                    { value: "", label: "Még nem döntöttem" },
                    { value: "dekor", label: "Dekoratív tó" },
                    { value: "halas", label: "Halas vagy élő tó" },
                    { value: "premium", label: "Prémium látványelem" }
                ]
            },
            {
                id: "filtration",
                type: "select",
                label: "Szűrési igény",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "alap", label: "Alap szűrés" },
                    { value: "eros", label: "Erősebb szűrés" },
                    { value: "komplex", label: "Komplex biológiai rendszer" }
                ]
            },
            { id: "stream", type: "toggle", label: "Patak- vagy vízesés-elemet is szeretnék", full: true },
            { id: "lighting", type: "toggle", label: "Víz alatti vagy parti világítást is kérek", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Stílus, halak, karbantarthatóság, elhelyezés..." }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const typeRate = lookupValue(values.type, {
                dekor: 95000,
                halas: 125000,
                premium: 180000
            });
            const filtrationFee = lookupValue(values.filtration, {
                alap: 85000,
                eros: 160000,
                komplex: 280000
            });
            const streamFee = isChecked(values.stream) ? 135000 : 0;
            const lightingFee = isChecked(values.lighting) ? 85000 : 0;
            const raw = area * typeRate + filtrationFee + streamFee + lightingFee;
            return withStartingPrice(480000, raw);
        }
    },
    {
        id: "tervrajz-keszites",
        name: "Tervrajz készítés",
        badge: "Tervezési dokumentáció",
        description: "Kertépítési tervrajz vagy részletes előkészítő terv készítése.",
        startingPrice: 180000,
        note: "A tervrajz díját az igényelt részletezettség, a telekméret és az egyeztetések száma befolyásolja.",
        fields: [
            {
                id: "package",
                type: "choice",
                label: "Tervcsomag",
                full: true,
                options: [
                    { value: "", label: "Még nem döntöttem" },
                    { value: "alap", label: "Alap koncepció" },
                    { value: "reszletes", label: "Részletes kertépítési terv" },
                    { value: "komplex", label: "Komplex műszaki csomag" }
                ]
            },
            {
                id: "plotSize",
                type: "select",
                label: "Telekméret kategória",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "kicsi", label: "800 m² alatt" },
                    { value: "kozepes", label: "800–1500 m²" },
                    { value: "nagy", label: "1500 m² felett" }
                ]
            },
            {
                id: "revisions",
                type: "select",
                label: "Tervezett módosítási körök",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "1", label: "1 kör" },
                    { value: "2", label: "2 kör" },
                    { value: "3", label: "3 vagy több kör" }
                ]
            },
            { id: "siteVisit", type: "toggle", label: "Helyszíni bejárást is kérek hozzá", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Milyen tervszintet vársz, milyen gyors határidővel..." }
        ],
        calculate(values) {
            const packageFee = lookupValue(values.package, {
                alap: 180000,
                reszletes: 320000,
                komplex: 540000
            });
            const plotFee = lookupValue(values.plotSize, {
                kicsi: 0,
                kozepes: 60000,
                nagy: 120000
            });
            const revisionFee = lookupValue(values.revisions, {
                "1": 0,
                "2": 25000,
                "3": 60000
            });
            const visitFee = isChecked(values.siteVisit) ? 45000 : 0;
            const raw = packageFee + plotFee + revisionFee + visitFee;
            return withStartingPrice(180000, raw);
        }
    },
    {
        id: "latvanyterv-keszites",
        name: "Látványterv készítés",
        badge: "Vizualizáció és prezentáció",
        description: "Kerti látványtervek, renderképek és prezentációs vizualizációk készítése.",
        startingPrice: 140000,
        note: "A látványterv ára a képek száma, minősége és az esetleges animáció függvényében alakul.",
        fields: [
            { id: "renderCount", type: "number", label: "Látványképek száma", min: 0, step: 1, placeholder: "pl. 4" },
            {
                id: "quality",
                type: "choice",
                label: "Látványterv minősége",
                full: true,
                options: [
                    { value: "", label: "Még nem döntöttem" },
                    { value: "alap", label: "Alap vizualizáció" },
                    { value: "premium", label: "Prémium látványkép" },
                    { value: "fotoreal", label: "Fotórealisztikus csomag" }
                ]
            },
            { id: "animation", type: "toggle", label: "Rövid animációt is szeretnék", full: true },
            {
                id: "animationLength",
                type: "number",
                label: "Animáció hossza",
                suffix: "db",
                min: 0,
                step: 1,
                showWhen: { field: "animation", equals: true },
                placeholder: "pl. 1"
            },
            { id: "variants", type: "number", label: "Alternatív változatok száma", min: 0, step: 1, placeholder: "pl. 2" },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Milyen nézetek, milyen hangulat, mire kell a terv..." }
        ],
        calculate(values) {
            const renders = numberValue(values.renderCount);
            const qualityRate = lookupValue(values.quality, {
                alap: 45000,
                premium: 85000,
                fotoreal: 120000
            });
            const animationFee = isChecked(values.animation) ? numberValue(values.animationLength) * 90000 : 0;
            const variantsFee = numberValue(values.variants) * 30000;
            const raw = renders * qualityRate + animationFee + variantsFee;
            return withStartingPrice(140000, raw);
        }
    }
];

const CONTACT_FIELDS = [
    { id: "fullName", type: "text", label: "Név", placeholder: "Teljes név", required: true },
    { id: "email", type: "email", label: "Email-cím", placeholder: "pelda@email.hu", required: true },
    { id: "phone", type: "tel", label: "Telefonszám", placeholder: "+36 30 123 4567", required: true },
    { id: "siteAddress", type: "text", label: "Helyszín címe", placeholder: "Irányítószám, település, utca, házszám", required: true, full: true },
    { id: "settlement", type: "text", label: "Település", placeholder: "pl. Biatorbágy" },
    { id: "desiredStart", type: "date", label: "Tervezett kezdés" },
    {
        id: "contactMode",
        type: "choice",
        label: "Milyen módon keressünk?",
        full: true,
        options: [
            { value: "", label: "Válassz" },
            { value: "telefon", label: "Telefonon" },
            { value: "email", label: "Emailben" },
            { value: "mindegy", label: "Mindkettő megfelel" }
        ]
    },
    { id: "availableTime", type: "text", label: "Mikor vagy elérhető?", placeholder: "pl. hétköznap 14:00 után" },
    {
        id: "planStatus",
        type: "select",
        label: "Van már előkészített anyagod?",
        options: [
            { value: "", label: "Válassz" },
            { value: "nincs", label: "Még nincs" },
            { value: "meretek", label: "Méretek vagy skicc már van" },
            { value: "terv", label: "Van terv vagy látványterv" },
            { value: "helyszin", label: "Helyszíni bejárás után pontosítanánk" }
        ]
    },
    { id: "projectGoal", type: "textarea", label: "Röviden: mit szeretnél megvalósítani?", full: true, placeholder: "Mi a legfontosabb cél, milyen stílust vagy használatot szeretnél?" },
    { id: "notes", type: "textarea", label: "További megjegyzés", full: true, placeholder: "Bármi, ami segíti a pontosabb ajánlatadást." },
    {
        id: "consent",
        type: "toggle",
        label: "Elfogadom, hogy az itt megjelenő összeg tájékoztató jellegű, és a végleges ajánlat a helyszíni felmérés, a műszaki részletek, a mennyiségek és az anyagválasztás alapján módosulhat.",
        required: true,
        full: true
    }
];

const SERVICE_LOOKUP = Object.fromEntries(SERVICES.map((service) => [service.id, service]));
const CONTACT_LOOKUP = Object.fromEntries(CONTACT_FIELDS.map((field) => [field.id, field]));
const SERVICE_TONES = [
    { surface: "#edf5ef", border: "#b9d5c0", accent: "#2f6b45", text: "#214a31" },
    { surface: "#f7efe6", border: "#e3caa8", accent: "#bb7c37", text: "#6f461d" },
    { surface: "#eef2fb", border: "#c3d0ef", accent: "#4367b1", text: "#29416f" },
    { surface: "#f4ecf8", border: "#d4c1e4", accent: "#8a5ca8", text: "#56386c" },
    { surface: "#fef1ef", border: "#efc6bd", accent: "#c86a58", text: "#7a3b2f" },
    { surface: "#edf6f7", border: "#bbdbe0", accent: "#3b8390", text: "#25535c" }
];

const form = document.getElementById("quoteForm");
const stepContainer = document.getElementById("stepContainer");
const stepCounter = document.getElementById("stepCounter");
const stepTitle = document.getElementById("stepTitle");
const stepPills = document.getElementById("stepPills");
const progressBar = document.getElementById("progressBar");
const totalPriceElement = document.getElementById("totalPrice");
const selectedServicesElement = document.getElementById("selectedServices");
const feedback = document.getElementById("feedback");
const startButton = document.getElementById("startButton");
const editSelectionButton = document.getElementById("editSelectionButton");
const successModal = document.getElementById("successModal");
const closeSuccessButton = document.getElementById("closeSuccessButton");

const state = {
    currentStep: 0,
    selectedServices: [],
    serviceValues: {},
    contactValues: createDefaultContactState(),
    isSubmitting: false
};

function createDefaultContactState() {
    return {
        fullName: "",
        email: "",
        phone: "",
        siteAddress: "",
        settlement: "",
        desiredStart: "",
        contactMode: "",
        availableTime: "",
        planStatus: "",
        projectGoal: "",
        notes: "",
        consent: false
    };
}

function defaultValueForField(field) {
    if (Object.prototype.hasOwnProperty.call(field, "defaultValue")) {
        return field.defaultValue;
    }

    if (field.type === "toggle") {
        return false;
    }

    return "";
}

function ensureServiceState(serviceId) {
    if (!state.serviceValues[serviceId]) {
        const service = getService(serviceId);
        state.serviceValues[serviceId] = service.fields.reduce((accumulator, field) => {
            accumulator[field.id] = defaultValueForField(field);
            return accumulator;
        }, {});
    }

    return state.serviceValues[serviceId];
}

function getService(serviceId) {
    return SERVICE_LOOKUP[serviceId];
}

function getServiceTone(serviceId) {
    const index = SERVICES.findIndex((service) => service.id === serviceId);
    return SERVICE_TONES[index % SERVICE_TONES.length];
}

function getServiceToneStyle(serviceId) {
    const tone = getServiceTone(serviceId);
    return `--service-surface:${tone.surface}; --service-border:${tone.border}; --service-accent:${tone.accent}; --service-text:${tone.text};`;
}

function getFlowSteps() {
    return [
        { id: "selection", kind: "selection", title: "Tételek kiválasztása", pillLabel: "Tételek" },
        ...state.selectedServices.map((serviceId) => ({
            id: serviceId,
            kind: "service",
            title: getService(serviceId).name,
            pillLabel: getService(serviceId).name
        })),
        { id: "contact", kind: "contact", title: "Kapcsolat és küldés", pillLabel: "Kapcsolat" }
    ];
}

function numberValue(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

function isChecked(value) {
    return value === true || value === "true" || value === "on" || value === 1;
}

function lookupValue(value, map, fallback = 0) {
    return Object.prototype.hasOwnProperty.call(map, value) ? map[value] : fallback;
}

function withStartingPrice(startingPrice, raw) {
    if (raw <= 0) {
        return 0;
    }

    return Math.round(raw);
}

function formatCurrency(value) {
    return `${currencyFormatter.format(Math.round(value || 0))} Ft`;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function shouldShowField(contextFields, field, values) {
    if (!field.showWhen) {
        return true;
    }

    const dependencyValue = values[field.showWhen.field];

    if (Object.prototype.hasOwnProperty.call(field.showWhen, "equals")) {
        return dependencyValue === field.showWhen.equals;
    }

    if (Object.prototype.hasOwnProperty.call(field.showWhen, "notEquals")) {
        return dependencyValue !== field.showWhen.notEquals;
    }

    if (Array.isArray(field.showWhen.oneOf)) {
        return field.showWhen.oneOf.includes(dependencyValue);
    }

    if (field.showWhen.truthy) {
        return Boolean(dependencyValue);
    }

    return true;
}

function getFieldDisplayValue(field, rawValue) {
    if (rawValue == null || rawValue === "" || rawValue === false) {
        return "";
    }

    if (field.type === "toggle") {
        return isChecked(rawValue) ? "Igen" : "";
    }

    if (field.type === "choice" || field.type === "select") {
        const option = (field.options || []).find((item) => item.value === rawValue);
        return option ? option.label : String(rawValue);
    }

    if (field.type === "number") {
        const suffix = field.suffix ? ` ${field.suffix}` : "";
        return `${rawValue}${suffix}`;
    }

    return String(rawValue).trim();
}

function getFieldLabel(field) {
    return field.suffix ? `${field.label} (${field.suffix})` : field.label;
}

function getVisibleFieldLines(fields, values) {
    return fields
        .filter((field) => shouldShowField(fields, field, values))
        .map((field) => {
            const formatted = getFieldDisplayValue(field, values[field.id]);
            if (!formatted) {
                return null;
            }

            return `${field.label}: ${formatted}`;
        })
        .filter(Boolean);
}

function getSelectedServiceTotals() {
    return state.selectedServices.reduce((accumulator, serviceId) => {
        const service = getService(serviceId);
        const values = ensureServiceState(serviceId);
        const subtotal = service.calculate(values);
        accumulator[serviceId] = subtotal;
        return accumulator;
    }, {});
}

function getGrandTotal() {
    const subtotals = getSelectedServiceTotals();
    return Object.values(subtotals).reduce((sum, value) => sum + value, 0);
}

function buildServiceMeta(service, values) {
    const lines = getVisibleFieldLines(service.fields, values)
        .filter((line) => !line.startsWith("Megjegyzés"))
        .slice(0, 2);

    if (!lines.length) {
        return "Még nincs megadott részlet";
    }

    return lines.join(" • ");
}

function renderApp() {
    const steps = getFlowSteps();
    if (state.currentStep > steps.length - 1) {
        state.currentStep = steps.length - 1;
    }

    clearFeedback();
    renderHeader(steps);
    renderSummary();
    renderCurrentStep(steps[state.currentStep]);
}

function renderHeader(steps) {
    const current = steps[state.currentStep];
    stepCounter.textContent = `${state.currentStep + 1} / ${steps.length}`;
    stepTitle.textContent = current.title;
    progressBar.style.width = `${(state.currentStep / Math.max(steps.length - 1, 1)) * 100}%`;

    stepPills.innerHTML = steps
        .map((step, index) => {
            const classes = [
                "step-pill",
                index === state.currentStep ? "is-active" : "",
                index < state.currentStep ? "is-complete" : ""
            ].filter(Boolean).join(" ");

            return `
                <button type="button" class="${classes}" data-action="jump-step" data-step-index="${index}">
                    ${escapeHtml(step.pillLabel)}
                </button>
            `;
        })
        .join("");
}

function renderSummary() {
    const subtotals = getSelectedServiceTotals();
    const total = Object.values(subtotals).reduce((sum, value) => sum + value, 0);

    totalPriceElement.textContent = formatCurrency(total);

    if (!state.selectedServices.length) {
        selectedServicesElement.innerHTML = `
            <div class="selected-service-card">
                <p>Még nincs kiválasztott tétel. Az első lépésben választhatsz szolgáltatásokat.</p>
            </div>
        `;
        editSelectionButton.disabled = true;
        return;
    }

    editSelectionButton.disabled = false;
    selectedServicesElement.innerHTML = state.selectedServices
        .map((serviceId) => {
            const service = getService(serviceId);
            const meta = buildServiceMeta(service, ensureServiceState(serviceId));
            const serviceStepIndex = getFlowSteps().findIndex((step) => step.id === serviceId);
            return `
                <div class="selected-service-card" style="${getServiceToneStyle(serviceId)}">
                    <div class="selected-service-header">
                        <button type="button" data-action="jump-step" data-step-index="${serviceStepIndex}">
                            ${escapeHtml(service.name)}
                        </button>
                        <span class="selected-service-price">${formatCurrency(subtotals[serviceId])}</span>
                    </div>
                    <p class="selected-service-meta">${escapeHtml(meta)}</p>
                </div>
            `;
        })
        .join("");
}

function renderCurrentStep(step) {
    if (step.kind === "selection") {
        stepContainer.innerHTML = renderSelectionStep();
        return;
    }

    if (step.kind === "service") {
        stepContainer.innerHTML = renderServiceStep(getService(step.id));
        return;
    }

    stepContainer.innerHTML = renderContactStep();
}

function renderSelectionStep() {
    const selectedCount = state.selectedServices.length;
    const availableServices = SERVICES.filter((service) => !state.selectedServices.includes(service.id));

    return `
        <section class="step-card">
            <div class="card-top">
                <div>
                    <p class="eyebrow">1. lépés</p>
                    <h2>Mit szeretnél kikalkulálni?</h2>
                    <p>Válassz tételt a listából.</p>
                </div>
                <div class="inline-price">
                    <span>Kiválasztott tételek</span>
                    <strong id="selectedCount">${selectedCount} db</strong>
                </div>
            </div>

            <div class="selection-summary">
                <strong>${selectedCount ? `${selectedCount} tétel kiválasztva` : ""}</strong>
            </div>

            <div class="service-picker-shell">
                <div class="service-picker-row">
                    <div class="field service-picker-field">
                        <label for="servicePicker">Új tétel hozzáadása</label>
                        <select id="servicePicker">
                            <option value="">Válassz tételt</option>
                            ${availableServices.map((service) => `
                                <option value="${service.id}">${escapeHtml(service.name)}</option>
                            `).join("")}
                        </select>
                    </div>
                    <button
                        type="button"
                        class="primary-btn service-add-btn"
                        data-action="add-selected-service"
                        ${availableServices.length ? "" : "disabled"}
                    >
                        Tétel hozzáadása
                    </button>
                </div>
            </div>

            <div class="selected-list">
                ${selectedCount
                    ? state.selectedServices.map((serviceId) => renderSelectedSelectionCard(serviceId)).join("")
                    : `<div class="empty-selection">Még nem adtál hozzá tételt.</div>`}
            </div>

            <div class="nav-actions">
                <div class="left-actions"></div>
                <div class="right-actions">
                    <button type="button" class="primary-btn" data-action="next-step">Tovább a kiválasztott tételekhez</button>
                </div>
            </div>
        </section>
    `;
}

function renderSelectedSelectionCard(serviceId) {
    const service = getService(serviceId);
    const serviceStepIndex = getFlowSteps().findIndex((step) => step.id === serviceId);

    return `
        <article class="selection-item-card" style="${getServiceToneStyle(serviceId)}">
            <div class="selection-item-top">
                <span class="selection-item-name">${escapeHtml(service.name)}</span>
                <span class="selection-item-status">Hozzáadva</span>
            </div>
            <div class="selection-item-actions">
                <button type="button" class="secondary-btn compact-btn" data-action="jump-step" data-step-index="${serviceStepIndex}">
                    Kitöltés
                </button>
                <button type="button" class="ghost-btn compact-btn" data-action="remove-service" data-service-id="${service.id}">
                    Eltávolítás
                </button>
            </div>
        </article>
    `;
}

function renderServiceStep(service) {
    const values = ensureServiceState(service.id);
    const subtotal = service.calculate(values);
    const currentIndex = state.currentStep;
    const isLastServiceStep = currentIndex === state.selectedServices.length;

    return `
        <section class="step-card">
            <div class="card-top">
                <div>
                    <p class="eyebrow">${currentIndex + 1}. lépés</p>
                    <h2>${escapeHtml(service.name)}</h2>
                </div>
                <div class="inline-price">
                    <span>Részösszeg</span>
                    <strong id="currentSubtotal">${formatCurrency(subtotal)}</strong>
                </div>
            </div>

            <div class="field-grid">
                ${service.fields.map((field) => renderContextField({
                    field,
                    values,
                    scope: "service",
                    scopeId: service.id,
                    fields: service.fields
                })).join("")}
            </div>

            ${service.shopProducts && service.shopProducts.length ? renderShopProducts(service.shopProducts) : ""}

            <div class="nav-actions">
                <div class="left-actions">
                    <button type="button" class="secondary-btn" data-action="prev-step">Vissza</button>
                    <button type="button" class="ghost-btn" data-action="remove-service" data-service-id="${service.id}">Tétel eltávolítása</button>
                </div>
                <div class="right-actions">
                    <button type="button" class="primary-btn" data-action="next-step">
                        ${isLastServiceStep ? "Tovább az alapadatokhoz" : "Következő tétel"}
                    </button>
                </div>
            </div>
        </section>
    `;
}

function renderShopProducts(products) {
    return `
        <section class="step-card">
            <div>
                <p class="eyebrow">Kapcsolódó termékek</p>
                <h2>Webshophoz kapcsolható tételek</h2>
            </div>
            <div class="product-grid">
                ${products.map((product) => `
                    <article class="product-card">
                        <div>
                            <h3>${escapeHtml(product.name)}</h3>
                            <p>${escapeHtml(product.description)}</p>
                        </div>
                        <div class="product-actions">
                            <a
                                class="product-link ${product.url ? "" : "is-disabled"}"
                                href="${product.url || "#"}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                ${product.url ? "Webshop megnyitása" : "Webshop link beállítható"}
                            </a>
                        </div>
                    </article>
                `).join("")}
            </div>
        </section>
    `;
}

function renderContactStep() {
    const total = getGrandTotal();
    const subtotals = getSelectedServiceTotals();

    return `
        <section class="step-card">
            <div class="card-top">
                <div>
                    <p class="eyebrow">${state.currentStep + 1}. lépés</p>
                    <h2>Kapcsolat és küldés</h2>
                    <p>Itt add meg az alapadataidat. Az előzetes kalkuláció tájékoztató jellegű, a végleges ajánlat helyszíni egyeztetés után készül.</p>
                </div>
                <div class="inline-price">
                    <span>Tájékoztató végösszeg</span>
                    <strong id="finalTotal">${formatCurrency(total)}</strong>
                </div>
            </div>

            <div class="summary-grid">
                ${state.selectedServices.map((serviceId) => {
                    const service = getService(serviceId);
                    const meta = buildServiceMeta(service, ensureServiceState(serviceId));
                    return `
                        <article class="quote-line">
                            <div>
                                <h3>${escapeHtml(service.name)}</h3>
                                <p>${escapeHtml(meta)}</p>
                            </div>
                            <span class="quote-line-price">${formatCurrency(subtotals[serviceId])}</span>
                        </article>
                    `;
                }).join("")}
            </div>

            <div class="field-grid">
                ${CONTACT_FIELDS.map((field) => renderContextField({
                    field,
                    values: state.contactValues,
                    scope: "contact",
                    scopeId: "contact",
                    fields: CONTACT_FIELDS
                })).join("")}
            </div>

            <div class="disclaimer">
                <strong>Tájékoztató ajánlat:</strong>
                <p>
                    Az itt megjelenő összeg előzetes kalkuláció. A végleges ár a helyszín pontos felmérése, a mennyiségek, a választott anyagok, a megközelíthetőség, az esetleges bontási és földmunkák, valamint a műszaki részletek alapján módosulhat. A változtatás jogát fenntartjuk.
                </p>
            </div>

            <div class="nav-actions">
                <div class="left-actions">
                    <button type="button" class="secondary-btn" data-action="prev-step">Vissza</button>
                    <button type="button" class="ghost-btn" data-action="jump-step" data-step-index="0">Tételek módosítása</button>
                </div>
                <div class="right-actions">
                    <button type="button" class="primary-btn" data-action="submit-quote" ${state.isSubmitting ? "disabled" : ""}>
                        ${state.isSubmitting ? "Küldés folyamatban..." : "Ajánlatkérés elküldése"}
                    </button>
                </div>
            </div>
        </section>
    `;
}

function renderContextField({ field, values, scope, scopeId, fields }) {
    if (!shouldShowField(fields, field, values)) {
        return "";
    }

    const fieldClass = ["field", field.full ? "is-full" : ""].filter(Boolean).join(" ");
    const value = values[field.id];
    const inputId = `${scopeId}-${field.id}`;
    const commonAttributes = scope === "service"
        ? `data-scope="service" data-service-id="${scopeId}" data-field-id="${field.id}"`
        : `data-scope="contact" data-contact-field="${field.id}"`;

    if (field.type === "textarea") {
        return `
            <div class="${fieldClass}">
                <label for="${inputId}">${escapeHtml(getFieldLabel(field))}</label>
                ${field.helper ? `<p class="field-helper">${escapeHtml(field.helper)}</p>` : ""}
                <textarea
                    id="${inputId}"
                    placeholder="${escapeHtml(field.placeholder || "")}"
                    ${commonAttributes}
                >${escapeHtml(value || "")}</textarea>
            </div>
        `;
    }

    if (field.type === "select") {
        return `
            <div class="${fieldClass}">
                <label for="${inputId}">${escapeHtml(getFieldLabel(field))}</label>
                ${field.helper ? `<p class="field-helper">${escapeHtml(field.helper)}</p>` : ""}
                <select id="${inputId}" ${commonAttributes}>
                    ${(field.options || []).map((option) => `
                        <option value="${escapeHtml(option.value)}" ${option.value === value ? "selected" : ""}>
                            ${escapeHtml(option.label)}
                        </option>
                    `).join("")}
                </select>
            </div>
        `;
    }

    if (field.type === "choice") {
        return `
            <fieldset class="${fieldClass}">
                <legend>${escapeHtml(getFieldLabel(field))}</legend>
                ${field.helper ? `<p class="field-helper">${escapeHtml(field.helper)}</p>` : ""}
                <div class="choice-grid">
                    ${(field.options || []).map((option, index) => {
                        const optionId = `${inputId}-${index}`;
                        return `
                            <div class="option-card">
                                <label for="${optionId}">
                                    <div class="option-title-row">
                                        <div>
                                            <input
                                                id="${optionId}"
                                                type="radio"
                                                name="${escapeHtml(inputId)}"
                                                value="${escapeHtml(option.value)}"
                                                ${option.value === value ? "checked" : ""}
                                                ${commonAttributes}
                                            >
                                            <span class="option-title">${escapeHtml(option.label)}</span>
                                        </div>
                                        ${option.priceText ? `<span class="option-price">${escapeHtml(option.priceText)}</span>` : ""}
                                    </div>
                                    ${option.note ? `<span class="option-note">${escapeHtml(option.note)}</span>` : ""}
                                </label>
                            </div>
                        `;
                    }).join("")}
                </div>
            </fieldset>
        `;
    }

    if (field.type === "toggle") {
        return `
            <fieldset class="${fieldClass}">
                <legend>${escapeHtml(getFieldLabel(field))}</legend>
                <div class="toggle-grid">
                    <div class="toggle-card">
                        <label for="${inputId}">
                            <input
                                id="${inputId}"
                                type="checkbox"
                                ${isChecked(value) ? "checked" : ""}
                                ${commonAttributes}
                            >
                            <span class="option-title">${escapeHtml(field.label)}</span>
                            ${field.required ? `<span class="option-note">Ez a megerősítés szükséges a beküldéshez.</span>` : ""}
                        </label>
                    </div>
                </div>
            </fieldset>
        `;
    }

    const type = field.type === "email" || field.type === "tel" || field.type === "date" ? field.type : field.type === "number" ? "number" : "text";
    const inputMarkup = `
        <input
            id="${inputId}"
            type="${type}"
            value="${escapeHtml(value || "")}"
            placeholder="${escapeHtml(field.placeholder || "")}"
            ${field.min != null ? `min="${field.min}"` : ""}
            ${field.step != null ? `step="${field.step}"` : ""}
            ${commonAttributes}
        >
    `;

    return `
        <div class="${fieldClass}">
            <label for="${inputId}">${escapeHtml(getFieldLabel(field))}</label>
            ${field.helper ? `<p class="field-helper">${escapeHtml(field.helper)}</p>` : ""}
            ${inputMarkup}
        </div>
    `;
}

function showFeedback(message, type = "error") {
    feedback.hidden = false;
    feedback.className = `feedback is-${type}`;
    feedback.textContent = message;
}

function clearFeedback() {
    feedback.hidden = true;
    feedback.className = "feedback";
    feedback.textContent = "";
}

function scrollToCalculator() {
    document.getElementById("calculator").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function startForm() {
    scrollToCalculator();
}

function toggleService(serviceId) {
    const exists = state.selectedServices.includes(serviceId);

    if (exists) {
        state.selectedServices = state.selectedServices.filter((current) => current !== serviceId);
        delete state.serviceValues[serviceId];
    } else {
        state.selectedServices = [...state.selectedServices, serviceId];
        ensureServiceState(serviceId);
    }

    renderApp();
}

function removeService(serviceId) {
    state.selectedServices = state.selectedServices.filter((current) => current !== serviceId);
    delete state.serviceValues[serviceId];
    state.currentStep = Math.max(0, Math.min(state.currentStep - 1, getFlowSteps().length - 1));
    renderApp();
}

function goToStep(index) {
    const steps = getFlowSteps();
    state.currentStep = Math.max(0, Math.min(index, steps.length - 1));
    renderApp();
    scrollToCalculator();
}

function handleNextStep() {
    const steps = getFlowSteps();

    if (steps[state.currentStep].kind === "selection" && !state.selectedServices.length) {
        showFeedback("Kérlek válassz ki legalább egy tételt a továbblépéshez.");
        return;
    }

    if (state.currentStep < steps.length - 1) {
        state.currentStep += 1;
        renderApp();
        scrollToCalculator();
    }
}

function handlePrevStep() {
    if (state.currentStep > 0) {
        state.currentStep -= 1;
        renderApp();
        scrollToCalculator();
    }
}

function updateServiceField(serviceId, fieldId, value) {
    const serviceState = ensureServiceState(serviceId);
    serviceState[fieldId] = value;
}

function updateContactField(fieldId, value) {
    state.contactValues[fieldId] = value;
}

function getFieldValueFromInput(input) {
    if (input.type === "checkbox") {
        return input.checked;
    }

    return input.value;
}

function updateLiveTotals() {
    renderSummary();

    const serviceSubtotal = document.getElementById("currentSubtotal");
    const finalTotal = document.getElementById("finalTotal");

    if (serviceSubtotal) {
        const currentStep = getFlowSteps()[state.currentStep];
        if (currentStep.kind === "service") {
            serviceSubtotal.textContent = formatCurrency(getService(currentStep.id).calculate(ensureServiceState(currentStep.id)));
        }
    }

    if (finalTotal) {
        finalTotal.textContent = formatCurrency(getGrandTotal());
    }

    const selectedCountElement = document.getElementById("selectedCount");
    if (selectedCountElement) {
        selectedCountElement.textContent = `${state.selectedServices.length} db`;
    }
}

function validateContactStep() {
    if (!state.selectedServices.length) {
        showFeedback("Kérlek válassz ki legalább egy tételt.");
        goToStep(0);
        return false;
    }

    const requiredFields = CONTACT_FIELDS.filter((field) => field.required);

    for (const field of requiredFields) {
        const value = state.contactValues[field.id];

        if (field.type === "toggle") {
            if (!isChecked(value)) {
                showFeedback("Kérlek fogadd el a tájékoztató árra vonatkozó feltételt a beküldéshez.");
                return false;
            }
            continue;
        }

        if (!String(value || "").trim()) {
            showFeedback(`Kérlek töltsd ki ezt a mezőt: ${field.label}.`);
            const element = document.querySelector(`[data-contact-field="${field.id}"]`);
            if (element) {
                element.focus();
            }
            return false;
        }
    }

    if (state.contactValues.email) {
        const emailValue = String(state.contactValues.email).trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailValue)) {
            showFeedback("Kérlek adj meg egy érvényes email-címet.");
            const emailInput = document.querySelector('[data-contact-field="email"]');
            if (emailInput) {
                emailInput.focus();
            }
            return false;
        }
    }

    return true;
}

function buildSubmissionPayloads() {
    const submittedAt = new Date().toLocaleString("hu-HU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });

    const subtotals = getSelectedServiceTotals();
    const total = getGrandTotal();

    const serviceSummaries = state.selectedServices.map((serviceId) => {
        const service = getService(serviceId);
        const values = ensureServiceState(serviceId);
        const lines = getVisibleFieldLines(service.fields, values);
        return [
            `${service.name} — ${formatCurrency(subtotals[serviceId])}`,
            ...lines.map((line) => `- ${line}`)
        ].join("\n");
    });

    const compactCustomerSummary = state.selectedServices.map((serviceId) => {
        const service = getService(serviceId);
        const values = ensureServiceState(serviceId);
        return `- ${service.name}: ${formatCurrency(subtotals[serviceId])} (${buildServiceMeta(service, values)})`;
    });

    const contactLines = CONTACT_FIELDS
        .map((field) => {
            if (field.id === "consent") {
                return null;
            }

            const formatted = getFieldDisplayValue(field, state.contactValues[field.id]);
            if (!formatted) {
                return null;
            }

            return `- ${field.label}: ${formatted}`;
        })
        .filter(Boolean);

    const summary = [
        "Kiválasztott tételek",
        ...serviceSummaries,
        "",
        "Kapcsolati adatok",
        ...contactLines,
        "",
        `Tájékoztató végösszeg: ${formatCurrency(total)}`
    ].join("\n");

    const customerSummary = [
        "A kiválasztott tételek előzetes összegzése:",
        ...compactCustomerSummary,
        "",
        `Tájékoztató végösszeg: ${formatCurrency(total)}`,
        "",
        "A végleges ajánlat a helyszíni felmérés, a pontos mennyiségek, az anyagválasztás és a műszaki adottságok alapján készül el."
    ].join("\n");

    const customerName = state.contactValues.fullName || "Érdeklődő";
    const customerEmail = (state.contactValues.email || "").trim().toLowerCase();
    const projectAddress = state.contactValues.siteAddress || "nincs megadva";

    const basePayload = {
        customer_name: customerName,
        customer_email: customerEmail,
        reply_to: customerEmail,
        submitted_at: submittedAt,
        project_address: projectAddress,
        project_goal: state.contactValues.projectGoal || "nincs megadva",
        phone: state.contactValues.phone || "nincs megadva",
        estimated_total: formatCurrency(total),
        selected_services: state.selectedServices.map((serviceId) => getService(serviceId).name).join(", "),
        service_count: String(state.selectedServices.length),
        summary,
        internal_summary: summary,
        customer_summary: customerSummary,
        intro_line: "Új kertépítési kalkuláció érkezett a webes felületről.",
        customer_intro_line: `Kedves ${customerName}, köszönjük az ajánlatkérést.`,
        customer_closing_line: "Hamarosan felvesszük veled a kapcsolatot a pontosításhoz.",
        internal_subject: `Új kertépítési kalkuláció - ${customerName}`,
        customer_subject: "Köszönjük az ajánlatkérést - Díszkertek",
        email_subject: `Új kertépítési kalkuláció - ${customerName}`
    };

    return {
        internalPayload: {
            ...basePayload
        },
        customerPayload: {
            ...basePayload
        }
    };
}

async function handleSubmit() {
    if (state.isSubmitting) {
        return;
    }

    if (!validateContactStep()) {
        return;
    }

    if (!window.emailjs) {
        showFeedback("Az EmailJS nincs betöltve. Ellenőrizd az internetkapcsolatot vagy az EmailJS beállítást.");
        return;
    }

    state.isSubmitting = true;
    renderApp();

    try {
        const { internalPayload, customerPayload } = buildSubmissionPayloads();

        await Promise.all([
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_INTERNAL, internalPayload),
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CUSTOMER, customerPayload)
        ]);

        state.isSubmitting = false;
        openSuccessModal();
    } catch (error) {
        state.isSubmitting = false;
        renderApp();
        showFeedback("Az email küldése most nem sikerült. Kérlek ellenőrizd az EmailJS sablonokat és próbáld újra.");
        console.error(error);
    }
}

function openSuccessModal() {
    successModal.hidden = false;
    document.body.style.overflow = "hidden";
}

function closeSuccessModal() {
    successModal.hidden = true;
    document.body.style.overflow = "";
    resetApp();
}

function resetApp() {
    state.currentStep = 0;
    state.selectedServices = [];
    state.serviceValues = {};
    state.contactValues = createDefaultContactState();
    state.isSubmitting = false;
    renderApp();
    scrollToCalculator();
}

function handleActionClick(event) {
    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget) {
        return;
    }

    const { action } = actionTarget.dataset;

    if (action === "toggle-service") {
        toggleService(actionTarget.dataset.serviceId);
        return;
    }

    if (action === "add-selected-service") {
        addSelectedServiceFromPicker();
        return;
    }

    if (action === "next-step") {
        handleNextStep();
        return;
    }

    if (action === "prev-step") {
        handlePrevStep();
        return;
    }

    if (action === "jump-step") {
        goToStep(Number(actionTarget.dataset.stepIndex));
        return;
    }

    if (action === "remove-service") {
        removeService(actionTarget.dataset.serviceId);
        return;
    }

    if (action === "submit-quote") {
        handleSubmit();
    }
}

function handleFieldUpdate(event, shouldRerender) {
    const input = event.target;

    if (!(input instanceof HTMLInputElement || input instanceof HTMLSelectElement || input instanceof HTMLTextAreaElement)) {
        return;
    }

    const scope = input.dataset.scope;
    if (!scope) {
        return;
    }

    const value = getFieldValueFromInput(input);

    if (scope === "service") {
        updateServiceField(input.dataset.serviceId, input.dataset.fieldId, value);
    }

    if (scope === "contact") {
        updateContactField(input.dataset.contactField, value);
    }

    if (shouldRerender) {
        renderApp();
    } else {
        updateLiveTotals();
    }
}

function addSelectedServiceFromPicker() {
    const picker = document.getElementById("servicePicker");
    if (!(picker instanceof HTMLSelectElement)) {
        return;
    }

    const serviceId = picker.value;
    if (!serviceId) {
        showFeedback("Válassz ki egy tételt a hozzáadáshoz.");
        return;
    }

    if (!state.selectedServices.includes(serviceId)) {
        state.selectedServices = [...state.selectedServices, serviceId];
        ensureServiceState(serviceId);
    }

    renderApp();
}

stepContainer.addEventListener("click", handleActionClick);
stepContainer.addEventListener("change", (event) => handleFieldUpdate(event, true));
stepContainer.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && (target.type === "radio" || target.type === "checkbox")) {
        return;
    }

    if (target instanceof HTMLSelectElement) {
        return;
    }

    handleFieldUpdate(event, false);
});

stepPills.addEventListener("click", handleActionClick);
selectedServicesElement.addEventListener("click", handleActionClick);

startButton.addEventListener("click", startForm);
editSelectionButton.addEventListener("click", () => goToStep(0));
closeSuccessButton.addEventListener("click", closeSuccessModal);

window.startForm = startForm;

renderApp();
