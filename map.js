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
        MOZ: [35.5, -18.5],
        PER: [-75.0, -9.5],
        MEX: [-102.0, 23.0],
        GIN: [-10.5, 10.5],
        BRA: [-51.0, -10.0],
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
        MOZ: { name: 'Mozambique', minerals: ['Graphite'], buyers: ['CHN', 'USA'] },
        PER: { name: 'Peru', minerals: ['Copper', 'Silver', 'Zinc'], buyers: ['CHN', 'USA', 'JPN'] },
        MEX: { name: 'Mexico', minerals: ['Silver'], buyers: ['USA', 'CHN'] },
        GIN: { name: 'Guinea', minerals: ['Bauxite'], buyers: ['CHN', 'USA'] },
        USA: { name: 'United States', minerals: ['Manufacturing', 'Recycling'], buyers: [] },
        BRA: { name: 'Brazil', minerals: ['Iron Ore'], buyers: ['CHN', 'USA', 'DEU'] },
        IND: { name: 'India', minerals: ['Steel', 'Aluminium'], buyers: [] },
    };

    const PRODUCT_COUNTRY_CARDS = {
        'ev-battery': {
            connectionLabel: 'Mineral connection',
            roleLabel: 'Role in the battery supply chain',
            COD: {
                name: 'Democratic Republic of the Congo',
                mineral: 'Cobalt',
                role: 'Major producer',
                why: [
                    'The DRC is one of the most important countries in the global cobalt supply chain. Cobalt is used in some EV batteries, which makes the country central to the clean energy transition.',
                    'But cobalt mining also raises serious questions about labour conditions, local communities, governance, and whether mineral-producing regions receive a fair share of the value they help create.',
                ],
                question: 'What would a fair cobalt supply chain look like for the people living closest to extraction?',
            },
            IDN: {
                name: 'Indonesia',
                mineral: 'Nickel',
                role: 'Major producer and processing hub',
                why: [
                    'Indonesia has become a major country for nickel, a mineral used in many EV batteries. This has created new economic opportunities and made Indonesia important to global battery supply chains.',
                    'At the same time, rapid nickel expansion can raise concerns around forests, pollution, coastal areas, workers, and nearby communities.',
                ],
                question: 'How can battery supply grow without putting local environments and communities at risk?',
            },
            CHL: {
                name: 'Chile',
                mineral: 'Lithium',
                role: 'Major producer',
                why: [
                    'Chile is an important source of lithium, especially from salt flat regions. Lithium is essential for most EV batteries, but extraction in dry regions can be closely connected to water use, fragile ecosystems, and local communities.',
                    'This makes Chile an important place for thinking about how battery supply chains should account for water and ecological limits.',
                ],
                question: 'How should clean technology supply chains account for water stress in dry regions?',
            },
            ARG: {
                name: 'Argentina',
                mineral: 'Lithium',
                role: 'Growing producer',
                why: [
                    'Argentina is part of a major lithium-producing region in South America. As lithium demand grows, new projects can bring investment and jobs, but also raise questions around water governance, local consent, and community benefit.',
                ],
                question: 'Who gets a voice in deciding how lithium is extracted?',
            },
            AUS: {
                name: 'Australia',
                mineral: 'Lithium and nickel',
                role: 'Major producer',
                why: [
                    'Australia is a major supplier of battery minerals and plays an important role in diversifying global supply. Its mining sector is often seen as more stable than many other regions, but extraction still raises questions around land, water, biodiversity, and Indigenous rights.',
                ],
                question: 'What does responsible mining look like in practice?',
            },
            CHN: {
                name: 'China',
                mineral: 'Graphite, lithium processing, cobalt processing, battery manufacturing',
                role: 'Major processing and manufacturing hub',
                why: [
                    'China is central to EV battery supply chains, not only because of minerals, but because of its major role in processing and battery manufacturing.',
                    'This shows that supply chain risk is not only about where minerals are mined. It is also about where they are refined, processed, and turned into battery components.',
                ],
                question: 'What happens when processing power is concentrated in a few places?',
            },
            MOZ: {
                name: 'Mozambique',
                mineral: 'Graphite',
                role: 'Growing producer',
                why: [
                    'Mozambique is becoming more visible in graphite supply chains. Graphite is essential for most EV battery anodes, even though it is often less discussed than lithium or cobalt.',
                    'As graphite demand grows, the key questions are about land use, local value creation, community benefit, and environmental safeguards.',
                ],
                question: 'Can mineral-producing countries capture more value locally, instead of only exporting raw materials?',
            },
        },
        'solar-panel': {
            connectionLabel: 'Material connection',
            roleLabel: 'Role in the solar supply chain',
            CHN: {
                name: 'China',
                mineral: 'Silicon processing, solar cells, modules, manufacturing',
                role: 'Major processing and manufacturing hub',
                why: [
                    'China plays a central role in solar panel supply chains. Many stages of solar manufacturing, including polysilicon, wafers, cells, and modules, are concentrated there.',
                    'This makes solar energy highly scalable, but also raises questions about supply chain concentration, labour standards, energy use in manufacturing, and global dependence on a few industrial hubs.',
                ],
                question: 'What happens when a clean energy technology depends heavily on one manufacturing system?',
            },
            CHL: {
                name: 'Chile',
                mineral: 'Copper',
                role: 'Major producer',
                why: [
                    'Copper is important for wiring, connections, and wider electricity systems that carry solar power. Chile is one of the key countries linked to global copper supply.',
                    'Copper mining can create economic value, but it can also raise questions about water use, land, ecosystems, and community participation.',
                ],
                question: 'How can solar expansion account for the places that supply its electrical materials?',
            },
            PER: {
                name: 'Peru',
                mineral: 'Copper and silver',
                role: 'Major producer',
                why: [
                    'Peru is connected to solar panel supply chains through copper and silver. These materials help panels conduct and move electricity.',
                    'Mining can support jobs and revenue, but it can also create tensions around land, water, local consent, and benefit-sharing.',
                ],
                question: 'Who benefits from the minerals that make renewable energy possible?',
            },
            MEX: {
                name: 'Mexico',
                mineral: 'Silver',
                role: 'Major producer',
                why: [
                    'Silver is used in many solar cells because it conducts electricity well. Mexico is an important country in global silver supply.',
                    'Even small amounts of silver inside each panel can become significant when solar deployment grows rapidly across the world.',
                ],
                question: 'How should we think about mineral demand when clean technologies scale up?',
            },
            GIN: {
                name: 'Guinea',
                mineral: 'Bauxite for aluminium',
                role: 'Raw material producer',
                why: [
                    'Aluminium is widely used in solar panel frames and mounting structures. Bauxite is the main ore used to produce aluminium, and Guinea is an important bauxite-producing country.',
                    'This connects solar panels to questions of land use, local development, mining governance, and whether raw material producers capture enough value.',
                ],
                question: 'Can countries that supply raw materials gain more from clean energy supply chains?',
            },
            AUS: {
                name: 'Australia',
                mineral: 'Bauxite, quartz/silica, and other mineral inputs',
                role: 'Mineral producer',
                why: [
                    'Australia is connected to solar panel supply chains through mineral inputs used in aluminium, glass, and silicon-based technologies.',
                    'Its role shows that solar supply chains are not only about final panel manufacturing. They also depend on upstream mining and material processing.',
                ],
                question: 'What does responsible sourcing look like before the panel reaches the factory?',
            },
            USA: {
                name: 'United States',
                mineral: 'Manufacturing, installation, recycling, supply chain diversification',
                role: 'Growing manufacturing and deployment hub',
                why: [
                    'The United States is important as a large solar market and a growing place for solar manufacturing and recycling efforts.',
                    'Its role highlights another side of the supply chain: not only where materials come from, but where panels are assembled, installed, maintained, and eventually recycled.',
                ],
                question: 'How can countries build solar supply chains that are both resilient and responsible?',
            },
        },
        'wind-turbine': {
            connectionLabel: 'Material connection',
            roleLabel: 'Role in the wind supply chain',
            CHN: {
                name: 'China',
                mineral: 'Rare earth processing, magnets, steel, wind manufacturing',
                role: 'Major processing and manufacturing hub',
                why: [
                    'China plays a central role in wind turbine supply chains, especially through rare earth processing, magnet production, and manufacturing capacity.',
                    'This makes wind energy easier to scale, but it also raises questions about supply chain concentration, environmental standards, labour conditions, and dependence on a few industrial hubs.',
                ],
                question: 'What happens when clean energy supply chains depend heavily on one manufacturing system?',
            },
            AUS: {
                name: 'Australia',
                mineral: 'Iron ore, rare earths, bauxite',
                role: 'Major mineral producer',
                why: [
                    'Australia is connected to wind turbine supply chains through minerals used in steel, aluminium, and some rare earth supply chains.',
                    'Its role shows that wind energy does not begin at the wind farm. It also depends on upstream mining, land use decisions, water management, and Indigenous rights.',
                ],
                question: 'What does responsible sourcing look like before a wind turbine reaches the factory?',
            },
            CHL: {
                name: 'Chile',
                mineral: 'Copper',
                role: 'Major producer',
                why: [
                    'Copper is important for wind turbines because it helps move electricity through generators, cables, and grid systems. Chile is one of the key countries connected to global copper supply.',
                    'Copper mining can support jobs and revenue, but it can also raise questions about water, land, ecosystems, and local participation.',
                ],
                question: 'How can renewable energy account for the places that supply its electrical materials?',
            },
            PER: {
                name: 'Peru',
                mineral: 'Copper and zinc',
                role: 'Major producer',
                why: [
                    'Peru is connected to wind turbine supply chains through copper and zinc. Copper helps carry electricity, while zinc is used to protect steel components from corrosion.',
                    'Mining can bring economic benefits, but it can also create tensions around land, water, local consent, and benefit-sharing.',
                ],
                question: 'Who benefits from the minerals that help generate clean electricity?',
            },
            BRA: {
                name: 'Brazil',
                mineral: 'Iron ore',
                role: 'Major raw material producer',
                why: [
                    'Steel is one of the main materials used in wind turbines, especially in towers, foundations, and structural parts. Brazil is an important iron ore producer, linking it to the steel behind wind infrastructure.',
                    'This connects wind energy to broader questions of mining impacts, industrial processing, land use, and local development.',
                ],
                question: 'Can large clean energy infrastructure be built without ignoring the impacts of its raw materials?',
            },
            ZAF: {
                name: 'South Africa',
                mineral: 'Manganese and iron ore',
                role: 'Raw material producer',
                why: [
                    'Manganese is used in steelmaking, and steel is central to wind turbine towers and structures. South Africa is one of the countries connected to this part of the supply chain.',
                    'This shows that even the most visible parts of a turbine depend on less visible mining and processing systems.',
                ],
                question: 'What hidden materials sit inside renewable energy infrastructure?',
            },
            USA: {
                name: 'United States',
                mineral: 'Wind manufacturing, deployment, rare earth mining, recycling',
                role: 'Manufacturing and deployment hub',
                why: [
                    'The United States is important as a large wind energy market and a growing site for manufacturing, supply chain diversification, and recycling efforts.',
                    'Its role highlights another part of the supply chain: not only where materials come from, but where turbines are assembled, installed, maintained, and eventually recycled.',
                ],
                question: 'How can countries build wind supply chains that are both secure and responsible?',
            },
            MMR: {
                name: 'Myanmar',
                mineral: 'Heavy rare earths',
                role: 'Rare earth source',
                why: [
                    'Some rare earth elements used in strong magnets can be linked to complex and sensitive mining regions. Myanmar has become important in parts of the rare earth supply chain.',
                    'This raises difficult questions about conflict sensitivity, transparency, environmental harm, and whether companies can properly trace where materials come from.',
                ],
                question: 'How should clean energy companies respond when key minerals come from high-risk regions?',
            },
        },
        'power-grid': {
            connectionLabel: 'Material connection',
            roleLabel: 'Role in the grid supply chain',
            CHL: {
                name: 'Chile',
                mineral: 'Copper',
                role: 'Major producer',
                why: [
                    'Copper is one of the most important materials for electricity grids. It is used in cables, transformers, substations, and wider power systems.',
                    'Chile is a key country connected to global copper supply. This makes it important for grid expansion, but copper mining can also raise questions around water use, land, ecosystems, and local participation.',
                ],
                question: 'How can grid expansion account for the places that supply its copper?',
            },
            PER: {
                name: 'Peru',
                mineral: 'Copper and zinc',
                role: 'Major producer',
                why: [
                    'Peru is connected to grid supply chains through copper and zinc. Copper helps move electricity, while zinc helps protect steel used in outdoor infrastructure.',
                    'Mining can bring jobs and revenue, but it can also create tensions around land, water, local consent, and how benefits are shared.',
                ],
                question: 'Who benefits from the minerals that make electricity systems possible?',
            },
            GIN: {
                name: 'Guinea',
                mineral: 'Bauxite for aluminium',
                role: 'Raw material producer',
                why: [
                    'Aluminium is widely used in power lines and grid infrastructure. Bauxite is the main ore used to produce aluminium, and Guinea is an important bauxite-producing country.',
                    'This connects grid expansion to questions of land use, local development, mining governance, and whether raw material producers capture enough value from global supply chains.',
                ],
                question: 'Can countries that supply raw materials gain more from the clean energy transition?',
            },
            AUS: {
                name: 'Australia',
                mineral: 'Iron ore, bauxite, copper',
                role: 'Mineral producer',
                why: [
                    'Australia is connected to grid supply chains through materials used in steel, aluminium, and electrical systems.',
                    'Its role shows that grid infrastructure does not begin with transmission lines. It begins with mines, processing systems, land decisions, water use, and long-term environmental responsibilities.',
                ],
                question: 'What does responsible sourcing look like before the electricity reaches the grid?',
            },
            BRA: {
                name: 'Brazil',
                mineral: 'Iron ore',
                role: 'Raw material producer',
                why: [
                    'Steel is used in transmission towers, poles, substations, and other parts of grid infrastructure. Brazil is an important iron ore producer, linking it to the steel behind electricity systems.',
                    'This connects the power grid to broader questions around mining impacts, industrial processing, land use, and local development.',
                ],
                question: 'Can large energy infrastructure be built without ignoring the impacts of its raw materials?',
            },
            CHN: {
                name: 'China',
                mineral: 'Aluminium, copper processing, steel, grid equipment manufacturing',
                role: 'Processing and manufacturing hub',
                why: [
                    'China plays a major role in processing materials and manufacturing equipment used in power systems.',
                    'This shows that grid supply chains are not only about where materials are mined. They are also about where materials are refined, processed, manufactured, and turned into cables, transformers, and other equipment.',
                ],
                question: 'What happens when key parts of grid supply chains are concentrated in a few manufacturing hubs?',
            },
            IND: {
                name: 'India',
                mineral: 'Steel, aluminium, grid equipment, deployment',
                role: 'Manufacturing and deployment hub',
                why: [
                    'India is expanding and modernising its electricity grid as energy demand grows and more renewable energy is added.',
                    'This makes India important not only as a user of grid materials, but also as a place where questions of energy access, infrastructure planning, land, affordability, and resilience come together.',
                ],
                question: 'How can grid expansion support both clean energy and fair energy access?',
            },
            USA: {
                name: 'United States',
                mineral: 'Copper, aluminium, steel, grid equipment, recycling',
                role: 'Deployment and manufacturing hub',
                why: [
                    'The United States is working to modernise ageing grid infrastructure and connect more renewable energy to the power system.',
                    'Its role highlights another part of the supply chain: not only where materials come from, but where grids are built, upgraded, maintained, and eventually recycled.',
                ],
                question: 'How can countries build grids that are resilient, affordable, and responsible?',
            },
        },
    };

    let map = null;
    let countriesLayer = null;
    let layerByIso = {};
    let arrowLayers = [];
    let initialized = false;
    let activeProductIsoCodes = null;
    let activeProductId = null;
    let selectedCountryIso = null;
    const GEOJSON_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';

    const producerStyle = {
        fillColor: '#c9a06a',
        fillOpacity: 0.58,
        color: '#8f642f',
        weight: 2,
    };

    const defaultStyle = {
        fillColor: '#d6cfc3',
        fillOpacity: 0.52,
        color: '#aeb9b7',
        weight: 1.15,
    };

    const hoverStyle = {
        fillColor: '#d58a3a',
        fillOpacity: 0.86,
        color: '#7a4519',
        weight: 3,
    };

    const productHighlightStyle = {
        fillColor: '#e6a85f',
        fillOpacity: 0.78,
        color: '#8a4f1d',
        weight: 2.8,
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
            layerByIso[iso].closeTooltip();
        });
        applyProductHighlight();
    }

    function isActiveProductCountry(iso) {
        return activeProductIsoCodes && activeProductIsoCodes.indexOf(iso) >= 0;
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

    function renderCountryInfoCard(iso) {
        const card = document.getElementById('country-info-card');
        if (!card || !activeProductId || !isActiveProductCountry(iso)) return;

        if (selectedCountryIso === iso && !card.hidden) {
            selectedCountryIso = null;
            card.hidden = true;
            card.innerHTML = '';
            applyProductHighlight();
            return;
        }

        const productData = PRODUCT_COUNTRY_CARDS[activeProductId];
        const countryData = productData && productData[iso];
        if (!countryData) {
            card.hidden = true;
            card.innerHTML = '';
            return;
        }

        selectedCountryIso = iso;
        applyProductHighlight();
        card.innerHTML = `
            <div class="country-info-header">
                <span class="country-info-kicker">Country connection</span>
                <h2>${countryData.name}</h2>
            </div>
            <div class="country-info-meta">
                <p><strong>${productData.connectionLabel || 'Material connection'}:</strong> ${countryData.mineral}</p>
                <p><strong>${productData.roleLabel || 'Role in the supply chain'}:</strong> ${countryData.role}</p>
            </div>
            <div class="country-info-body">
                <h3>Why it matters</h3>
                ${countryData.why.map(paragraph => `<p>${paragraph}</p>`).join('')}
            </div>
            <div class="country-info-question">
                <h3>Question</h3>
                <p>${countryData.question}</p>
            </div>
        `;
        card.hidden = false;
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
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
                            click: function() {
                                renderCountryInfoCard(iso);
                            },
                        });
                    },
                }).addTo(map);

                applyProductHighlight();
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

    function highlightProductCountries(isoCodes, productId) {
        activeProductIsoCodes = isoCodes || null;
        activeProductId = productId || null;
        selectedCountryIso = null;
        const card = document.getElementById('country-info-card');
        if (card) {
            card.hidden = true;
            card.innerHTML = '';
        }
        applyProductHighlight();
    }

    function applyProductHighlight() {
        Object.keys(layerByIso).forEach(iso => {
            const layer = layerByIso[iso];
            const isProducer = SUPPLY_CHAINS[iso];
            const highlight = activeProductIsoCodes && activeProductIsoCodes.indexOf(iso) >= 0;
            if (highlight && selectedCountryIso === iso) {
                layer.setStyle(hoverStyle);
                layer.bringToFront();
            } else if (highlight && isProducer) {
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
            activeProductIsoCodes = null;
            activeProductId = null;
            selectedCountryIso = null;
            Object.keys(layerByIso).forEach(iso => {
                const layer = layerByIso[iso];
                if (SUPPLY_CHAINS[iso]) layer.setStyle(producerStyle);
            });
            const card = document.getElementById('country-info-card');
            if (card) {
                card.hidden = true;
                card.innerHTML = '';
            }
        },
    };
})();
