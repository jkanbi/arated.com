// Mobile navigation menu HTML structure
const mobileNavigationMenu = `
    <nav id="mobile-nav-menu" class="mobile-nav-menu hidden" role="navigation" aria-label="Mobile navigation">
        <div class="mobile-menu-items">
            <a href="https://hub.arated.com" class="mobile-nav-item" target="_blank" rel="noopener">
                <span class="mobile-nav-text">Pro Hub</span>
                <svg class="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
            </a>
            <a href="#/homes" class="mobile-nav-item">
                <span class="mobile-nav-text">Homes</span>
                <svg class="mobile-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
            </a>
            <a href="https://myboiler.com/?referrer=ARated.com" class="mobile-nav-item" target="_blank" rel="noopener">
                <span class="mobile-nav-text">MyBoiler</span>
                <svg class="mobile-nav-icon" viewBox="0 0 56.926671 83.21725" height="18.725769" width="12.596496" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <defs>
                        <clipPath id="clipPath3696">
                            <path d="M 0,768 H 1024 V 0 H 0 Z" />
                        </clipPath>
                    </defs>
                    <g clip-path="url(#clipPath3696)" transform="matrix(1.3333333,0,0,-1.3333333,-289.83012,554.92257)">
                        <g transform="translate(260.0676,373.8517)">
                            <path style="fill:#33305e;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 0,0 c 0,23.646 -21.347,31.598 -21.347,43.392 0,1.149 -21.348,-18.138 -21.348,-43.392 0,-8.933 5.488,-16.579 13.273,-19.764 -0.11,0.113 -0.211,0.236 -0.319,0.352 -3.957,2.687 -6.554,7.222 -6.554,12.366 0,16.552 14.948,22.118 14.948,30.37 0,0.803 14.943,-12.699 14.943,-30.37 0,-5.539 -3.029,-10.364 -7.503,-12.944 -0.015,-0.011 -0.032,-0.022 -0.04,-0.039 C -5.809,-17.015 0,-9.184 0,0" />
                        </g>
                        <g transform="translate(238.5263,373.0451)">
                            <path style="fill:#4765ad;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 0,0 c 6.138,0 11.117,-4.974 11.117,-11.114 0,-3.185 -1.345,-6.045 -3.483,-8.07 4.474,2.58 7.503,7.405 7.503,12.945 0,17.671 -14.943,31.172 -14.943,30.369 0,-8.251 -14.947,-13.817 -14.947,-30.369 0,-5.144 2.597,-9.679 6.553,-12.366 -1.802,1.977 -2.918,4.598 -2.918,7.491 C -11.118,-4.974 -6.14,0 0,0" />
                        </g>
                    </g>
                </svg>
            </a>
        </div>
    </nav>
`;

// Function to initialize mobile navigation
function initializeNavigation() {
    try {
        const header = document.querySelector('.header');
        if (header) {
            header.insertAdjacentHTML('afterend', mobileNavigationMenu);
            
            // Handle window resize to show/hide navigation based on viewport width
            window.addEventListener('resize', handleWindowResize);
            
            // Initial check
            handleWindowResize();
        } else {
            console.error('Header not found');
        }
    } catch (error) {
        console.error('Error initializing navigation:', error);
    }
}

// Handle window resize to toggle between desktop and mobile navigation
function handleWindowResize() {
    const mobileNav = document.querySelector('.mobile-nav');
    const desktopNav = document.querySelector('.desktop-nav');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    
    if (window.innerWidth <= 768) {
        // Mobile view - show mobile nav, hide desktop nav
        if (mobileNav) mobileNav.style.display = 'block';
        if (desktopNav) desktopNav.style.display = 'none';
        
        // Ensure mobile menu is hidden when switching to mobile
        if (mobileNavMenu) {
            mobileNavMenu.classList.add('hidden');
            const hamburgerMenu = document.querySelector('.hamburger-menu');
            if (hamburgerMenu) {
                hamburgerMenu.classList.remove('menu-open');
                hamburgerMenu.setAttribute('aria-expanded', 'false');
            }
        }
    } else {
        // Desktop view - show desktop nav, hide mobile nav
        if (mobileNav) mobileNav.style.display = 'none';
        if (desktopNav) desktopNav.style.display = 'flex';
        
        // Ensure mobile menu is hidden when switching to desktop
        if (mobileNavMenu) {
            mobileNavMenu.classList.add('hidden');
            const hamburgerMenu = document.querySelector('.hamburger-menu');
            if (hamburgerMenu) {
                hamburgerMenu.classList.remove('menu-open');
                hamburgerMenu.setAttribute('aria-expanded', 'false');
            }
        }
    }
}

// Enhanced menu toggle functionality with accessibility
function toggleMenu() {
    try {
        // Only allow menu toggle on mobile view
        if (window.innerWidth > 768) {
            return;
        }
        
        const mobileNavMenu = document.getElementById('mobile-nav-menu');
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        
        if (!mobileNavMenu || !hamburgerMenu) {
            console.error('Mobile navigation elements not found');
            return;
        }
        
        const isHidden = mobileNavMenu.classList.contains('hidden');
        
        if (isHidden) {
            // Opening menu
            mobileNavMenu.classList.remove('hidden');
            hamburgerMenu.classList.add('menu-open');
            hamburgerMenu.setAttribute('aria-expanded', 'true');
            document.body.classList.add('menu-open');
            
            // Focus first menu item after animation
            setTimeout(() => {
                const firstMenuItem = mobileNavMenu.querySelector('.mobile-nav-item');
                if (firstMenuItem) {
                    firstMenuItem.focus();
                }
            }, 100);
        } else {
            // Closing menu
            mobileNavMenu.classList.add('hidden');
            hamburgerMenu.classList.remove('menu-open');
            hamburgerMenu.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
            hamburgerMenu.focus();
        }
    } catch (error) {
        console.error('Error toggling menu:', error);
    }
}

// Enhanced click handlers with better event delegation
function setupMenuClickHandlers() {
    try {
        // Add direct click handler to hamburger menu
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        if (hamburgerMenu) {
            hamburgerMenu.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Hamburger clicked via event listener');
                toggleMenu();
            });
        }
        
        document.addEventListener('click', (e) => {
            const mobileNavMenu = document.getElementById('mobile-nav-menu');
            const hamburgerMenu = document.querySelector('.hamburger-menu');
            
            if (!mobileNavMenu || !hamburgerMenu) return;
            
            // Close menu if clicking outside OR if clicking on a menu item
            if ((!mobileNavMenu.classList.contains('hidden') && !mobileNavMenu.contains(e.target) && !hamburgerMenu.contains(e.target)) || 
                (e.target.closest('.mobile-nav-item'))) {
                if (!mobileNavMenu.classList.contains('hidden')) {
                    mobileNavMenu.classList.add('hidden');
                    hamburgerMenu.classList.remove('menu-open');
                    hamburgerMenu.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('menu-open');
                }
            }
        });
        
        // Add keyboard navigation support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const mobileNavMenu = document.getElementById('mobile-nav-menu');
                const hamburgerMenu = document.querySelector('.hamburger-menu');
                
                if (mobileNavMenu && !mobileNavMenu.classList.contains('hidden')) {
                    mobileNavMenu.classList.add('hidden');
                    hamburgerMenu.classList.remove('menu-open');
                    hamburgerMenu.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('menu-open');
                    hamburgerMenu.focus();
                }
            }
        });
    } catch (error) {
        console.error('Error setting up menu handlers:', error);
    }
}

// Tagline rotation functionality
function initializeTaglineRotation() {
    const taglines = document.querySelectorAll('.tagline');
    let currentIndex = 0;
    
    if (taglines.length === 0) return;
    
    // Hide all taglines except the first one
    taglines.forEach((tagline, index) => {
        if (index === 0) {
            tagline.classList.add('active');
        } else {
            tagline.classList.remove('active');
        }
    });
    
    // Rotate taglines every 10 seconds
    setInterval(() => {
        // Remove active class from current tagline
        taglines[currentIndex].classList.remove('active');
        
        // Move to next tagline
        currentIndex = (currentIndex + 1) % taglines.length;
        
        // Add active class to new tagline
        taglines[currentIndex].classList.add('active');
    }, 10000); // 10 seconds
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing navigation...');
    initializeNavigation();
    setupMenuClickHandlers();
    initializeTaglineRotation();
    console.log('Navigation initialized');
});

// Test function to verify JavaScript is working
console.log('Navigation.js loaded'); 