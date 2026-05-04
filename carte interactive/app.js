// Initialiser la carte
var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: 0,
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

// Icône hôtel personnalisée
var hotelIcon = L.icon({
    iconUrl: 'hotel-icon.ico',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -42]
});

// Marqueur hôtel (toujours visible, icône verte)
var hotel = L.marker(map.unproject([1636, 1336], map.getMaxZoom()), { icon: hotelIcon }).addTo(map)
    .bindPopup('Hôtel la font de lauro <br><a href="https://www.hotel-la-font-de-lauro.fr/" target="_blank" lang="fr">site web</a>')
    .openPopup();

// Icônes carrées avec le nom de la ville
// isMarket=true : fond orange + 🛖 devant le nom
function createMarkerIcon(name, isMarket) {
    var displayName = isMarket ? ('🛖 ' + name.replace(/ /g, '-')) : name.replace(/ /g, '-');
    var textWidth = displayName.length * 7 + 12;
    var bgColor = isMarket ? '#e65100' : '#1565c0';
    return L.divIcon({
        className: 'village-marker',
        html: '<div style="background:' + bgColor + ';border-radius:4px;width:' + textWidth + 'px;height:24px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:11px;padding:0 6px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);">' + displayName + '</div>',
        iconSize: [textWidth, 24],
        iconAnchor: [textWidth / 2, 12]
    });
}

// Villages permanents (affichés par défaut, masqués lors de sélection de marché)
var villages = [
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
];
var villageMarkers = [];
villages.forEach(function(v) {
    var marker = L.marker(map.unproject(v.coords, map.getMaxZoom()), { icon: createMarkerIcon(v.name, false) }).addTo(map);
    marker.bindPopup('<a href="' + v.link + '" target="_blank" lang="fr">' + v.name + '</a>');
    marker.on('mouseover', function(e) { this.openPopup(); });
    marker.on('click',     function(e) { this.openPopup(); });
    villageMarkers.push(marker);
});

// Villes uniquement pour les marchés — UNE SEULE déclaration (doublon original supprimé)
var marketVillages = [
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
];

// Données des marchés
var markets = [
    { name: "Carpentras",             days: ["friday"],                                                     time: "le matin (8h-13h)" },
    { name: "Velleron",               days: ["monday","tuesday","wednesday","thursday","friday","saturday"], time: "le soir (18h en été) ou après-midi (16h30 en hiver)" },
    { name: "Pernes-les-Fontaines",   days: ["saturday"],                                                   time: "le matin (8h-13h)" },
    { name: "Le Thor",                days: ["wednesday","tuesday"],                                         time: "le matin (8h-13h) ou le soir (17h30-19h30)" },
    { name: "L'Isle-sur-la-Sorgue",   days: ["thursday","sunday"],                                          time: "le matin (8h-13h)" },
    { name: "Robion",                 days: ["thursday"],                                                    time: "le matin (8h-13h)" },
    { name: "Coustellet",             days: ["sunday","wednesday"],                                          time: "le matin (8h-13h) ou le soir" },
    { name: "Oppède le vieux",        days: ["saturday"],                                                    time: "le matin (8h-13h)" },
    { name: "Ménerbes",               days: ["thursday"],                                                    time: "le matin (8h-13h)" },
    { name: "Bonnieux",               days: ["friday"],                                                      time: "le matin (8h-13h)" },
    { name: "Lacoste",                days: ["wednesday"],                                                   time: "le matin (8h-13h)" },
    { name: "Lourmarin",              days: ["friday","tuesday"],                                            time: "le matin (8h-13h) ou le soir" },
    { name: "Apt",                    days: ["tuesday","saturday"],                                          time: "le matin (8h-13h)" },
    { name: "Roussillon",             days: ["thursday"],                                                    time: "le matin (9h-12h)" },
    { name: "Gordes",                 days: ["tuesday"],                                                     time: "le matin (8h-13h)" },
    { name: "Venasque",               days: ["tuesday"],                                                     time: "le soir (17h-20h)" },
    { name: "Saint-Didier",           days: ["monday"],                                                      time: "le matin (8h-13h)" },
    { name: "Fontaine-de-Vaucluse",   days: ["tuesday"],                                                    time: "le matin (8h-13h)" },
    { name: "Châteauneuf-de-Gadagne", days: ["tuesday"],                                                    time: "le soir (17h-19h)" },
    { name: "Sault",                  days: ["wednesday"],                                                   time: "le matin (8h-13h)" },
    { name: "Bédoin",                 days: ["monday"],                                                      time: "le matin (8h-13h)" }
];

// Marqueurs pour les marchés (gérés dynamiquement)
var marketMarkers = [];

// Itinéraires — IDENTIQUE à l'original
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
    map.unproject([1856, 616],  map.getMaxZoom()), // Venasque
    map.unproject([1623, 532],  map.getMaxZoom()), // Saint-Didier
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

var decorator1 = L.polylineDecorator(routePolyline1, { patterns: routeArrowPatterns });
var decorator2 = L.polylineDecorator(routePolyline2, { patterns: routeArrowPatterns });

var labels1 = [];
var pointsWithLabels1 = [
    { coords: [1636, 1336], label: '1',  offset: [0, 0],  name: 'Hôtel' },
    { coords: [1866, 1866], label: '2',  offset: [0, 0],  name: 'Coustellet' },
    { coords: [3243, 1971], label: '3',  offset: [0, 0],  name: 'Pont Julien' },
    { coords: [3667, 2928], label: '4',  offset: [0, 0],  name: 'Lourmarin' },
    { coords: [3058, 2274], label: '5',  offset: [0, 0],  name: 'Bonnieux' },
    { coords: [2873, 2209], label: '6',  offset: [0, 0],  name: 'Lacoste' },
    { coords: [2465, 2160], label: '7',  offset: [0, 0],  name: 'Ménerbes' },
    { coords: [2027, 2309], label: '8',  offset: [0, 0],  name: 'Oppède le vieux' },
    { coords: [1866, 1866], label: '9',  offset: [40, 0], name: 'Coustellet' },
    { coords: [1223, 1219], label: '10', offset: [0, 0],  name: "L'Isle-sur-la-Sorgue" },
    { coords: [1636, 1336], label: '11', offset: [0, 90], name: 'Hôtel' }
];
pointsWithLabels1.forEach(function(p) {
    var offset = p.offset || [0, 0];
    var labelCoords = [p.coords[0] + offset[0], p.coords[1] + offset[1] + 40];
    var icon = L.divIcon({ className: 'number-label', html: p.label, iconSize: [20, 20] });
    labels1.push(L.marker(map.unproject(labelCoords, map.getMaxZoom()), {icon: icon}));
});

var labels2 = [];
var pointsWithLabels2 = [
    { coords: [1636, 1336], label: '1', offset: [0, 0],  name: 'Hôtel' },
    { coords: [1866, 1866], label: '2', offset: [0, 0],  name: 'Coustellet' },
    { coords: [3083, 1578], label: '3', offset: [0, 0],  name: 'Roussillon' },
    { coords: [2445, 1384], label: '4', offset: [0, 0],  name: 'Gordes' },
    { coords: [2200, 1258], label: '5', offset: [0, 0],  name: 'Abbaye de Sénanque' },
    { coords: [1856, 616],  label: '6', offset: [0, 0],  name: 'Venasque' },
    { coords: [1623, 532],  label: '7', offset: [0, 0],  name: 'Saint-Didier' },
    { coords: [1636, 1336], label: '8', offset: [0, 90], name: 'Hôtel' }
];
pointsWithLabels2.forEach(function(p) {
    var offset = p.offset || [0, 0];
    var labelCoords = [p.coords[0] + offset[0], p.coords[1] + offset[1] + 40];
    var icon = L.divIcon({ className: 'number-label', html: p.label, iconSize: [20, 20] });
    labels2.push(L.marker(map.unproject(labelCoords, map.getMaxZoom()), {icon: icon}));
});

// Masquer itinéraires et labels au départ — IDENTIQUE à l'original
for (var route in routes) {
    map.removeLayer(routes[route]);
}
map.removeLayer(decorator1);
map.removeLayer(decorator2);
labels1.forEach(function(l) { map.removeLayer(l); });
labels2.forEach(function(l) { map.removeLayer(l); });

// Construit la liste numérotée des étapes avec description pour la sidebar
function buildRouteList(points) {
    return points.map(function(p, i) {
        var village = null;
        for (var k = 0; k < villages.length; k++) {
            if (villages[k].name === p.name) { village = villages[k]; break; }
        }
        var desc = village ? '<div class="step-desc">' + village.desc + '</div>' : '';
        return '<div class="route-step">' +
               '<span class="step-num">' + (i + 1) + '</span>' +
               '<div class="step-info"><span class="step-name">' + p.name + '</span>' + desc + '</div>' +
               '</div>';
    }).join('');
}

// Mise à jour itinéraire
function updateRoute() {
    marketMarkers.forEach(function(m) { map.removeLayer(m); });
    marketMarkers = [];
    document.getElementById('market-info').style.display = 'none';

    for (var route in routes) { map.removeLayer(routes[route]); }
    map.removeLayer(decorator1);
    map.removeLayer(decorator2);
    labels1.forEach(function(l) { map.removeLayer(l); });
    labels2.forEach(function(l) { map.removeLayer(l); });

    var routeInfoDiv = document.getElementById('route-info');
    var selectedRoute = document.getElementById('routeSelect').value;

    if (selectedRoute === 'none') {
        // Aucun itinéraire : afficher tous les villages
        villageMarkers.forEach(function(m) { m.addTo(map); });
        hotel.addTo(map);
        routeInfoDiv.style.display = 'none';
        return;
    }

    // Masquer tous les villages d'abord
    villageMarkers.forEach(function(m) { map.removeLayer(m); });
    hotel.addTo(map);

    // Déterminer les villages de l'itinéraire sélectionné
    var points = selectedRoute === 'route1' ? pointsWithLabels1 : pointsWithLabels2;
    var routeNames = points.map(function(p) { return p.name; });

    // N'afficher que les marqueurs des villages de cet itinéraire
    villageMarkers.forEach(function(m, idx) {
        if (routeNames.indexOf(villages[idx].name) !== -1) {
            m.addTo(map);
        }
    });

    if (selectedRoute === 'route1') {
        map.addLayer(routes.route1);
        map.addLayer(decorator1);
        labels1.forEach(function(l) { l.addTo(map); });
        routeInfoDiv.innerHTML = '<p><strong>Luberon</strong></p>' + buildRouteList(pointsWithLabels1);
        routeInfoDiv.style.display = 'block';
    } else if (selectedRoute === 'route2') {
        map.addLayer(routes.route2);
        map.addLayer(decorator2);
        labels2.forEach(function(l) { l.addTo(map); });
        routeInfoDiv.innerHTML = '<p><strong>Monts de Vaucluse</strong></p>' + buildRouteList(pointsWithLabels2);
        routeInfoDiv.style.display = 'block';
    }
}

// Mise à jour marchés
// CORRECTION : dayMap utilisait des noms FR mais le select et markets[] utilisent l'anglais
function updateMarket() {
    marketMarkers.forEach(function(m) { map.removeLayer(m); });
    marketMarkers = [];

    var selectedDay = document.getElementById('marketSelect').value;
    var marketInfoDiv = document.getElementById('market-info');

    if (selectedDay === 'none') {
        villageMarkers.forEach(function(m) { m.addTo(map); });
        hotel.addTo(map);
        marketInfoDiv.style.display = 'none';
        document.getElementById('route-info').style.display = 'none';
        return;
    }

    // Masquer les marqueurs permanents et effacer l'itinéraire
    villageMarkers.forEach(function(m) { map.removeLayer(m); });
    for (var route in routes) { map.removeLayer(routes[route]); }
    map.removeLayer(decorator1);
    map.removeLayer(decorator2);
    labels1.forEach(function(l) { map.removeLayer(l); });
    labels2.forEach(function(l) { map.removeLayer(l); });

    var sidebarItems = []; // tous les marchés du jour (sur carte + hors carte)
    markets.forEach(function(market) {
        if (market.days.indexOf(selectedDay) === -1) return;
        var village = null;
        for (var i = 0; i < villages.length; i++) {
            if (villages[i].name === market.name) { village = villages[i]; break; }
        }
        if (!village) {
            for (var j = 0; j < marketVillages.length; j++) {
                if (marketVillages[j].name === market.name) { village = marketVillages[j]; break; }
            }
        }
        if (!village) return;

        // Marqueur sur la carte si coordonnées disponibles
        if (village.coords) {
            var marker = L.marker(map.unproject(village.coords, map.getMaxZoom()), { icon: createMarkerIcon(market.name, true) });
            marker.bindPopup('Marché ' + market.time + '<br><a href="' + village.link + '" target="_blank" lang="fr">' + market.name + '</a>');
            marker.on('mouseover', function(e) { this.openPopup(); });
            marker.on('click',     function(e) { this.openPopup(); });
            marker.addTo(map);
            marketMarkers.push(marker);
        }

        // Toujours ajouter dans la liste sidebar
        sidebarItems.push({ name: market.name, time: market.time, link: village.link, onMap: !!village.coords });
    });

    document.getElementById('route-info').style.display = 'none';
    if (sidebarItems.length > 0) {
        marketInfoDiv.innerHTML = '<p><strong>Marchés du jour :</strong></p>' +
            sidebarItems.map(function(m) {
                var offMapBadge = m.onMap ? '' : ' <span class="off-map-badge">hors carte</span>';
                return '<div class="market-item">' +
                       '<span class="market-name">🛖 ' + m.name + offMapBadge + '</span>' +
                       '<div class="market-time">🕐 ' + m.time + '</div>' +
                       '<a href="' + m.link + '" target="_blank" lang="fr">🔍 En savoir plus</a>' +
                       '</div>';
            }).join('');
        marketInfoDiv.style.display = 'block';
    } else {
        marketInfoDiv.innerHTML = '<p>Aucun marché ce jour.</p>';
        marketInfoDiv.style.display = 'block';
    }
}

// CORRECTION du bug original : dayMap était en français mais select+markets[] utilisent l'anglais
var dayMap = { 0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday', 6: 'saturday' };
document.getElementById('marketSelect').value = dayMap[new Date().getDay()];
updateMarket();
