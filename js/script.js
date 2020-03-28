let $companyInput = $("#company-input");
let $searchBtn = $("#search-btn");
let $searchHistory = $("#search-history");
let $stockPrice = $("#stock-price");
let $errorMessage = $("#error-message");

const IEXCLOUD_SYMBOL_API_URL =
  "https://api.iextrading.com/1.0/ref-data/symbols";
const IEXCLOUD_PRICE_API_URL = "https://sandbox.iexapis.com/stable/stock/";
const NEWS_API_URL = "https://newsapi.org/v2/everything?q=coronavirus&?q=";

const IEXCLOUD_API_KEY = "Tsk_2d13159a4439423cb7fb707f85ac77c5";
const NEWS_API_KEY = "9a19e4ff6d4846d1b060f06b716e05a8";

let keywords = ["coronavirus", "covid", "pandemic"];

let searchHistory =
  JSON.parse(window.localStorage.getItem("searchHistory")) || [];

displaySearchHistory();

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

function updateSearchHistory(companyName) {
  if (!searchHistory.includes(companyName)) {
    searchHistory.push(companyName);
  }
  window.localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

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

function displayErrorMessage() {
  $errorMessage.text("Stock symbol not found");
}

function hideErrorMessage() {
  $errorMessage.text("");
}

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
        getStockPrice(response[i].symbol);
        return;
      }
    }
    displayErrorMessage();
    setTimeout(function() {
      hideErrorMessage();
    }, 1500);
  });
}

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

function getNewsStories(companyName) {
  $.ajax({
    url: `${NEWS_API_URL}${companyName}&apiKey=${NEWS_API_KEY}`,
    method: "GET"
  }).then(function(response) {
    return response;
  });
}

function displayStockPrice(stockPrice) {
  $stockPrice.text(stockPrice);
}

// TODO
function displayReaction(stockPrice) {}

// TODO
function displayNewsStories(data) {}

displayNewsStories(data);

$searchBtn.on("click", function(event) {
  event.preventDefault();
  let companyName = formatName($companyInput.val().trim());

  $companyInput.val("");

  if (companyName) {
    // TODO: Add get and display function calls
    getStockSymbol(companyName);
    getNewsStories(companyName);
  }
});

$searchHistory.on("click", "a", function() {
  let $this = $(this);
  getStockSymbol($this.text().trim());
});
