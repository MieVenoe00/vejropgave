// main.js
import { weatherIcons, getWeatherIcon } from './weatherIcons.js';
const API_KEY = '7d7d91c7a4a22c8e8bb2501ab77012e9'; // Get from openweathermap.org
const CITY = 'Aarhus';

async function fetchWeather() {
  // Show loading state
  document.getElementById('widget').innerHTML = `
    <div class="weather-card">
      <p style="color: white; font-size: 1.5rem;">Loading weather...</p>
    </div>
  `;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
    );
    
    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Weather data:', data); // Debug: see what we got
    
    displayWeather(data);
  } catch (error) {
    console.error('Error fetching weather:', error);
    document.getElementById('widget').innerHTML = `
      <div class="weather-card">
        <p style="color: white; font-size: 1.5rem;">Failed to load weather data</p>
        <p style="color: white; font-size: 1rem;">Check console for details</p>
      </div>
    `;
  }
}

function displayWeather(data) {
  const widget = document.getElementById('widget');
  
  // Get the weather condition
  const condition = data.weather[0].description;
  const icon = data.weather[0].icon; // API icon code like '01d'
  
  // Get the appropriate SVG icon
  const weatherIcon = getWeatherIcon(icon) || getWeatherIcon(condition);
  
  widget.innerHTML = `
    <div class="weather-card">
      <!-- Temperature section (top left) -->
      <div class="temperature-section">
        <p class="temperature">${Math.round(data.main.temp)}°</p>
      </div>
      
      <!-- City name section (top right) -->
      <div class="city-section">
        <h2>${data.name}</h2>
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
            <span class="detail-value">${Math.round(data.main.feels_like)}°C</span>
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

// Alternative: Manually select an icon
function showSpecificIcon(iconName) {
  const widget = document.getElementById('widget');
  widget.innerHTML = `
    <div class="icon-display">
      ${weatherIcons[iconName]}
    </div>
  `;
}

// Initialize
fetchWeather();

// Example of how to show specific icons manually:
// showSpecificIcon('sun');
// showSpecificIcon('rain');
// showSpecificIcon('thunderstorm');