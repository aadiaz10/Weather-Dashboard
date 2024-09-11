const apiKey = "c5c2f86b0dbfde3ed319a801025f0f69";  // Replace with your OpenWeather API key
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const forecastContainer = document.getElementById('forecast-container');
const historyList = document.getElementById('history-list');
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// Function to get weather data
const getWeatherData = async (city) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    displayWeatherData(data);
    updateHistory(city);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
};

// Function to display weather data
const displayWeatherData = (data) => {
  // Display current weather and 5-day forecast
  document.getElementById('city-name').textContent = data.city.name;

  forecastContainer.innerHTML = '';
  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const forecastCard = document.createElement('div');
    forecastCard.classList.add('forecast-card');
    forecastCard.innerHTML = `
      <h4>${new Date(forecast.dt_txt).toLocaleDateString()}</h4>
      <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather icon" />
      <p>Temp: ${forecast.main.temp}°C</p>
      <p>Wind: ${forecast.wind.speed} m/s</p>
      <p>Humidity: ${forecast.main.humidity}%</p>
    `;
    forecastContainer.appendChild(forecastCard);
  }
};

// Function to update search history
const updateHistory = (city) => {
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    renderHistory();
  }
};

// Function to render search history
const renderHistory = () => {
  historyList.innerHTML = '';
  searchHistory.forEach((city) => {
    const historyItem = document.createElement('li');
    historyItem.textContent = city;
    historyItem.addEventListener('click', () => getWeatherData(city));
    historyList.appendChild(historyItem);
  });
};

// Event listener for search button
searchBtn.addEventListener('click', () => {
  const city = cityInput.value;
  if (city) {
    getWeatherData(city);
  }
});

// Initialize search history on page load
renderHistory();
