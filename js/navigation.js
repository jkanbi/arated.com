// Navigation menu HTML structure
const navigationMenu = `
    <nav id="nav-menu" class="nav-menu hidden" role="navigation" aria-label="Main navigation">
        <div class="grid-menu">
        
        	<a href="https://hub.arated.com" class="grid-item" target="_blank" rel="noopener">
					<svg class="grid-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					  <circle cx="12" cy="12" r="3"/>
					  <line x1="12" y1="1" x2="12" y2="7"/>
					  <line x1="12" y1="17" x2="12" y2="23"/>
					  <line x1="4.22" y1="4.22" x2="7.76" y2="7.76"/>
					  <line x1="16.24" y1="16.24" x2="19.78" y2="19.78"/>
					  <line x1="1" y1="12" x2="7" y2="12"/>
					  <line x1="17" y1="12" x2="23" y2="12"/>
					  <line x1="4.22" y1="19.78" x2="7.76" y2="16.24"/>
					  <line x1="16.24" y1="7.76" x2="19.78" y2="4.22"/>
					</svg>
                <span>Pro Hub</span>
            </a>
        
            <a href="#/homes" class="grid-item">
                <svg class="grid-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                <span>Homes</span>
            </a>
            <a href="#/investments" class="grid-item">
				<svg class="grid-icon" width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				  <rect x="20" y="20" width="80" height="80" rx="10" fill="#0066cc" opacity="0.2"/>
				  <path d="M30,90 L50,50 L70,70 L90,30" stroke="#0066cc" stroke-width="8" fill="none" stroke-linecap="round"/>
				  <circle cx="30" cy="90" r="5" fill="#0066cc"/>
				  <circle cx="50" cy="50" r="5" fill="#0066cc"/>
				  <circle cx="70" cy="70" r="5" fill="#0066cc"/>
				  <circle cx="90" cy="30" r="5" fill="#0066cc"/>
				</svg>
                <span>Investments</span>
            </a>
            <a href="#/calculators" class="grid-item">
                <svg class="grid-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
  <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
  <path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
</svg>
                <span>Calculators</span>
            </a>
            <a href="#/energy" class="grid-item">
<svg class="grid-icon" width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect x="20" y="20" width="80" height="80" rx="10" fill="#fcc200" opacity="0.2"/>
  <path d="M40 30 L70 30 L50 60 L80 60 L40 90" stroke="#fcc200" stroke-width="8" fill="none" stroke-linecap="round"/>
</svg>
                <span>Energy</span>
            </a>
            <a href="#/renewables" class="grid-item">
				<svg class="grid-icon" viewBox="0 0 24 24" aria-hidden="true">
				    <path d="M12 3c-3.87 0-7 3.13-7 7 0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#4CAF50"/>
				</svg>
                <span>Renewables</span>
            </a>
            <a href="#/epc" class="grid-item">
                <svg class="grid-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                <span>EPC</span>
            </a>
            <a href="https://myboiler.com/?referrer=ARated.com" class="grid-item" target="_blank" rel="noopener">
				<svg class="grid-icon"
				   viewBox="0 0 56.926671 83.21725"
				   height="18.725769"
				   width="12.596496"
				   xmlns="http://www.w3.org/2000/svg"
				   aria-hidden="true">
				  <defs>
					<clipPath id="clipPath3696">
					  <path d="M 0,768 H 1024 V 0 H 0 Z" />
					</clipPath>
				  </defs>
				  <g clip-path="url(#clipPath3696)" transform="matrix(1.3333333,0,0,-1.3333333,-289.83012,554.92257)">
					<g transform="translate(260.0676,373.8517)">
					  <path
						style="fill:#33305e;fill-opacity:1;fill-rule:nonzero;stroke:none"
						d="m 0,0 c 0,23.646 -21.347,31.598 -21.347,43.392 0,1.149 -21.348,-18.138 -21.348,-43.392 0,-8.933 5.488,-16.579 13.273,-19.764 -0.11,0.113 -0.211,0.236 -0.319,0.352 -3.957,2.687 -6.554,7.222 -6.554,12.366 0,16.552 14.948,22.118 14.948,30.37 0,0.803 14.943,-12.699 14.943,-30.37 0,-5.539 -3.029,-10.364 -7.503,-12.944 -0.015,-0.011 -0.032,-0.022 -0.04,-0.039 C -5.809,-17.015 0,-9.184 0,0" />
					</g>
					<g transform="translate(238.5263,373.0451)">
					  <path
						style="fill:#4765ad;fill-opacity:1;fill-rule:nonzero;stroke:none"
						d="m 0,0 c 6.138,0 11.117,-4.974 11.117,-11.114 0,-3.185 -1.345,-6.045 -3.483,-8.07 4.474,2.58 7.503,7.405 7.503,12.945 0,17.671 -14.943,31.172 -14.943,30.369 0,-8.251 -14.947,-13.817 -14.947,-30.369 0,-5.144 2.597,-9.679 6.553,-12.366 -1.802,1.977 -2.918,4.598 -2.918,7.491 C -11.118,-4.974 -6.14,0 0,0" />
					</g>
				  </g>
				</svg>
                <span>MyBoiler</span>
            </a>
        </div>
    </nav>
`;

// Function to initialize navigation
function initializeNavigation() {
    try {
        const rightHeaderItems = document.querySelector('.right-header-items');
        if (rightHeaderItems) {
            rightHeaderItems.insertAdjacentHTML('beforeend', navigationMenu);
        } else {
            console.error('Navigation container not found');
        }
    } catch (error) {
        console.error('Error initializing navigation:', error);
    }
}

// Enhanced menu toggle functionality with accessibility
function toggleMenu() {
    try {
        const navMenu = document.getElementById('nav-menu');
        const dotsMenu = document.querySelector('.dots-menu');
        
        if (!navMenu || !dotsMenu) {
            console.error('Navigation elements not found');
            return;
        }
        
        const isHidden = navMenu.classList.contains('hidden');
        navMenu.classList.toggle('hidden');
        
        // Update ARIA attributes for accessibility
        dotsMenu.setAttribute('aria-expanded', !isHidden);
        
        // Focus management
        if (!isHidden) {
            // Menu is closing, return focus to trigger
            dotsMenu.focus();
        } else {
            // Menu is opening, focus first menu item
            const firstMenuItem = navMenu.querySelector('.grid-item');
            if (firstMenuItem) {
                firstMenuItem.focus();
            }
        }
    } catch (error) {
        console.error('Error toggling menu:', error);
    }
}

// Enhanced click handlers with better event delegation
function setupMenuClickHandlers() {
    try {
        document.addEventListener('click', (e) => {
            const navMenu = document.getElementById('nav-menu');
            const dotsMenu = document.querySelector('.dots-menu');
            
            if (!navMenu || !dotsMenu) return;
            
            // Close menu if clicking outside OR if clicking on a menu item
            if ((!navMenu.classList.contains('hidden') && !navMenu.contains(e.target) && !dotsMenu.contains(e.target)) || 
                (e.target.closest('.grid-item'))) {
                navMenu.classList.add('hidden');
                dotsMenu.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Add keyboard navigation support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const navMenu = document.getElementById('nav-menu');
                const dotsMenu = document.querySelector('.dots-menu');
                
                if (navMenu && !navMenu.classList.contains('hidden')) {
                    navMenu.classList.add('hidden');
                    dotsMenu.setAttribute('aria-expanded', 'false');
                    dotsMenu.focus();
                }
            }
        });
    } catch (error) {
        console.error('Error setting up menu handlers:', error);
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    setupMenuClickHandlers();
}); 