// Navigation menu HTML structure
const navigationMenu = `
    <nav id="nav-menu" class="nav-menu hidden">
        <div class="grid-menu">
            <a href="#/homes" class="grid-item">
                <svg class="grid-icon" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                <span>Homes</span>
            </a>
            <a href="#/epc" class="grid-item">
                <svg class="grid-icon" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                <span>EPC</span>
            </a>
            <a href="#/investments" class="grid-item">
                <svg class="grid-icon" viewBox="0 0 24 24">
                    <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM11 7h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
                </svg>
                <span>Investments</span>
            </a>
            <a href="#/calculators" class="grid-item">
                <svg class="grid-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-calculator">
  <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
  <path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
</svg>
                <span>Calculators</span>
            </a>
            <a href="#/misc" class="grid-item">
                <svg class="grid-icon" viewBox="0 0 24 24">
                    <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM11 7h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
                </svg>
                <span>Misc</span>
            </a>
            <a href="#/renewables" class="grid-item">
				<svg class="grid-icon" viewBox="0 0 24 24">
				    <path d="M12 3c-3.87 0-7 3.13-7 7 0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#4CAF50"/>
				</svg>
                <span>Renewables</span>
            </a>
        </div>
    </nav>
`;

// Function to initialize navigation
function initializeNavigation() {
    const rightHeaderItems = document.querySelector('.right-header-items');
    if (rightHeaderItems) {
        rightHeaderItems.insertAdjacentHTML('beforeend', navigationMenu);
    }
}

// Menu toggle functionality
function toggleMenu() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('hidden');
}

// Close menu when clicking outside
function setupMenuClickHandlers() {
    document.addEventListener('click', (e) => {
        const navMenu = document.getElementById('nav-menu');
        const dotsMenu = document.querySelector('.dots-menu');
        
        // Close menu if clicking outside OR if clicking on a menu item
        if ((!navMenu.classList.contains('hidden') && !navMenu.contains(e.target) && !dotsMenu.contains(e.target)) || 
            (e.target.closest('.grid-item'))) {
            navMenu.classList.add('hidden');
        }
    });
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    setupMenuClickHandlers();
}); 