// Initialiser la carte
var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 4
});

// Dimensions de l'image
var imageWidth = 4961;
var imageHeight = 3508;
var southWest = map.unproject([0, imageHeight], map.getMaxZoom());
var northEast = map.unproject([imageWidth, 0], map.getMaxZoom());
var bounds = new L.LatLngBounds(southWest, northEast);

// Ajouter l'image overlay avec gestion d'erreur
var imageOverlay = L.imageOverlay('carte_luberon.jpg', bounds).addTo(map);
imageOverlay.on('error', function() {
    console.error('Erreur : carte_luberon.jpg non trouvé ou corrompu');
    document.getElementById('image-error').style.display = 'block';
});
map.fitBounds(bounds);

// Icône verte pour l'Hôtel
var hotelIcon = L.icon({
    iconUrl: 'hotel-icon.svg',
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -30]
});

// Marqueur hôtel (toujours visible, icône verte)
var hotel = L.marker(map.unproject([1636, 1336], map.getMaxZoom()), { icon: hotelIcon }).addTo(map)
    .bindPopup('Hôtel la font de lauro <br><a href="https://www.hotel-la-font-de-lauro.fr/" target="_blank" lang="fr">site web</a>')
    .openPopup();

// Icônes carrées bleues avec le nom de la ville (espaces remplacés par des tirets)
function createMarkerIcon(name) {
    var displayName = name.replace(/ /g, '-');
    // Estimer la largeur du texte (~7px par caractère + padding)
    var textWidth = displayName.length * 7 + 12;
    return L.divIcon({
        className: 'village-marker',
        html: `<div style="background:#1565c0;border-radius:4px;width:${textWidth}px;height:24px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:11px;padding:0 6px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);">${displayName}</div>`,
        iconSize: [textWidth, 24],
        iconAnchor: [textWidth / 2, 12]
    });
}

// Villages permanents (affichés par défaut, masqués lors de sélection de marché)
var villages = [
    { name: "Oppède le vieux", coords: [2027, 2309], link: "https://www.google.com/search?q=Oppède+le+vieux" },
    { name: "Ménerbes", coords: [2465, 2160], link: "https://www.google.com/search?q=Ménerbes" },
    { name: "Lacoste", coords: [2873, 2209], link: "https://www.google.com/search?q=Lacoste+village" },
    { name: "Bonnieux", coords: [3058, 2274], link: "https://www.google.com/search?q=Bonnieux" },
    { name: "Lourmarin", coords: [3667, 2928], link: "https://www.google.com/search?q=Lourmarin" },
    { name: "Roussillon", coords: [3083, 1578], link: "https://www.google.com/search?q=Roussillon" },
    { name: "Gordes", coords: [2445, 1384], link: "https://www.google.com/search?q=Gordes" },
    { name: "Venasque", coords: [1856, 616], link: "https://www.google.com/search?q=Venasque" },
    { name: "Saint-Didier", coords: [1623, 532], link: "https://www.google.com/search?q=Saint-Didier" },
    { name: "L'Isle-sur-la-Sorgue", coords: [1223, 1219], link: "https://www.google.com/search?q=L%27Isle-sur-la-Sorgue" },
    { name: "Fontaine-de-Vaucluse", coords: [1882, 1239], link: "https://www.google.com/search?q=Fontaine-de-Vaucluse" },
    { name: "Abbaye de Sénanque", coords: [2200, 1258], link: "https://www.google.com/search?q=Abbaye+de+Sénanque" }
];
var villageMarkers = [];
villages.forEach(v => {
    var marker = L.marker(map.unproject(v.coords, map.getMaxZoom()), { icon: createMarkerIcon(v.name) }).addTo(map);
    marker.bindPopup(`<a href="${v.link}" target="_blank" lang="fr">${v.name}</a>`);
    marker.on('mouseover', function(e) { this.openPopup(); });
    marker.on('click', function(e) { this.openPopup(); });
    villageMarkers.push(marker);
});

// Villes uniquement pour les marchés
var marketVillages = [
    { name: "Carpentras", coords: [1365, 59], link: "https://www.google.com/search?q=Carpentras" },
    { name: "Velleron", coords: [1015, 967], link: "https://www.google.com/search?q=Velleron" },
    { name: "Pernes-les-Fontaines", coords: [1149, 550], link: "https://www.google.com/search?q=Pernes-les-Fontaines" },
    { name: "Le Thor", coords: [692, 1262], link: "https://www.google.com/search?q=Le+Thor" },
    { name: "Châteauneuf-de-Gadagne", coords: [489, 1147], link: "https://www.google.com/search?q=Châteauneuf-de-Gadagne" },
    { name: "Robion", coords: [1759, 2046], link: "https://www.google.com/search?q=Robion" },
    { name: "Apt", coords: [3876, 1750], link: "https://www.google.com/search?q=Apt" },
    { name: "Coustellet", coords: [1866, 1866], link: "https://www.google.com/search?q=Coustellet" },
    { name: "Sault", coords: null, link: "https://www.google.com/search?q=Sault" },
    { name: "Bédoin", coords: null, link: "https://www.google.com/search?q=Bédoin" }
];

// Villes uniquement pour les marchés
var marketVillages = [
    { name: "Carpentras", coords: [1365, 59], link: "https://www.google.com/search?q=Carpentras" },
    { name: "Velleron", coords: [1015, 967], link: "https://www.google.com/search?q=Velleron" },
    { name: "Pernes-les-Fontaines", coords: [1149, 550], link: "https://www.google.com/search?q=Pernes-les-Fontaines" },
    { name: "Le Thor", coords: [692, 1262], link: "https://www.google.com/search?q=Le+Thor" },
    { name: "Châteauneuf-de-Gadagne", coords: [489, 1147], link: "https://www.google.com/search?q=Châteauneuf-de-Gadagne" },
    { name: "Robion", coords: [1759, 2046], link: "https://www.google.com/search?q=Robion" },
    { name: "Apt", coords: [3876, 1750], link: "https://www.google.com/search?q=Apt" },
    { name: "Coustellet", coords: [1866, 1866], link: "https://www.google.com/search?q=Coustellet" },
    { name: "Sault", coords: null, link: "https://www.google.com/search?q=Sault" },
    { name: "Bédoin", coords: null, link: "https://www.google.com/search?q=Bédoin" }
];

// Données des marchés
var markets = [
    { name: "Carpentras", days: ["friday"], time: "le matin (8h-13h)" },
    { name: "Velleron", days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"], time: "le soir (18h en été) ou après-midi (16h30 en hiver)" },
    { name: "Pernes-les-Fontaines", days: ["saturday"], time: "le matin (8h-13h)" },
    { name: "Le Thor", days: ["wednesday", "saturday"], time: "le matin (8h-12h)" },
    { name: "L'Isle-sur-la-Sorgue", days: ["thursday", "sunday"], time: "le matin (8h-13h)" },
    { name: "Robion", days: ["thursday"], time: "le matin (8h-13h)" },
    { name: "Coustellet", days: ["sunday", "wednesday"], time: "le matin (8h-13h) ou le soir (saisonnier)" },
    { name: "Oppède le vieux", days: ["saturday"], time: "le matin (8h-13h)" },
    { name: "Ménerbes", days: ["thursday"], time: "le matin (8h-13h)" },
    { name: "Bonnieux", days: ["friday"], time: "le matin (8h-13h)" },
    { name: "Lacoste", days: ["wednesday"], time: "le matin (8h-13h)" },
    { name: "Lourmarin", days: ["friday", "tuesday"], time: "le matin (8h-13h) ou le soir (producteurs, saisonnier)" },
    { name: "Apt", days: ["tuesday", "saturday"], time: "le matin (8h-13h)" },
    { name: "Roussillon", days: ["thursday"], time: "le matin (9h-12h)" },
    { name: "Gordes", days: ["tuesday"], time: "le matin (8h-13h)" },
    { name: "Venasque", days: ["friday"], time: "le soir (17h-20h), saisonnier juin-septembre" },
    { name: "Saint-Didier", days: ["monday"], time: "le matin (8h-13h)" },
    { name: "Fontaine-de-Vaucluse", days: ["tuesday"], time: "le matin (8h-13h)" },
    { name: "Châteauneuf-de-Gadagne", days: ["tuesday"], time: "le soir (17h-19h), du 01/04 au 31/10" },
    { name: "Sault", days: ["wednesday"], time: "le matin (8h30-12h30)" },
    { name: "Bédoin", days: ["monday"], time: "le matin (8h-14h)" }
];

// Marqueurs pour les marchés (gérés dynamiquement)
var marketMarkers = [];

// Itinéraires
var routeColor = '#800080';
var routePolyline1 = L.polyline([
    map.unproject([1636, 1336], map.getMaxZoom()), // Hôtel
    map.unproject([1866, 1866], map.getMaxZoom()), // Coustellet
    map.unproject([3243, 1971], map.getMaxZoom()), // Pont Julien
    map.unproject([3667, 2928], map.getMaxZoom()), // Lourmarin
    map.unproject([3058, 2274], map.getMaxZoom()), // Bonnieux
    map.unproject([2873, 2209], map.getMaxZoom()), // Lacoste
    map.unproject([2465, 2160], map.getMaxZoom()), // Ménerbes
    map.unproject([2027, 2309], map.getMaxZoom()), // Oppède le vieux
    map.unproject([1866, 1866], map.getMaxZoom()), // Coustellet
    map.unproject([1223, 1219], map.getMaxZoom()), // L'Isle-sur-la-Sorgue
    map.unproject([1636, 1336], map.getMaxZoom())  // Hôtel
], {color: routeColor});

var routePolyline2 = L.polyline([
    map.unproject([1636, 1336], map.getMaxZoom()), // Hôtel
    map.unproject([1866, 1866], map.getMaxZoom()), // Coustellet
    map.unproject([3083, 1578], map.getMaxZoom()), // Roussillon
    map.unproject([2445, 1384], map.getMaxZoom()), // Gordes
    map.unproject([2200, 1258], map.getMaxZoom()), // Abbaye de Sénanque
    map.unproject([1856, 616], map.getMaxZoom()), // Venasque
    map.unproject([1623, 532], map.getMaxZoom()), // Saint-Didier
    map.unproject([1636, 1336], map.getMaxZoom())  // Hôtel
], {color: routeColor});

var routes = {
    route1: routePolyline1,
    route2: routePolyline2
};

var arrowPattern = {
    pixelSize: 15,
    polygon: false,
    pathOptions: { stroke: true, color: routeColor }
};

var routeArrowPatterns = [
    { offset: '50%', repeat: '100px', symbol: L.Symbol.arrowHead(arrowPattern) },
    { offset: '10%', repeat: '0', symbol: L.Symbol.arrowHead(arrowPattern) },
    { offset: '25%', repeat: '0', symbol: L.Symbol.arrowHead(arrowPattern) },
    { offset: '40%', repeat: '0', symbol: L.Symbol.arrowHead(arrowPattern) }
];

var decorator1 = L.polylineDecorator(routePolyline1, {
    patterns: routeArrowPatterns
});

var decorator2 = L.polylineDecorator(routePolyline2, {
    patterns: routeArrowPatterns
});

var labels1 = [];
var pointsWithLabels1 = [
    { coords: [1636, 1336], label: '1', offset: [0, 0], name: 'Hôtel' },
    { coords: [1866, 1866], label: '2', offset: [0, 0], name: 'Coustellet' },
    { coords: [3243, 1971], label: '3', offset: [0, 0], name: 'Pont Julien' },
    { coords: [3667, 2928], label: '4', offset: [0, 0], name: 'Lourmarin' },
    { coords: [3058, 2274], label: '5', offset: [0, 0], name: 'Bonnieux' },
    { coords: [2873, 2209], label: '6', offset: [0, 0], name: 'Lacoste' },
    { coords: [2465, 2160], label: '7', offset: [0, 0], name: 'Ménerbes' },
    { coords: [2027, 2309], label: '8', offset: [0, 0], name: 'Oppède le vieux' },
    { coords: [1866, 1866], label: '9', offset: [40, 0], name: 'Coustellet' },
    { coords: [1223, 1219], label: '10', offset: [0, 0], name: 'L\'Isle-sur-la-Sorgue' },
    { coords: [1636, 1336], label: '11', offset: [0, 90], name: 'Hôtel' }
];
pointsWithLabels1.forEach(p => {
    var offset = p.offset || [0, 0];
    var labelCoords = [p.coords[0] + offset[0], p.coords[1] + offset[1] + 40];
    var icon = L.divIcon({ className: 'number-label', html: p.label, iconSize: [20, 20] });
    labels1.push(L.marker(map.unproject(labelCoords, map.getMaxZoom()), {icon: icon}));
});

var labels2 = [];
var pointsWithLabels2 = [
    { coords: [1636, 1336], label: '1', offset: [0, 0], name: 'Hôtel' },
    { coords: [1866, 1866], label: '2', offset: [0, 0], name: 'Coustellet' },
    { coords: [3083, 1578], label: '3', offset: [0, 0], name: 'Roussillon' },
    { coords: [2445, 1384], label: '4', offset: [0, 0], name: 'Gordes' },
    { coords: [2200, 1258], label: '5', offset: [0, 0], name: 'Abbaye de Sénanque' },
    { coords: [1856, 616], label: '6', offset: [0, 0], name: 'Venasque' },
    { coords: [1623, 532], label: '7', offset: [0, 0], name: 'Saint-Didier' },
    { coords: [1636, 1336], label: '8', offset: [0, 90], name: 'Hôtel' }
];
pointsWithLabels2.forEach(p => {
    var offset = p.offset || [0, 0];
    var labelCoords = [p.coords[0] + offset[0], p.coords[1] + offset[1] + 40];
    var icon = L.divIcon({ className: 'number-label', html: p.label, iconSize: [20, 20] });
    labels2.push(L.marker(map.unproject(labelCoords, map.getMaxZoom()), {icon: icon}));
});

// Masquer itinéraires et labels au départ
for (var route in routes) {
    map.removeLayer(routes[route]);
}
map.removeLayer(decorator1);
map.removeLayer(decorator2);
labels1.forEach(l => map.removeLayer(l));
labels2.forEach(l => map.removeLayer(l));

// Mise à jour itinéraire
function updateRoute() {
    // Supprimer les marqueurs de marchés
    marketMarkers.forEach(m => map.removeLayer(m));
    marketMarkers = [];

    // Réafficher les marqueurs permanents
    villageMarkers.forEach(m => m.addTo(map));
    hotel.addTo(map);

    // Cacher le panneau des marchés
    document.getElementById('market-info').style.display = 'none';

    // Gérer les itinéraires
    for (var route in routes) {
        map.removeLayer(routes[route]);
    }
    map.removeLayer(decorator1);
    map.removeLayer(decorator2);
    labels1.forEach(l => map.removeLayer(l));
    labels2.forEach(l => map.removeLayer(l));

    var routeInfoDiv = document.getElementById('route-info');
    var selectedRoute = document.getElementById('routeSelect').value;
    if (selectedRoute === "route1") {
        map.addLayer(routes.route1);
        map.addLayer(decorator1);
        labels1.forEach(l => l.addTo(map));
        document.getElementById('market-info').style.display = 'none'; // Ferme market-info
        routeInfoDiv.innerHTML = `<p><strong>Luberon :</strong><br>${pointsWithLabels1.map(p => p.name).join(' → ')}</p>`;
        routeInfoDiv.style.display = 'block';
    } else if (selectedRoute === "route2") {
        map.addLayer(routes.route2);
        map.addLayer(decorator2);
        labels2.forEach(l => l.addTo(map));
        document.getElementById('market-info').style.display = 'none'; // Ferme market-info
        routeInfoDiv.innerHTML = `<p><strong>Monts de Vaucluse :</strong><br>${pointsWithLabels2.map(p => p.name).join(' → ')}</p>`;
        routeInfoDiv.style.display = 'block';
    } else {
        routeInfoDiv.style.display = 'none';
    }
}

// Mapping jour JS (0=Dimanche) vers valeur HTML
var dayMap = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
var today = dayMap[new Date().getDay()];
document.getElementById('marketSelect').value = today;
updateMarket();

// Mise à jour marchés
function updateMarket() {
    // Supprimer les anciens marqueurs de marchés
    marketMarkers.forEach(m => map.removeLayer(m));
    marketMarkers = [];

    // Gérer l'affichage des marqueurs permanents
    var selectedDay = document.getElementById('marketSelect').value;
    var marketInfoDiv = document.getElementById('market-info');

    if (selectedDay === "none") {
        // Réafficher les marqueurs permanents
        villageMarkers.forEach(m => m.addTo(map));
        hotel.addTo(map);
        marketInfoDiv.style.display = 'none';
        document.getElementById('route-info').style.display = 'none';
        return;
    }

    // Masquer les marqueurs permanents (sauf l'hôtel) et effacer l'itinéraire
    villageMarkers.forEach(m => map.removeLayer(m));
    // L'hôtel reste visible

    // Effacer l'itinéraire si sélectionné
    for (var route in routes) {
        map.removeLayer(routes[route]);
    }
    map.removeLayer(decorator1);
    map.removeLayer(decorator2);
    labels1.forEach(l => map.removeLayer(l));
    labels2.forEach(l => map.removeLayer(l));

    // Liste des marchés hors carte pour le jour sélectionné
    var marketList = [];
    markets.forEach(market => {
        if (market.days.includes(selectedDay)) {
            var village = villages.find(v => v.name === market.name) || marketVillages.find(v => v.name === market.name);
            if (village) {
                if (village.coords) {
                    var marker = L.marker(map.unproject(village.coords, map.getMaxZoom()), { icon: createMarkerIcon(market.name) });
                    marker.bindPopup(`Marché ${market.time}<br><a href="${village.link}" target="_blank" lang="fr">${market.name}</a>`);
                    marker.on('mouseover', function(e) { this.openPopup(); });
                    marker.on('click', function(e) { this.openPopup(); });
                    marker.addTo(map);
                    marketMarkers.push(marker);
                } else {
                    marketList.push(`${market.name} : Marché ${market.time} <a href="https://www.google.com/maps?q=${encodeURIComponent(market.name)}" target="_blank" lang="fr">📍 Voir sur Google Maps</a>`);
                }
            }
        }
    });

    // Mettre à jour le panneau d'information (seulement marchés hors carte)
    document.getElementById('route-info').style.display = 'none'; // Ferme route-info
    if (marketList.length > 0) {
        marketInfoDiv.innerHTML = `<p><strong>Marchés hors carte :</strong><br>${marketList.join('<br>')}</p>`;
        marketInfoDiv.style.display = 'block';
    } else {
        marketInfoDiv.style.display = 'none';
    }
}
