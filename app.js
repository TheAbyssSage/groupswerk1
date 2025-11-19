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
    const currentLocation = document.getElementById("location").value.trim();
  
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
        const SUNRISE = data.sys.sunrise;
        const SUNSET = data.sys.sunset;
        const CLOUDCOVERAGE = data.clouds.all;
        const HUMIDITY = data.main.humidity;

        // console.log(WINDSPEED)
        // console.log(WINDDIRECTION)

        windSpeed.innerHTML = `The wind speed is ${WINDSPEED}`;
        windDirection.innerHTML = `The wind direction is ${WINDDIRECTION}`;
        rain.innerHTML = `Rain is ${RAIN}`;
        temperature.innerHTML = `Temp is ${TEMPERATURE}`;
        sunrise.innerHTML = `Sunrise is ${SUNRISE}`;
        sunset.innerHTML = `Sunsetis ${SUNSET}`;
        cloudCoverage.innerHTML = `Cloud coverage is ${CLOUDCOVERAGE}`;
        humidity.innerHTML = `Humidity is ${HUMIDITY}`;
    
}