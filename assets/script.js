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
