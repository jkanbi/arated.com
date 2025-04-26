/* The following is to get pages from WordPress using the API */
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const content = document.getElementById('page-content');
                content.innerHTML = `
                    <h1>${data.title.rendered}</h1>
                    <p class="meta">Published on: ${new Date(data.date).toLocaleDateString()}</p>
                    <div>${data.content.rendered}</div>
                `;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                document.getElementById('content').innerHTML = '<p>Error loading content. Please try again later.</p>';
            });