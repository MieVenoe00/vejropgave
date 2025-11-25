// main.js
import { weatherIcons, getWeatherIcon } from "./weatherIcons.js";
const API_KEY = "7d7d91c7a4a22c8e8bb2501ab77012e9";


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
            "Location permission denied. Please enable location access.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out.";
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
        <h2 class="temperature">${Math.round(data.main.temp)}°</h2>
      </div>
      
      <!-- City name section (top right) -->
      <div class="city-section">
        <h2 id="cityname">${data.name}</h2>
      </div>
      
      <!-- Details section (bottom left) -->
      <div class="details-section">
        <div class="details">
          <div class="detail-item">
            <span class="detail-label">Humidity</span>
            <span class="detail-value">${data.main.humidity}%</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Wind Speed</span>
            <span class="detail-value">${data.wind.speed} m/s</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Feels Like</span>
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
}

// Initialize with geolocation
fetchWeatherByLocation();
