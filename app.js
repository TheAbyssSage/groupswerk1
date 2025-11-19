const API_KEY = "77f36ebced508f08d1bb597493dd3030"; // totally hidden free API

// ----------------------------------------------------------------------------------- underneath here by chatgpt, no clue yet how to integrate this in functions below
const input = document.getElementById('locationForm');
const datalist = document.getElementById('locationList');

// Load saved locations from localStorage
let savedLocations = JSON.parse(localStorage.getItem('locations')) || [];
updateDatalist();

// When user clicks the button
document.getElementById("search-btn").addEventListener('click', () => {
    const location = input.value.trim();
    if (!location) return; // ignore empty input
    
    // Avoid duplicates
    if (!savedLocations.includes(location)) {
        savedLocations.push(location);
        localStorage.setItem('locations', JSON.stringify(savedLocations));
        updateDatalist();
    }
    
    // input.value = ''; // optionally clear input after saving -----------------------------disabled this due to another function needing this
});

// Function to update the datalist
function updateDatalist() {
    datalist.innerHTML = '';
    savedLocations.forEach(loc => {
        const option = document.createElement('option');
        option.value = loc;
        datalist.appendChild(option);
    });
}
// ----------------------------------------------------------------------------------- above here by chatgpt

document.getElementById("search-btn").addEventListener("click", () => {
    const currentLocation = document.getElementById("locationForm").value.trim();
  
    if (!currentLocation) {
        alert("no location eh? genk it is");
        showStuff("Genk");
        return;
    }

    showStuff(currentLocation);
});


function showStuff(currentLocation) {
    const linkie = `https://api.openweathermap.org/data/2.5/weather?q=${currentLocation}&APPID=${API_KEY}&units=metric`; // making linkie because using url made JS angy

    fetch(linkie)
    .then(response => response.json()) // doing its json thingy
    .then(data => displayData(data)) // executing function displayData using the data
    .catch();

    // console.log(linkie);
}

function displayData (data) {
    // receiving div id from html
    const windSpeed = document.getElementById('windSpeed');
    const windDirection = document.getElementById('windDirection');
    const rain = document.getElementById('rain');
    const temperature = document.getElementById('temperature');
    const sunrise = document.getElementById('sunrise');
    const sunset = document.getElementById('sunset');
    const cloudCoverage = document.getElementById('cloudCoverage');
    const humidity = document.getElementById('humidity');

    // putting all read data from API into const
    const WINDSPEED = data.wind.speed;
    const WINDDIRECTION = data.wind.deg;
    const RAIN = data.rain?.["1h"] ?? 0;
    const TEMPERATURE = data.main.temp;

    // extra steps required for turning unix seconds into readable time    
    const sunriseTimestamp = data.sys.sunrise;
    const sunsetTimestamp = data.sys.sunset;
    const sunriseDate = new Date(sunriseTimestamp * 1000);
    const sunsetDate = new Date(sunsetTimestamp * 1000);
    const SUNRISE = sunriseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const SUNSET = sunsetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const CLOUDCOVERAGE = data.clouds.all;
    const HUMIDITY = data.main.humidity;

    // console.log(WINDSPEED)
    // console.log(WINDDIRECTION)

    // writing all cons into innerHTML
    windSpeed.innerHTML = `The wind speed is ${WINDSPEED} m/s`;
    windDirection.innerHTML = `The wind direction is ${WINDDIRECTION} degrees`;
    rain.innerHTML = `Rain in the past hour is ${RAIN} mm`;
    temperature.innerHTML = `Temperature is ${TEMPERATURE} degrees`;
    sunrise.innerHTML = `Sunrise is at ${SUNRISE}`;
    sunset.innerHTML = `Sunset is at ${SUNSET}`;
    cloudCoverage.innerHTML = `Cloud coverage is ${CLOUDCOVERAGE}%`;
    humidity.innerHTML = `Humidity is ${HUMIDITY}%`;
    
}