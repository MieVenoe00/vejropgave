// main.js
import { weatherIcons, getWeatherIcon } from "./weatherIcons.js";
const API_KEY = "7d7d91c7a4a22c8e8bb2501ab77012e9";

// Handle form submission for city search
const form = document.querySelector("#search form");
const searchInput = document.getElementById("bynavn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const cityName = searchInput.value.trim();
  
  if (cityName) {
    await fetchWeatherByCity(cityName);
  }
});

async function fetchWeatherByCity(cityName) {
  document.getElementById("widget").innerHTML = `
    <div class="weather-card">
      <p style="color: white; font-size: 1.5rem;">Searching for ${cityName}...</p>
    </div>
  `;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&lang=da`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found. Please try another city name.");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Weather data:", data);

    displayWeather(data);
    searchInput.value = ""; // Clear the search input
  } catch (error) {
    console.error("Error fetching weather:", error);
    showError(error.message || "Failed to load weather data");
  }
}

async function fetchWeatherByLocation() {
  // Show loading state
  document.getElementById("widget").innerHTML = `
    <div class="weather-card">
      <p style="color: white; font-size: 1.5rem;">Getting your location...</p>
    </div>
  `;

  // Check if geolocation is supported
  if (!navigator.geolocation) {
    showError("Geolocation is not supported by your browser");
    return;
  }

  // Get user's location
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      await fetchWeatherByCoords(lat, lon);
    },
    (error) => {
      console.error("Geolocation error:", error);
      let errorMessage = "Unable to get your location";

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage =
            "Location permission denied. Please enable location access or search for a city.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information unavailable. Please search for a city.";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out. Please search for a city.";
          break;
      }

      showError(errorMessage);
    }
  );
}

async function fetchWeatherByCoords(lat, lon) {
  document.getElementById("widget").innerHTML = `
    <div class="weather-card">
      <p style="color: white; font-size: 1.5rem;">Loading weather...</p>
    </div>
  `;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=da`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Weather data:", data);

    displayWeather(data);
  } catch (error) {
    console.error("Error fetching weather:", error);
    showError("Failed to load weather data");
  }
}

function showError(message) {
  document.getElementById("widget").innerHTML = `
    <div class="weather-card">
      <p style="color: white; font-size: 1.5rem;">${message}</p>
      <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: rgba(255,255,255,0.2); border: none; border-radius: 0.5rem; color: white; cursor: pointer;">
        Try Again
      </button>
    </div>
  `;
}

function displayWeather(data) {
  const widget = document.getElementById("widget");

  const condition = data.weather[0].description;
  const icon = data.weather[0].icon;

  const weatherIcon = getWeatherIcon(icon) || getWeatherIcon(condition);

  widget.innerHTML = `
    <div class="weather-card">
      <!-- Temperature section (top left) -->
      <div class="temperature-section">
        <h2 id="temperature" class="temperature">${Math.round(data.main.temp)}°</h2>
      </div>
      
      <!-- City name section (top right) -->
      <div class="city-section">
        <h2 id="cityname">${data.name}</h2>
      </div>
      
      <!-- Details section (bottom left) -->
      <div class="details-section">
        <div class="details">
          <div class="detail-item">
            <span class="detail-label">Luftfugtighed</span>
            <span class="detail-value">${data.main.humidity}%</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Vindstyrke</span>
            <span class="detail-value">${data.wind.speed} m/s</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Føles som</span>
            <span class="detail-value">${Math.round(
              data.main.feels_like
            )}°</span>
          </div>
        </div>
      </div>
      
      <!-- Weather icon (bottom right) -->
      <div class="weather-icon">
        ${weatherIcon}
        <p class="condition">${condition}</p>
      </div>
    </div>
  `;
  // Auto-scale city name to fit container
  autoScaleCityName();
  autoScaleTemp();

}

function autoScaleCityName() {
  const cityElement = document.getElementById('cityname');
  const container = cityElement.parentElement;
  
  // Get container's padding
  const containerStyle = window.getComputedStyle(container);
  const paddingLeft = parseFloat(containerStyle.paddingLeft);
  const paddingRight = parseFloat(containerStyle.paddingRight);
  const availableWidth = container.clientWidth - paddingLeft - paddingRight;
  
  let fontSize = 7; // Start at 5rem
  cityElement.style.fontSize = fontSize + 'rem';
  
  // Shrink until it fits within available width
  while (cityElement.scrollWidth > availableWidth && fontSize > 1.5) {
    fontSize -= 0.1; // Decrease by 0.1rem each step
    cityElement.style.fontSize = fontSize + 'rem';
  }
}

function autoScaleTemp() {
  const temperatureSection = document.getElementById('temperature');
  const container = temperatureSection.parentElement;
  
  // Get container's padding
  const containerStyle = window.getComputedStyle(container);
  const paddingLeft = parseFloat(containerStyle.paddingLeft);
  const paddingRight = parseFloat(containerStyle.paddingRight);
  const availableWidth = container.clientWidth - paddingLeft - paddingRight;
  
  let fontSize = 12; 
  temperatureSection.style.fontSize = fontSize + 'rem';
  
  // Shrink until it fits within available width
  while (temperatureSection.scrollWidth > availableWidth && fontSize > 1.5) {
    fontSize -= 0.1; // Decrease by 0.1rem each step
    temperatureSection.style.fontSize = fontSize + 'rem';
  }
}

// Initialize with geolocation by default
fetchWeatherByLocation();