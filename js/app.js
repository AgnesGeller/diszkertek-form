const EMAILJS_SERVICE_ID = "service_gi1vj2r";
const EMAILJS_TEMPLATE_CUSTOMER = "template_m0utevq";
const EMAILJS_TEMPLATE_INTERNAL = "template_ciz2tq2";

const EMAIL_SEND_TIMEOUT_MS = 30000;

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
                id: "waterPressure",
                type: "select",
                label: "Víznyomás / vízhozam ismertsége",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "ismert-jo", label: "Ismert és megfelelő" },
                    { value: "ismert-kerdeses", label: "Ismert, de kérdéses" },
                    { value: "nem-ismert", label: "Még nem ismert" }
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
            {
                id: "zoneTypes",
                type: "checklist",
                label: "Milyen zónák lesznek?",
                full: true,
                options: [
                    { value: "gyep", label: "Gyepzóna" },
                    { value: "agyas", label: "Ágyászóna" },
                    { value: "soveny", label: "Sövényzóna" },
                    { value: "edeny", label: "Edényes növények" },
                    { value: "kulonkor", label: "Külön érzékeny kör" }
                ]
            },
            { id: "drip", type: "toggle", label: "Csepegtető köröket is szeretnék az ágyásokhoz", full: true },
            { id: "existingSystem", type: "toggle", label: "Meglévő öntözőrendszerhez kell csatlakozni vagy azt kell átalakítani", full: true },
            { id: "trenchLength", type: "number", label: "Becsült csőárok hossza", suffix: "fm", min: 0, step: 1, placeholder: "pl. 70" },
            {
                id: "terrainDifficulty",
                type: "select",
                label: "Terepi nehézség",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "sima", label: "Sík, jól szervezhető" },
                    { value: "tagolt", label: "Tagolt, több szintű" },
                    { value: "szuk", label: "Szűk, nehezebben megközelíthető" }
                ]
            },
            { id: "rainSensor", type: "toggle", label: "Esőérzékelőt is kérek", showWhen: { field: "automation", oneOf: ["alap", "okos"] }, full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Meglévő rendszer, kiállások, külön igények..." }
        ],
        shopProducts: [
            { name: "Hunter vezérlő", priceLabel: "induló ár: 69 900 Ft", description: "Időzített vagy okos vezérléshez.", url: "https://agnesgeller.github.io/katalogus/" },
            { name: "Csepegtető csomag", priceLabel: "induló ár: 24 900 Ft", description: "Ágyások és sövények célzott öntözéséhez.", url: "https://agnesgeller.github.io/katalogus/" }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const zones = numberValue(values.zones);
            const sourceFee = lookupValue(values.waterSource, {
                halozat: 0,
                kut: 90000,
                ciszterna: 65000
            });
            const pressureFee = lookupValue(values.waterPressure, {
                "ismert-jo": 0,
                "ismert-kerdeses": 25000,
                "nem-ismert": 45000
            });
            const automationFee = lookupValue(values.automation, {
                nincs: 0,
                alap: 38000,
                okos: 76000
            });
            const zoneTypeCount = Array.isArray(values.zoneTypes) ? values.zoneTypes.length : 0;
            const dripFee = isChecked(values.drip) ? 48000 : 0;
            const existingFee = isChecked(values.existingSystem) ? 95000 : 0;
            const trenchFee = numberValue(values.trenchLength) * 1800;
            const terrainFee = lookupValue(values.terrainDifficulty, {
                sima: 0,
                tagolt: 55000,
                szuk: 95000
            });
            const rainFee = isChecked(values.rainSensor) ? 28000 : 0;
            const raw = area * 2300
                + zones * 16000
                + sourceFee
                + pressureFee
                + automationFee
                + zoneTypeCount * 22000
                + dripFee
                + existingFee
                + trenchFee
                + terrainFee
                + rainFee;
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
            { id: "thickness", type: "number", label: "Szerkezeti rétegvastagság", suffix: "cm", min: 0, step: 1, placeholder: "pl. 25" },
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
            {
                id: "subbase",
                type: "select",
                label: "Alépítmény állapota",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "uj", label: "Teljesen új alépítmény kell" },
                    { value: "reszben", label: "Részben megtartható" },
                    { value: "ismeretlen", label: "Még nem ismert" }
                ]
            },
            {
                id: "edgeCondition",
                type: "choice",
                label: "Csatlakozó szegély és befogás",
                full: true,
                options: [
                    { value: "", label: "Válassz" },
                    { value: "egyszeru", label: "Egyszerű lezárás" },
                    { value: "reszletes", label: "Több csatlakozás és irányváltás" },
                    { value: "komplex", label: "Komplex befogás, szintek és ívek" }
                ]
            },
            { id: "edging", type: "toggle", label: "Szegélyezést is kérek", full: true },
            { id: "demolition", type: "toggle", label: "Meglévő burkolat bontása is szükséges", full: true },
            {
                id: "demolitionThickness",
                type: "number",
                label: "Bontandó szerkezet vastagsága",
                suffix: "cm",
                min: 0,
                step: 1,
                showWhen: { field: "demolition", equals: true },
                placeholder: "pl. 18"
            },
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
            { id: "levelDifference", type: "number", label: "Szintkülönbség", suffix: "cm", min: 0, step: 1, placeholder: "pl. 20" },
            {
                id: "accessMode",
                type: "select",
                label: "Kivitelezési hozzáférés",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "gepi", label: "Jó gépi hozzáférés" },
                    { value: "vegyes", label: "Vegyes hozzáférés" },
                    { value: "kezi", label: "Főleg kézi kihordás" }
                ]
            },
            { id: "carryDistance", type: "number", label: "Anyagmozgatási távolság", suffix: "m", min: 0, step: 1, placeholder: "pl. 18" },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Burkolattípus, meglévő szintkülönbség, képek..." }
        ],
        shopProducts: [
            { name: "Prémium térkő", priceLabel: "induló ár: 12 900 Ft / m²", description: "Teraszhoz és közlekedőhöz.", url: "https://agnesgeller.github.io/katalogus/" },
            { name: "Kerti lap", priceLabel: "induló ár: 16 500 Ft / m²", description: "Nagyobb formátumú kültéri lap.", url: "https://agnesgeller.github.io/katalogus/" }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const baseRate = lookupValue(values.material, {
                standard: 27000,
                premium: 36000,
                termesko: 48000
            });
            const thicknessFee = area * numberValue(values.thickness) * 65;
            const usageAdd = lookupValue(values.usage, {
                setany: 0,
                terasz: 2500,
                beallo: 6500
            });
            const subbaseFee = lookupValue(values.subbase, {
                uj: 145000,
                reszben: 65000,
                ismeretlen: 85000
            });
            const edgeFee = lookupValue(values.edgeCondition, {
                egyszeru: 0,
                reszletes: 45000,
                komplex: 92000
            });
            const edgingFee = isChecked(values.edging) ? 65000 : 0;
            const demolitionFee = isChecked(values.demolition) ? 115000 + numberValue(values.demolitionThickness) * area * 12 : 0;
            const drainageFee = isChecked(values.drainage)
                ? lookupValue(values.drainageType, { pont: 85000, folyoka: 125000, komplex: 185000 }, 85000)
                : 0;
            const levelFee = numberValue(values.levelDifference) * area * 9;
            const accessFee = lookupValue(values.accessMode, {
                gepi: 0,
                vegyes: 45000,
                kezi: 95000
            });
            const carryFee = numberValue(values.carryDistance) * lookupValue(values.accessMode, {
                gepi: 60,
                vegyes: 140,
                kezi: 260
            }, 60);
            const raw = area * (baseRate + usageAdd)
                + thicknessFee
                + subbaseFee
                + edgeFee
                + edgingFee
                + demolitionFee
                + drainageFee
                + levelFee
                + accessFee
                + carryFee;
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
            { id: "span", type: "number", label: "Legnagyobb fesztáv", suffix: "m", min: 0, step: 0.1, placeholder: "pl. 4.8", audience: "pro" },
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
            {
                id: "attachment",
                type: "select",
                label: "Kapcsolódás",
                audience: "pro",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "szabadonallo", label: "Szabadon álló" },
                    { value: "hazhoz", label: "Házhoz csatlakozó" },
                    { value: "vegyes", label: "Részben csatlakozó" }
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
            { id: "foundationPrep", type: "toggle", label: "Alapozási és fogadószerkezeti előkészítés is szükséges", full: true, audience: "pro" },
            { id: "drainagePrep", type: "toggle", label: "Vízlevezetés vagy csapadékkezelés is szükséges", full: true, audience: "pro" },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Elhelyezés, homlokzati csatlakozás, egyedi elképzelés..." }
        ],
        shopProducts: [
            { name: "Alumínium pergola rendszer", priceLabel: "induló ár: 1 190 000 Ft", description: "Közepes méretű modern pergola csomag.", url: "https://agnesgeller.github.io/katalogus/" },
            { name: "Zip-screen árnyékoló", priceLabel: "induló ár: 189 000 Ft / oldal", description: "Oldalárnyékoló kiegészítő pergolához.", url: "" }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const typeRate = lookupValue(values.type, {
                fa: 115000,
                aluminium: 155000,
                bioklimatikus: 235000
            });
            const spanFee = numberValue(values.span) * area * 2200;
            const attachmentFee = lookupValue(values.attachment, {
                szabadonallo: 0,
                hazhoz: 85000,
                vegyes: 120000
            });
            const sideFee = isChecked(values.sideShade)
                ? area * lookupValue(values.shadeType, { textil: 16000, screen: 26000, lamellas: 42000 }, 16000)
                : 0;
            const lightingFee = isChecked(values.lighting) ? 90000 : 0;
            const heatingFee = isChecked(values.heating) ? 160000 : 0;
            const foundationFee = isChecked(values.foundationPrep) ? 180000 : 0;
            const drainageFee = isChecked(values.drainagePrep) ? 75000 : 0;
            const raw = area * typeRate + spanFee + attachmentFee + sideFee + lightingFee + heatingFee + foundationFee + drainageFee;
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
            { id: "childCount", type: "number", label: "Gyermekek száma", suffix: "fő", min: 0, step: 1, placeholder: "pl. 2" },
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
            {
                id: "ageGroup",
                type: "choice",
                label: "Korosztály",
                full: true,
                audience: "pro",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "kicsi", label: "Kisgyermek" },
                    { value: "vegyes", label: "Vegyes korosztály" },
                    { value: "nagyobb", label: "Nagyobb gyermekek" }
                ]
            },
            { id: "install", type: "toggle", label: "Telepítéssel együtt kérem", full: true },
            { id: "fence", type: "toggle", label: "Biztonsági elhatárolás is szükséges", full: true },
            { id: "shading", type: "toggle", label: "Árnyékolás is szükséges", full: true, audience: "pro" },
            { id: "fallZone", type: "toggle", label: "Biztonsági esési zónát is ki kell alakítani", full: true, audience: "pro" },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Korosztály, kedvenc elemek, elhelyezés..." }
        ],
        shopProducts: [
            { name: "Játszótorony csomag", priceLabel: "induló ár: 299 000 Ft", description: "Hinta és csúszda kombináció.", url: "https://agnesgeller.github.io/katalogus/" },
            { name: "Prémium hintaállvány", priceLabel: "induló ár: 169 000 Ft", description: "Kisebb kertekhez is jól illeszthető.", url: "https://agnesgeller.github.io/katalogus/" }
        ],
        calculate(values) {
            const packageFee = lookupValue(values.package, {
                alap: 220000,
                kozepes: 420000,
                nagy: 690000
            });
            const childFee = numberValue(values.childCount) * 12000;
            const surfaceFee = lookupValue(values.surface, {
                nem: 0,
                mulcs: 90000,
                gumi: 240000
            });
            const ageFee = lookupValue(values.ageGroup, {
                kicsi: 35000,
                vegyes: 65000,
                nagyobb: 45000
            });
            const installFee = isChecked(values.install) ? 65000 : 0;
            const fenceFee = isChecked(values.fence) ? 115000 : 0;
            const shadingFee = isChecked(values.shading) ? 85000 : 0;
            const fallZoneFee = isChecked(values.fallZone) ? 95000 : 0;
            const raw = packageFee + childFee + surfaceFee + ageFee + installFee + fenceFee + shadingFee + fallZoneFee;
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
            {
                id: "sunExposure",
                type: "select",
                label: "Fekvés",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "napos", label: "Napos" },
                    { value: "felarnyek", label: "Félárnyékos" },
                    { value: "arnyek", label: "Árnyékos" }
                ]
            },
            {
                id: "soilState",
                type: "select",
                label: "Talajállapot",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "normal", label: "Normál kerti talaj" },
                    { value: "kimerult", label: "Kimerült / gyenge talaj" },
                    { value: "sittes", label: "Sittes / építési maradványos" },
                    { value: "agyagos", label: "Agyagos, kötött" }
                ]
            },
            { id: "soilReplacement", type: "toggle", label: "Talajcserét is kérek", full: true },
            {
                id: "soilReplacementQty",
                type: "number",
                label: "Talajcsere mennyisége",
                suffix: "m³",
                min: 0,
                step: 0.5,
                showWhen: { field: "soilReplacement", equals: true },
                placeholder: "pl. 6"
            },
            { id: "irrigationPrep", type: "toggle", label: "Öntözési előkészítést is kérek", full: true },
            { id: "mulch", type: "toggle", label: "Talajtakarást is kérek", full: true },
            {
                id: "mulchType",
                type: "select",
                label: "Talajtakarás típusa",
                showWhen: { field: "mulch", equals: true },
                options: [
                    { value: "", label: "Válassz" },
                    { value: "fakereg", label: "Fakéreg" },
                    { value: "dekor", label: "Dekorkavics" },
                    { value: "vegyes", label: "Vegyes takarás" }
                ]
            },
            { id: "edging", type: "toggle", label: "Ágyásszegély is szükséges", full: true },
            { id: "existingPlants", type: "toggle", label: "Meglévő növényállományhoz kell illeszteni", full: true },
            {
                id: "maintenanceLevel",
                type: "choice",
                label: "Fenntartási elvárás",
                full: true,
                options: [
                    { value: "", label: "Válassz" },
                    { value: "alacsony", label: "Alacsony fenntartás" },
                    { value: "kozepes", label: "Közepes fenntartás" },
                    { value: "intenziv", label: "Intenzív, gazdag ágyás" }
                ]
            },
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
            const sunAdd = lookupValue(values.sunExposure, {
                napos: 0,
                felarnyek: 600,
                arnyek: 1200
            });
            const soilAdd = lookupValue(values.soilState, {
                normal: 0,
                kimerult: 1800,
                sittes: 3200,
                agyagos: 1400
            });
            const soilReplacementFee = isChecked(values.soilReplacement) ? numberValue(values.soilReplacementQty) * 18000 : 0;
            const irrigationFee = isChecked(values.irrigationPrep) ? 38000 : 0;
            const mulchFee = isChecked(values.mulch)
                ? area * lookupValue(values.mulchType, { fakereg: 1200, dekor: 2100, vegyes: 1700 }, 1200)
                : 0;
            const edgingFee = isChecked(values.edging) ? 55000 : 0;
            const existingFee = isChecked(values.existingPlants) ? 35000 : 0;
            const maintenanceAdd = lookupValue(values.maintenanceLevel, {
                alacsony: 0,
                kozepes: 1200,
                intenziv: 2800
            });
            const raw = area * (styleRate + densityAdd + sunAdd + soilAdd + maintenanceAdd)
                + soilReplacementFee
                + irrigationFee
                + mulchFee
                + edgingFee
                + existingFee;
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
            {
                id: "plantType",
                type: "select",
                label: "Növény jellege",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "orokzold", label: "Örökzöld" },
                    { value: "lombhullato", label: "Lombhullató" },
                    { value: "vegyes", label: "Vegyes" }
                ]
            },
            { id: "finalHeight", type: "number", label: "Elvárt végmagasság", suffix: "m", min: 0, step: 0.1, placeholder: "pl. 2.2" },
            {
                id: "plantSpacing",
                type: "select",
                label: "Ültetési sűrűség",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "laza", label: "Lazább" },
                    { value: "normal", label: "Normál" },
                    { value: "suru", label: "Sűrűbb, gyors takaráshoz" }
                ]
            },
            { id: "doubleRow", type: "toggle", label: "Kétsoros ültetést is vállalhatunk", showWhen: { field: "privacy", equals: "magas" }, full: true },
            { id: "soilReplacement", type: "toggle", label: "Talajcsere vagy javítás is szükséges", full: true },
            { id: "rootBarrier", type: "toggle", label: "Gyökérterelő vagy védősáv is szükséges", full: true },
            { id: "existingRemoval", type: "toggle", label: "Meglévő sövény vagy növényzet bontása is kell", full: true },
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
            const plantTypeAdd = lookupValue(values.plantType, {
                orokzold: 3200,
                lombhullato: 0,
                vegyes: 1800
            });
            const heightAdd = numberValue(values.finalHeight) * 1800;
            const spacingAdd = lookupValue(values.plantSpacing, {
                laza: 0,
                normal: 1200,
                suru: 2800
            });
            const doubleRowFee = isChecked(values.doubleRow) ? length * 7000 : 0;
            const soilFee = isChecked(values.soilReplacement) ? length * 3500 : 0;
            const barrierFee = isChecked(values.rootBarrier) ? length * 2600 : 0;
            const removalFee = isChecked(values.existingRemoval) ? length * 2200 : 0;
            const dripFee = isChecked(values.drip) ? 42000 : 0;
            const raw = length * (rate + privacyAdd + plantTypeAdd + heightAdd + spacingAdd)
                + doubleRowFee
                + soilFee
                + barrierFee
                + removalFee
                + dripFee;
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
            {
                id: "purpose",
                type: "select",
                label: "Telepítés célja",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "arnyek", label: "Árnyékadás" },
                    { value: "disz", label: "Díszérték" },
                    { value: "takaras", label: "Takarás / térhatárolás" },
                    { value: "fasor", label: "Fasor vagy ismétlődő ültetés" }
                ]
            },
            { id: "pitVolume", type: "number", label: "Ültetőgödör összes mennyisége", suffix: "m³", min: 0, step: 0.5, placeholder: "pl. 3" },
            { id: "anchoring", type: "toggle", label: "Karózást és rögzítést is kérek", full: true },
            { id: "wateringBag", type: "toggle", label: "Öntözőzsákot is szeretnék", full: true },
            { id: "soilImprovement", type: "toggle", label: "Talajjavítást is kérek", full: true },
            { id: "rootBarrier", type: "toggle", label: "Gyökérterelő is szükséges", full: true },
            { id: "existingStump", type: "toggle", label: "Régi tuskó vagy gyökér eltávolítása is kell", full: true },
            {
                id: "accessMode",
                type: "select",
                label: "Beemelés és hozzáférés",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "gepi", label: "Jó gépi hozzáférés" },
                    { value: "vegyes", label: "Vegyes hozzáférés" },
                    { value: "kezi", label: "Főleg kézi mozgatás" }
                ]
            },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Fafaj, meglévő közművek, ültetési hely..." }
        ],
        calculate(values) {
            const count = numberValue(values.count);
            const unit = lookupValue(values.size, {
                fiatal: 65000,
                kozepes: 135000,
                nagy: 290000
            });
            const purposeAdd = lookupValue(values.purpose, {
                arnyek: 12000,
                disz: 0,
                takaras: 18000,
                fasor: 24000
            });
            const pitFee = numberValue(values.pitVolume) * 18000;
            const anchoringFee = isChecked(values.anchoring) ? count * 12000 : 0;
            const wateringFee = isChecked(values.wateringBag) ? count * 9000 : 0;
            const soilFee = isChecked(values.soilImprovement) ? count * 20000 : 0;
            const rootBarrierFee = isChecked(values.rootBarrier) ? count * 18000 : 0;
            const stumpFee = isChecked(values.existingStump) ? count * 25000 : 0;
            const accessFee = lookupValue(values.accessMode, {
                gepi: 0,
                vegyes: 45000,
                kezi: 90000
            });
            const raw = count * (unit + purposeAdd)
                + pitFee
                + anchoringFee
                + wateringFee
                + soilFee
                + rootBarrierFee
                + stumpFee
                + accessFee;
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
            {
                id: "purpose",
                type: "select",
                label: "Szegély szerepe",
                audience: "pro",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "gyep", label: "Gyep és ágyás elválasztása" },
                    { value: "burkolat", label: "Burkolat megtámasztása" },
                    { value: "dekor", label: "Dekoratív lezárás" }
                ]
            },
            { id: "curves", type: "toggle", label: "Íves vonalvezetés is lesz", full: true },
            { id: "foundation", type: "toggle", label: "Betonalapozást is kérek", full: true },
            { id: "heightStep", type: "toggle", label: "Szintváltás vagy magassági lépcsőzés is van", full: true, audience: "pro" },
            { id: "subgradePrep", type: "toggle", label: "Alapárok és fogadóágy előkészítése is szükséges", full: true, audience: "pro" },
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
            const purposeAdd = lookupValue(values.purpose, {
                gyep: 0,
                burkolat: 1800,
                dekor: 1200
            });
            const curveFee = isChecked(values.curves) ? length * 900 : 0;
            const foundationFee = isChecked(values.foundation) ? 45000 : 0;
            const heightFee = isChecked(values.heightStep) ? length * 1400 : 0;
            const subgradeFee = isChecked(values.subgradePrep) ? 35000 : 0;
            const raw = length * (rate + purposeAdd) + curveFee + foundationFee + heightFee + subgradeFee;
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
                id: "currentState",
                type: "choice",
                label: "Jelenlegi állapot",
                full: true,
                options: [
                    { value: "", label: "Válassz" },
                    { value: "nyers", label: "Nyers föld, füvesítés nélkül" },
                    { value: "ritkas", label: "Hiányos / ritkás gyep" },
                    { value: "gyomos", label: "Erősen gyomos terület" },
                    { value: "epitesi", label: "Építkezés utáni nyers terep" }
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
            {
                id: "subsoil",
                type: "select",
                label: "Altalaj / talajállapot",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "normal", label: "Normál kerti talaj" },
                    { value: "agyagos", label: "Agyagos, kötött" },
                    { value: "sittes", label: "Sittes / törmelékes" },
                    { value: "homokos", label: "Homokos, laza" }
                ]
            },
            { id: "weedTreatment", type: "toggle", label: "Gyomirtás vagy gyommentesítés is szükséges", full: true },
            { id: "roughGrading", type: "toggle", label: "Durva tereprendezés is szükséges", full: true },
            { id: "irrigationPrep", type: "toggle", label: "Öntözési előkészítést is kérek", full: true },
            { id: "levelling", type: "toggle", label: "Külön finom tereprendezés is szükséges", full: true },
            { id: "topsoil", type: "toggle", label: "Termőföld pótlásra is szükség lesz", full: true },
            {
                id: "topsoilQty",
                type: "number",
                label: "Termőföld mennyiség",
                suffix: "m³",
                min: 0,
                step: 0.5,
                showWhen: { field: "topsoil", equals: true },
                placeholder: "pl. 10"
            },
            {
                id: "topsoilDepth",
                type: "number",
                label: "Tervezett termőréteg vastagsága",
                suffix: "cm",
                min: 0,
                step: 1,
                showWhen: { field: "topsoil", equals: true },
                placeholder: "pl. 15"
            },
            {
                id: "accessMode",
                type: "select",
                label: "Kivitelezési hozzáférés",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "gepi", label: "Jó gépi hozzáférés" },
                    { value: "vegyes", label: "Vegyes, részben kézi kihordás" },
                    { value: "kezi", label: "Főleg kézi kihordás" }
                ]
            },
            {
                id: "carryDistance",
                type: "number",
                label: "Anyagmozgatási távolság",
                suffix: "m",
                min: 0,
                step: 1,
                placeholder: "pl. 25"
            },
            { id: "aftercare", type: "toggle", label: "Utókezelés / első nyírás / beállítás is szükséges", full: true },
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
            const stateRate = lookupValue(values.currentState, {
                nyers: 0,
                ritkas: 250,
                gyomos: 550,
                epitesi: 850
            });
            const subsoilRate = lookupValue(values.subsoil, {
                normal: 0,
                agyagos: 320,
                sittes: 780,
                homokos: 180
            });
            const weedFee = isChecked(values.weedTreatment) ? area * 280 : 0;
            const roughFee = isChecked(values.roughGrading) ? 85000 : 0;
            const irrigationFee = isChecked(values.irrigationPrep) ? 45000 : 0;
            const levellingFee = isChecked(values.levelling) ? 65000 : 0;
            const topsoilFee = isChecked(values.topsoil) ? numberValue(values.topsoilQty) * 18000 : 0;
            const topsoilDepthFee = isChecked(values.topsoil) ? numberValue(values.topsoilDepth) * area * 8 : 0;
            const accessFee = lookupValue(values.accessMode, {
                gepi: 0,
                vegyes: 45000,
                kezi: 95000
            });
            const carryFee = numberValue(values.carryDistance) * lookupValue(values.accessMode, {
                gepi: 80,
                vegyes: 180,
                kezi: 320
            }, 80);
            const aftercareFee = isChecked(values.aftercare) ? 35000 : 0;
            const raw = area * (typeRate + prepRate + stateRate + subsoilRate)
                + weedFee
                + roughFee
                + irrigationFee
                + levellingFee
                + topsoilFee
                + topsoilDepthFee
                + accessFee
                + carryFee
                + aftercareFee;
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
            { id: "thickness", type: "number", label: "Bontandó szerkezet vastagsága", suffix: "cm", min: 0, step: 1, placeholder: "pl. 15" },
            {
                id: "wasteType",
                type: "select",
                label: "Hulladék jellege",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "zold", label: "Főleg zöldhulladék" },
                    { value: "inert", label: "Inert sitt / beton / tégla" },
                    { value: "vegyes", label: "Vegyes hulladék" }
                ]
            },
            { id: "debris", type: "toggle", label: "Elszállítással együtt kérem", full: true },
            { id: "sorting", type: "toggle", label: "Anyagválogatás vagy külön rakodás is szükséges", full: true },
            { id: "cutting", type: "toggle", label: "Darabolás vagy vágás is szükséges", full: true },
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
            {
                id: "machineAccess",
                type: "select",
                label: "Gépbejárás",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "jo", label: "Jó gépi hozzáférés" },
                    { value: "korlatozott", label: "Korlátozott" },
                    { value: "nincs", label: "Nincs gépi hozzáférés" }
                ]
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
            const thicknessFee = numberValue(values.thickness) * area * 10;
            const wasteFee = lookupValue(values.wasteType, {
                zold: 0,
                inert: 55000,
                vegyes: 90000
            });
            const debrisFee = isChecked(values.debris) ? 95000 : 0;
            const sortingFee = isChecked(values.sorting) ? 45000 : 0;
            const cuttingFee = isChecked(values.cutting) ? 60000 : 0;
            const manualFee = isChecked(values.manualAccess) ? 80000 : 0;
            const carryFee = isChecked(values.manualAccess) ? numberValue(values.carryDistance) * 600 : 0;
            const machineFee = lookupValue(values.machineAccess, {
                jo: 0,
                korlatozott: 35000,
                nincs: 75000
            });
            const raw = area * rate + thicknessFee + wasteFee + debrisFee + sortingFee + cuttingFee + manualFee + carryFee + machineFee;
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
            { id: "maxHeight", type: "number", label: "Legnagyobb magasság", suffix: "m", min: 0, step: 0.1, placeholder: "pl. 1.8" },
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
                id: "soilPressure",
                type: "select",
                label: "Megtámasztott földtömeg jellege",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "enyhe", label: "Kisebb földnyomás" },
                    { value: "kozepes", label: "Átlagos földnyomás" },
                    { value: "eros", label: "Erős földnyomás / meredek rézsű" }
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
            { id: "coping", type: "toggle", label: "Falzárás / fedkő is szükséges", full: true },
            {
                id: "accessMode",
                type: "select",
                label: "Kivitelezési hozzáférés",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "gepi", label: "Jó gépi hozzáférés" },
                    { value: "vegyes", label: "Vegyes hozzáférés" },
                    { value: "kezi", label: "Főleg kézi kivitelezés" }
                ]
            },
            { id: "geogrid", type: "toggle", label: "Georács vagy megerősítés is szükséges", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Mennyire meredek a terep, van-e hely gépnek..." }
        ],
        shopProducts: [
            { name: "Támfalblokk rendszer", priceLabel: "induló ár: 18 500 Ft / m²", description: "Rendszerkő támfal építéshez.", url: "https://agnesgeller.github.io/katalogus/" },
            { name: "Gabion kosár", priceLabel: "induló ár: 42 000 Ft / db", description: "Modern, szellős támfalszerkezethez.", url: "https://agnesgeller.github.io/katalogus/" },
            { name: "Dréncső csomag", priceLabel: "induló ár: 19 900 Ft", description: "Vízelvezetéshez és háttöltéshez.", url: "https://agnesgeller.github.io/katalogus/" }
        ],
        calculate(values) {
            const length = numberValue(values.length);
            const height = numberValue(values.height);
            const systemRate = lookupValue(values.system, {
                betonblokk: 85000,
                termesko: 115000,
                gabion: 92000
            });
            const maxHeightFee = numberValue(values.maxHeight) * length * 12000;
            const pressureFee = lookupValue(values.soilPressure, {
                enyhe: 0,
                kozepes: 85000,
                eros: 165000
            });
            const foundationFee = lookupValue(values.foundation, {
                alap: 65000,
                erositett: 140000
            });
            const drainageFee = isChecked(values.drainage) ? 85000 : 0;
            const backfillFee = isChecked(values.drainage)
                ? lookupValue(values.backfill, { normal: 45000, erositett: 92000 }, 45000)
                : 0;
            const copingFee = isChecked(values.coping) ? length * 18000 : 0;
            const accessFee = lookupValue(values.accessMode, {
                gepi: 0,
                vegyes: 65000,
                kezi: 135000
            });
            const geogridFee = isChecked(values.geogrid) ? 95000 : 0;
            const raw = length * height * systemRate
                + maxHeightFee
                + pressureFee
                + foundationFee
                + drainageFee
                + backfillFee
                + copingFee
                + accessFee
                + geogridFee;
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
            {
                id: "zonePurpose",
                type: "checklist",
                label: "Világítási zónák célja",
                full: true,
                audience: "pro",
                options: [
                    { value: "setany", label: "Közlekedési útvonal" },
                    { value: "agyas", label: "Ágyás vagy növénykiemelés" },
                    { value: "terasz", label: "Terasz vagy pihenőtér" },
                    { value: "biztonsag", label: "Biztonsági / orientációs fény" }
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
            { id: "transformer", type: "toggle", label: "Transzformátor vagy vezérlődoboz telepítése is szükséges", full: true, audience: "pro" },
            { id: "existingNetwork", type: "toggle", label: "Meglévő kültéri hálózathoz kell illeszteni", full: true, audience: "pro" },
            { id: "trench", type: "number", label: "Kábelárok hossza", suffix: "fm", min: 0, step: 1, placeholder: "pl. 26" },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Milyen hangulatot, milyen zónákat szeretnél kiemelni..." }
        ],
        shopProducts: [
            { name: "Kerti leszúrható lámpa", priceLabel: "induló ár: 14 900 Ft", description: "Ágyások és kis fák kiemeléséhez.", url: "https://agnesgeller.github.io/katalogus/" },
            { name: "Járdavilágító oszlop", priceLabel: "induló ár: 22 900 Ft", description: "Biztonságos közlekedéshez.", url: "https://agnesgeller.github.io/katalogus/" }
        ],
        calculate(values) {
            const points = numberValue(values.points);
            const pointRate = lookupValue(values.type, {
                hangulat: 28000,
                setany: 36000,
                vegyes: 42000,
                premium: 56000
            });
            const zoneCount = Array.isArray(values.zonePurpose) ? values.zonePurpose.length : 0;
            const zoneFee = zoneCount * 18000;
            const smartFee = isChecked(values.smart) ? 95000 : 0;
            const scenesFee = isChecked(values.smart) ? numberValue(values.sceneCount) * 18000 : 0;
            const transformerFee = isChecked(values.transformer) ? 48000 : 0;
            const networkFee = isChecked(values.existingNetwork) ? 36000 : 0;
            const trenchFee = numberValue(values.trench) * 1800;
            const raw = points * pointRate + zoneFee + smartFee + scenesFee + transformerFee + networkFee + trenchFee;
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
            {
                id: "consumers",
                type: "checklist",
                label: "Tervezett fogyasztók",
                full: true,
                audience: "pro",
                options: [
                    { value: "robot", label: "Robotfűnyíró" },
                    { value: "szivattyu", label: "Szivattyú vagy gépészet" },
                    { value: "vilagitas", label: "Kerti világítás" },
                    { value: "kapu", label: "Kapumozgatás vagy automatika" }
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
            { id: "distributionBoard", type: "toggle", label: "Külön kültéri elosztó vagy bővítés is szükséges", full: true, audience: "pro" },
            { id: "existingNetwork", type: "toggle", label: "Meglévő hálózat felmérése és illesztése is kell", full: true, audience: "pro" },
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
            const consumerCount = Array.isArray(values.consumers) ? values.consumers.length : 0;
            const consumerFee = consumerCount * 24000;
            const weatherFee = isChecked(values.weatherproof) ? points * 18000 : 0;
            const kitchenFee = isChecked(values.outdoorKitchen)
                ? lookupValue(values.highLoad, { grill: 95000, jacuzzi: 160000 }, 95000)
                : 0;
            const boardFee = isChecked(values.distributionBoard) ? 78000 : 0;
            const networkFee = isChecked(values.existingNetwork) ? 42000 : 0;
            const trenchFee = numberValue(values.trench) * 2200;
            const raw = points * pointRate + consumerFee + weatherFee + kitchenFee + boardFee + networkFee + trenchFee;
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
                id: "propertyType",
                type: "choice",
                label: "Milyen területet kell tisztítani?",
                full: true,
                options: [
                    { value: "", label: "Válassz" },
                    { value: "epitesi", label: "Építési telek vagy nyers terület" },
                    { value: "elhanyagolt", label: "Elhanyagolt, benőtt kert" },
                    { value: "lakott", label: "Részben használt lakott kert" },
                    { value: "bozotos", label: "Bozótos, erősen felverődött telek" }
                ]
            },
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
            {
                id: "tasks",
                type: "checklist",
                label: "Szükséges munkák",
                full: true,
                options: [
                    { value: "kaszalas", label: "Kaszálás" },
                    { value: "bozotirtas", label: "Bozótirtás" },
                    { value: "cserjeirtas", label: "Cserjeirtás" },
                    { value: "kezitakaritas", label: "Kézi összeszedés / takarítás" },
                    { value: "invaziv", label: "Invazív gyomok kezelése" }
                ]
            },
            { id: "removal", type: "toggle", label: "Zöldhulladék elszállítással együtt kérem", full: true },
            {
                id: "wasteType",
                type: "select",
                label: "Elszállítandó anyag jellege",
                showWhen: { field: "removal", equals: true },
                options: [
                    { value: "", label: "Válassz" },
                    { value: "zold", label: "Csak zöldhulladék" },
                    { value: "vegyes", label: "Zöldhulladék és egyéb maradványok" },
                    { value: "epitesi", label: "Építési maradványok is vannak" }
                ]
            },
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
            { id: "treeCutting", type: "toggle", label: "Kisebb fák / sarjak kivágása is szükséges", full: true },
            {
                id: "treeCount",
                type: "number",
                label: "Kivágandó kisebb fák száma",
                suffix: "db",
                min: 0,
                step: 1,
                showWhen: { field: "treeCutting", equals: true },
                placeholder: "pl. 6"
            },
            {
                id: "machineAccess",
                type: "select",
                label: "Gépbejárás",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "jo", label: "Jó gépi hozzáférés" },
                    { value: "korlatozott", label: "Korlátozott hozzáférés" },
                    { value: "nincs", label: "Csak kézi megközelítés" }
                ]
            },
            { id: "manualCarry", type: "toggle", label: "Kézi kihordás is szükséges", full: true },
            {
                id: "carryDistance",
                type: "number",
                label: "Kihordási távolság",
                suffix: "m",
                min: 0,
                step: 1,
                showWhen: { field: "manualCarry", equals: true },
                placeholder: "pl. 20"
            },
            { id: "oldMaterials", type: "toggle", label: "Régi anyagmaradványok, szemét vagy sitt is van a területen", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Elhanyagolt terület, bozót, régi anyagmaradványok..." }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const propertyFee = lookupValue(values.propertyType, {
                epitesi: 45000,
                elhanyagolt: 65000,
                lakott: 25000,
                bozotos: 95000
            });
            const rate = lookupValue(values.density, {
                enyhe: 550,
                kozepes: 1100,
                suru: 1900
            });
            const taskCount = Array.isArray(values.tasks) ? values.tasks.length : 0;
            const removalFee = isChecked(values.removal) ? 65000 : 0;
            const wasteFee = isChecked(values.removal)
                ? lookupValue(values.wasteType, {
                    zold: 0,
                    vegyes: 45000,
                    epitesi: 95000
                }, 0)
                : 0;
            const stumpFee = isChecked(values.stumps) ? numberValue(values.stumpCount) * 22000 : 0;
            const treeFee = isChecked(values.treeCutting) ? numberValue(values.treeCount) * 18000 : 0;
            const machineFee = lookupValue(values.machineAccess, {
                jo: 0,
                korlatozott: 35000,
                nincs: 75000
            });
            const manualFee = isChecked(values.manualCarry) ? 45000 + numberValue(values.carryDistance) * 380 : 0;
            const oldMaterialFee = isChecked(values.oldMaterials) ? 85000 : 0;
            const raw = area * rate
                + propertyFee
                + taskCount * 26000
                + removalFee
                + wasteFee
                + stumpFee
                + treeFee
                + machineFee
                + manualFee
                + oldMaterialFee;
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
            { id: "levelDifference", type: "number", label: "Becsült szintkülönbség", suffix: "cm", min: 0, step: 1, placeholder: "pl. 45" },
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
            {
                id: "workType",
                type: "checklist",
                label: "Szükséges munkák",
                full: true,
                options: [
                    { value: "durva", label: "Durva tereprendezés" },
                    { value: "finom", label: "Finom tereprendezés" },
                    { value: "rezu", label: "Rézsű kialakítás" },
                    { value: "toltes", label: "Töltésépítés" },
                    { value: "deponia", label: "Depóniák elsimítása" }
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
                id: "soilBalance",
                type: "select",
                label: "Földmérleg",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "egyensuly", label: "Nagyjából egyensúlyban van" },
                    { value: "hiany", label: "Földhiány várható" },
                    { value: "tobblet", label: "Földtöbblet várható" }
                ]
            },
            {
                id: "excessSoilQty",
                type: "number",
                label: "Földhiány / többlet mennyiség",
                suffix: "m³",
                min: 0,
                step: 0.5,
                showWhen: { field: "soilBalance", oneOf: ["hiany", "tobblet"] },
                placeholder: "pl. 8"
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
            {
                id: "earthmovingMode",
                type: "choice",
                label: "Anyagmozgatás módja",
                full: true,
                options: [
                    { value: "", label: "Válassz" },
                    { value: "gepi", label: "Főleg gépi" },
                    { value: "vegyes", label: "Vegyes, gépi és kézi" },
                    { value: "kezi", label: "Főleg kézi / talicskás" }
                ]
            },
            { id: "carryDistance", type: "number", label: "Hordási távolság", suffix: "m", min: 0, step: 1, placeholder: "pl. 30" },
            {
                id: "subsoil",
                type: "select",
                label: "Talajtípus",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "normal", label: "Normál kerti talaj" },
                    { value: "agyagos", label: "Agyagos, kötött" },
                    { value: "sittes", label: "Sittes / törmelékes" },
                    { value: "koves", label: "Köves" }
                ]
            },
            { id: "disposal", type: "toggle", label: "Elszállítás is szükséges", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Lejtés, töltés, rézsű, szűk átjáró, fal melletti sáv..." }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const rate = lookupValue(values.difficulty, {
                enyhe: 3200,
                kozepes: 5200,
                eros: 8200
            });
            const levelFee = numberValue(values.levelDifference) * area * 4;
            const workCount = Array.isArray(values.workType) ? values.workType.length : 0;
            const workFee = workCount * 38000;
            const topsoilFee = isChecked(values.topsoil) ? numberValue(values.topsoilQty) * 18000 : 0;
            const soilBalanceFee = lookupValue(values.soilBalance, {
                egyensuly: 0,
                hiany: numberValue(values.excessSoilQty) * 16000,
                tobblet: numberValue(values.excessSoilQty) * 12000
            }, 0);
            const accessFee = lookupValue(values.machineAccess, {
                jo: 0,
                korlatozott: 65000,
                nehez: 125000
            });
            const movingFee = lookupValue(values.earthmovingMode, {
                gepi: numberValue(values.carryDistance) * 120,
                vegyes: numberValue(values.carryDistance) * 240,
                kezi: numberValue(values.carryDistance) * 420
            }, 0);
            const subsoilFee = lookupValue(values.subsoil, {
                normal: 0,
                agyagos: area * 220,
                sittes: area * 680,
                koves: area * 540
            }, 0);
            const disposalFee = isChecked(values.disposal) ? 95000 : 0;
            const raw = area * rate
                + levelFee
                + workFee
                + topsoilFee
                + soilBalanceFee
                + accessFee
                + movingFee
                + subsoilFee
                + disposalFee;
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
            { id: "heightPlay", type: "toggle", label: "Szintjátékot vagy kisebb domborzatot is kérek", full: true, audience: "pro" },
            {
                id: "basePrep",
                type: "select",
                label: "Alapréteg és drénelőkészítés",
                audience: "pro",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "minimal", label: "Minimális alapelőkészítés" },
                    { value: "kozepes", label: "Közepes drén- és alapréteg" },
                    { value: "erositett", label: "Erősített rétegrend" }
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
            { id: "edgeSupport", type: "toggle", label: "Peremrögzítés vagy kőtámasztás is szükséges", full: true, audience: "pro" },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Napfény, stílus, kedvelt kőszínek..." }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const rate = lookupValue(values.stone, {
                andezit: 22000,
                meszko: 26000,
                diszko: 34000
            });
            const heightFee = isChecked(values.heightPlay) ? area * 2800 : 0;
            const baseFee = lookupValue(values.basePrep, {
                minimal: 28000,
                kozepes: 62000,
                erositett: 98000
            });
            const plantingFee = isChecked(values.planting)
                ? area * lookupValue(values.plantStyle, { visszafogott: 4000, kozepes: 6500, gazdag: 9500 }, 4000)
                : 0;
            const weedFee = isChecked(values.weedBarrier) ? 38000 : 0;
            const edgeFee = isChecked(values.edgeSupport) ? 42000 : 0;
            const raw = area * rate + heightFee + baseFee + plantingFee + weedFee + edgeFee;
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
            {
                id: "fraction",
                type: "select",
                label: "Kavics frakciója",
                audience: "pro",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "finom", label: "Finom szemcse" },
                    { value: "kozepes", label: "Közepes szemcse" },
                    { value: "durva", label: "Durva dekorfrakció" }
                ]
            },
            { id: "depth", type: "number", label: "Rétegvastagság", suffix: "cm", min: 0, step: 1, placeholder: "pl. 5", audience: "pro" },
            { id: "geotextile", type: "toggle", label: "Geotextillel együtt kérem", full: true },
            { id: "subgradePrep", type: "toggle", label: "Fogadófelület előkészítése és finom szintezése is kell", full: true, audience: "pro" },
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
            { name: "Fehér díszkavics", priceLabel: "induló ár: 8 900 Ft / zsák", description: "Világos, dekoratív felületekhez.", url: "https://agnesgeller.github.io/katalogus/" },
            { name: "Bazalt dekor", priceLabel: "induló ár: 9 900 Ft / zsák", description: "Kontrasztos, modern megjelenéshez.", url: "https://agnesgeller.github.io/katalogus/" }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const rate = lookupValue(values.gravel, {
                folyami: 9500,
                feher: 14500,
                bazalt: 16500
            });
            const fractionAdd = lookupValue(values.fraction, {
                finom: 0,
                kozepes: 1200,
                durva: 2400
            });
            const depthFee = area * numberValue(values.depth) * 320;
            const geotextileFee = isChecked(values.geotextile) ? area * 650 : 0;
            const subgradeFee = isChecked(values.subgradePrep) ? area * 1100 : 0;
            const edgingFee = isChecked(values.edging)
                ? lookupValue(values.edgingMaterial, { muanyag: 45000, fem: 72000, corten: 98000 }, 45000)
                : 0;
            const raw = area * (rate + fractionAdd) + depthFee + geotextileFee + subgradeFee + edgingFee;
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
            { id: "height", type: "number", label: "Kerítés magassága", suffix: "m", min: 0, step: 0.1, placeholder: "pl. 1.8" },
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
            {
                id: "privacyLevel",
                type: "choice",
                label: "Belátásvédelem szintje",
                full: true,
                options: [
                    { value: "", label: "Válassz" },
                    { value: "reszleges", label: "Részleges belátásvédelem" },
                    { value: "kozepes", label: "Közepes takarás" },
                    { value: "teljes", label: "Teljes zárás" }
                ]
            },
            {
                id: "terrain",
                type: "select",
                label: "Telekhatár és terepviszony",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "sik", label: "Sík terep" },
                    { value: "lejtos", label: "Lejtős vagy szinteltéréses" },
                    { value: "bizonytalan", label: "Telekhatár / szint még pontosítandó" }
                ]
            },
            {
                id: "foundation",
                type: "select",
                label: "Alapozási igény",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "pont", label: "Pontszerű oszlopalapok" },
                    { value: "savalap", label: "Sávalap" },
                    { value: "erositett", label: "Erősített alapozás" }
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
            { id: "automation", type: "toggle", label: "Kapunyitó automatika is szükséges", showWhen: { field: "gate", equals: true }, full: true },
            { id: "demolition", type: "toggle", label: "Meglévő kerítés bontása is kell", full: true },
            { id: "manualAccess", type: "toggle", label: "Korlátozott hozzáférés, részben kézi kivitelezéssel", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Belátásvédelem, stílus, szomszédos oldal, alapozás..." }
        ],
        shopProducts: [
            { name: "Panelkerítés szett", priceLabel: "induló ár: 24 900 Ft / panel", description: "Gyorsan telepíthető klasszikus rendszer.", url: "https://agnesgeller.github.io/katalogus/" },
            { name: "WPC kerítésrendszer", priceLabel: "induló ár: 39 900 Ft / panel", description: "Magasabb privát szinthez.", url: "https://agnesgeller.github.io/katalogus/" }
        ],
        calculate(values) {
            const length = numberValue(values.length);
            const height = numberValue(values.height);
            const rate = lookupValue(values.type, {
                panel: 24000,
                wpc: 42000,
                leces: 38000,
                falazott: 65000
            });
            const privacyAdd = lookupValue(values.privacyLevel, {
                reszleges: 0,
                kozepes: 3200,
                teljes: 7600
            });
            const terrainFee = lookupValue(values.terrain, {
                sik: 0,
                lejtos: 95000,
                bizonytalan: 55000
            });
            const foundationFee = lookupValue(values.foundation, {
                pont: 0,
                savalap: 95000,
                erositett: 165000
            });
            const gateFee = isChecked(values.gate)
                ? lookupValue(values.gateType, { szemely: 180000, kert: 260000, tolokapu: 420000 }, 180000)
                : 0;
            const automationFee = isChecked(values.automation) ? 180000 : 0;
            const demolitionFee = isChecked(values.demolition) ? 95000 : 0;
            const manualFee = isChecked(values.manualAccess) ? 85000 : 0;
            const raw = length * (rate + privacyAdd + height * 3800)
                + terrainFee
                + foundationFee
                + gateFee
                + automationFee
                + demolitionFee
                + manualFee;
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
            { id: "depth", type: "number", label: "Átlagos mélység", suffix: "cm", min: 0, step: 1, placeholder: "pl. 90", audience: "pro" },
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
            { id: "machineRoom", type: "toggle", label: "Gépészeti akna vagy rejtett technikai tér is szükséges", full: true, audience: "pro" },
            { id: "stream", type: "toggle", label: "Patak- vagy vízesés-elemet is szeretnék", full: true },
            { id: "lighting", type: "toggle", label: "Víz alatti vagy parti világítást is kérek", full: true },
            { id: "childSafety", type: "toggle", label: "Gyermekbiztonsági kialakítás is szükséges", full: true, audience: "pro" },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Stílus, halak, karbantarthatóság, elhelyezés..." }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const depthFee = area * numberValue(values.depth) * 180;
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
            const machineFee = isChecked(values.machineRoom) ? 180000 : 0;
            const streamFee = isChecked(values.stream) ? 135000 : 0;
            const lightingFee = isChecked(values.lighting) ? 85000 : 0;
            const safetyFee = isChecked(values.childSafety) ? 95000 : 0;
            const raw = area * typeRate + depthFee + filtrationFee + machineFee + streamFee + lightingFee + safetyFee;
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
                id: "deliverables",
                type: "checklist",
                label: "Kért tervrészek",
                full: true,
                audience: "pro",
                options: [
                    { value: "helyszinrajz", label: "Helyszínrajz" },
                    { value: "burkolat", label: "Burkolat- és szintezési terv" },
                    { value: "ultetesi", label: "Ültetési terv" },
                    { value: "ontozes", label: "Öntözési vázlat" }
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
            { id: "baseDocs", type: "toggle", label: "Meglévő alaprajz, geodézia vagy közműadat feldolgozása is kell", full: true, audience: "pro" },
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
            const deliverableCount = Array.isArray(values.deliverables) ? values.deliverables.length : 0;
            const deliverableFee = deliverableCount * 28000;
            const docsFee = isChecked(values.baseDocs) ? 45000 : 0;
            const visitFee = isChecked(values.siteVisit) ? 45000 : 0;
            const raw = packageFee + deliverableFee + plotFee + revisionFee + docsFee + visitFee;
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
            {
                id: "viewTypes",
                type: "checklist",
                label: "Kért nézettípusok",
                full: true,
                audience: "pro",
                options: [
                    { value: "nappali", label: "Nappali összkép" },
                    { value: "esti", label: "Esti hangulat" },
                    { value: "legi", label: "Felülnézeti vagy madártávlati kép" },
                    { value: "reszlet", label: "Részletkiemelés" }
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
            { id: "sourcePlan", type: "toggle", label: "Meglévő tervből vagy felmérésből kell felépíteni", full: true, audience: "pro" },
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
            const viewCount = Array.isArray(values.viewTypes) ? values.viewTypes.length : 0;
            const viewFee = viewCount * 18000;
            const animationFee = isChecked(values.animation) ? numberValue(values.animationLength) * 90000 : 0;
            const sourceFee = isChecked(values.sourcePlan) ? 35000 : 0;
            const variantsFee = numberValue(values.variants) * 30000;
            const raw = renders * qualityRate + viewFee + animationFee + sourceFee + variantsFee;
            return withStartingPrice(140000, raw);
        }
    }
];

const COMMON_SERVICE_FIELDS = [
    {
        id: "projectStage",
        type: "select",
        label: "Munka jellege",
        audience: "pro",
        options: [
            { value: "", label: "Válassz" },
            { value: "uj", label: "Új kialakítás" },
            { value: "atalakitas", label: "Meglévő átalakítása" },
            { value: "felujitas", label: "Részleges felújítás" },
            { value: "helyreallitas", label: "Helyreállítás / javítás" }
        ]
    },
    {
        id: "solutionLevel",
        type: "choice",
        label: "Megoldási szint",
        audience: "pro",
        full: true,
        options: [
            { value: "", label: "Még nem döntöttem" },
            { value: "koltseghatekony", label: "Költséghatékony / megtakarításra optimalizált", note: "Egyszerűbb, takarékosabb megoldás" },
            { value: "kiegyensulyozott", label: "Kiegyensúlyozott", note: "Ár-érték arányban átgondolt megoldás" },
            { value: "premium", label: "Teljes műszaki tartalom / magasabb esztétikai szint", note: "Erősebb műszaki és vizuális tartalom" }
        ]
    },
    {
        id: "siteAccess",
        type: "choice",
        label: "Megközelítés és helyszíni nehézség",
        audience: "pro",
        full: true,
        options: [
            { value: "", label: "Még nem tudom" },
            { value: "konnyu", label: "Könnyű megközelítés", note: "Jól behajtható, könnyen szervezhető" },
            { value: "korlatozott", label: "Korlátozott megközelítés", note: "Szűkebb vagy részben kézi kihordás" },
            { value: "nehez", label: "Nehéz megközelítés", note: "Szűk, meredek vagy kézi mozgatást igénylő helyszín" }
        ]
    }
];

const EXTRA_SERVICES = [
    {
        id: "vizelvezetes-csapadekviz",
        name: "Vízelvezetés és csapadékvíz-kezelés",
        badge: "Folyóka, drén, szikkasztás",
        description: "Burkolatok, falsávok és terepszintek vízelvezetési problémáinak előkészítő felmérése.",
        fields: [
            { id: "affectedArea", type: "number", label: "Érintett felület", suffix: "m²", min: 0, step: 1, placeholder: "pl. 85" },
            { id: "drainLength", type: "number", label: "Folyóka vagy drénhossz", suffix: "fm", min: 0, step: 1, placeholder: "pl. 24" },
            {
                id: "problemType",
                type: "choice",
                label: "Fő probléma",
                full: true,
                options: [
                    { value: "", label: "Válassz" },
                    { value: "pango", label: "Pangó víz" },
                    { value: "sar", label: "Sárosodás" },
                    { value: "fal", label: "Fal vagy épület melletti visszafröccsenés" },
                    { value: "burkolat", label: "Burkolat melletti lefolyási gond" }
                ]
            },
            {
                id: "solutionType",
                type: "checklist",
                label: "Kért megoldások",
                full: true,
                options: [
                    { value: "folyoka", label: "Folyóka" },
                    { value: "drencso", label: "Dréncső" },
                    { value: "szikkaszto", label: "Szikkasztó" },
                    { value: "eso", label: "Esővízgyűjtő" },
                    { value: "lejtesszabalyzas", label: "Lejtésszabályzás" }
                ]
            },
            { id: "existingUtilities", type: "toggle", label: "Közmű vagy gyökér nehezíti a kivitelezést", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Pangó pontok, lejtések, jelenlegi kifolyás..." }
        ],
        calculate(values) {
            const area = numberValue(values.affectedArea);
            const length = numberValue(values.drainLength);
            const problemFee = lookupValue(values.problemType, {
                pango: 65000,
                sar: 45000,
                fal: 85000,
                burkolat: 75000
            });
            const solutionCount = Array.isArray(values.solutionType) ? values.solutionType.length : 0;
            const utilityFee = isChecked(values.existingUtilities) ? 70000 : 0;
            return Math.round(area * 4200 + length * 6800 + problemFee + solutionCount * 38000 + utilityFee);
        }
    },
    {
        id: "parkolo-gepkocsibeallo",
        name: "Parkoló és gépkocsi-beálló",
        badge: "Beálló és manőverterület",
        description: "Autóbeállók, parkolók és kapcsolódó burkolati csomópontok felmérése.",
        fields: [
            { id: "slots", type: "number", label: "Parkolóhelyek száma", suffix: "db", min: 0, step: 1, placeholder: "pl. 2" },
            { id: "area", type: "number", label: "Burkolt felület", suffix: "m²", min: 0, step: 1, placeholder: "pl. 52" },
            {
                id: "trafficType",
                type: "choice",
                label: "Terhelés",
                full: true,
                options: [
                    { value: "", label: "Válassz" },
                    { value: "szemelyauto", label: "Személyautó" },
                    { value: "suv", label: "SUV vagy nagyobb autó" },
                    { value: "teher", label: "Teherautó / utánfutó is" }
                ]
            },
            { id: "turningArea", type: "toggle", label: "Forduló- vagy manőverterületet is kérek", full: true },
            { id: "lighting", type: "toggle", label: "Kapcsolódó világítás is szükséges", full: true },
            { id: "drainage", type: "toggle", label: "Vízelvezetés is szükséges", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Kapcsolódó kapu, járda, fordulás, használati gyakoriság..." }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const slots = numberValue(values.slots);
            const trafficRate = lookupValue(values.trafficType, {
                szemelyauto: 36000,
                suv: 40500,
                teher: 52000
            });
            const turningFee = isChecked(values.turningArea) ? 180000 : 0;
            const lightingFee = isChecked(values.lighting) ? 95000 : 0;
            const drainageFee = isChecked(values.drainage) ? 145000 : 0;
            return Math.round(area * trafficRate + slots * 40000 + turningFee + lightingFee + drainageFee);
        }
    },
    {
        id: "kulteri-lepcso-rampa",
        name: "Kültéri lépcső és rámpa",
        badge: "Szintkülönbség kezelése",
        description: "Kültéri lépcsők, rámpák és kapcsolódó közlekedőelemek felmérése.",
        fields: [
            { id: "stepCount", type: "number", label: "Lépcsőfokok száma", suffix: "db", min: 0, step: 1, placeholder: "pl. 6" },
            { id: "heightDifference", type: "number", label: "Szintkülönbség", suffix: "cm", min: 0, step: 1, placeholder: "pl. 95" },
            {
                id: "material",
                type: "choice",
                label: "Kialakítás",
                full: true,
                options: [
                    { value: "", label: "Válassz" },
                    { value: "terko", label: "Térkő vagy lapburkolat" },
                    { value: "monolit", label: "Monolit beton" },
                    { value: "termesko", label: "Terméskő" },
                    { value: "kombinalt", label: "Kombinált lépcső és rámpa" }
                ]
            },
            { id: "handrail", type: "toggle", label: "Korlát vagy oldalfal is szükséges", full: true },
            { id: "lighting", type: "toggle", label: "Világítás is szükséges", full: true },
            { id: "antiSlip", type: "toggle", label: "Kiemelt csúszásmentesség szükséges", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Kapcsolódó szintek, idősek vagy gyermekek használata, vízelvezetés..." }
        ],
        calculate(values) {
            const steps = numberValue(values.stepCount);
            const height = numberValue(values.heightDifference);
            const materialFee = lookupValue(values.material, {
                terko: 260000,
                monolit: 320000,
                termesko: 420000,
                kombinalt: 510000
            });
            const railFee = isChecked(values.handrail) ? 135000 : 0;
            const lightingFee = isChecked(values.lighting) ? 85000 : 0;
            const antiSlipFee = isChecked(values.antiSlip) ? 45000 : 0;
            return Math.round(materialFee + steps * 22000 + height * 850 + railFee + lightingFee + antiSlipFee);
        }
    },
    {
        id: "tarolok-kiszolgalo-elemek",
        name: "Tárolók és kiszolgáló elemek",
        badge: "Szerszámtároló, kuka, géptároló",
        description: "Kerti tárolók, kukaelrejtők és kiszolgáló építmények előkészítő felmérése.",
        fields: [
            {
                id: "storageType",
                type: "checklist",
                label: "Kért elemek",
                full: true,
                options: [
                    { value: "szerszam", label: "Szerszámtároló" },
                    { value: "gep", label: "Géptároló" },
                    { value: "kuka", label: "Kukatároló" },
                    { value: "fa", label: "Tűzifatároló" },
                    { value: "kerekpar", label: "Kerékpártároló" }
                ]
            },
            { id: "area", type: "number", label: "Összes alapterület", suffix: "m²", min: 0, step: 1, placeholder: "pl. 12" },
            {
                id: "material",
                type: "select",
                label: "Szerkezet",
                options: [
                    { value: "", label: "Válassz" },
                    { value: "fa", label: "Fa" },
                    { value: "fem", label: "Fém" },
                    { value: "konnyuszerkezet", label: "Könnyűszerkezet" },
                    { value: "falazott", label: "Falazott" }
                ]
            },
            { id: "power", type: "toggle", label: "Áramkiállás is szükséges", full: true },
            { id: "water", type: "toggle", label: "Vízkiállás is szükséges", full: true },
            { id: "foundation", type: "toggle", label: "Alapozás vagy burkolat is kell alá", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Mire kell, mekkora ajtó, milyen homlokzathoz illeszkedjen..." }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const typeCount = Array.isArray(values.storageType) ? values.storageType.length : 0;
            const materialRate = lookupValue(values.material, {
                fa: 165000,
                fem: 210000,
                konnyuszerkezet: 245000,
                falazott: 340000
            });
            const powerFee = isChecked(values.power) ? 70000 : 0;
            const waterFee = isChecked(values.water) ? 65000 : 0;
            const foundationFee = isChecked(values.foundation) ? 115000 : 0;
            return Math.round(area * 42000 + typeCount * 55000 + materialRate + powerFee + waterFee + foundationFee);
        }
    },
    {
        id: "vetemenyes-emelt-agyas",
        name: "Veteményes és emelt ágyás",
        badge: "Haszonkert",
        description: "Veteményes, fűszerkert és emelt ágyások kialakításának felmérése.",
        fields: [
            { id: "bedCount", type: "number", label: "Ágyások száma", suffix: "db", min: 0, step: 1, placeholder: "pl. 4" },
            { id: "area", type: "number", label: "Összes terület", suffix: "m²", min: 0, step: 1, placeholder: "pl. 18" },
            {
                id: "construction",
                type: "choice",
                label: "Kialakítás",
                full: true,
                options: [
                    { value: "", label: "Válassz" },
                    { value: "talajszint", label: "Talajszintű veteményes" },
                    { value: "magasagyas", label: "Emelt ágyás" },
                    { value: "vegyes", label: "Vegyes rendszer" }
                ]
            },
            { id: "irrigation", type: "toggle", label: "Öntözést is kérek hozzá", full: true },
            { id: "soilReplacement", type: "toggle", label: "Talajcsere vagy komposztfeltöltés is szükséges", full: true },
            { id: "shading", type: "toggle", label: "Árnyékolás vagy védelem is szükséges", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Mit termesztenétek, mennyire intenzív használattal..." }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const beds = numberValue(values.bedCount);
            const constructionRate = lookupValue(values.construction, {
                talajszint: 18500,
                magasagyas: 52000,
                vegyes: 36500
            });
            const irrigationFee = isChecked(values.irrigation) ? 95000 : 0;
            const soilFee = isChecked(values.soilReplacement) ? 120000 : 0;
            const shadingFee = isChecked(values.shading) ? 75000 : 0;
            return Math.round(area * constructionRate + beds * 24000 + irrigationFee + soilFee + shadingFee);
        }
    },
    {
        id: "medence-jacuzzi-elokeszites",
        name: "Medence és jacuzzi előkészítés",
        badge: "Gépészet és környezet",
        description: "Medence, jacuzzi vagy dézsa előkészítésének terepi és műszaki felmérése.",
        fields: [
            {
                id: "unitType",
                type: "choice",
                label: "Mi készülne?",
                full: true,
                options: [
                    { value: "", label: "Válassz" },
                    { value: "medence", label: "Medence" },
                    { value: "jacuzzi", label: "Jacuzzi" },
                    { value: "tobb", label: "Több funkció együtt" }
                ]
            },
            { id: "area", type: "number", label: "Érintett felület", suffix: "m²", min: 0, step: 1, placeholder: "pl. 35" },
            { id: "machineRoom", type: "toggle", label: "Gépészeti akna vagy kiszolgáló zóna is kell", full: true },
            { id: "waterPower", type: "toggle", label: "Víz- és áramkiállás előkészítés is kell", full: true },
            { id: "decking", type: "toggle", label: "Kapcsolódó burkolat vagy pihenőterasz is kell", full: true },
            { id: "safety", type: "toggle", label: "Kiemelt gyermekbiztonság szükséges", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Mélyítés, gépészet helye, takarás, környező burkolatok..." }
        ],
        calculate(values) {
            const area = numberValue(values.area);
            const unitFee = lookupValue(values.unitType, {
                medence: 520000,
                jacuzzi: 280000,
                tobb: 760000
            });
            const machineFee = isChecked(values.machineRoom) ? 180000 : 0;
            const utilitiesFee = isChecked(values.waterPower) ? 150000 : 0;
            const deckingFee = isChecked(values.decking) ? 220000 : 0;
            const safetyFee = isChecked(values.safety) ? 95000 : 0;
            return Math.round(unitFee + area * 18500 + machineFee + utilitiesFee + deckingFee + safetyFee);
        }
    },
    {
        id: "kerti-konyha-grillezo-tuzrako",
        name: "Kerti konyha, grillező és tűzrakó",
        badge: "Kerti vendéglátás",
        description: "Kerti konyhák, grillezők, kemencék és tűzrakóhelyek előkészítő felmérése.",
        fields: [
            {
                id: "unitType",
                type: "checklist",
                label: "Kért elemek",
                full: true,
                options: [
                    { value: "grill", label: "Grillező" },
                    { value: "konyha", label: "Komplett kerti konyha" },
                    { value: "kemence", label: "Kemence" },
                    { value: "tuzrako", label: "Tűzrakó" },
                    { value: "barpult", label: "Bárpult / pult" }
                ]
            },
            { id: "counterLength", type: "number", label: "Pult hossza", suffix: "fm", min: 0, step: 0.5, placeholder: "pl. 4" },
            { id: "seating", type: "number", label: "Ülőhelyek száma", suffix: "db", min: 0, step: 1, placeholder: "pl. 8" },
            { id: "waterPoint", type: "toggle", label: "Vízkiállás vagy mosogató is kell", full: true },
            { id: "powerPoint", type: "toggle", label: "Áramkiállás és világítás is kell", full: true },
            { id: "cover", type: "toggle", label: "Fedés vagy pergolakapcsolat is kell", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Milyen főzési mód, milyen vendégforgalom, milyen környezethez..." }
        ],
        calculate(values) {
            const counter = numberValue(values.counterLength);
            const seating = numberValue(values.seating);
            const unitCount = Array.isArray(values.unitType) ? values.unitType.length : 0;
            const waterFee = isChecked(values.waterPoint) ? 115000 : 0;
            const powerFee = isChecked(values.powerPoint) ? 95000 : 0;
            const coverFee = isChecked(values.cover) ? 280000 : 0;
            return Math.round(unitCount * 145000 + counter * 180000 + seating * 12000 + waterFee + powerFee + coverFee);
        }
    },
    {
        id: "okoskert-automatika-biztonsag",
        name: "Okoskert, automatika és biztonság",
        badge: "Vezérlés és előkészítés",
        description: "Robotfűnyíró, automatika, világításvezérlés és biztonsági előkészítés felmérése.",
        fields: [
            {
                id: "systems",
                type: "checklist",
                label: "Milyen rendszerek érdekelnek?",
                full: true,
                options: [
                    { value: "robotfukasza", label: "Robotfűnyíró előkészítés" },
                    { value: "kapu", label: "Automata kapu" },
                    { value: "vilagitas", label: "Világításvezérlés" },
                    { value: "kamera", label: "Kamerák vagy érzékelők" },
                    { value: "kozpont", label: "Központi vezérlés" }
                ]
            },
            { id: "cableLength", type: "number", label: "Becsült kábelhossz", suffix: "fm", min: 0, step: 1, placeholder: "pl. 60" },
            { id: "controlPoints", type: "number", label: "Vezérlési pontok száma", suffix: "db", min: 0, step: 1, placeholder: "pl. 5" },
            { id: "network", type: "toggle", label: "Külön hálózati vagy wifi előkészítés is kell", full: true },
            { id: "futureExpansion", type: "toggle", label: "Későbbi bővíthetőséget is kérünk", full: true },
            { id: "security", type: "toggle", label: "Biztonsági és riasztási funkciók is kellenek", full: true },
            { id: "notes", type: "textarea", label: "Megjegyzés", full: true, placeholder: "Melyik rendszer mihez kapcsolódjon, mi a fő cél..." }
        ],
        calculate(values) {
            const systems = Array.isArray(values.systems) ? values.systems.length : 0;
            const cable = numberValue(values.cableLength);
            const controls = numberValue(values.controlPoints);
            const networkFee = isChecked(values.network) ? 95000 : 0;
            const expansionFee = isChecked(values.futureExpansion) ? 65000 : 0;
            const securityFee = isChecked(values.security) ? 125000 : 0;
            return Math.round(systems * 85000 + cable * 2400 + controls * 18000 + networkFee + expansionFee + securityFee);
        }
    }
];

const CONTACT_SECTION_META = {
    contact: {
        title: "Kapcsolattartás",
        description: "Ki tölti ki a felmérőt, és hogyan tudunk a legjobban visszajelezni."
    },
    site: {
        title: "Helyszín és megközelítés",
        description: "A kivitelezéshez és a helyszíni felméréshez szükséges cím- és megközelítési adatok."
    },
    docs: {
        title: "Dokumentumok és előkészítés",
        description: "Milyen tervanyag, fotó vagy előkészítő információ áll már rendelkezésre."
    },
    budget: {
        title: "Projektkeret és ütemezés",
        description: "Költségszint, ütemezés és kivitelezési keret meghatározása."
    },
    summary: {
        title: "Összefoglalás",
        description: "A fő célok, a használati szempontok és a végső beküldéshez szükséges megerősítés."
    }
};

const SERVICE_FIELD_AUDIENCE_OVERRIDES = {
    ontozorendszer: { waterPressure: "pro", zoneTypes: "pro", existingSystem: "pro", trenchLength: "pro", terrainDifficulty: "pro" },
    burkolatok: { thickness: "pro", subbase: "pro", edgeCondition: "pro", demolitionThickness: "pro", levelDifference: "pro", accessMode: "pro", carryDistance: "pro" },
    agyasok: { soilState: "pro", soilReplacement: "pro", soilReplacementQty: "pro", mulchType: "pro", existingPlants: "pro", maintenanceLevel: "pro" },
    sovenyek: { plantSpacing: "pro", soilReplacement: "pro", rootBarrier: "pro", existingRemoval: "pro", finalHeight: "pro" },
    "fa-ultetes": { purpose: "pro", pitVolume: "pro", rootBarrier: "pro", existingStump: "pro", accessMode: "pro" },
    fuvesites: { currentState: "pro", soilPrep: "pro", subsoil: "pro", weedTreatment: "pro", roughGrading: "pro", topsoil: "pro", topsoilQty: "pro", topsoilDepth: "pro", accessMode: "pro", carryDistance: "pro", aftercare: "pro" },
    bontas: { thickness: "pro", wasteType: "pro", sorting: "pro", cutting: "pro", manualAccess: "pro", carryDistance: "pro", machineAccess: "pro" },
    "tamfal-epites": { maxHeight: "pro", soilPressure: "pro", foundation: "pro", drainage: "pro", backfill: "pro", coping: "pro", accessMode: "pro", geogrid: "pro" },
    "kerti-vilagitas": { zonePurpose: "pro", transformer: "pro", existingNetwork: "pro", trench: "pro" },
    "kerti-aramforras": { consumers: "pro", highLoad: "pro", distributionBoard: "pro", existingNetwork: "pro", trench: "pro" },
    telektisztitas: { propertyType: "pro", tasks: "pro", wasteType: "pro", stumps: "pro", stumpCount: "pro", machineAccess: "pro", manualCarry: "pro", carryDistance: "pro", treeCutting: "pro", treeCount: "pro", oldMaterials: "pro" },
    "terep-rendezes": { levelDifference: "pro", workType: "pro", topsoil: "pro", topsoilQty: "pro", soilBalance: "pro", excessSoilQty: "pro", machineAccess: "pro", earthmovingMode: "pro", carryDistance: "pro", subsoil: "pro", disposal: "pro" },
    "sziklakert-epites": { heightPlay: "pro", basePrep: "pro", edgeSupport: "pro" },
    "diszkavics-agyas": { fraction: "pro", depth: "pro", subgradePrep: "pro" },
    "kerites-epites": { height: "pro", privacyLevel: "pro", terrain: "pro", foundation: "pro", automation: "pro", manualAccess: "pro" },
    "kerti-to-epites": { depth: "pro", filtration: "pro", machineRoom: "pro", childSafety: "pro" },
    "tervrajz-keszites": { deliverables: "pro", plotSize: "pro", revisions: "pro", baseDocs: "pro" },
    "latvanyterv-keszites": { viewTypes: "pro", sourcePlan: "pro" }
};

const CONTACT_FIELD_AUDIENCE_OVERRIDES = {
    propertySize: "pro",
    designArea: "pro",
    zoning: "pro",
    accessType: "pro",
    gateWidth: "pro",
    distanceFromRoad: "pro",
    machineAccess: "pro",
    documents: "pro",
    documentsNote: "pro",
    exactBudget: "pro",
    phasePriority: "pro"
};

const CONTACT_FIELDS_RUNTIME = [
    {
        id: "requestRole",
        section: "contact",
        type: "select",
        label: "Ki tölti ki a felmérőt?",
        required: true,
        options: [
            { value: "", label: "Válassz" },
            { value: "megrendelo", label: "Megrendelő" },
            { value: "kerttervezo", label: "Kerttervező" },
            { value: "kivitelezo", label: "Kivitelező / felmérő" },
            { value: "egyeb", label: "Egyéb közreműködő" }
        ]
    },
    { id: "fullName", section: "contact", type: "text", label: "Név", placeholder: "Teljes név", required: true },
    { id: "email", section: "contact", type: "email", label: "Email-cím", placeholder: "pelda@email.hu", required: true },
    { id: "phone", section: "contact", type: "tel", label: "Telefonszám", placeholder: "+36 30 123 4567", required: true },
    {
        id: "contactMode",
        section: "contact",
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
    { id: "availableTime", section: "contact", type: "text", label: "Mikor vagy elérhető?", placeholder: "pl. hétköznap 14:00 után" },

    { id: "postalCode", section: "site", type: "text", label: "Irányítószám", placeholder: "pl. 2051", required: true, inputMode: "numeric", maxLength: 4 },
    { id: "settlement", section: "site", type: "text", label: "Település", placeholder: "Automatikusan kitöltjük", required: true },
    { id: "siteAddress", section: "site", type: "text", label: "Utca, házszám, egyéb címadat", placeholder: "pl. Tópark utca 12.", required: true, full: true },
    { id: "propertySize", section: "site", type: "number", label: "Telek teljes mérete", suffix: "m²", min: 0, step: 1, placeholder: "pl. 850" },
    { id: "designArea", section: "site", type: "number", label: "Tervezési terület mérete", suffix: "m²", min: 0, step: 1, placeholder: "pl. 320" },
    { id: "zoning", section: "site", type: "text", label: "Lakóövezeti besorolás / HÉSZ megjegyzés", placeholder: "ha ismert" },
    {
        id: "accessType",
        section: "site",
        type: "select",
        label: "Megközelítés típusa",
        options: [
            { value: "", label: "Válassz" },
            { value: "utcafront", label: "Közvetlen utcafronti" },
            { value: "oldalkert", label: "Oldalkerten keresztül" },
            { value: "belso", label: "Belső udvar / átjárón keresztül" },
            { value: "korlatozott", label: "Korlátozott megközelítés" }
        ]
    },
    { id: "gateWidth", section: "site", type: "number", label: "Kapuszélesség", suffix: "m", min: 0, step: 0.1, placeholder: "pl. 2.8" },
    { id: "distanceFromRoad", section: "site", type: "number", label: "Anyagmozgatási távolság az utcától", suffix: "m", min: 0, step: 1, placeholder: "pl. 35" },
    { id: "machineAccess", section: "site", type: "toggle", label: "Gépbejárás biztosítható", full: true },

    {
        id: "planStatus",
        section: "docs",
        type: "select",
        label: "Milyen előkészítettségi szinten tart a projekt?",
        options: [
            { value: "", label: "Válassz" },
            { value: "nincs", label: "Még nincs előkészített anyag" },
            { value: "skicc", label: "Skicc, kézi méret vagy rövid brief van" },
            { value: "terv", label: "Van terv vagy látványterv" },
            { value: "helyszini", label: "Helyszíni felmérés után pontosítanánk" }
        ]
    },
    {
        id: "documents",
        section: "docs",
        type: "checklist",
        label: "Milyen anyagok állnak rendelkezésre?",
        full: true,
        options: [
            { value: "helyszinrajz", label: "Helyszínrajz" },
            { value: "geodezia", label: "Geodéziai felmérés" },
            { value: "fotok", label: "Fotók a jelenlegi állapotról" },
            { value: "inspiracio", label: "Inspirációs képek" },
            { value: "tervrajz", label: "Tervrajz" },
            { value: "latvanyterv", label: "Látványterv" },
            { value: "kozmuterv", label: "Közműterv" }
        ]
    },
    { id: "documentsNote", section: "docs", type: "textarea", label: "Dokumentumokkal kapcsolatos megjegyzés", full: true, placeholder: "Mi van már meg, mi hiányzik, mit kell majd pontosítani..." },

    { id: "desiredStart", section: "budget", type: "date", label: "Tervezett kezdés" },
    { id: "desiredFinish", section: "budget", type: "date", label: "Tervezett befejezés" },
    {
        id: "budgetLevel",
        section: "budget",
        type: "choice",
        label: "Költségszint",
        full: true,
        options: [
            { value: "", label: "Még nem döntöttem" },
            { value: "koltseghatekony", label: "Költséghatékony / megtakarításra optimalizált" },
            { value: "kiegyensulyozott", label: "Kiegyensúlyozott" },
            { value: "premium", label: "Teljes műszaki tartalom / magasabb esztétikai szint" }
        ]
    },
    { id: "exactBudget", section: "budget", type: "text", label: "Konkrét költségkeret", placeholder: "pl. 3–4 millió Ft" },
    {
        id: "phasePriority",
        section: "budget",
        type: "select",
        label: "Ütemezés",
        options: [
            { value: "", label: "Válassz" },
            { value: "egyuttem", label: "Egy ütemben készülne" },
            { value: "ketutem", label: "Két ütemben készülne" },
            { value: "tobb", label: "Több ütemben készülne" },
            { value: "felmeres", label: "Először felmérés és tervezés kell" }
        ]
    },

    { id: "projectGoal", section: "summary", type: "textarea", label: "Mi a projekt fő célja?", full: true, placeholder: "Röviden írd le, mit szeretnétek létrehozni és mi a legfontosabb eredmény." },
    { id: "mainProblem", section: "summary", type: "textarea", label: "Mi a legfontosabb jelenlegi probléma?", full: true, placeholder: "pl. nincs használható teraszkapcsolat, nincs vízelvezetés, rendezetlen kert..." },
    {
        id: "useCases",
        section: "summary",
        type: "checklist",
        label: "Használati és életmódbeli szempontok",
        full: true,
        options: [
            { value: "gyermek", label: "Gyermekbarát kialakítás" },
            { value: "allat", label: "Háziállat-barát kialakítás" },
            { value: "alacsonyfenntartas", label: "Alacsony fenntartási igény" },
            { value: "esti", label: "Esti használat is fontos" },
            { value: "vendegek", label: "Vendégfogadás / reprezentatív használat" },
            { value: "intenziv", label: "Intenzív mindennapi használat" }
        ]
    },
    { id: "notes", section: "summary", type: "textarea", label: "További megjegyzés", full: true, placeholder: "Bármi, ami segíti a pontosabb ajánlatadást vagy felmérést." },
    {
        id: "consent",
        section: "summary",
        type: "toggle",
        label: "Elfogadom a tájékoztató kalkulációt.",
        required: true,
        full: true
    }
];

function cloneField(field) {
    return {
        ...field,
        options: Array.isArray(field.options)
            ? field.options.map((option) => ({ ...option }))
            : undefined
    };
}

function enhanceServiceDefinition(service) {
    if (service.__enhanced) {
        return service;
    }

    const originalCalculate = service.calculate.bind(service);
    const fieldIds = new Set(service.fields.map((field) => field.id));

    COMMON_SERVICE_FIELDS.forEach((field) => {
        if (!fieldIds.has(field.id)) {
            service.fields.push(cloneField(field));
        }
    });

    service.calculate = (values) => {
        const base = originalCalculate(values);

        if (base <= 0) {
            return 0;
        }

        const stageMultiplier = lookupValue(values.projectStage, {
            uj: 1,
            atalakitas: 1.08,
            felujitas: 1.12,
            helyreallitas: 1.15
        }, 1);
        const solutionMultiplier = lookupValue(values.solutionLevel, {
            koltseghatekony: 0.92,
            kiegyensulyozott: 1,
            premium: 1.18
        }, 1);
        const accessMultiplier = lookupValue(values.siteAccess, {
            konnyu: 1,
            korlatozott: 1.06,
            nehez: 1.14
        }, 1);

        return Math.round(base * stageMultiplier * solutionMultiplier * accessMultiplier);
    };

    service.__enhanced = true;
    return service;
}

function applyFieldAudienceOverrides() {
    SERVICES.forEach((service) => {
        const overrides = SERVICE_FIELD_AUDIENCE_OVERRIDES[service.id] || {};
        service.fields.forEach((field) => {
            if (overrides[field.id]) {
                field.audience = overrides[field.id];
            }
        });
    });

    CONTACT_FIELDS_RUNTIME.forEach((field) => {
        if (CONTACT_FIELD_AUDIENCE_OVERRIDES[field.id]) {
            field.audience = CONTACT_FIELD_AUDIENCE_OVERRIDES[field.id];
        }
    });
}

SERVICES.push(...EXTRA_SERVICES);
SERVICES.forEach(enhanceServiceDefinition);
applyFieldAudienceOverrides();

const SERVICE_LOOKUP = Object.fromEntries(SERVICES.map((service) => [service.id, service]));
const CONTACT_LOOKUP = Object.fromEntries(CONTACT_FIELDS_RUNTIME.map((field) => [field.id, field]));
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
const successModal = document.getElementById("successModal");
const closeSuccessButton = document.getElementById("closeSuccessButton");
const STORAGE_KEY = "diszkertek-form-state-v1";

const state = {
    currentStep: 0,
    selectedServices: [],
    serviceValues: {},
    contactValues: createDefaultContactState(),
    isSubmitting: false,
    postalLookupMessage: "",
    postalLookupState: "idle"
};

function storageAvailable() {
    try {
        return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
    } catch (error) {
        return false;
    }
}

function createDefaultContactState() {
    return CONTACT_FIELDS_RUNTIME.reduce((accumulator, field) => {
        if (Object.prototype.hasOwnProperty.call(field, "defaultValue")) {
            accumulator[field.id] = field.defaultValue;
        } else if (field.type === "toggle") {
            accumulator[field.id] = false;
        } else if (field.type === "checklist") {
            accumulator[field.id] = [];
        } else {
            accumulator[field.id] = "";
        }

        return accumulator;
    }, {});
}

const POSTAL_CODE_OVERRIDES = {
    "2011": "Budakal\u00e1sz",
    "2013": "Pom\u00e1z"
};

let postalLookupTimer = null;

function sanitizeFieldValue(field, value) {
    if (field.type === "toggle") {
        return isChecked(value);
    }

    if (field.type === "checklist") {
        if (!Array.isArray(value)) {
            return [];
        }

        const allowed = new Set((field.options || []).map((option) => option.value));
        return value.filter((item) => allowed.has(item));
    }

    if (field.type === "choice" || field.type === "select") {
        const allowed = new Set((field.options || []).map((option) => option.value));
        return allowed.has(value) ? value : "";
    }

    if (field.type === "number") {
        return value === "" || value == null ? "" : String(value);
    }

    return value == null ? "" : String(value);
}

function buildPersistableContactState(rawValues = {}) {
    const defaults = createDefaultContactState();

    CONTACT_FIELDS_RUNTIME.forEach((field) => {
        defaults[field.id] = sanitizeFieldValue(field, rawValues[field.id]);
    });

    return defaults;
}

function buildPersistableServiceState(selectedServices, rawServiceValues = {}) {
    return selectedServices.reduce((accumulator, serviceId) => {
        const service = getService(serviceId);
        if (!service) {
            return accumulator;
        }

        const sourceValues = rawServiceValues[serviceId] || {};
        accumulator[serviceId] = service.fields.reduce((fieldAccumulator, field) => {
            const fallback = defaultValueForField(field);
            const rawValue = Object.prototype.hasOwnProperty.call(sourceValues, field.id)
                ? sourceValues[field.id]
                : fallback;
            fieldAccumulator[field.id] = sanitizeFieldValue(field, rawValue);
            return fieldAccumulator;
        }, {});

        return accumulator;
    }, {});
}

function persistState() {
    if (!storageAvailable()) {
        return;
    }

    const payload = {
        currentStep: state.currentStep,
        selectedServices: [...state.selectedServices],
        serviceValues: state.serviceValues,
        contactValues: state.contactValues
    };

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
        console.warn("Nem sikerült elmenteni a helyi állapotot.", error);
    }
}

function clearPersistedState() {
    if (!storageAvailable()) {
        return;
    }

    try {
        window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.warn("Nem sikerült törölni a helyi állapotot.", error);
    }
}

function restorePersistedState() {
    if (!storageAvailable()) {
        return;
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return;
        }

        const parsed = JSON.parse(raw);
        const selectedServices = Array.isArray(parsed?.selectedServices)
            ? parsed.selectedServices.filter((serviceId) => Boolean(getService(serviceId)))
            : [];

        state.selectedServices = selectedServices;
        state.serviceValues = buildPersistableServiceState(selectedServices, parsed?.serviceValues || {});
        state.contactValues = buildPersistableContactState(parsed?.contactValues || {});

        const steps = getFlowSteps();
        const savedStep = Number(parsed?.currentStep);
        state.currentStep = Number.isFinite(savedStep)
            ? Math.max(0, Math.min(savedStep, steps.length - 1))
            : 0;
    } catch (error) {
        console.warn("Nem sikerült visszaállítani a helyi állapotot.", error);
        clearPersistedState();
    }
}

function defaultValueForField(field) {
    if (Object.prototype.hasOwnProperty.call(field, "defaultValue")) {
        return field.defaultValue;
    }

    if (field.type === "toggle") {
        return false;
    }

    if (field.type === "checklist") {
        return [];
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

    if (field.type === "checklist") {
        if (!Array.isArray(rawValue) || !rawValue.length) {
            return "";
        }

        const labels = rawValue
            .map((value) => (field.options || []).find((item) => item.value === value)?.label || null)
            .filter(Boolean);

        return labels.join(", ");
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

function getFieldAudience(field) {
    return field.audience || "customer";
}

function getFieldAudienceBadge(field) {
    if (field.id === "consent") {
        return "";
    }

    const audience = getFieldAudience(field);

    if (audience === "pro") {
        return '<span class="field-badge field-badge--pro">Szakmai mező</span>';
    }

    return '<span class="field-badge field-badge--customer">Alap kérdés</span>';
}

function renderFieldLabel(field, inputId) {
    return `
        <label for="${inputId}">
            <span>${escapeHtml(getFieldLabel(field))}</span>
            ${getFieldAudienceBadge(field)}
        </label>
    `;
}

function renderFieldLegend(field) {
    return `
        <legend>
            <span>${escapeHtml(getFieldLabel(field))}</span>
            ${getFieldAudienceBadge(field)}
        </legend>
    `;
}

function getFieldHelperText(field, scope) {
    if (scope === "contact" && field.id === "postalCode" && state.postalLookupMessage) {
        return state.postalLookupMessage || "";
    }

    if (scope === "contact" && field.id === "settlement") {
        if (state.postalLookupState === "success") {
            return "Az irányítószám alapján kitöltve, szükség esetén módosítható.";
        }

        return "Ha nem sikerül automatikusan, kézzel is megadható.";
    }

    return field.helper || "";
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
    persistState();
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
        selectedServicesElement.innerHTML = "";
        return;
    }

    selectedServicesElement.innerHTML = state.selectedServices
        .map((serviceId) => {
            const service = getService(serviceId);
            const meta = buildServiceMeta(service, ensureServiceState(serviceId));
            const serviceStepIndex = getFlowSteps().findIndex((step) => step.id === serviceId);
            return `
                <div
                    class="selected-service-card is-clickable"
                    style="${getServiceToneStyle(serviceId)}"
                    data-action="jump-step"
                    data-step-index="${serviceStepIndex}"
                    tabindex="0"
                    role="button"
                    aria-label="${escapeHtml(service.name)} megnyitása"
                >
                    <div class="selected-service-header">
                        <span class="selected-service-linkish">${escapeHtml(service.name)}</span>
                        <span class="selected-service-price">${formatCurrency(subtotals[serviceId])}</span>
                    </div>
                    <p class="selected-service-meta">${escapeHtml(meta)}</p>
                    <div class="selected-service-actions">
                        <button type="button" class="ghost-btn compact-btn" data-action="remove-service" data-service-id="${service.id}">
                            Eltávolítás
                        </button>
                    </div>
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
    const hasAnyServices = SERVICES.length > 0;

    return `
        <section class="step-card">
            <div class="card-top">
                <div>
                    <p class="eyebrow">1. lépés</p>
                    <p>Válassz tételt a listából.</p>
                </div>
                <div class="inline-price">
                    <span>Kiválasztott tételek</span>
                    <strong id="selectedCount">${selectedCount} db</strong>
                </div>
            </div>

            <div class="service-picker-shell">
                <div class="service-picker-row">
                    <div class="field service-picker-field">
                        <label for="servicePicker">Új tétel hozzáadása</label>
                        <select id="servicePicker">
                            <option value="">Válassz tételt</option>
                            ${SERVICES.map((service) => `
                                <option value="${service.id}">
                                    ${escapeHtml(service.name)}${state.selectedServices.includes(service.id) ? " (már hozzáadva)" : ""}
                                </option>
                            `).join("")}
                        </select>
                    </div>
                    <button
                        type="button"
                        class="primary-btn service-add-btn"
                        data-action="add-selected-service"
                        ${hasAnyServices ? "" : "disabled"}
                    >
                        Tétel hozzáadása
                    </button>
                </div>
                </div>

            <div class="nav-actions">
                <div class="left-actions">
                    <button type="button" class="ghost-btn" data-action="clear-form">Kitöltött mezők törlése</button>
                </div>
                <div class="right-actions">
                    <button type="button" class="primary-btn primary-btn-alt" data-action="next-step" ${selectedCount ? "" : "disabled"}>Tovább a kiválasztott tételekhez</button>
                </div>
            </div>
        </section>
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
                    ${service.description ? `<p>${escapeHtml(service.description)}</p>` : ""}
                </div>
                <div class="inline-price">
                    <span>Részösszeg</span>
                    <strong id="currentSubtotal">${formatCurrency(subtotal)}</strong>
                </div>
            </div>

            ${service.note ? `
                <div class="service-note">
                    <strong>Megjegyzés</strong>
                    <p>${escapeHtml(service.note)}</p>
                </div>
            ` : ""}

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
                    <button type="button" class="ghost-btn" data-action="clear-form">Kitöltött mezők törlése</button>
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

function renderContactSections() {
    const sections = Object.entries(CONTACT_SECTION_META);

    return sections.map(([sectionId, meta]) => {
        const fields = CONTACT_FIELDS_RUNTIME.filter((field) => field.section === sectionId);

        if (!fields.length) {
            return "";
        }

        return `
            <section class="contact-section">
                <div class="section-heading">
                    <p class="eyebrow">${escapeHtml(meta.title)}</p>
                    <p class="section-intro">${escapeHtml(meta.description)}</p>
                </div>
                <div class="field-grid">
                    ${fields.map((field) => renderContextField({
                        field,
                        values: state.contactValues,
                        scope: "contact",
                        scopeId: "contact",
                        fields: CONTACT_FIELDS_RUNTIME
                    })).join("")}
                </div>
            </section>
        `;
    }).join("");
}

function renderAttachmentTools() {
    return `
        <section class="contact-section contact-section--tools">
            <div class="section-heading">
                <p class="eyebrow">PDF összefoglaló</p>
                <p class="section-intro">A jelenlegi kitöltött adatokból nyomtatható összefoglaló készül.</p>
            </div>

            <div class="highlight-box attachment-box">
                <strong>PDF mentése</strong>
                <p>Új ablakban nyílik meg az összefoglaló. Onnan menthető PDF-ként.</p>
                <div class="attachment-actions">
                    <button type="button" class="secondary-btn" data-action="export-pdf">PDF összefoglaló megnyitása</button>
                </div>
            </div>
        </section>
    `;
}

function renderContactStep() {
    const total = getGrandTotal();

    return `
        <section class="step-card">
            <div class="card-top">
                <div>
                    <p class="eyebrow">${state.currentStep + 1}. lépés</p>
                    <h2>Kapcsolat és küldés</h2>
                    <p>Itt add meg a végleges helyszíni felmérő és az ajánlatadás szempontjából fontos adatokat.</p>
                </div>
                <div class="inline-price">
                    <span>Tájékoztató végösszeg</span>
                    <strong id="finalTotal">${formatCurrency(total)}</strong>
                </div>
            </div>

            <div class="contact-section-grid">
                ${renderContactSections()}
                ${renderAttachmentTools()}
            </div>

            <div class="nav-actions">
                <div class="left-actions">
                    <button type="button" class="secondary-btn" data-action="prev-step">Vissza</button>
                    <button type="button" class="ghost-btn" data-action="clear-form">Kitöltött mezők törlése</button>
                    <button type="button" class="ghost-btn" data-action="jump-step" data-step-index="0">Új tétel hozzáadása</button>
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

    const fieldClass = ["field", field.full ? "is-full" : "", `field--${getFieldAudience(field)}`, `field--${field.id}`].filter(Boolean).join(" ");
    const value = values[field.id];
    const inputId = `${scopeId}-${field.id}`;
    const helperId = `${inputId}-helper`;
    const helperText = getFieldHelperText(field, scope);
    const helperMarkup = helperText
        ? `<p class="field-helper" id="${helperId}">${escapeHtml(helperText)}</p>`
        : `<p class="field-helper" id="${helperId}" hidden></p>`;
    const commonAttributes = scope === "service"
        ? `data-scope="service" data-service-id="${scopeId}" data-field-id="${field.id}"`
        : `data-scope="contact" data-contact-field="${field.id}"`;

    if (field.type === "textarea") {
        return `
            <div class="${fieldClass}">
                ${renderFieldLabel(field, inputId)}
                ${helperMarkup}
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
                ${renderFieldLabel(field, inputId)}
                ${helperMarkup}
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
                ${renderFieldLegend(field)}
                ${helperMarkup}
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

    if (field.type === "checklist") {
        const selectedValues = Array.isArray(value) ? value : [];

        return `
            <fieldset class="${fieldClass}">
                ${renderFieldLegend(field)}
                ${helperMarkup}
                <div class="choice-grid">
                    ${(field.options || []).map((option, index) => {
                        const optionId = `${inputId}-${index}`;
                        const checked = selectedValues.includes(option.value);
                        return `
                            <div class="option-card">
                                <label for="${optionId}">
                                    <div class="option-title-row">
                                        <div>
                                            <input
                                                id="${optionId}"
                                                type="checkbox"
                                                ${checked ? "checked" : ""}
                                                data-multi-value="${escapeHtml(option.value)}"
                                                ${commonAttributes}
                                            >
                                            <span class="option-title">${escapeHtml(option.label)}</span>
                                        </div>
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
                            ${getFieldAudienceBadge(field)}
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
            ${field.inputMode ? `inputmode="${field.inputMode}"` : ""}
            ${field.maxLength ? `maxlength="${field.maxLength}"` : ""}
            ${field.pattern ? `pattern="${field.pattern}"` : ""}
            ${field.id === "postalCode" ? `autocomplete="postal-code"` : ""}
            ${field.id === "settlement" ? `autocomplete="address-level2"` : ""}
            ${commonAttributes}
        >
    `;

    return `
        <div class="${fieldClass}">
            ${renderFieldLabel(field, inputId)}
            ${helperMarkup}
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

function setHelperText(helperId, text) {
    const helper = document.getElementById(helperId);
    if (!helper) {
        return;
    }

    if (text) {
        helper.hidden = false;
        helper.textContent = text;
    } else {
        helper.hidden = true;
        helper.textContent = "";
    }
}

function syncPostalLookupUi() {
    const postalInput = document.querySelector('[data-contact-field="postalCode"]');
    const settlementInput = document.querySelector('[data-contact-field="settlement"]');

    if (postalInput instanceof HTMLInputElement) {
        postalInput.value = state.contactValues.postalCode || "";
    }

    if (settlementInput instanceof HTMLInputElement) {
        settlementInput.value = state.contactValues.settlement || "";
    }

    setHelperText("contact-postalCode-helper", state.postalLookupMessage || "");

    let settlementHelperText = "";
    if (state.postalLookupState === "success") {
        settlementHelperText = "Az irányítószám alapján kitöltve, szükség esetén módosítható.";
    } else if (state.postalLookupState === "error") {
        settlementHelperText = "Ha nem sikerül automatikusan, kézzel is megadható.";
    }

    setHelperText("contact-settlement-helper", settlementHelperText);
}

async function lookupSettlementByPostalCode(postalCode) {
    const cleanPostalCode = String(postalCode || "").trim();

    if (!/^\d{4}$/.test(cleanPostalCode)) {
        state.postalLookupState = "idle";
        state.postalLookupMessage = "";
        state.contactValues.settlement = "";
        persistState();
        syncPostalLookupUi();
        return;
    }

    state.postalLookupState = "loading";
    state.postalLookupMessage = "Telep\u00fcl\u00e9s keres\u00e9se...";
    persistState();
    syncPostalLookupUi();

    if (POSTAL_CODE_OVERRIDES[cleanPostalCode]) {
        state.contactValues.settlement = POSTAL_CODE_OVERRIDES[cleanPostalCode];
        state.postalLookupState = "success";
        state.postalLookupMessage = `Telep\u00fcl\u00e9s kit\u00f6ltve: ${POSTAL_CODE_OVERRIDES[cleanPostalCode]}`;
        persistState();
        syncPostalLookupUi();
        return;
    }

    try {
        const response = await fetch(`https://api.zippopotam.us/HU/${cleanPostalCode}`);

        if (!response.ok) {
            throw new Error("Postal lookup failed");
        }

        const data = await response.json();
        const placeName = data?.places?.[0]?.["place name"] || "";

        if (!placeName) {
            throw new Error("No place name found");
        }

        state.contactValues.settlement = placeName;
        state.postalLookupState = "success";
        state.postalLookupMessage = `Telep\u00fcl\u00e9s kit\u00f6ltve: ${placeName}`;
        persistState();
        syncPostalLookupUi();
    } catch (error) {
        state.postalLookupState = "error";
        state.postalLookupMessage = "A telep\u00fcl\u00e9st most nem tudtuk automatikusan kit\u00f6lteni, k\u00e9rlek \u00edrd be k\u00e9zzel.";
        persistState();
        syncPostalLookupUi();
    }
}

function getFieldValueFromInput(input) {
    if (input.type === "checkbox") {
        return input.checked;
    }

    return input.value;
}

function getScopedFieldDefinition(input) {
    if (input.dataset.scope === "service") {
        const service = getService(input.dataset.serviceId);
        return service?.fields.find((field) => field.id === input.dataset.fieldId) || null;
    }

    if (input.dataset.scope === "contact") {
        return CONTACT_LOOKUP[input.dataset.contactField] || null;
    }

    return null;
}

function fieldHasDependentVisibility(scope, scopeId, fieldId) {
    if (!fieldId) {
        return false;
    }

    const fields = scope === "service"
        ? (getService(scopeId)?.fields || [])
        : CONTACT_FIELDS_RUNTIME;

    return fields.some((field) => field.showWhen?.field === fieldId);
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

    const requiredFields = CONTACT_FIELDS_RUNTIME.filter((field) => field.required);

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

    const services = state.selectedServices.map((serviceId) => {
        const service = getService(serviceId);
        const values = ensureServiceState(serviceId);
        const lines = getVisibleFieldLines(service.fields, values);
        return {
            name: service.name,
            meta: buildServiceMeta(service, values),
            subtotal: formatCurrency(subtotals[serviceId]),
            details: lines.length ? lines : ["Nincs további részlet megadva."]
        };
    });

    const contactLines = CONTACT_FIELDS_RUNTIME
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

    const contact_rows = CONTACT_FIELDS_RUNTIME
        .map((field) => {
            if (field.id === "consent") {
                return null;
            }

            const formatted = getFieldDisplayValue(field, state.contactValues[field.id]);
            if (!formatted) {
                return null;
            }

            return {
                label: field.label,
                value: formatted
            };
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
    const projectAddress = [
        state.contactValues.postalCode,
        state.contactValues.settlement,
        state.contactValues.siteAddress
    ].filter(Boolean).join(", ") || "nincs megadva";

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
        services,
        contact_rows,
        intro_line: "Új kertépítési kalkuláció érkezett a webes felületről.",
        customer_intro_line: `Kedves ${customerName}, köszönjük az ajánlatkérést.`,
        customer_closing_line: "Hamarosan felvesszük veled a kapcsolatot a pontosításhoz.",
        internal_subject: `Új kertépítési kalkuláció - ${customerName}`,
        customer_subject: "Köszönjük az ajánlatkérést - Díszkertek",
        email_subject: `Új kertépítési kalkuláció - ${customerName}`,
        email_disclaimer: "A megjelenített összeg tájékoztató jellegű. A végleges ajánlat a helyszíni felmérés, a pontos mennyiségek, az anyagválasztás és a műszaki adottságok alapján készül el."
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

function wait(ms) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

function withTimeout(promise, ms, message) {
    let timeoutId = null;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = window.setTimeout(() => {
            const error = new Error(message);
            error.name = "TimeoutError";
            reject(error);
        }, ms);
    });

    return Promise.race([promise, timeoutPromise]).finally(() => {
        if (timeoutId) {
            window.clearTimeout(timeoutId);
        }
    });
}

async function sendEmailWithRetry(templateId, payload, options = {}) {
    const {
        delayBefore = 0,
        retryCount = 0,
        retryDelay = 1600,
        logLabel = "Email küldés",
        timeoutMs = EMAIL_SEND_TIMEOUT_MS
    } = options;

    if (delayBefore > 0) {
        await wait(delayBefore);
    }

    let lastError = null;

    for (let attempt = 0; attempt <= retryCount; attempt += 1) {
        try {
            return await withTimeout(
                emailjs.send(EMAILJS_SERVICE_ID, templateId, payload),
                timeoutMs,
                `${logLabel} túl sokáig tartott.`
            );
        } catch (error) {
            lastError = error;

            if (error?.name === "TimeoutError") {
                break;
            }

            if (attempt < retryCount) {
                await wait(retryDelay);
                continue;
            }
        }
    }

    console.error(`${logLabel} sikertelen.`, lastError);
    throw lastError;
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

        await sendEmailWithRetry(EMAILJS_TEMPLATE_INTERNAL, internalPayload, {
            retryCount: 1,
            retryDelay: 1800,
            logLabel: "A belső értesítő email küldése"
        });
        await sendEmailWithRetry(EMAILJS_TEMPLATE_CUSTOMER, customerPayload, {
            delayBefore: 1800,
            retryCount: 1,
            retryDelay: 1800,
            logLabel: "A visszaigazoló email küldése"
        });
        state.isSubmitting = false;
        openSuccessModal();
        renderApp();
    } catch (error) {
        state.isSubmitting = false;
        renderApp();
        if (error?.name === "TimeoutError") {
            showFeedback("A küldés túl sokáig tartott. Az adatok megmaradtak, kérlek ellenőrizd az internetkapcsolatot, majd próbáld újra.");
        } else {
            showFeedback("Az email küldése most nem sikerült. Az adatok megmaradtak, kérlek próbáld újra később.");
        }
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
    persistState();
    renderApp();
}

function resetApp() {
    state.currentStep = 0;
    state.selectedServices = [];
    state.serviceValues = {};
    state.contactValues = createDefaultContactState();
    state.isSubmitting = false;
    state.postalLookupMessage = "";
    state.postalLookupState = "idle";
    clearPersistedState();
    renderApp();
    scrollToCalculator();
}

function clearFilledValues() {
    state.serviceValues = buildPersistableServiceState(state.selectedServices, {});
    state.contactValues = createDefaultContactState();
    state.postalLookupMessage = "";
    state.postalLookupState = "idle";
    renderApp();
}

function buildPrintableSummaryHtml() {
    const submittedAt = new Date().toLocaleString("hu-HU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });

    const total = formatCurrency(getGrandTotal());
    const servicesHtml = state.selectedServices.map((serviceId) => {
        const service = getService(serviceId);
        const values = ensureServiceState(serviceId);
        const subtotal = formatCurrency(service.calculate(values));
        const lines = getVisibleFieldLines(service.fields, values);

        return `
            <section class="print-service">
                <div class="print-service-head">
                    <h3>${escapeHtml(service.name)}</h3>
                    <strong>${escapeHtml(subtotal)}</strong>
                </div>
                <div class="print-service-meta">${escapeHtml(buildServiceMeta(service, values))}</div>
                ${lines.length
                    ? `<ul>${lines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>`
                    : `<p class="print-muted">Nincs további részlet megadva.</p>`}
            </section>
        `;
    }).join("");

    const contactHtml = CONTACT_FIELDS_RUNTIME
        .filter((field) => field.id !== "consent")
        .map((field) => {
            const value = getFieldDisplayValue(field, state.contactValues[field.id]);
            if (!value) {
                return "";
            }

            return `
                <tr>
                    <td>${escapeHtml(field.label)}</td>
                    <td>${escapeHtml(value)}</td>
                </tr>
            `;
        })
        .join("");

    return `
        <!DOCTYPE html>
        <html lang="hu">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Díszkertek - Helyszíni felmérő összefoglaló</title>
            <style>
                * { box-sizing: border-box; }
                body { font-family: Arial, Helvetica, sans-serif; color: #2f281f; margin: 0; background: #f5f1ea; }
                .page { max-width: 880px; margin: 0 auto; background: #fffdf9; padding: 32px; }
                .toolbar { max-width: 880px; margin: 0 auto; padding: 20px 32px 0; display: flex; justify-content: flex-end; }
                .toolbar button { border: 0; border-radius: 999px; padding: 12px 18px; font-size: 14px; font-weight: 700; color: #fff; background: #1f5b3b; cursor: pointer; }
                .hero { border-bottom: 2px solid #e8dfd3; padding-bottom: 18px; margin-bottom: 24px; }
                .eyebrow { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #7b6b58; margin: 0 0 8px; }
                h1 { margin: 0 0 8px; font-size: 30px; }
                .lead { margin: 0; color: #5a4e41; line-height: 1.7; }
                .summary { display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: end; background: #f8f4ed; border: 1px solid #eadfce; border-radius: 18px; padding: 18px 20px; margin-bottom: 24px; }
                .summary strong { font-size: 28px; color: #1f5b3b; }
                .section { margin-bottom: 24px; }
                .section h2 { margin: 0 0 12px; font-size: 20px; }
                .print-service { border: 1px solid #e8dfd3; border-radius: 16px; padding: 16px 18px; margin-bottom: 14px; background: #fcfaf7; }
                .print-service-head { display: flex; justify-content: space-between; gap: 16px; align-items: start; }
                .print-service-head h3 { margin: 0; font-size: 18px; }
                .print-service-head strong { color: #1f5b3b; white-space: nowrap; }
                .print-service-meta { margin-top: 8px; color: #6f6153; font-size: 13px; }
                .print-service ul, .file-list ul { margin: 12px 0 0 18px; padding: 0; line-height: 1.6; }
                .print-service li, td { overflow-wrap: anywhere; }
                .print-muted { color: #7b6b58; }
                table { width: 100%; border-collapse: collapse; }
                td { padding: 9px 0; border-bottom: 1px solid #eee4d8; vertical-align: top; }
                td:first-child { width: 34%; color: #6f6153; font-weight: 700; padding-right: 18px; }
                @media (max-width: 760px) {
                    body { background: #fffdf9; }
                    .toolbar { padding: 12px 10px 0; justify-content: stretch; }
                    .toolbar button { width: 100%; border-radius: 12px; }
                    .page { width: 100%; max-width: none; padding: 18px 10px; }
                    h1 { font-size: 25px; line-height: 1.12; }
                    .summary { grid-template-columns: 1fr; align-items: start; padding: 14px; border-radius: 14px; }
                    .summary strong { font-size: 24px; }
                    .print-service { padding: 12px; border-radius: 12px; }
                    .print-service-head { display: grid; gap: 6px; }
                    .print-service-head strong { white-space: normal; }
                    td { display: block; width: 100%; padding: 7px 0; border-bottom: 0; }
                    td:first-child { width: 100%; padding-right: 0; padding-top: 12px; }
                    tr { display: block; border-bottom: 1px solid #eee4d8; padding-bottom: 6px; }
                }
                @media (max-width: 420px) {
                    .page { padding: 16px 8px; }
                    h1 { font-size: 22px; }
                    .eyebrow { letter-spacing: 1.2px; }
                    .print-service ul, .file-list ul { margin-left: 14px; }
                }
                @media print {
                    body { background: #fff; }
                    .toolbar { display: none; }
                    .page { max-width: none; padding: 0; }
                }
            </style>
        </head>
        <body>
            <div class="toolbar">
                <button type="button" onclick="window.print()">Nyomtatás / PDF mentése</button>
            </div>
            <div class="page">
                <header class="hero">
                    <p class="eyebrow">Díszkertek</p>
                    <h1>Helyszíni felmérő összefoglaló</h1>
                    <p class="lead">Generálva: ${escapeHtml(submittedAt)}</p>
                </header>

                <section class="summary">
                    <div>
                        <div class="eyebrow">Kiválasztott tételek</div>
                        <div>${escapeHtml(String(state.selectedServices.length))} db</div>
                    </div>
                    <div>
                        <div class="eyebrow">Tájékoztató végösszeg</div>
                        <strong>${escapeHtml(total)}</strong>
                    </div>
                </section>

                <section class="section">
                    <h2>Kiválasztott tételek</h2>
                    ${servicesHtml || `<p class="print-muted">Nincs kiválasztott tétel.</p>`}
                </section>

                <section class="section">
                    <h2>Kapcsolati és helyszíni adatok</h2>
                    <table>${contactHtml}</table>
                </section>
            </div>
        </body>
        </html>
    `;
}

function exportPdfSummary() {
    const previewWindow = window.open("", "_blank");

    if (!previewWindow) {
        showFeedback("A PDF előnézet megnyitása nem sikerült. Ellenőrizd, hogy a böngésző engedi-e az új lap megnyitását.");
        return;
    }

    previewWindow.document.open();
    previewWindow.document.write(buildPrintableSummaryHtml());
    previewWindow.document.close();
    previewWindow.focus();
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
        return;
    }

    if (action === "export-pdf") {
        exportPdfSummary();
        return;
    }

    if (action === "clear-form") {
        clearFilledValues();
    }
}

function handleActionKeydown(event) {
    const target = event.target.closest("[data-action]");
    if (!target) {
        return;
    }

    if (event.key !== "Enter" && event.key !== " ") {
        return;
    }

    if (target.tagName === "BUTTON") {
        return;
    }

    event.preventDefault();
    target.click();
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

    const field = getScopedFieldDefinition(input);
    let value = getFieldValueFromInput(input);
    let forceRerender = false;

    if (field?.id === "postalCode") {
        value = String(value || "").replace(/\D/g, "").slice(0, 4);
        input.value = value;
    }

    if (field?.type === "checklist" && input.dataset.multiValue) {
        const currentValue = scope === "service"
            ? ensureServiceState(input.dataset.serviceId)[input.dataset.fieldId]
            : state.contactValues[input.dataset.contactField];
        const currentValues = Array.isArray(currentValue) ? currentValue : [];

        value = input.checked
            ? [...new Set([...currentValues, input.dataset.multiValue])]
            : currentValues.filter((item) => item !== input.dataset.multiValue);
    }

    if (scope === "service") {
        updateServiceField(input.dataset.serviceId, input.dataset.fieldId, value);
    }

    if (scope === "contact") {
        updateContactField(input.dataset.contactField, value);

        if (input.dataset.contactField === "postalCode") {
            if (postalLookupTimer) {
                clearTimeout(postalLookupTimer);
            }

            if (value.length === 4) {
                postalLookupTimer = window.setTimeout(() => {
                    lookupSettlementByPostalCode(value);
                }, 250);
            } else {
                state.postalLookupState = "idle";
                state.postalLookupMessage = "";

                if (!value.length) {
                    state.contactValues.settlement = "";
                }

                persistState();
                syncPostalLookupUi();
            }
        }
    }

    if (shouldRerender || forceRerender) {
        renderApp();
    } else if (scope === "contact") {
        persistState();
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
        showFeedback("V\u00e1lassz ki egy t\u00e9telt a hozz\u00e1ad\u00e1shoz.");
        return;
    }

    if (state.selectedServices.includes(serviceId)) {
        showFeedback("Ez a tétel már hozzá van adva.");
        return;
    }

    state.selectedServices = [...state.selectedServices, serviceId];
    ensureServiceState(serviceId);
    renderApp();
}

stepContainer.addEventListener("click", handleActionClick);
stepContainer.addEventListener("keydown", handleActionKeydown);
stepContainer.addEventListener("change", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) {
        return;
    }

    const field = getScopedFieldDefinition(target);
    const shouldRerender = fieldHasDependentVisibility(
        target.dataset.scope,
        target.dataset.serviceId || target.dataset.contactField || "",
        field?.id
    );

    handleFieldUpdate(event, shouldRerender);
});
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
stepPills.addEventListener("keydown", handleActionKeydown);
selectedServicesElement.addEventListener("click", handleActionClick);
selectedServicesElement.addEventListener("keydown", handleActionKeydown);

startButton.addEventListener("click", startForm);
closeSuccessButton.addEventListener("click", closeSuccessModal);

window.startForm = startForm;

restorePersistedState();
renderApp();
