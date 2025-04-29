document.addEventListener('click', () => {
    window.parent.document.getElementById('nav-menu').classList.add('hidden');
});




	// Get the current file name (e.g., "tesla-model-y-overview.html")
    const pathParts = window.location.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];

    // Remove the .html extension to get the slug
    let slug = fileName.replace('.html', '');
    
    // Remove the 'wp-' prefix if it exists
    if (slug.startsWith('wp-')) {
        slug = slug.substring(3); // Remove first 3 characters: 'w', 'p', '-'
    }

	// Remove all hyphens to form the title base
	const titleBase = slug.replace(/-/g, ' ');
	
	// Capitalize the first letter of each word
	const titleFormatted = titleBase.replace(/\b\w/g, char => char.toUpperCase());
	
	// Create the full page title
	const pageTitle = `${titleFormatted} - ARated.com`;
	
	// Check if a <title> tag exists
  		let titleTag = document.querySelector('head title');
  		if (!titleTag) {
    		titleTag = document.createElement('title');
    		document.head.appendChild(titleTag);
  		}
  		titleTag.textContent = pageTitle;
	
	 // Set the document title (this updates the <title> tag in <head>)
  	document.title = pageTitle;

    // Build the API URL using the slug
    const apiUrl = `https://myboiler.com/wp-json/wp/v2/pages?slug=${slug}`;

        async function fetchPageContent() {
            const contentDiv = document.getElementById('content');
            try {
                // Fetch page data from WordPress REST API using the page slug
                const response = await fetch(apiUrl);
                const pages = await response.json();

                // Check if the page exists
                if (pages.length === 0) {
                    contentDiv.innerHTML = '<div class="error">Page not found.</div>';
                    return;
                }

                // Get the first (and likely only) page
                const page = pages[0];

                // Render the page title and content
                contentDiv.innerHTML = `
                    <h1>${page.title.rendered}</h1>
                    <div>${page.content.rendered}</div>
                `;
            } catch (error) {
                console.error('Error fetching page:', error);
                contentDiv.innerHTML = '<div class="error">Failed to load content. Please try again later.</div>';
            }
        }

        // Call the function when the page loads
        window.onload = fetchPageContent(slug);