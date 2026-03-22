// Initialize Leaflet map
// coordinates centered roughly on Fontibon
const map = L.map('map', {
    zoomControl: true,
    attributionControl: false
}).setView([4.67, -74.13], 13);

// Variables to hold the GeoJSON layers
let mapLayer = null;
let sipLayer = null;

// Fetch coordinates for Fontibón Map
fetch('/api/fontibon')
    .then(response => response.json())
    .then(data => {
        // Create the polygon layer for Fontibon
        mapLayer = L.geoJSON(data, {
            style: {
                color: '#3388ff',
                weight: 2,
                fillColor: '#3388ff',
                fillOpacity: 0.2
            }
        });
        
        // Add to map by default
        mapLayer.addTo(map);
        
        // Adjust map bounds to Fontibón polygon
        if(mapLayer.getBounds().isValid()) {
            map.fitBounds(mapLayer.getBounds());
        }
    })
    .catch(err => console.error("Error loading Fontibon map data:", err));

// Fetch coordinates for Fontibón Paraderos
fetch('/api/paraderos')
    .then(response => response.json())
    .then(data => {
        // Create the markers layer
        sipLayer = L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                // Return a simple circle marker or default marker
                return L.circleMarker(latlng, {
                    radius: 5,
                    fillColor: '#ff7800',
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            // Bind a popup to each paradero point to show info
            onEachFeature: function(feature, layer) {
                if (feature.properties) {
                    const info = `
                        <b>Ubicación/Nombre:</b> ${feature.properties.nombre_par || 'N/A'}<br>
                        <b>Dirección:</b> ${feature.properties.direccion_ || 'N/A'}<br>
                        <b>Vía:</b> ${feature.properties.via_parade || 'N/A'}
                    `;
                    layer.bindPopup(info);
                }
            }
        });
        
        // Add to map by default
        sipLayer.addTo(map);
    })
    .catch(err => console.error("Error loading Paraderos data:", err));

// Button Interactions
const btnMap = document.getElementById('btnMap');
const btnParaderos = document.getElementById('btnParaderos');

btnMap.addEventListener('click', () => {
    if (map.hasLayer(mapLayer)) {
        // Remove map layer
        map.removeLayer(mapLayer);
        btnMap.classList.remove('active');
    } else {
        // Add map layer back
        mapLayer.addTo(map);
        btnMap.classList.add('active');
        
        // As requested: "si se deselecciona el mapa y se vuelve a seleccionar debe salir por encima de los paraderos"
        mapLayer.bringToFront();
    }
});

btnParaderos.addEventListener('click', () => {
    if (map.hasLayer(sipLayer)) {
        // Remove paraderos layer
        map.removeLayer(sipLayer);
        btnParaderos.classList.remove('active');
    } else {
        // Add paraderos layer back
        sipLayer.addTo(map);
        btnParaderos.classList.add('active');
    }
});
