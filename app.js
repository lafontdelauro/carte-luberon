// ============================================================
// LOGIQUE DE LA CARTE — les contenus (villages, marchés, routes)
// sont dans data.js ; ici seulement le fonctionnement.
// ============================================================

// --- Initialisation de la carte ---
var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: 0,
    maxZoom: 5 // +1 niveau de zoom (ancien max : 4)
});

var imageWidth  = DATA.image.width;
var imageHeight = DATA.image.height;
var southWest = map.unproject([0, imageHeight], map.getMaxZoom());
var northEast = map.unproject([imageWidth, 0], map.getMaxZoom());
var bounds = new L.LatLngBounds(southWest, northEast);

// Image overlay avec gestion d'erreur
var imageOverlay = L.imageOverlay('carte_luberon.jpg', bounds).addTo(map);
imageOverlay.on('error', function() {
    console.error('Erreur : carte_luberon.jpg non trouvé ou corrompu');
    document.getElementById('image-error').style.display = 'block';
});
map.fitBounds(bounds);
// Ouverture +1 niveau de zoom par rapport à l'affichage précédent :
// même centrage, mais la vue est resserrée d'un cran (fitBounds seul ne changeait rien,
// car il recadre toujours l'image entière ; maxZoom n'est qu'un plafond).
var openZoom = Math.min(Math.round(map.getZoom()) + 1, map.getMaxZoom());
map.setView(bounds.getCenter(), openZoom, { animate: false });

// --- Utilitaires ---
function toLatLng(coords) {
    return map.unproject(coords, map.getMaxZoom());
}

// --- Marqueur hôtel (logo.png) ---
var hotelIcon = L.icon({
    iconUrl: 'logo.png',
    iconSize: [46, 82],
    iconAnchor: [23, 41],
    popupAnchor: [0, -38]
});

var hotel = L.marker(toLatLng(DATA.hotel.coords), { icon: hotelIcon })
    .addTo(map)
    .bindPopup(DATA.hotel.name + ' <br><a href="' + DATA.hotel.link + '" target="_blank" lang="fr">site web</a>');
// NB : plus d'openPopup() automatique : la carte s'affiche proprement au chargement.

// --- Icônes carrées avec le nom de la ville ---
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

// --- Icône des « repères de passage » (villes du trajet, pas des villages à visiter) ---
// Style volontairement différent des badges bleus : pastille blanc/contour bleu foncé du logo
function createWaypointIcon(name) {
    var displayName = name.replace(/ /g, '-');
    var textWidth = displayName.length * 7 + 22;
    return L.divIcon({
        className: 'village-marker',
        html: '<div style="background:white;border-radius:12px;width:' + textWidth + 'px;height:24px;display:flex;align-items:center;justify-content:center;color:#114d5f;font-weight:bold;font-size:11px;padding:0 8px;border:2px solid #114d5f;box-shadow:0 2px 4px rgba(0,0,0,0.25);">⚑ ' + displayName + '</div>',
        iconSize: [textWidth, 24],
        iconAnchor: [textWidth / 2, 12]
    });
}

// --- Villages permanents (affichés par défaut) ---
var villageMarkers = [];
DATA.villages.forEach(function(v) {
    var marker = L.marker(toLatLng(v.coords), { icon: createMarkerIcon(v.name, false) }).addTo(map);
    marker.bindPopup('<a href="' + v.link + '" target="_blank" lang="fr">' + v.name + '</a>');
    marker.on('mouseover', function(e) { this.openPopup(); });
    marker.on('click',     function(e) { this.openPopup(); });
    villageMarkers.push(marker);
});

// --- Itinéraires (générés depuis DATA.routes) ---
var routeCasingColor = '#1a237e'; // bande sombre pour la lisibilité du jaune pâle
var routeLineColor   = '#fff176'; // ligne principale : jaune pâle
var arrowColor       = '#114d5f'; // flèches — bleu/vert foncé du logo

var casings = {};     // bande de fond par route
var routes = {};      // ligne jaune animée par route
var decorators = {};  // flèches par route
var labels = {};      // pastilles numérotées par route

var arrowPattern = {
    pixelSize: 15,
    polygon: false,
    pathOptions: { stroke: true, color: arrowColor }
};

var arrowPatterns = [
    { offset: '50%', repeat: '100px', symbol: L.Symbol.arrowHead(arrowPattern) },
    { offset: '10%', repeat: '0', symbol: L.Symbol.arrowHead(arrowPattern) },
    { offset: '25%', repeat: '0', symbol: L.Symbol.arrowHead(arrowPattern) },
    { offset: '40%', repeat: '0', symbol: L.Symbol.arrowHead(arrowPattern) }
];

Object.keys(DATA.routes).forEach(function(key) {
    var pts = DATA.routes[key].points;

    // Bande de fond (contraste avec la carte claire)
    casings[key] = L.polyline(pts.map(function(p) { return toLatLng(p.coords); }), {
        color: routeCasingColor, weight: 6, opacity: 1, interactive: false
    });

    // Ligne jaune pâle "défilée" : pointillés animés (voir .route-flow dans style.css)
    routes[key] = L.polyline(pts.map(function(p) { return toLatLng(p.coords); }), {
        color: routeLineColor,
        weight: 3.5,
        dashArray: '4 4',
        className: 'route-flow',
        interactive: false
    });

    // Flèches de sens
    decorators[key] = L.polylineDecorator(routes[key], { patterns: arrowPatterns });

    // Étiquettes numérotées (créées une fois, affichées/masquées à la demande)
    labels[key] = pts.map(function(p, i) {
        var off = p.offset || [0, 0];
        return L.marker(toLatLng([p.coords[0] + off[0], p.coords[1] + off[1] + 40]), {
            icon: L.divIcon({ className: 'number-label', html: String(i + 1), iconSize: [20, 20] }),
            interactive: false
        });
    });
});

// --- Affichages/masquages communs ---
var marketMarkers = [];
var routeWaypointMarkers = []; // points d'orientation de la route (Coustellet, Pont Julien…)

function clearTransientLayers() {
    marketMarkers.forEach(function(m) { map.removeLayer(m); });
    marketMarkers = [];
    routeWaypointMarkers.forEach(function(m) { map.removeLayer(m); });
    routeWaypointMarkers = [];
    Object.keys(routes).forEach(function(key) {
        map.removeLayer(casings[key]);
        map.removeLayer(routes[key]);
        map.removeLayer(decorators[key]);
        labels[key].forEach(function(l) { map.removeLayer(l); });
    });
}

function showAllVillages() {
    villageMarkers.forEach(function(m) { m.addTo(map); });
    hotel.addTo(map);
}

// --- Cadrage de l'itinéraire SANS « sauter » ---
// Principe : le centre et le zoom du cadrage d'ouverture sont conservés.
// Si un bout de l'itinéraire déborde du cadre, on décale le centre au
// minimum nécessaire (simple pan, sans zoom, sans animation).
function ensureRouteVisible(routeLayer) {
    if (map.getBounds().contains(routeLayer.getBounds())) return; // tout visible → aucun mouvement
    var z = map.getZoom();
    // Enveloppe projetée (espace écran) — min/max des deux coins,
    // donc indépendante de l'orientation des axes CRS.Simple.
    function box(b) {
        var sw = map.project(b.getSouthWest(), z);
        var ne = map.project(b.getNorthEast(), z);
        return {
            x0: Math.min(sw.x, ne.x), y0: Math.min(sw.y, ne.y),
            x1: Math.max(sw.x, ne.x), y1: Math.max(sw.y, ne.y)
        };
    }
    var v = box(map.getBounds());
    var r = box(routeLayer.getBounds());
    var dx = (r.x0 < v.x0) ? (r.x0 - v.x0) : ((r.x1 > v.x1) ? (r.x1 - v.x1) : 0);
    var dy = (r.y0 < v.y0) ? (r.y0 - v.y0) : ((r.y1 > v.y1) ? (r.y1 - v.y1) : 0);
    if (dx === 0 && dy === 0) return;
    var c = map.project(map.getCenter(), z);
    map.panTo(map.unproject([c.x + dx, c.y + dy], z), { animate: false });
}

// Construit la liste numérotée des étapes avec description pour la sidebar
function buildRouteList(points) {
    return points.map(function(p, i) {
        var village = null;
        for (var k = 0; k < DATA.villages.length; k++) {
            if (DATA.villages[k].name === p.name) { village = DATA.villages[k]; break; }
        }
        var desc = village ? '<div class="step-desc">' + village.desc + '</div>' : '';
        return '<div class="route-step">' +
               '<span class="step-num">' + (i + 1) + '</span>' +
               '<div class="step-info"><span class="step-name">' + p.name + '</span>' + desc + '</div>' +
               '</div>';
    }).join('');
}

// --- Mise à jour itinéraire ---
function updateRoute() {
    clearTransientLayers();
    document.getElementById('market-info').style.display = 'none';
    document.getElementById('route-info').style.display = 'none';

    var selectedRoute = document.getElementById('routeSelect').value;

    if (selectedRoute === 'none') {
        // Aucun itinéraire : afficher tous les villages
        showAllVillages();
        return;
    }

    // Synchronisation : l'autre menu repasse sur "none"
    document.getElementById('marketSelect').value = 'none';

    var route = DATA.routes[selectedRoute];

    // N'afficher que les villages de cet itinéraire
    villageMarkers.forEach(function(m, idx) {
        map.removeLayer(m);
        var routeNames = route.points.map(function(p) { return p.name; });
        if (routeNames.indexOf(DATA.villages[idx].name) !== -1) {
            m.addTo(map);
        }
    });
    hotel.addTo(map);

    // Repères de passage : villes du trajet qui ne sont PAS des « villages »
    // (ex. Pont Julien, Coustellet) — style blanc/⚑ différent des badges bleus,
    // affichés tant que la route est active.
    var villageNames = DATA.villages.map(function(v) { return v.name; });
    var waypointSeen = {};
    route.points.forEach(function(p) {
        if (p.name === 'Hôtel' || villageNames.indexOf(p.name) !== -1 || waypointSeen[p.name]) return;
        waypointSeen[p.name] = true;
        var village = findVillage(p.name);
        var link = village ? village.link : ('https://www.google.com/search?q=' + encodeURIComponent(p.name));
        var marker = L.marker(toLatLng(p.coords), { icon: createWaypointIcon(p.name) });
        marker.bindPopup('<a href="' + link + '" target="_blank" lang="fr">' + p.name + '</a>');
        marker.on('mouseover', function(e) { this.openPopup(); });
        marker.on('click',     function(e) { this.openPopup(); });
        marker.addTo(map);
        routeWaypointMarkers.push(marker);
    });

    map.addLayer(casings[selectedRoute]);
    map.addLayer(routes[selectedRoute]);
    map.addLayer(decorators[selectedRoute]);
    labels[selectedRoute].forEach(function(l) { l.addTo(map); });

    var routeInfoDiv = document.getElementById('route-info');
    routeInfoDiv.innerHTML = '<p><strong>' + route.label + '</strong></p>' + buildRouteList(route.points);
    routeInfoDiv.style.display = 'block';

    // Centre d'ouverture conservé : la carte ne bouge qu'au strict minimum
    // si un bout de l'itinéraire sort du cadre (sans changer le niveau de zoom).
    ensureRouteVisible(routes[selectedRoute]);
}

// --- Aide : retrouver les coordonnées d'un village de marché ---
function findVillage(name) {
    for (var i = 0; i < DATA.villages.length; i++) {
        if (DATA.villages[i].name === name) return DATA.villages[i];
    }
    for (var j = 0; j < DATA.marketVillages.length; j++) {
        if (DATA.marketVillages[j].name === name) return DATA.marketVillages[j];
    }
    return null;
}

// --- Mise à jour marchés ---
function updateMarket() {
    clearTransientLayers();
    document.getElementById('market-info').style.display = 'none';
    document.getElementById('route-info').style.display = 'none';

    var selectedDay = document.getElementById('marketSelect').value;

    if (selectedDay === 'none') {
        showAllVillages();
        return;
    }

    // Synchronisation : l'autre menu repasse sur "none"
    document.getElementById('routeSelect').value = 'none';

    // Masquer les marqueurs permanents
    villageMarkers.forEach(function(m) { map.removeLayer(m); });
    hotel.addTo(map);

    var sidebarItems = []; // tous les marchés du jour (sur carte + hors carte)
    DATA.markets.forEach(function(market) {
        if (market.days.indexOf(selectedDay) === -1) return;
        var village = findVillage(market.name);
        if (!village) return;

        // Marqueur sur la carte si coordonnées disponibles
        if (village.coords) {
            var marker = L.marker(toLatLng(village.coords), { icon: createMarkerIcon(market.name, true) });
            marker.bindPopup('Marché ' + market.time + '<br><a href="' + village.link + '" target="_blank" lang="fr">' + market.name + '</a>');
            marker.on('mouseover', function(e) { this.openPopup(); });
            marker.on('click',     function(e) { this.openPopup(); });
            marker.addTo(map);
            marketMarkers.push(marker);
        }

        // Toujours ajouter dans la liste sidebar
        sidebarItems.push({ name: market.name, time: market.time, link: village.link, onMap: !!village.coords });
    });

    var marketInfoDiv = document.getElementById('market-info');
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

// --- Chargement : jour du marché pré-sélectionné automatiquement ---
var dayMap = { 0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday', 6: 'saturday' };
document.getElementById('marketSelect').value = dayMap[new Date().getDay()];
updateMarket();

// ============================================================
// ============================================================
// CARTE N°2 : ŒNOTOURISME (carte-oenotour.jpg, 5512 x 2520)
// Deuxième carte Leaflet indépendante, activée via le menu « Carte : »
// de la sidebar. La carte Luberon ci-dessus reste telle quelle.
// Coordonnées pixels : data-oenotour-coords.js (OENO_COORDS)
// Contenus (téléphone, site) : data-oenotour.js (OENO_DATA)
// ============================================================

var OENO_W = 5512, OENO_H = 2520;      // dimensions de carte-oenotour.jpg
var oenoMap = null;                    // instance Leaflet (créée à la 1re ouverture)
var oenoInit = false;                  // vrai une fois la carte œno créée
var oenoMarkersByNum = {};             // num -> marqueur (navigation depuis la liste)

// --- Conversion pixels -> latlng (espace propre de la carte œno) ---
function oenoToLatLng(c) {
    return oenoMap.unproject(c, oenoMap.getMaxZoom());
}

// --- Échappement HTML (les noms peuvent contenir & < >) ---
function oenoEsc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// --- Icône d'un point œno : pastille numérotée (vin) + petit nom ---
function createOenoIcon(p) {
    var name = p.name;
    if (name.length > 24) { name = name.slice(0, 23) + '…'; }
    name = oenoEsc(name);
    var iconW = Math.max(name.length * 6 + 16, 26);   // largeur estimée du libellé
    var html = '<div class="oeno-wrap">' +
                  '<div class="oeno-badge">' + p.num + '</div>' +
                  '<div class="oeno-name">' + name + '</div>' +
              '</div>';
    return L.divIcon({
        className: 'oeno-marker',
        html: html,
        iconSize: [iconW, 42],
        iconAnchor: [Math.round(iconW / 2), 21]
    });
}

// --- Fenêtre d'un point œno : n°, nom, tél, site, Fiche Google ---
function oenoPopup(p) {
    var type = (p.type === 'domaine') ? '🍷 Domaine / cave' : '🍷 Caviste / bar à vin';
    var html = '<div class="oeno-pop">';
    html += '<div class="oeno-pop-head"><span class="oeno-pop-num">' + p.num + '</span>' + type + '</div>';
    html += '<div class="oeno-pop-name">' + oenoEsc(p.name) + '</div>';
    if (p.phone) { html += '<div class="oeno-pop-row">☎ ' + p.phone + '</div>'; }
    if (p.site)  { html += '<a class="oeno-pop-link" href="' + p.site + '" target="_blank" lang="fr">🌐 Site web</a>'; }
    var gq = encodeURIComponent(p.name + ' Vaucluse');
    html += '<a class="oeno-pop-link" href="https://www.google.com/search?q=' + gq + '" target="_blank" lang="fr">🔍 Fiche Google (photo, horaires, avis)</a>';
    html += '</div>';
    return html;
}

// --- Création de la carte œnotouristique (une seule fois) ---
function initOeno() {
    oenoMap = L.map('map-oeno', {
        crs: L.CRS.Simple,
        minZoom: 0,
        maxZoom: 6   // un cran au-dessus du Luberon (points serrés Cavaillon/Lourmarin)
    });

    var sw = oenoMap.unproject([0, OENO_H], oenoMap.getMaxZoom());
    var ne = oenoMap.unproject([OENO_W, 0], oenoMap.getMaxZoom());
    var oenoBounds = new L.LatLngBounds(sw, ne);

    var overlay = L.imageOverlay('carte-oenotour.jpg', oenoBounds).addTo(oenoMap);
    overlay.on('error', function () {
        console.error('Erreur : carte-oenotour.jpg non trouvée ou corrompue');
    });

    // Hôtel (logo.png) — juste en dessous du point 38
    var hotelIcon = L.icon({
        iconUrl: 'logo.png',
        iconSize: [46, 82],
        iconAnchor: [23, 41],
        popupAnchor: [0, -38]
    });
    var hotelPos = OENO_COORDS['hotel'] || [2810, 770];
    var oenoHotel = L.marker(oenoToLatLng(hotelPos), { icon: hotelIcon }).addTo(oenoMap);
    oenoHotel.bindPopup(DATA.hotel.name + ' <br><a href="' + DATA.hotel.link + '" target="_blank" lang="fr">site web</a>');
    oenoHotel.on('mouseover', function () { this.openPopup(); });
    oenoHotel.on('click',     function () { this.openPopup(); });

    // Les 59 points (domaines + cavistes)
    OENO_DATA.forEach(function (p) {
        var c = OENO_COORDS[String(p.num)];
        if (!c) { console.warn('Coordonnées manquantes pour le point œno ' + p.num); return; }
        var marker = L.marker(oenoToLatLng(c), { icon: createOenoIcon(p) });
        marker.bindPopup(oenoPopup(p));
        marker.on('mouseover', function () { this.openPopup(); });
        marker.on('click',     function () { this.openPopup(); });
        marker.addTo(oenoMap);
        oenoMarkersByNum[p.num] = marker;
    });

    // Cadrage d'ouverture : fitBounds puis +1 zoom (même centrage, vue resserrée)
    oenoMap.fitBounds(oenoBounds);
    var openZoom = Math.min(Math.round(oenoMap.getZoom()) + 1, oenoMap.getMaxZoom());
    oenoMap.setView(oenoBounds.getCenter(), openZoom, { animate: false });
}

// --- Aller vers un point œno depuis la liste sidebar ---
function oenoGoTo(num) {
    if (!oenoInit) {
        document.getElementById('mapSelect').value = 'oenotour';
        switchMap();
    }
    var marker = oenoMarkersByNum[num];
    if (!marker || !oenoMap) { return; }
    oenoMap.setView(marker.getLatLng(), Math.max(oenoMap.getZoom(), 4), { animate: true });
    setTimeout(function () { marker.openPopup(); }, 320);
}

// --- Recherche insensible aux accents (« trelus » trouve « TrélUs ») ---
function oenoNorm(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// --- Liste sidebar des 59 adresses (+ recherche) ---
function oenoListItem(p) {
    return '<a href="#" class="oeno-li" onclick="oenoGoTo(' + p.num + ');return false;">' +
               '<span class="oeno-li-num">' + p.num + '</span>' +
               '<span class="oeno-li-name">' + oenoEsc(p.name) + '</span>' +
           '</a>';
}

function renderOenoList() {
    var q = oenoNorm(document.getElementById('oenoFilter').value || '');
    function match(p) { return !q || oenoNorm(p.name).indexOf(q) !== -1; }
    var domaines = OENO_DATA.filter(function (p) { return p.type === 'domaine'; }).filter(match);
    var cavistes = OENO_DATA.filter(function (p) { return p.type === 'caviste'; }).filter(match);
    if (domaines.length === 0 && cavistes.length === 0) {
        document.getElementById('oenoList').innerHTML = '<div class="oeno-none">Aucun résultat.</div>';
        return;
    }
    var out = [];
    if (domaines.length) { out.push('<div class="oeno-group">Domaines &amp; caves (1-40)</div>'); }
    domaines.forEach(function (p) { out.push(oenoListItem(p)); });
    if (cavistes.length) { out.push('<div class="oeno-group">Cavistes &amp; bars à vin (41-59)</div>'); }
    cavistes.forEach(function (p) { out.push(oenoListItem(p)); });
    document.getElementById('oenoList').innerHTML = out.join('');
}

// --- BASCULE Luberon <-> Œnotourisme (menu « Carte : ») ---
function switchMap() {
    var target   = document.getElementById('mapSelect').value;
    var lubDiv   = document.getElementById('map');
    var oenoDiv  = document.getElementById('map-oeno');
    var sideLub  = document.getElementById('sidebar-luberon');
    var sideOeno = document.getElementById('sidebar-oeno');

    if (target === 'oenotour') {
        lubDiv.style.display   = 'none';
        oenoDiv.style.display  = 'block';
        sideLub.style.display  = 'none';
        sideOeno.style.display = 'block';
        if (!oenoInit) { initOeno(); oenoInit = true; }
        renderOenoList();
        setTimeout(function () { oenoMap.invalidateSize(); }, 40);
    } else {
        oenoDiv.style.display  = 'none';
        lubDiv.style.display   = 'block';
        sideLub.style.display  = 'block';
        sideOeno.style.display = 'none';
        setTimeout(function () { map.invalidateSize(); }, 40);
    }
}

// Pré-rendu de la liste (inoffensif tant que la carte œno est masquée)
renderOenoList();
