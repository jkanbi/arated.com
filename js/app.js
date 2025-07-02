const WP_API_BASE = 'https://hub.arated.com/wp-json/wp/v2/';

function decodeHtmlEntities(str) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
}

function createSearchBox() {
    return `
<div style="text-align: center; margin: 40px auto; padding: 60px 0;">
  <form role="search" method="get" action="/" style="display: inline-flex; align-items: center;">
    <input 
      type="search" 
      name="s" 
      id="search-input"
      placeholder="Search..." 
      style="
        height: 44px;
        width: 420px;
        max-width: 80%;
        padding: 0 18px;
        border: 1px solid #dfe1e5;
        border-radius: 10px 0 0 10px;
        font-size: 16px;
        background: #f7f7f7;
        box-sizing: border-box;
        outline: none;
      "
    >
    <button 
      type="submit" 
      id="search-button"
      style="
        height: 44px;
        width: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #777;
        border: 1px solid #444;
        border-left: none;
        border-radius: 0 10px 10px 0;
        font-size: 16px;
        color: #fff;
        box-sizing: border-box;
        cursor: pointer;
        font-weight: 500;
        letter-spacing: 0.5px;
        line-height: 0;
        padding: 0;
      "
      aria-label="Go"
    >
      Go
    </button>
  </form>
  <div id="search-results"></div>
</div>
    `;
}

async function searchPosts(query) {
    try {
        const response = await fetch(`${WP_API_BASE}search?search=${encodeURIComponent(query)}&subtype=post,page&per_page=10`);
        const results = await response.json();
        return results;
    } catch (error) {
        console.error('Error searching posts:', error);
        return [];
    }
}

function displaySearchResults(results) {
    const resultsDiv = document.getElementById('search-results');
    const resetButton = document.getElementById('reset-button');
    
    if (!results.length) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
        if (resetButton) resetButton.classList.add('hidden');
    } else {
        if (resetButton) resetButton.classList.remove('hidden');
        const html = results.map(result => `
            <div class="search-result">
                <h3><a href="#/${result.type}/${result.id}">${decodeHtmlEntities(result.title)}</a></h3>
                ${result.excerpt ? `<p>${decodeHtmlEntities(result.excerpt)}</p>` : ''}
                <div class="search-meta">
                    ${result.date ? `<span class="search-date">
                        ${new Date(result.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>` : ''}
                    ${result.type === 'post' ? '<span class="search-type">Article</span>' : ''}
                    ${result.type === 'page' ? '<span class="search-type">Page</span>' : ''}
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
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
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
                     console.error('HTTP error loading page with same ID!', pageResponse.status, pageResponse.statusText);
                     appDiv.innerHTML = `<h1>Error loading content: ${pageResponse.status} ${pageResponse.statusText}</h1>`;
                     document.title = 'Error - ARated.com';
                     return;
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
                console.error('HTTP error loading post!', response.status, response.statusText);
                appDiv.innerHTML = `<h1>Error loading post: ${response.status} ${response.statusText}</h1>`;
                document.title = 'Error - ARated.com';
                return;
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
            appDiv.innerHTML = '<h1>Error loading content</h1>';
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
                 console.error('HTTP error loading page!', response.status, response.statusText);
                 appDiv.innerHTML = `<h1>Error loading page: ${response.status} ${response.statusText}</h1>`;
                 document.title = 'Error - ARated.com';
                 return;
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
            appDiv.innerHTML = '<h1>Error loading page</h1>';
            document.title = 'Error - ARated.com';
        }
        return;
    }

    // Handle other pages
    const route = routes[path];
    if (!route) {
        appDiv.innerHTML = '<h1>404 Not Found</h1>';
        document.title = '404 Not Found - ARated.com';
        return;
    }

    try {
        if (route.source === 'markdown') {
            // Load markdown content
            const response = await fetch(`/pages/${route.slug}.md`);
            if (!response.ok) {
                throw new Error(`Failed to load markdown file: ${response.status}`);
            }
            const markdown = await response.text();
            // Convert markdown to HTML (you'll need to add a markdown parser library)
            const html = marked.parse(markdown);
            appDiv.innerHTML = `
                <article class="page">
                    <div class="page-content">${html}</div>
                </article>
            `;
            document.title = route.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' - ARated.com';
        } else {
            // Load WordPress content
            const response = await fetch(`${WP_API_BASE}pages?slug=${route.slug}`);
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
        }
    } catch (error) {
        console.error('Error loading content:', error);
        appDiv.innerHTML = '<h1>Error loading page</h1>';
        document.title = 'Error - ARated.com';
    }
}

// Initialize the app
window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render); 