function init(){
    
}

function getWeather() {
    // code
}

function showWeather() {
    // code
}

const API_KEY = "77f36ebced508f08d1bb597493dd3030";

document.getElementById("search-btn").addEventListener("click", () => {
    const currentLocation = document.getElementById("locationForm").value.trim();
  
    if (!currentLocation) {
        alert("Please enter a location ya tw*t");
        return;
    }

    showStuff(currentLocation);
});

function showStuff(currentLocation) {
    const linkie = `https://api.openweathermap.org/data/2.5/weather?q=${currentLocation}&APPID=${API_KEY}&units=metric`;

    fetch(linkie)
    .then(response => response.json())
    .then(data => displayData(data))
    .catch();

    console.log(linkie);
}

function displayData (data) {
        const windSpeed = document.getElementById('windSpeed');
        const windDirection = document.getElementById('windDirection');
        const rain = document.getElementById('rain');
        const temperature = document.getElementById('temperature');
        const sunrise = document.getElementById('sunrise');
        const sunset = document.getElementById('sunset');
        const cloudCoverage = document.getElementById('cloudCoverage');
        const humidity = document.getElementById('humidity');

        const WINDSPEED = data.wind.speed;
        const WINDDIRECTION = data.wind.deg;
        const RAIN = data.rain?.["1h"] ?? 0;
        const TEMPERATURE = data.main.temp;
        
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

        windSpeed.innerHTML = `The wind speed is ${WINDSPEED} m/s`;
        windDirection.innerHTML = `The wind direction is ${WINDDIRECTION} degrees`;
        rain.innerHTML = `Rain in the past hour is ${RAIN} mm`;
        temperature.innerHTML = `Temperature is ${TEMPERATURE} degrees`;
        sunrise.innerHTML = `Sunrise is at ${SUNRISE}`;
        sunset.innerHTML = `Sunset is at ${SUNSET}`;
        cloudCoverage.innerHTML = `Cloud coverage is ${CLOUDCOVERAGE}%`;
        humidity.innerHTML = `Humidity is ${HUMIDITY}%`;
    
}