// ============================================================
// DONNÉES DE LA CARTE — contenu séparé de la logique (app.js)
// Coordonnées = pixels sur carte_luberon.jpg (4961 x 3508)
// ============================================================
var DATA = {

    image: { width: 4961, height: 3508 },

    hotel: {
        name: "Hôtel la font de lauro",
        coords: [1636, 1336],
        link: "https://www.hotel-la-font-de-lauro.fr/"
    },

    // Villages permanents (affichés par défaut)
    villages: [
        { name: "Oppède le vieux",      coords: [2027, 2309], link: "https://www.google.com/search?q=Oppède+le+vieux",        desc: "Village médiéval perché, ruelles sauvages et vue sur le Luberon." },
        { name: "Ménerbes",             coords: [2465, 2160], link: "https://www.google.com/search?q=Ménerbes",                desc: "Village de Peter Mayle, vue panoramique sur la plaine." },
        { name: "Lacoste",              coords: [2873, 2209], link: "https://www.google.com/search?q=Lacoste+village",         desc: "Village du Marquis de Sade, festival d'art chaque été." },
        { name: "Bonnieux",             coords: [3058, 2274], link: "https://www.google.com/search?q=Bonnieux",                desc: "Village perché avec vue imprenable et forêt de cèdres centenaires." },
        { name: "Lourmarin",            coords: [3667, 2928], link: "https://www.google.com/search?q=Lourmarin",               desc: "Château Renaissance, village d'Albert Camus." },
        { name: "Roussillon",           coords: [3083, 1578], link: "https://www.google.com/search?q=Roussillon",              desc: "Village des ocres, sentier des Ocres à ne pas manquer." },
        { name: "Gordes",               coords: [2445, 1384], link: "https://www.google.com/search?q=Gordes",                  desc: "L'un des plus beaux villages de France, village en pierre." },
        { name: "Venasque",             coords: [1856, 616],  link: "https://www.google.com/search?q=Venasque",                desc: "Village fortifié avec un baptistère mérovingien du VIe siècle." },
        { name: "Saint-Didier",         coords: [1623, 532],  link: "https://www.google.com/search?q=Saint-Didier",            desc: "Village provençal calme, point de départ vers le Mont Ventoux. À visiter : <a href='https://nougats-silvain.fr/' target='_blank'>Nougaterie Silvain</a>, nougats artisanaux &amp; douceurs de Provence." },
        { name: "L'Isle-sur-la-Sorgue", coords: [1223, 1219], link: "https://www.google.com/search?q=L%27Isle-sur-la-Sorgue", desc: "La Venise provençale, capitale mondiale des antiquaires." },
        { name: "Fontaine-de-Vaucluse", coords: [1882, 1239], link: "https://www.google.com/search?q=Fontaine-de-Vaucluse",   desc: "Source mystérieuse, l'une des plus puissantes résurgences du monde." },
        { name: "Abbaye de Sénanque",   coords: [2200, 1258], link: "https://www.google.com/search?q=Abbaye+de+Sénanque",     desc: "Abbaye cistercienne du XIIe siècle au milieu des champs de lavande." }
    ],

    // Villes présentes uniquement pour les marchés
    marketVillages: [
        { name: "Carpentras",             coords: [1365, 59],   link: "https://www.google.com/search?q=Carpentras" },
        { name: "Velleron",               coords: [1015, 967],  link: "https://www.google.com/search?q=Velleron" },
        { name: "Pernes-les-Fontaines",   coords: [1149, 550],  link: "https://www.google.com/search?q=Pernes-les-Fontaines" },
        { name: "Le Thor",                coords: [692, 1262],  link: "https://www.google.com/search?q=Le+Thor" },
        { name: "Châteauneuf-de-Gadagne", coords: [489, 1147],  link: "https://www.google.com/search?q=Châteauneuf-de-Gadagne" },
        { name: "Robion",                 coords: [1759, 2046], link: "https://www.google.com/search?q=Robion" },
        { name: "Apt",                    coords: [3876, 1750], link: "https://www.google.com/search?q=Apt" },
        { name: "Coustellet",             coords: [1866, 1866], link: "https://www.google.com/search?q=Coustellet" },
        { name: "Sault",                  coords: null,         link: "https://www.google.com/search?q=Sault" },
        { name: "Bédoin",                 coords: null,         link: "https://www.google.com/search?q=Bédoin" }
    ],

    // Marchés (days en anglais : sunday, monday, ...)
    markets: [
        { name: "Carpentras",             days: ["friday"],                                                     time: "le matin (8h-13h)" },
        { name: "Velleron",               days: ["monday","tuesday","wednesday","thursday","friday","saturday"], time: "le soir (18h en été) ou après-midi (16h30 en hiver)" },
        { name: "Pernes-les-Fontaines",   days: ["saturday"],                                                   time: "le matin (8h-13h)" },
        { name: "Le Thor",                days: ["wednesday","saturday"],                                        time: "le matin (8h-12h)" },
        { name: "L'Isle-sur-la-Sorgue",   days: ["thursday","sunday"],                                          time: "le matin (8h-13h)" },
        { name: "Robion",                 days: ["thursday"],                                                    time: "le matin (8h-13h)" },
        { name: "Coustellet",             days: ["sunday","wednesday"],                                          time: "le matin (8h-13h) ou le soir" },
        { name: "Oppède le vieux",        days: ["saturday"],                                                    time: "le matin (8h-13h)" },
        { name: "Ménerbes",               days: ["thursday"],                                                    time: "le matin (8h-13h)" },
        { name: "Bonnieux",               days: ["friday"],                                                      time: "le matin (8h-13h)" },
        { name: "Lacoste",                days: ["wednesday"],                                                   time: "le matin (8h-13h)" },
        { name: "Lourmarin",              days: ["friday","tuesday"],                                            time: "le matin (8h-13h) ou le soir" },
        { name: "Apt",                    days: ["tuesday","saturday"],                                          time: "le matin (8h-13h)" },
        { name: "Roussillon",             days: ["thursday"],                                                     time: "le matin (8h-12h)" },
        { name: "Gordes",                 days: ["tuesday"],                                                      time: "le matin (8h-13h)" },
        { name: "Venasque",               days: ["friday"],                                                      time: "le soir (17h-20h), saisonnier juin-sept" },
        { name: "Saint-Didier",           days: ["monday"],                                                       time: "le matin (8h-13h)" },
        { name: "Fontaine-de-Vaucluse",   days: ["tuesday"],                                                      time: "le matin (8h-13h)" },
        { name: "Châteauneuf-de-Gadagne", days: ["tuesday"],                                                      time: "le soir (17h-19h), du 01/04 au 31/10" },
        { name: "Sault",                  days: ["wednesday"],                                                    time: "le matin (8h-13h)" },
        { name: "Bédoin",                 days: ["monday"],                                                       time: "le matin (8h-13h)" }
    ],

    // Itinéraires (points dans l'ordre, avec libellé de l'étape)
    routes: {
        route1: {
            label: "Luberon",
            points: [
                { coords: [1636, 1336], name: 'Hôtel' },
                { coords: [1866, 1866], name: 'Coustellet' },
                { coords: [3243, 1971], name: 'Pont Julien' },
                { coords: [3667, 2928], name: 'Lourmarin' },
                { coords: [3058, 2274], name: 'Bonnieux' },
                { coords: [2873, 2209], name: 'Lacoste' },
                { coords: [2465, 2160], name: 'Ménerbes' },
                { coords: [2027, 2309], name: 'Oppède le vieux' },
                { coords: [1866, 1866], name: 'Coustellet', offset: [40, 0] },
                { coords: [1223, 1219], name: "L'Isle-sur-la-Sorgue" },
                { coords: [1636, 1336], name: 'Hôtel', offset: [0, 90] }
            ]
        },
        route2: {
            label: "Monts de Vaucluse",
            points: [
                { coords: [1636, 1336], name: 'Hôtel' },
                { coords: [1866, 1866], name: 'Coustellet' },
                { coords: [3083, 1578], name: 'Roussillon' },
                { coords: [2445, 1384], name: 'Gordes' },
                { coords: [2200, 1258], name: 'Abbaye de Sénanque' },
                { coords: [1856, 616],  name: 'Venasque' },
                { coords: [1623, 532],  name: 'Saint-Didier' },
                { coords: [1636, 1336], name: 'Hôtel', offset: [0, 90] }
            ]
        }
    }
};
