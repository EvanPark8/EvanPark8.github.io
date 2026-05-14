// Interactive supply chain map: mineral producers to purchasing countries

(function() {
    'use strict';

    const CENTROIDS = {
        COD: [23.6, -2.9],   // DRC [lng, lat] - Leaflet uses [lat, lng]
        CHL: [-71.0, -35.7], // Chile
        IDN: [118.0, -2.0],  // Indonesia
        AUS: [134.5, -25.0], // Australia
        CHN: [105.0, 35.0],  // China
        BOL: [-64.7, -16.7], // Bolivia
        ARG: [-64.2, -34.6], // Argentina
        ZWE: [29.0, -19.0],  // Zimbabwe
        RWA: [29.9, -2.0],   // Rwanda
        PHL: [122.0, 12.0],  // Philippines
        MMR: [96.0, 21.0],   // Myanmar
        ZAF: [25.0, -29.0],  // South Africa
        USA: [-95.7, 37.1],
        JPN: [138.2, 36.2],
        KOR: [127.8, 35.9],
        DEU: [10.5, 51.2],
        BEL: [4.5, 50.5],
        FRA: [2.2, 46.2],
        GBR: [-2.0, 54.0],
        IND: [78.0, 21.0],
    };

    const SUPPLY_CHAINS = {
        COD: { name: 'DRC', minerals: ['Cobalt', 'Coltan', 'Copper'], buyers: ['CHN', 'USA', 'JPN', 'KOR', 'BEL', 'DEU'] },
        CHL: { name: 'Chile', minerals: ['Lithium', 'Copper'], buyers: ['CHN', 'USA', 'KOR', 'JPN'] },
        IDN: { name: 'Indonesia', minerals: ['Nickel', 'Cobalt'], buyers: ['CHN', 'USA', 'JPN', 'KOR'] },
        AUS: { name: 'Australia', minerals: ['Lithium', 'Rare Earths', 'Cobalt'], buyers: ['CHN', 'USA', 'JPN', 'KOR'] },
        CHN: { name: 'China', minerals: ['Rare Earths', 'Graphite'], buyers: ['USA', 'JPN', 'DEU', 'KOR'] },
        BOL: { name: 'Bolivia', minerals: ['Lithium'], buyers: ['CHN', 'ARG'] },
        ARG: { name: 'Argentina', minerals: ['Lithium'], buyers: ['CHN', 'USA', 'KOR', 'JPN'] },
        ZWE: { name: 'Zimbabwe', minerals: ['Lithium'], buyers: ['CHN'] },
        RWA: { name: 'Rwanda', minerals: ['Coltan'], buyers: ['CHN', 'USA', 'BEL'] },
        PHL: { name: 'Philippines', minerals: ['Nickel'], buyers: ['CHN', 'JPN'] },
        MMR: { name: 'Myanmar', minerals: ['Rare Earths'], buyers: ['CHN'] },
        ZAF: { name: 'South Africa', minerals: ['Platinum', 'Chromium'], buyers: ['CHN', 'USA', 'DEU', 'JPN'] },
    };

    let map = null;
    let countriesLayer = null;
    let layerByIso = {};
    let arrowLayers = [];
    let initialized = false;
    const GEOJSON_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';

    const producerStyle = {
        fillColor: '#c9a06a',
        fillOpacity: 0.72,
        color: '#a67c3d',
        weight: 2,
    };

    const defaultStyle = {
        fillColor: '#e0dcd4',
        fillOpacity: 0.92,
        color: '#b5aea0',
        weight: 1,
    };

    const hoverStyle = {
        fillColor: '#d4a574',
        fillOpacity: 0.88,
        color: '#b86b24',
        weight: 2.5,
    };

    const productHighlightStyle = {
        fillColor: '#e8b878',
        fillOpacity: 0.92,
        color: '#9e5d1f',
        weight: 3,
    };

    function getIsoCode(props) {
        if (!props) return null;
        const code = (props.ISO_A3 || props.ADM0_A3 || props.iso_a3 || props.ISO_A2 || props.iso_a2 || '').toUpperCase();
        return code || null;
    }

    function toLatLng(coord) {
        return [coord[1], coord[0]];
    }

    function clearArrows() {
        arrowLayers.forEach(layer => {
            if (map && layer) map.removeLayer(layer);
        });
        arrowLayers = [];
    }

    function isOverProducerCountry(clientX, clientY) {
        const el = document.elementFromPoint(clientX, clientY);
        if (!el) return false;
        for (const iso of Object.keys(layerByIso)) {
            if (!SUPPLY_CHAINS[iso]) continue;
            const layer = layerByIso[iso];
            const path = layer._path;
            if (path && (path === el || path.contains(el))) return true;
        }
        return false;
    }

    function clearHoverState() {
        clearArrows();
        Object.keys(layerByIso).forEach(function(iso) {
            if (SUPPLY_CHAINS[iso]) {
                layerByIso[iso].setStyle(producerStyle);
                layerByIso[iso].closeTooltip();
            }
        });
    }

    function drawArrows(fromIso, toIsos) {
        clearArrows();
        const from = CENTROIDS[fromIso];
        const toList = toIsos.filter(iso => CENTROIDS[iso]);
        if (!from || !toList.length) return;

        const arrowColor = '#b86b24';
        const arrowWeight = 2;

        toList.forEach((toIso) => {
            const to = CENTROIDS[toIso];
            const fromLatLng = toLatLng(from);
            const toLatLng_ = toLatLng(to);

            const line = L.polyline([fromLatLng, toLatLng_], {
                color: arrowColor,
                weight: arrowWeight,
                opacity: 0.85,
                interactive: false,
            });
            map.addLayer(line);
            arrowLayers.push(line);
        });
    }

    function getStyle(feature, isProducer) {
        return isProducer ? producerStyle : defaultStyle;
    }

    function initMap() {
        if (initialized) return;
        initialized = true;

        const container = document.getElementById('map');
        if (!container) return;

        map = L.map('map', {
            center: [20, 20],
            zoom: 2,
            zoomControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false,
            boxZoom: false,
            keyboard: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap, &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19,
        }).addTo(map);

        fetch(GEOJSON_URL)
            .then(res => res.json())
            .then(geojson => {
                countriesLayer = L.geoJSON(geojson, {
                    style: (feature) => {
                        const iso = getIsoCode(feature.properties);
                        const isProducer = iso && SUPPLY_CHAINS[iso];
                        return getStyle(feature, isProducer);
                    },
                    onEachFeature: (feature, layer) => {
                        const iso = getIsoCode(feature.properties);
                        if (iso) layerByIso[iso] = layer;
                        const data = iso && SUPPLY_CHAINS[iso];

                        if (!data) return;

                        layer.on({
                            mouseover: function() {
                                this.setStyle(hoverStyle);
                                this.bringToFront();
                                drawArrows(iso, data.buyers);
                                layer.bindTooltip(
                                    data.name + '<br>' + data.minerals.join(', '),
                                    {
                                        direction: 'top',
                                        className: 'map-tooltip',
                                        offset: [0, -5],
                                        sticky: false,
                                    }
                                ).openTooltip();
                            },
                            mouseout: function() {
                                clearHoverState();
                            },
                        });
                    },
                }).addTo(map);

                map.getContainer().addEventListener('mouseleave', clearHoverState);

                map.on('mousemove', function(e) {
                    if (!isOverProducerCountry(e.originalEvent.clientX, e.originalEvent.clientY)) {
                        clearHoverState();
                    }
                });
            })
            .catch(err => {
                console.error('Failed to load map data:', err);
                container.innerHTML = '<p class="map-error">Unable to load map. Please check your connection.</p>';
            });
    }

    function highlightProductCountries(isoCodes) {
        Object.keys(layerByIso).forEach(iso => {
            const layer = layerByIso[iso];
            const isProducer = SUPPLY_CHAINS[iso];
            const highlight = isoCodes && isoCodes.indexOf(iso) >= 0;
            if (highlight && isProducer) {
                layer.setStyle(productHighlightStyle);
                layer.bringToFront();
            } else if (isProducer) {
                layer.setStyle(producerStyle);
            }
        });
    }

    window.MineralSenseMap = {
        init: initMap,
        ensureInit: function() {
            initMap();
            if (map) setTimeout(() => map.invalidateSize(), 150);
        },
        highlightProductCountries: highlightProductCountries,
        resetProductHighlight: function() {
            Object.keys(layerByIso).forEach(iso => {
                const layer = layerByIso[iso];
                if (SUPPLY_CHAINS[iso]) layer.setStyle(producerStyle);
            });
        },
    };
})();
