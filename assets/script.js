// API key from OpenWeather
const apiKey = "a3b05e2566d1a936de8b31f8b28ad68e";

// Event listener for form submission using jQuery
$("#search-form").submit(function (event) {
  event.preventDefault(); // Prevent form submission
  const city = $("#search-input").val().trim();
  if (city) {
    // Call the function to fetch weather data for the entered city
    fetchWeatherData(city);
    // Add the city to the search history
    addToSearchHistory(city);
  }
});

// Event listener for search history items using jQuery
$("#history").on("click", "button", function () {
  const selectedCity = $(this).text();
  // Call the function to fetch weather data for the selected city
  fetchWeatherData(selectedCity);
});

// Function to fetch weather data from OpenWeather API
function fetchWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Handle the data and update the HTML content
      displayCurrentWeather(data);
      displayForecast(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      // Handle errors, display an error message to the user
    });
}
// Function to display current weather using jQuery
function displayCurrentWeather(data) {
  // Extract relevant data from the API response
  const city = data.city.name;
  const date = new Date(data.list[0].dt * 1000);
  const iconCode = data.list[0].weather[0].icon;
  const temperature = data.list[0].main.temp;
  const humidity = data.list[0].main.humidity;
  const windSpeed = data.list[0].wind.speed;

  // Update the HTML content for current weather using jQuery
  $("#today").html(`
      <h2>${city} (${date.toLocaleDateString()})
      <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon" class="icon"></h2>
      <p>Temperature: ${temperature}°C</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
      <p>Humidity: ${humidity}%</p>
      
    `);
}
// Function to display 5-day forecast using jQuery
function displayForecast(data) {
  // Cleared previous forecast content
  $("#forecast").empty();

  // Iterated through the forecast data and display each day's information
  for (let i = 0; i < data.list.length; i += 8) {
    // Using a step of 8 to get once per day data
    const dayData = data.list[i];

    if (dayData) {
      const iconCode = dayData.weather[0].icon;
      const dateTimestamp = dayData.dt * 1000; // Converted Unix timestamp to milliseconds
      const date = new Date(dateTimestamp);
      const formattedDate = date.toLocaleDateString();
      const temperature = dayData.main.temp;
      const windSpeed = dayData.wind.speed;
      const humidity = dayData.main.humidity;

      // Created a div for each day's forecast and appended it to the forecast section using jQuery
      const forecastItem = $(`
          <div class="col-md-2 forecast-item">
            <h4>${formattedDate}</h4>
            <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
            <p>Temp: ${temperature}°C</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
            <p>Humidity: ${humidity}%</p>
          </div>
        `);
      $("#forecast").append(forecastItem);
    } else {
      console.error(
        "API response does not contain valid weather data for day " + i
      );
      // Handle the error or display a message to the user
    }
  } 
  // Function to add a city to the search history and store it in local storage
  function addToSearchHistory(city) {
    // Retrieve existing search history from local storage
    const searchHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Add the new city to the search history array
    searchHistory.push(city);

    // Store the updated search history in local storage
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    // Create a button element and append it to the history list using jQuery
    const $button = $("<button>").text(city).addClass("history-button");
    $("#history").append($button);
  }

  // Function to load the search history from local storage
  function loadSearchHistory() {
    // Retrieve the search history from local storage
    const searchHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Display the search history as buttons in your HTML using jQuery
    const $historyList = $("#history");
    $historyList.empty(); // Clear existing buttons

    searchHistory.forEach(function (city) {
      const $button = $("<button>").text(city).addClass("history-button");
      $historyList.append($button);
    });
  }
  // Load and display the search history when the page is ready
  $(document).ready(function () {
    loadSearchHistory();
  });
}
