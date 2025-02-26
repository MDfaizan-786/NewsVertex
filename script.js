// ✅ Your GNews API Key (Keep it Secret)
const API_KEY = "b721d9c109be23e002c0b1d71e04171f"; // Replace with your actual API Key

// ✅ GNews API URL (Correct format)
const BASE_URL = "https://gnews.io/api/v4/search?lang=en&country=us&max=10&token=" + API_KEY;

// ✅ Load default news on page load (e.g., "India")
window.addEventListener("load", () => fetchNews("India"));

// ✅ Function to Reload the Page (if needed)
function reload() {
    window.location.reload();
}

// ✅ Fetch news articles from the GNews API
async function fetchNews(query) {
    try {
        // Construct API URL with the search query
        const url = `${BASE_URL}&q=${query}`;

        // Fetch the news data from API
        const res = await fetch(url);
        const data = await res.json();

        // Check if the API returned articles
        if (data.articles) {
            bindData(data.articles);
        } else {
            console.error("No articles found", data);
        }
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

// ✅ Bind the fetched news data to the UI
function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    // Clear previous news before displaying new ones
    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.image) return; // GNews API uses "image" instead of "urlToImage"

        // Clone the news card template
        const cardClone = newsCardTemplate.content.cloneNode(true);

        // Fill data into the card
        fillDataInCard(cardClone, article);

        // Append the card to the container
        cardsContainer.appendChild(cardClone);
    });
}

// ✅ Fill data into the cloned card template
function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    // Assign API data to HTML elements
    newsImg.src = article.image; // GNews API uses "image" field
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description || "No description available.";

    // Format the publication date
    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    // Display source name and date
    newsSource.innerHTML = `${article.source.name} · ${date}`;

    // Open the full article in a new tab when clicked
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// ✅ Handle navigation clicks (e.g., categories like Sports, Tech)
let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    
    // Remove previous active class
    curSelectedNav?.classList.remove("active");
    
    // Set new active class
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

// ✅ Handle search button click event
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;

    fetchNews(query);

    // Remove active class from previous selection
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
