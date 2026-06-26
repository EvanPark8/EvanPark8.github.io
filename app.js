// Tab navigation for MineralSense

document.addEventListener('DOMContentLoaded', () => {
    const rawHash = (window.location.hash || '#home').replace('#', '') || 'home';
    const tabFromHash = rawHash.startsWith('tab-') ? rawHash.slice(4) : rawHash;
    const initialTab = document.getElementById(`tab-${tabFromHash}`) ? tabFromHash : 'home';
    const tabs = document.querySelectorAll('.nav-tab');
    const panels = document.querySelectorAll('.tab-panel');
    const logo = document.querySelector('.logo');

    function switchTab(targetId) {
        // Update active tab button
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === targetId);
        });

        // Update active panel
        panels.forEach(panel => {
            panel.classList.toggle('active', panel.id === `tab-${targetId}`);
        });

        // Init map when first viewing map tab
        if (targetId === 'map' && window.MineralSenseMap) {
            window.MineralSenseMap.ensureInit();
        }
        window.history.replaceState(null, '', '#' + targetId);
    }

    // Initial tab from hash
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const initTabBtn = document.querySelector(`.nav-tab[data-tab="${initialTab}"]`);
    const initPanel = document.getElementById(`tab-${initialTab}`);
    if (initTabBtn) initTabBtn.classList.add('active');
    if (initPanel) initPanel.classList.add('active');
    if (initialTab === 'map' && window.MineralSenseMap) setTimeout(() => window.MineralSenseMap.ensureInit(), 100);

    // Nav tab clicks
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });

    // Logo click -> Home
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('home');
        });
    }

    // CTA buttons
    document.querySelectorAll('.cta-button, .material-footprint-card').forEach(btn => {
        const tab = btn.dataset.tab;
        if (tab) {
            btn.addEventListener('click', () => switchTab(tab));
        }
    });

    const productExplanationEl = document.getElementById('product-explanation');
    const mapClickInstructionEl = document.getElementById('map-click-instruction');
    const mapInstructionTextEl = mapClickInstructionEl?.querySelector('p');
    const productInstructions = {
        'ev-battery': 'Click on a highlighted country to see which battery mineral connects it to the EV supply chain, why it matters, and what questions responsible sourcing should ask.',
        'solar-panel': 'Click on a highlighted country to see which material connects it to solar panels, why it matters, and what questions responsible supply chains should ask.',
        'wind-turbine': 'Click on a highlighted country to see which material connects it to wind turbines, why it matters, and what questions responsible supply chains should ask.',
        'power-grid': 'Click on a highlighted country to see which material connects it to power grids, why it matters, and what questions responsible supply chains should ask.',
    };
    const productExplanations = {
        'ev-battery': `
            <div class="product-explanation-header">
                <span class="product-explanation-kicker">Product context</span>
                <h3>EV Battery</h3>
            </div>
            <p>An EV battery may look like a clean technology when it is inside a car, but its journey begins much earlier, in lithium salt flats, cobalt mines, nickel regions, graphite supply chains, processing hubs, ports, factories, and recycling systems.</p>
            <p>These supply chains connect electric mobility to questions of water, land, labour, ecosystems, community rights, and global dependence.</p>
            <div class="product-explanation-grid">
                <div>
                    <h4>Key minerals</h4>
                    <ul>
                        <li><strong>Lithium</strong> helps the battery store and release energy.</li>
                        <li><strong>Nickel</strong> helps some batteries store more energy.</li>
                        <li><strong>Cobalt</strong> is used in some batteries for stability and performance.</li>
                        <li><strong>Graphite</strong> is used in battery anodes.</li>
                    </ul>
                </div>
                <div class="product-question">
                    <h4>Question</h4>
                    <p>How can electric mobility reduce emissions without shifting environmental and social costs to the places that supply its minerals?</p>
                </div>
            </div>
        `,
        'solar-panel': `
            <div class="product-explanation-header">
                <span class="product-explanation-kicker">Product context</span>
                <h3>Solar Panel Supply Chain</h3>
            </div>
            <p>The highlighted countries show some of the key places connected to solar panel materials and manufacturing.</p>
            <p>A solar panel may look clean and simple on a rooftop or solar farm, but its journey begins much earlier, with quartz and silicon processing, silver and copper mining, aluminium frames, glass production, factories, ports, and installation sites.</p>
            <p>These supply chains connect solar energy to questions of mining, energy use in manufacturing, land, labour, processing concentration, recycling, and local environmental impacts.</p>
            <div class="product-explanation-grid">
                <div>
                    <h4>Key materials</h4>
                    <ul>
                        <li><strong>Silicon</strong> is the main material used in most solar cells.</li>
                        <li><strong>Silver</strong> helps conduct electricity inside the panel.</li>
                        <li><strong>Copper</strong> is used in wiring and electrical connections.</li>
                        <li><strong>Aluminium</strong> is used in frames and mounting structures.</li>
                    </ul>
                </div>
                <div class="product-question">
                    <h4>Question</h4>
                    <p>How can solar energy grow quickly while making its supply chains cleaner, fairer, and more resilient?</p>
                </div>
            </div>
        `,
        'wind-turbine': `
            <div class="product-explanation-header">
                <span class="product-explanation-kicker">Product context</span>
                <h3>Wind Turbine Supply Chain</h3>
            </div>
            <p>Wind turbines produce clean electricity, but their supply chains depend on minerals, metals, manufacturing hubs, and large infrastructure systems.</p>
            <p>The highlighted countries show some of the key places connected to wind turbine materials and manufacturing.</p>
            <p>A wind turbine may look like a clean energy machine in the landscape or at sea, but its journey begins much earlier with mining, metal processing, magnet production, steelmaking, ports, factories, installation sites, and future recycling systems.</p>
            <p>These supply chains connect wind energy to questions of mining, land use, labour, biodiversity, processing concentration, manufacturing capacity, and circularity.</p>
            <div class="product-explanation-grid">
                <div>
                    <h4>Key materials</h4>
                    <ul>
                        <li><strong>Rare earths</strong> are used in powerful magnets in some wind turbine designs.</li>
                        <li><strong>Copper</strong> is used in generators, wiring, cables, and grid connections.</li>
                        <li><strong>Steel</strong> is used in towers, foundations, and major structural parts.</li>
                        <li><strong>Zinc</strong> helps protect steel from corrosion, especially in harsh weather and offshore conditions.</li>
                    </ul>
                </div>
                <div class="product-question">
                    <h4>Question</h4>
                    <p>How can wind energy expand while making its material supply chains more responsible, resilient, and circular?</p>
                </div>
            </div>
        `,
        'power-grid': `
            <div class="product-explanation-header">
                <span class="product-explanation-kicker">Product context</span>
                <h3>Power Grid Supply Chain</h3>
            </div>
            <p>The highlighted countries show some of the key places connected to the materials used in electricity grids.</p>
            <p>A power grid may look like wires, towers, substations, and transformers. But behind it are large supply chains for mining, metal processing, cable manufacturing, steelmaking, construction, maintenance, and recycling.</p>
            <p>As clean energy grows, electricity grids need to expand and modernise. This connects the energy transition to questions of mining, land use, industrial processing, community impacts, supply concentration, and material demand.</p>
            <div class="product-explanation-grid">
                <div>
                    <h4>Key materials</h4>
                    <ul>
                        <li><strong>Copper</strong> carries electricity through wires, cables, transformers, and substations.</li>
                        <li><strong>Aluminium</strong> is used in power lines because it is light and good at carrying electricity.</li>
                        <li><strong>Steel</strong> is used in towers, poles, substations, and other grid infrastructure.</li>
                        <li><strong>Zinc</strong> helps protect steel from rust and corrosion, especially in outdoor infrastructure.</li>
                    </ul>
                </div>
                <div class="product-question">
                    <h4>Question</h4>
                    <p>Can clean energy scale without building grid supply chains that create new environmental and social pressures elsewhere?</p>
                </div>
            </div>
        `,
    };

    function showProductExplanation(productId) {
        if (!productExplanationEl) return;
        const html = productExplanations[productId];
        if (!html) {
            productExplanationEl.hidden = true;
            productExplanationEl.innerHTML = '';
            return;
        }
        productExplanationEl.innerHTML = html;
        productExplanationEl.hidden = false;
        productExplanationEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    let activeProductCard = null;
    let productHighlightTimer = null;

    function clearProductSelection() {
        activeProductCard = null;
        if (productHighlightTimer) {
            clearTimeout(productHighlightTimer);
            productHighlightTimer = null;
        }
        document.querySelectorAll('.product-card').forEach(item => {
            item.classList.remove('product-card-active');
        });
        if (productExplanationEl) {
            productExplanationEl.hidden = true;
            productExplanationEl.innerHTML = '';
        }
        if (mapClickInstructionEl) mapClickInstructionEl.hidden = true;
        window.MineralSenseMap?.resetProductHighlight?.();
    }

    // Product map: click to highlight countries
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            if (window.MineralSenseMap) {
                window.MineralSenseMap.ensureInit();
                if (activeProductCard === card) {
                    clearProductSelection();
                    return;
                }
                const minerals = card.dataset.minerals;
                showProductExplanation(card.dataset.product);
                if (mapClickInstructionEl) {
                    if (mapInstructionTextEl) {
                        mapInstructionTextEl.textContent = productInstructions[card.dataset.product] || 'Click on a highlighted country to see why it matters to this product supply chain.';
                    }
                    mapClickInstructionEl.hidden = false;
                }
                if (minerals && window.MineralSenseMap.highlightProductCountries) {
                    activeProductCard = card;
                    document.querySelectorAll('.product-card').forEach(item => {
                        item.classList.toggle('product-card-active', item === card);
                    });
                    if (productHighlightTimer) clearTimeout(productHighlightTimer);
                    productHighlightTimer = setTimeout(() => {
                        window.MineralSenseMap.highlightProductCountries(minerals.split(','), card.dataset.product);
                        productHighlightTimer = null;
                    }, 200);
                }
            }
        });
    });
});
