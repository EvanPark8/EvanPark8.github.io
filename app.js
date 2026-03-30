// Tab navigation for MineSense

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
        if (targetId === 'map' && window.MineSenseMap) {
            window.MineSenseMap.ensureInit();
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
    if (initialTab === 'map' && window.MineSenseMap) setTimeout(() => window.MineSenseMap.ensureInit(), 100);

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
    document.querySelectorAll('.cta-button').forEach(btn => {
        const tab = btn.dataset.tab;
        if (tab) {
            btn.addEventListener('click', () => switchTab(tab));
        }
    });

    // Product map: hover to highlight countries
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (window.MineSenseMap) {
                window.MineSenseMap.ensureInit();
                const minerals = card.dataset.minerals;
                if (minerals && window.MineSenseMap.highlightProductCountries) {
                    setTimeout(() => window.MineSenseMap.highlightProductCountries(minerals.split(',')), 200);
                }
            }
        });
        card.addEventListener('mouseleave', () => {
            if (window.MineSenseMap && window.MineSenseMap.resetProductHighlight) {
                window.MineSenseMap.resetProductHighlight();
            }
        });
    });
});
