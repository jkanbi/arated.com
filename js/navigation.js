// Mobile navigation menu HTML structure
const mobileNavigationMenu = `
    <nav id="mobile-nav-menu" class="mobile-nav-menu hidden" role="navigation" aria-label="Mobile navigation">
        <div class="mobile-menu-items">
            <a href="#/renewables" class="mobile-nav-item">
                <span class="mobile-nav-text">Renewables</span>
                <svg class="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
            </a>
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
    
    // Start rotation after 4 seconds and add transition class
    setTimeout(() => {
        // Add transition class to all taglines for smooth transitions
        taglines.forEach(tagline => {
            tagline.classList.add('transition');
        });
        
        // Start rotating taglines every 4 seconds
        setInterval(() => {
            // Remove active class from current tagline
            taglines[currentIndex].classList.remove('active');
            
            // Move to next tagline
            currentIndex = (currentIndex + 1) % taglines.length;
            
            // Add active class to new tagline
            taglines[currentIndex].classList.add('active');
        }, 4000); // 4 seconds
    }, 4000); // Wait 4 seconds before starting rotation
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