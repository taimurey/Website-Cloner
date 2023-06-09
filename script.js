async function downloadWebsite(url) {
    // const corsProxy = 'http://localhost:8080/';
    const corsProxy = 'https://api.allorigins.win/raw?url=';


    try {
        // Fetch HTML content
        const htmlResponse = await fetch(corsProxy + url).catch((error) => {
            console.error("Error fetching HTML:", error);
        });
        const htmlText = await htmlResponse.text();

        // Parse HTML and extract CSS files
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const cssLinks = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));

        // Fetch and download CSS files
        for (const cssLink of cssLinks) {
            const cssHref = cssLink.getAttribute('href');
            const cssUrl = new URL(cssHref, url);
            const cssResponse = await fetch(corsProxy + cssUrl).catch((error) => {
                console.error("Error fetching CSS:", error);
            });
            const cssText = await cssResponse.text();

            // Download CSS file
            const fileName = cssUrl.pathname.split('/').pop();
            downloadFile(fileName, cssText, 'text/css');
        }

        // Download HTML file
        downloadFile('index.html', htmlText, 'text/html');
    } catch (error) {
        console.error("Error downloading website:", error);
    }
}

function downloadFile(fileName, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
}

// Button click event listener
const downloadButton = document.getElementById('downloadButton');
const urlInput = document.getElementById('urlInput');

downloadButton.addEventListener('click', () => {
    const url = urlInput.value;
    if (url) {
        downloadWebsite(url);
    } else {
        alert('Please enter a valid URL');
    }
});
