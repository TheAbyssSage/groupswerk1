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

// ----------------------------------------------------------- below all favorites

// elements for favorites list
const addToFavoritesButton = document.getElementById('add-to-favorites');
const favDatalist = document.getElementById('favLocations'); 

// load saved favorite locations from localstorage
let savedFavLocations = JSON.parse(localStorage.getItem('favLocations')) || [];
updateFavDatalist();

function updateFavDatalist() {

    // FIX: ensure element exists
    if (!favDatalist) {
        console.error("favLocations element not found in HTML");
        return;
    }

    favDatalist.innerHTML = '';

    // Limit to max 10 locations
    if (savedFavLocations.length > 10) {
        savedFavLocations.shift(); 
        localStorage.setItem('favLocations', JSON.stringify(savedFavLocations)); 
    }

    // Create list items
    savedFavLocations.forEach(loc => {
        const li = document.createElement('li');
        li.textContent = loc;
        li.style.cursor = 'pointer';

        li.addEventListener('click', () => {
            input.value = loc;
            showStuff(loc);
        });

        favDatalist.appendChild(li);
    });
}

addToFavoritesButton.addEventListener('click', () => {

    const currentLocation = input.value.trim();

    if (!currentLocation) {
        alert("Enter a location first!");
        return;
    }

    if (!savedFavLocations.includes(currentLocation)) {

        savedFavLocations.push(currentLocation);
        localStorage.setItem('favLocations', JSON.stringify(savedFavLocations));
        updateFavDatalist();

        alert('Location added to favorites!');
    } else {
        alert('This location is already in your favorites!');
    }
});
// ------------------------------------------------------------------- above all favorite related

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



// Surfer bg animation
/**
 * Constants
 */
const TWO_PI = Math.PI * 2;

/**
 * Application Class
 */
class Application {
    /**
     * Application constructor
     */
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.center = {
            x: this.width / 2,
            y: this.height / 2
        };

        this.circleContainers = [];

        //Resize listener for the canvas to fill browser window dynamically
        window.addEventListener('resize', () => this.resizeCanvas(), false);
    }

    /**
     * Simple resize function. Reinitializes everything on the canvas while changing the width/height
     */
    resizeCanvas() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.center = {
            x: this.width / 2,
            y: this.height / 2
        };

        //Empty the previous container and fill it again with new CircleContainer objects
        this.circleContainers = [];
        this.initializeCircleContainers();
    }

    /**
     * Create a number of CircleContainer objects based on the numberOfContainers variable
     * @return void
     */
    initializeCircleContainers() {
        for (let x = 0; x < this.width + 100; x += 100) {
            for (let y = 0; y < this.height + 100; y += 100) {
                //Initialize a new instance of the CircleContainer class
                let circleContainer = new CircleContainer(this.context, x, y);

                //Let the CircleContainer initialize it's children
                circleContainer.initializeCircles();

                //Add the container to our array of CircleContainer objects
                this.circleContainers.push(circleContainer);
            }
        }
    }

    /**
     * Updates the application and every child of the application
     * @return void
     */
    update() {
        for (let i = 0; i < this.circleContainers.length; i++) {
            this.circleContainers[i].update();
        }
    }

    /**
     * Renders the application and every child of the application
     * @return void
     */
    render() {
        //Clear the entire canvas every render
        this.context.clearRect(0, 0, this.width, this.height);

        //Trigger the render function on every child element
        for (let i = 0; i < this.circleContainers.length; i++) {
            this.circleContainers[i].render();
        }
    }

    /**
     * Update and render the application at least 60 times a second
     * @return void
     */
    loop() {
        this.update();
        this.render();

        window.requestAnimationFrame(() => this.loop());
    }
}

/**
 * CircleContainer Class
 */
class CircleContainer {
    /**
     * CircleContainer constructor
     * @param context - The context from the canvas object of the Application
     * @param x
     * @param y
     */
    constructor(context, x, y) {
        this.context = context;
        this.position = {x, y};

        this.numberOfCircles = 19;
        this.circles = [];

        this.baseRadius = 20;
        this.bounceRadius = 150;
        this.singleSlice = TWO_PI / this.numberOfCircles;
    }

    /**
     * Create a number of Circle objects based on the numberOfCircles variable
     * @return void
     */
    initializeCircles() {
        for (let i = 0; i < this.numberOfCircles; i++) {
            this.circles.push(new Circle(this.position.x, this.position.y + Math.random(), this.baseRadius, this.bounceRadius, i * this.singleSlice));
        }
    }

    /**
     * Try to update the application at least 60 times a second
     * @return void
     */
    update() {
        for (let i = 0; i < this.numberOfCircles; i++) {
            this.circles[i].update(this.context);
        }
    }

    /**
     * Try to render the application at least 60 times a second
     * @return void
     */
    render() {
        for (let i = 0; i < this.numberOfCircles; i++) {
            this.circles[i].render(this.context);
        }
    }
}

/**
 * Circle Class
 */
class Circle {
    /**
     * Circle constructor
     * @param x - The horizontal position of this circle
     * @param y - The vertical position of this circle
     * @param baseRadius
     * @param bounceRadius
     * @param angleCircle
     */
    constructor(x, y, baseRadius, bounceRadius, angleCircle) {
        this.basePosition = {x, y};
        this.position = {x, y};
        this.speed = 0.01;
        this.baseSize = 10;
        this.size = 10;
        this.angle = (x + y);
        this.baseRadius = baseRadius;
        this.bounceRadius = bounceRadius;
        this.angleCircle = angleCircle;
    }

    /**
     * Update the position of this object
     * @return void
     */
    update() {
        this.position.x = this.basePosition.x + Math.cos(this.angleCircle) * (Math.sin(this.angle + this.angleCircle) * this.bounceRadius + this.baseRadius);
        this.position.y = this.basePosition.y + Math.sin(this.angleCircle) * (Math.sin(this.angle + this.angleCircle) * this.bounceRadius + this.baseRadius);
        this.size = Math.cos(this.angle) * 8 + this.baseSize;

        this.angle += this.speed;
    }

    /**
     * Renders this Circle object on the canvas
     * @param context - The context from the canvas object of the Application
     * @return void
     */
    render(context) {
        context.fillStyle = "hsl(195, 100%, "+this.size * 4+"%)";
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.size, 0, TWO_PI);
        context.fill();
    }
}

/**
 * Onload function is executed whenever the page is done loading, initializes the application
 */
window.onload = function () {
    //Create a new instance of the application
    const application = new Application();

    //Initialize the CircleContainer objects
    application.initializeCircleContainers();

    //Start the initial loop function for the first time
    application.loop();
};

// app.js (add this resize logic if you don't already set canvas size)
/* Ensure canvas matches viewport and re-render on resize */
const canvas = document.getElementById('canvas');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // TODO: call your wave render/draw function here so it redraws at the new size
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
