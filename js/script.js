// Define jQuery selectors
let $companyInput = $("#company-input");
let $searchBtn = $("#search-btn");
let $resetBtn = $("#reset-btn");
let $searchHistory = $("#search-history");
let $stockPrice = $("#stock-price");
let $errorMessage = $("#error-message");
let $companyName = $("#company-name");
let $newsFeed = $("#news-feed");

// Define constants representing API info
const IEXCLOUD_SYMBOL_API_URL =
  "https://api.iextrading.com/1.0/ref-data/symbols";
const IEXCLOUD_PRICE_API_URL = "https://sandbox.iexapis.com/stable/stock/";
const IEXCLOUD_API_KEY = "Tsk_2d13159a4439423cb7fb707f85ac77c5";
const NEWS_API_URL = "https://newsapi.org/v2/everything";
const NEWS_API_KEY = "9a19e4ff6d4846d1b060f06b716e05a8";

// Define array containing keywords for news story search
let keywords = ["coronavirus", "covid", "pandemic"];

// Work with localStorage
let searchHistory =
  JSON.parse(window.localStorage.getItem("searchHistory")) || [];

// Show search history on first page view/page refresh
displaySearchHistory();

// Apply proper case to name
function formatName(name) {
  let formattedName = "";
  for (let i = 0; i < name.length; i++) {
    if (
      i === 0 ||
      name[i - 1] === " " ||
      name[i - 1] === "-" ||
      name[i - 1] === "."
    ) {
      formattedName += name[i].toUpperCase();
    } else {
      formattedName += name[i].toLowerCase();
    }
  }
  return formattedName;
}

// Add company name to search history if it's not already there
function updateSearchHistory(companyName) {
  if (!searchHistory.includes(companyName)) {
    searchHistory.push(companyName);
  }
  window.localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

// Show search history in left sidebar
function displaySearchHistory() {
  $searchHistory.empty();
  let listItems = "";
  for (let i = 0; i < searchHistory.length; i++) {
    listItems += `
      <li>
        <a>
          ${searchHistory[i]}
        </a>
      </li>`;
  }
  $searchHistory.append($.parseHTML(listItems));
}

// Remove all items from search history
function resetSearchHistory() {
  $searchHistory.empty();
  searchHistory = "";
  window.localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

// Show error message below form input if company stock symbol not found
function displayErrorMessage() {
  let errorMessage = "<p>Stock symbol not found</p>";
  $errorMessage.append($.parseHTML(errorMessage));
}

// Hide error message
function hideErrorMessage() {
  $errorMessage.empty();
}

// Get stock symbol from API and show content if found
function getStockSymbol(companyName) {
  $.ajax({
    url: IEXCLOUD_SYMBOL_API_URL,
    method: "GET"
  }).then(function(response) {
    for (let i = 0; i < response.length; i++) {
      if (response[i].name === companyName.toUpperCase()) {
        // Test
        console.log(response[i].symbol);

        updateSearchHistory(companyName);
        displaySearchHistory();
        displayCompanyName(companyName);
        getStockPrice(response[i].symbol);
        getNewsStories(companyName);
        return;
      }
    }
    displayErrorMessage();
    setTimeout(function() {
      hideErrorMessage();
    }, 1500);
  });
}

// Get stock price from API
function getStockPrice(stockSymbol) {
  $.ajax({
    url: `${IEXCLOUD_PRICE_API_URL}${stockSymbol}/price?token=${IEXCLOUD_API_KEY}`,
    method: "GET"
  }).then(function(response) {
    // Test
    console.log(response);

    displayStockPrice(response);
  });
}

// Show stock price beside company name
function displayStockPrice(stockPrice) {
  $stockPrice.text(`$${stockPrice}`);
}

// Show company name beside stock price
function displayCompanyName(companyName) {
  $companyName.text(companyName);
}

// Get news stories from API
function getNewsStories(companyName) {
  let searchParameters = "";
  for (let i = 0; i < keywords.length; i++) {
    searchParameters += `?q=${keywords[i]}&`;
  }
  $.ajax({
    url: `${NEWS_API_URL}${searchParameters}?q=${companyName}&apiKey=${NEWS_API_KEY}`,
    method: "GET"
  }).then(function(response) {
    displayNewsStories(response.articles);
  });
}

// Show news stories in newsfeed
function displayNewsStories(newsStories) {
  // Test
  console.log(newsStories);

  $newsFeed.empty();
  let listItems = "";
  for (let i = 0; i < 5; i++) {
    listItems += `
      <div class="w3-card-4">
        <div class="w3-container w3-teal">
          <h3>${newsStories[i].title}</h3>
          <p>by ${newsStories[i].author}</p>
        </div>
        <div class="w3-container">
          <img src="${newsStories[i].urlToImage}" height="150">
          <p>${newsStories[i].description}</p>
          <a href="${newsStories[i].url}">${newsStories[i].url}</a>
        </div>
      </div>
      <br>`;
  }
  $newsFeed.append($.parseHTML(listItems));
}

// Add click event listener to search button
$searchBtn.on("click", function(event) {
  event.preventDefault();
  let companyName = formatName($companyInput.val().trim());
  $companyInput.val("");
  if (companyName) {
    getStockSymbol(companyName);
  }
});

// Add click event listeners to search history links
$searchHistory.on("click", "a", function() {
  getStockSymbol(
    $(this)
      .text()
      .trim()
  );
});

$resetBtn.on("click", function() {
  resetSearchHistory();
});
