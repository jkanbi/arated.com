const WP_API_BASE = 'https://hub.arated.com/wp-json/wp/v2/';

// Embedded markdown content for local file access
const embeddedMarkdown = {
    'about-us': `# About Us

- [Company](#/company)
- [Our Mission](#/mission)
- [Privacy Policy](#/privacy-policy)
- [Carbon Emissions](#/carbon-emissions)
- [Affilate Activity](#/affilate-activity-disclosure)`,
    
    'contact-us': `# Contact Us

## Get in Touch

We'd love to hear from you! Here are the different ways you can reach us:

### 📍 Visit Us

**A Rated House**  
11 Sunnymead Road  
London, NW9 8BT  
United Kingdom

<div class="map-container">
  <iframe 
    width="100%" 
    height="300" 
    frameborder="0" 
    scrolling="no" 
    marginheight="0" 
    marginwidth="0" 
    src="https://www.openstreetmap.org/export/embed.html?bbox=-0.2458,51.5800,-0.2408,51.5850&amp;layer=mapnik&amp;marker=51.5825,-0.2433"
    style="border: 1px solid #ccc; border-radius: 8px;">
  </iframe>
  <br/>
  <small>
    <a href="https://www.openstreetmap.org/?mlat=51.5825&amp;mlon=-0.2433#map=16/51.5825/-0.2433" target="_blank">
      View Larger Map
    </a>
  </small>
</div>

### 📞 Call Us

**[+44 020 8123 4411](tel:+4402081234411)**



### 🕒 Business Hours

Monday - Friday: 9:00 AM - 6:00 PM  
Saturday: 10:00 AM - 4:00 PM  
Sunday: Closed

`,
    
    'quicklinks': `# Quicklinks

- [Club](#/club)
- [Energy](#/energy)
- [Tesla](#/tesla)
- [Finance](#/finance)
- [MyBoiler.com](https://myboiler.com/)`,
    
    'epc-checklist': `# EPC Checklist

This is the EPC checklist content.`,
    
    'test-page': `# Test Page

This is a test page for development purposes.`
};

// Utility function to decode HTML entities
function decodeHtmlEntities(str) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
}

// Create search box with proper CSS classes instead of inline styles
function createSearchBox() {
    return `
<div class="search-container">
  <form role="search" method="get" action="/" class="search-form">
    <div class="search-input-container">
      <input 
        type="search" 
        name="s" 
        id="search-input"
        placeholder="Search..." 
        class="search-input"
        aria-label="Search content"
      >
      <button 
        type="submit" 
        id="search-button"
        class="search-button"
        aria-label="Search"
      >
        Go
      </button>
    </div>
  </form>
  <div id="search-results" class="search-results"></div>
</div>
    `;
}

// Enhanced search function with better error handling
async function searchPosts(query) {
    try {
        const response = await fetch(`${WP_API_BASE}search?search=${encodeURIComponent(query)}&subtype=post,page&per_page=10`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const results = await response.json();
        return results;
    } catch (error) {
        console.error('Error searching posts:', error);
        return [];
    }
}

// Improved search results display with better accessibility
function displaySearchResults(results) {
    const resultsDiv = document.getElementById('search-results');
    
    if (!results.length) {
        resultsDiv.innerHTML = '<p class="no-results">No results found. Try different keywords.</p>';
        return;
    }
    
    const html = results.map((result, index) => `
        <article class="search-result" role="article">
            <h3><a href="#/${result.type}/${result.id}" class="search-result-link">${decodeHtmlEntities(result.title)}</a></h3>
            ${result.excerpt ? `<p class="search-excerpt">${decodeHtmlEntities(result.excerpt)}</p>` : ''}
            <div class="search-meta">
                ${result.date ? `<time class="search-date" datetime="${result.date}">
                    ${new Date(result.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>` : ''}
                <span class="search-type">${result.type === 'post' ? 'Article' : 'Page'}</span>
            </div>
        </article>
    `).join('');
    
    resultsDiv.innerHTML = html;
}

// Function to load markdown content with fallback
async function loadMarkdownContent(slug) {
    try {
        // First try to fetch from server (works with live server)
        const response = await fetch(`/pages/${slug}.md`);
        if (response.ok) {
            return await response.text();
        }
    } catch (error) {
        console.log('Server fetch failed, trying embedded content...');
    }
    
    // Fallback to embedded content (works without live server)
    if (embeddedMarkdown[slug]) {
        console.log('Using embedded markdown content for:', slug);
        return embeddedMarkdown[slug];
    }
    
    throw new Error(`Markdown content not found for: ${slug}`);
}

// Function to load HTML content
async function loadHtmlContent(slug) {
    try {
        const response = await fetch(`/pages/${slug}.html`);
        if (response.ok) {
            return await response.text();
        }
        throw new Error(`HTML file not found: ${slug}.html`);
    } catch (error) {
        console.error('Error loading HTML:', error);
        throw error;
    }
}

// Enhanced render function with better error handling and loading states
async function render() {
    const path = location.hash.replace('#', '') || '/';
    const appDiv = document.getElementById('app');

    // Show loading state
    appDiv.innerHTML = '<div class="loading">Loading...</div>';

    try {
        // Handle home page with search
        if (path === '/') {
            appDiv.innerHTML = createSearchBox();
            document.title = 'ARated.com - Accelerating Sustainability & Net Zero';

            // Add search functionality with debouncing
            const searchInput = document.getElementById('search-input');
            const searchButton = document.getElementById('search-button');
            let searchTimeout;

            const performSearch = async () => {
                const query = searchInput.value.trim();
                if (query) {
                    const results = await searchPosts(query);
                    displaySearchResults(results);
                }
            };

            searchButton.addEventListener('click', (e) => {
                e.preventDefault();
                performSearch();
            });
            
            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(performSearch, 500); // Debounce search
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    performSearch();
                }
            });

            return;
        }

        // Handle post pages
        if (path.startsWith('/post/')) {
            const contentId = path.split('/')[2];
            console.log('Attempting to load post with ID:', contentId);
            
            try {
                const response = await fetch(`${WP_API_BASE}posts/${contentId}`);
                
                if (response.status === 404) {
                    console.log('Post not found, attempting to load as page with ID:', contentId);
                    // If post fetch returns 404, try fetching as a page
                    const pageResponse = await fetch(`${WP_API_BASE}pages/${contentId}`);
                    if (!pageResponse.ok) {
                         throw new Error(`HTTP error loading page! ${pageResponse.status} ${pageResponse.statusText}`);
                    }
                    const page = await pageResponse.json();
                     appDiv.innerHTML = `
                        <article class="page">
                            <h1>${decodeHtmlEntities(page.title.rendered)}</h1>
                            <div class="page-content">${page.content.rendered}</div>
                        </article>
                    `;
                    document.title = decodeHtmlEntities(page.title.rendered) + ' - ARated.com';
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error loading post! ${response.status} ${response.statusText}`);
                }
                
                const post = await response.json();
                appDiv.innerHTML = `
                    <article class="post">
                        <h1>${decodeHtmlEntities(post.title.rendered)}</h1>
                        <div class="post-content">${post.content.rendered}</div>
                    </article>
                `;
                document.title = decodeHtmlEntities(post.title.rendered) + ' - ARated.com';
            } catch (error) {
                console.error('Error fetching content:', error);
                appDiv.innerHTML = `<div class="error-message"><h1>Error loading content</h1><p>${error.message}</p></div>`;
                document.title = 'Error - ARated.com';
            }
            return;
        }

        // Handle page loading by ID (from search results)
        if (path.startsWith('/page/')) {
            const pageId = path.split('/')[2];
             console.log('Attempting to load page with ID:', pageId);
            try {
                const response = await fetch(`${WP_API_BASE}pages/${pageId}`);
                 if (!response.ok) {
                     throw new Error(`HTTP error loading page! ${response.status} ${response.statusText}`);
                }
                const page = await response.json();
                appDiv.innerHTML = `
                    <article class="page">
                        <h1>${decodeHtmlEntities(page.title.rendered)}</h1>
                        <div class="page-content">${page.content.rendered}</div>
                    </article>
                `;
                document.title = decodeHtmlEntities(page.title.rendered) + ' - ARated.com';
            } catch (error) {
                console.error('Error fetching page:', error);
                appDiv.innerHTML = `<div class="error-message"><h1>Error loading page</h1><p>${error.message}</p></div>`;
                document.title = 'Error - ARated.com';
            }
            return;
        }

        // Handle other pages
        console.log('Current path:', path, 'Available routes:', Object.keys(routes));
        const route = routes[path];
        if (!route) {
            appDiv.innerHTML = '<div class="error-message"><h1>404 Not Found</h1><p>The page you are looking for does not exist.</p></div>';
            document.title = '404 Not Found - ARated.com';
            return;
        }

        if (route.source === 'markdown') {
            // Load markdown content with fallback
            try {
                const markdown = await loadMarkdownContent(route.slug);
                // Configure marked to allow HTML
                marked.setOptions({
                    breaks: true,
                    gfm: true
                });
                // Convert markdown to HTML
                const html = marked.parse(markdown);
                appDiv.innerHTML = `
                    <article class="page">
                        <div class="page-content">${html}</div>
                    </article>
                `;
                
                document.title = route.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' - ARated.com';
            } catch (error) {
                console.error('Error loading markdown:', error);
                appDiv.innerHTML = `<div class="error-message"><h1>Error loading page</h1><p>${error.message}</p></div>`;
                document.title = 'Error - ARated.com';
            }
        } else if (route.source === 'html') {
            // Load HTML content
            try {
                const html = await loadHtmlContent(route.slug);
                appDiv.innerHTML = `
                    <article class="page">
                        <div class="page-content">${html}</div>
                    </article>
                `;
                
                document.title = route.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' - ARated.com';
            } catch (error) {
                console.error('Error loading HTML:', error);
                appDiv.innerHTML = `<div class="error-message"><h1>Error loading page</h1><p>${error.message}</p></div>`;
                document.title = 'Error - ARated.com';
            }
        } else {
            // Load WordPress content
            const response = await fetch(`${WP_API_BASE}pages?slug=${route.slug}`);
            if (!response.ok) {
                throw new Error(`HTTP error loading WordPress page! ${response.status} ${response.statusText}`);
            }
            
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
                appDiv.innerHTML = '<div class="error-message"><h1>Page Not Found</h1><p>The requested page could not be found.</p></div>';
                document.title = 'Page Not Found - ARated.com';
            }
        }
    } catch (error) {
        console.error('Error loading content:', error);
        appDiv.innerHTML = `<div class="error-message"><h1>Error loading page</h1><p>${error.message}</p></div>`;
        document.title = 'Error - ARated.com';
    }
}

// Initialize the app
window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render); 