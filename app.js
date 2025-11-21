const API_KEY = "77f36ebced508f08d1bb597493dd3030"; // totally hidden free API

// ----------------------------------------------------------------------------------- underneath here by chatgpt, no clue yet how to integrate this in functions below
const input = document.getElementById('locationForm');
const datalist = document.getElementById('locationList');

// Load saved locations from localStorage
let savedLocations = JSON.parse(localStorage.getItem('locations')) || [];
updateDatalist();

// Function to update the datalist
function updateDatalist() {
    datalist.innerHTML = '';
    
    // Limit to max 10 locations
    if (savedLocations.length > 10) {
        savedLocations.shift(); // Remove first (oldest) item
        localStorage.setItem('locations', JSON.stringify(savedLocations));
    }
    
    // Create list items for each saved location
    savedLocations.forEach(loc => {
        const option = document.createElement('li');
        option.innerText = `${loc}`;
        option.style.cursor = 'pointer';
        // Add click event to populate input and show weather
        option.addEventListener('click', () => {
            input.value = loc;
            showStuff(loc);
        });
        datalist.appendChild(option);
    });
}
// ----------------------------------------------------------------------------------- above here by chatgpt

// Single event listener for search button
document.getElementById("search-btn").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form submission/page refresh
    const currentLocation = document.getElementById("locationForm").value.trim();

    if (!currentLocation) {
        alert("no location eh? genk it is");
        showStuff("Genk");
        return;
    }

    // Avoid duplicates - fixed logic
    if (!savedLocations.includes(currentLocation)) {
        savedLocations.push(currentLocation);
        localStorage.setItem('locations', JSON.stringify(savedLocations));
        updateDatalist();
    }

    showStuff(currentLocation);
});


function showStuff(currentLocation) {
    const linkie = `https://api.openweathermap.org/data/2.5/weather?q=${currentLocation}&APPID=${API_KEY}&units=metric`; // making linkie because using url made JS angy

    fetch(linkie)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => displayData(data))
        // error handling for fetch in case of typo or invalid location
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert(`Failed to fetch weather data for "${currentLocation}". Please check the location name and try again.`);
        });

    // console.log(linkie);
}

function displayData(data) {
    // receiving div id from html
    const currentTime = document.getElementById('currenttime');
    const windSpeed = document.getElementById('windSpeed');
    const windDirection = document.getElementById('windDirection');
    const rain = document.getElementById('rain');
    const temperature = document.getElementById('temperature');
    const sunrise = document.getElementById('sunrise');
    const sunset = document.getElementById('sunset');
    const cloudCoverage = document.getElementById('cloudCoverage');
    const humidity = document.getElementById('humidity');
    const location = document.getElementById('city');
    const country = document.getElementById('country');
    const huntingtime = document.getElementById('hunting');
    // putting all read data from API into const
    const WINDSPEED = data.wind.speed;
    const WINDDIRECTION = data.wind.deg;
    const TEMPERATURE = Math.round(parseFloat(data.main.temp));
    // extra steps required for turning unix seconds into readable time    
    const sunriseTimestamp = data.sys.sunrise;
    const sunsetTimestamp = data.sys.sunset;
    const sunriseDate = new Date(sunriseTimestamp * 1000);
    const sunsetDate = new Date(sunsetTimestamp * 1000);
    const SUNRISE = sunriseDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const SUNSET = sunsetDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const CLOUDCOVERAGE = data.clouds.all;
    const HUMIDITY = data.main.humidity;

    // console.log(WINDSPEED)
    // console.log(WINDDIRECTION)

    // writing all cons into innerHTML
    // null checks to avoid errors if element not found
    if (currentTime)
        currentTime.innerHTML = `${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
    if (windSpeed)
        windSpeed.innerHTML = `${WINDSPEED} <span class="windSpeed-unit">m/s</span>`;
    if (windDirection)
        windDirection.innerHTML = `The wind direction is ${WINDDIRECTION} degrees`;
    if (rain)
        rain.innerHTML = `${getWeatherEmoji(data)}`;
    if (temperature)
        temperature.innerHTML = `${TEMPERATURE}°<span class="temperature-unit">C</span>`;
    if (sunrise)
        sunrise.innerHTML = `Sunrise is at ${SUNRISE}`;
    if (sunset)
        sunset.innerHTML = `Sunset is at ${SUNSET}`;
    if (cloudCoverage)
        cloudCoverage.innerHTML = `Cloud coverage is ${CLOUDCOVERAGE}%`;
    if (humidity)
        humidity.innerHTML = `Humidity is ${HUMIDITY}%`;
    if (location)
        location.innerHTML = `${data.name}`;
    if (country)
        country.innerHTML = `${data.sys.country}`;
    if (huntingtime)
        huntingtime.innerHTML = nightHunt(data);

}

showStuff("Genk"); // default location at start

// Function to get weather emoji based on conditions based on OpenWeatherMap weather codes
function getWeatherEmoji(data) {
    const weatherId = data.weather[0].id;
    const cloudCoverage = data.clouds.all;
    const sunriseTimestamp = data.sys.sunrise;
    const sunsetTimestamp = data.sys.sunset;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const isNight = currentTimestamp < sunriseTimestamp || currentTimestamp >= sunsetTimestamp;

    // Thunderstorm (200-232)
    if (weatherId >= 200 && weatherId < 300) return '🌩️';

    // Drizzle (300-321)
    if (weatherId >= 300 && weatherId < 400) return '☔';

    // Rain (500-531)
    if (weatherId >= 500 && weatherId < 600) {
        // Heavy rain
        if (weatherId === 502 || weatherId === 503 || weatherId === 504) return '🌧️';
        // Light rain with sun
        if (weatherId === 500 && cloudCoverage < 50) return isNight ? '🌧️' : '🌦️';
        return '🌧️';
    }

    // Snow (600-622)
    if (weatherId >= 600 && weatherId < 700) return '🌨️';

    // Atmosphere (fog, mist, etc.) (700-781)
    if (weatherId >= 700 && weatherId < 800) return '🌫️';

    // Clear (800)
    if (weatherId === 800) return isNight ? '🌙' : '☀️';

    // Clouds (801-804)
    if (weatherId > 800) {
        if (cloudCoverage < 50) return isNight ? '☁️' : '🌤️';
        if (cloudCoverage >= 45 && cloudCoverage <= 55) return '⛅';
        if (cloudCoverage > 55) return '🌥️';
    }

    return '☁️'; // default
}

// Function to determine if it's a good time for vampires to hunt
function nightHunt(data) {
    const sunriseTimestamp = data.sys.sunrise;
    const sunsetTimestamp = data.sys.sunset;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const cloudCoverage = data.clouds.all;
    const weatherId = data.weather[0].id;

    // Check if it's nighttime
    const isNight = currentTimestamp < sunriseTimestamp || currentTimestamp > sunsetTimestamp;

    if (isNight) {
        return `<span class="vampire">🧛‍♂️ </span>Perfect time for a hunt!<span class="vampire"> 🧛‍♀️</span>`;
    }

    // Daytime - check cloud coverage and weather conditions
    // Heavy clouds (>80%) or rain/snow/storm provides good cover
    if (cloudCoverage > 80 || weatherId < 700) {
        return `<span class="vampire">🧛‍♂️ </span> Safe to hunt! Heavy clouds or precipitation provide cover.<span class="vampire"> 🧛‍♀️</span>`;
    }

    if (cloudCoverage > 50) {
        return `<span class="vampire">⚠️ </span> Risky hunt. Moderate cloud cover - proceed with caution.<span class="vampire">⚠️ </span>`;
    }

    return `<span class="vampire">☀️ </span> Stay inside! The sun is too strong.<span class="vampire">☀️ </span>`;
}
