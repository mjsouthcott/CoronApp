// Define and initialize various variables
let $input = $('input')
let $cityInput = $('#city-input')
let $countryInput = $('#country-input')
let $searchBtn = $('#search-btn')
let $pastLocationsList = $('#past-locations-list')
let pastLocationsArray = []

// Check if `pastLocationsArray` exists in localStorage. If no, initialize and set it; if yes, get it
if (!window.localStorage.getItem('pastLocationsArray')) {
    window.localStorage.setItem('pastLocationsArray', JSON.stringify(pastLocationsArray))
} else {
    pastLocationsArray = JSON.parse(window.localStorage.getItem('pastLocationsArray'))
}

// Define function to properly format name character cases
function formatName(string) {
    let capitalizedString = ''
    for (let i = 0; i < string.length; i++) {
        if (i === 0 || string[i - 1] === " ") {
            capitalizedString += string[i].toUpperCase()
        } else {
            capitalizedString += string[i].toLowerCase()
        }
    }
    return capitalizedString
}

// Define function to display past locations
function displayPastLocations (pastLocationsArray) {
    // Remove all child nodes and content
    $pastLocationsList.empty()

    // Iterate over `pastLocationsArray` to display info
    for (let i = 0; i < pastLocationsArray.length; i++) {
        let $location = $(`<li class="list-group-item past-locations-list-item">${pastLocationsArray[i]}</li>`)
        $pastLocationsList.append($location)
    }
}

// Call `displayPastLocations` to display past locations on first page visit or page refresh
displayPastLocations(pastLocationsArray)

// Add `input` event handler to inputs to perform validation as user types
$input.on('input', function(e) {
    // Define and initialize variables representing input values
    const cityValue = $cityInput.val()
    const countryValue = $countryInput.val()

    // If inputs are empty, reset input data states
    if (!cityValue) {
        $cityInput.dataset.state = ''
    }
    if (!countryValue) {
        $countryInput.dataset.state = ''
    }
    
    // Define and initialize variables representing input values without white space
    const cityTrimmed = cityValue.trim()
    const countryTrimmed = countryValue.trim()
    
    // Once user begins typing, if inputs are not empty, set data states to `valid`; else, set them to `invalid`
    if (cityTrimmed) {
        $cityInput.dataset.state = 'valid'
    } else {
        $cityInput.dataset.state = 'invalid'
    }
    if (countryTrimmed) {
        $countryInput.dataset.state = 'valid'
    } else {
        $countryInput.dataset.state = 'invalid'
    }
})

// Add `click` event handler to location search button
$searchBtn.on('click', function(e) {
    e.preventDefault()

    // Define and initialize variables representing input values
    const cityValue = $cityInput.val()
    const countryValue = $countryInput.val()

    // TODO
    if (cityValue && countryValue) {
        // TODO
    } else if (!cityValue && countryValue) {
        // TODO
    } else if (cityValue && !countryValue) {
        // TODO
    }
})

// Add `click` event handler to past locations list items
$pastLocationsList.on('click', '.past-locations-list-item', function() {
    // TODO
})
