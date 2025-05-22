const WP_API_BASE = 'https://myboiler.com/wp-json/wp/v2/';

const routes = {
    '/': 'home',
    '/homes': 'homes',
    '/epc': 'epc',
    '/investments': 'investments',
    '/about-us': 'about-us',
    '/carbon-emissions': 'carbon-emissions',
    '/mission': 'mission',
    '/privacy-policy': 'privacy-policy',
    '/affilate-activity-disclosure': 'affilate-activity-disclosure',
    '/club': 'club',
    '/energy': 'energy',
    '/tesla': 'tesla',
    '/finance': 'finance'
};

function decodeHtmlEntities(str) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
}

function createSearchBox() {
    return `
        <div class="search-container">
            <div class="search-box">
                <input type="text" id="search-input" placeholder="Search">
                <button id="search-button">GO</button>
                <button id="reset-button" class="hidden">RESET</button>
            </div>
            <div id="search-results"></div>
        </div>
    `;
}

async function searchPosts(query) {
    try {
        const response = await fetch(`${WP_API_BASE}search?search=${encodeURIComponent(query)}&subtype=post&per_page=10`);
        const results = await response.json();
        return results;
    } catch (error) {
        console.error('Error searching posts:', error);
        return [];
    }
}

function displaySearchResults(results) {
    const resultsDiv = document.getElementById('search-results');
    const searchContainer = document.querySelector('.search-container');
    const resetButton = document.getElementById('reset-button');
    
    if (!results.length) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
        searchContainer.style.marginTop = '20vh';
        resetButton.classList.add('hidden');
    } else {
        searchContainer.style.marginTop = '2rem';
        resetButton.classList.remove('hidden');
        const html = results.map(result => `
            <div class="search-result">
                <h3><a href="#/post/${result.id}">${decodeHtmlEntities(result.title)}</a></h3>
                ${result.excerpt ? `<p>${decodeHtmlEntities(result.excerpt)}</p>` : ''}
                <div class="search-meta">
                    ${result.date ? `<span class="search-date">${new Date(result.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</span>` : ''}
                    ${result.type === 'post' ? '<span class="search-type">Article</span>' : ''}
                </div>
            </div>
        `).join('');
        resultsDiv.innerHTML = html;
    }
}

async function render() {
    const path = location.hash.replace('#', '') || '/';
    const appDiv = document.getElementById('app');

    // Handle home page with search
    if (path === '/') {
        appDiv.innerHTML = createSearchBox();
        document.title = 'ARated.com - Find the Best AR Apps';

        // Add search functionality
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        const resetButton = document.getElementById('reset-button');

        const performSearch = async () => {
            const query = searchInput.value.trim();
            if (query) {
                const results = await searchPosts(query);
                displaySearchResults(results);
            }
        };

        const resetSearch = () => {
            searchInput.value = '';
            document.getElementById('search-results').innerHTML = '';
            document.querySelector('.search-container').style.marginTop = '20vh';
            resetButton.classList.add('hidden');
        };

        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        resetButton.addEventListener('click', resetSearch);

        return;
    }

    // Handle post pages
    if (path.startsWith('/post/')) {
        const postId = path.split('/')[2];
        try {
            const response = await fetch(`${WP_API_BASE}posts/${postId}`);
            const post = await response.json();
            appDiv.innerHTML = `
                <article class="post">
                    <h1>${decodeHtmlEntities(post.title.rendered)}</h1>
                    <div class="post-content">${post.content.rendered}</div>
                </article>
            `;
            document.title = decodeHtmlEntities(post.title.rendered) + ' - ARated.com';
        } catch (error) {
            appDiv.innerHTML = '<h1>Error loading post</h1>';
            document.title = 'Error - ARated.com';
        }
        return;
    }

    // Handle other pages
    const slug = routes[path];
    if (!slug) {
        appDiv.innerHTML = '<h1>404 Not Found</h1>';
        document.title = '404 Not Found - ARated.com';
        return;
    }

    try {
        const response = await fetch(`${WP_API_BASE}pages?slug=${slug}`);
        const data = await response.json();
        if (data.length > 0) {
            const page = data[0];
            appDiv.innerHTML = `
                <article class="page">
                    <h1>${decodeHtmlEntities(page.title.rendered)}</h1>
                    <div class="page-content">${page.content.rendered}</div>
                </article>
            `;
            document.title = decodeHtmlEntities(page.title.rendered) + ' - ARated.com';
        } else {
            appDiv.innerHTML = '<h1>Page Not Found</h1>';
            document.title = 'Page Not Found - ARated.com';
        }
    } catch (error) {
        appDiv.innerHTML = '<h1>Error loading page</h1>';
        document.title = 'Error - ARated.com';
    }
}

// Initialize the app
window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render);

// Menu toggle functionality
function toggleMenu() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('hidden');
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const navMenu = document.getElementById('nav-menu');
    const dotsMenu = document.querySelector('.dots-menu');
    
    if (!navMenu.classList.contains('hidden') && !navMenu.contains(e.target) && !dotsMenu.contains(e.target)) {
        navMenu.classList.add('hidden');
    }
}); 