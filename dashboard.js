// Constants
const API_KEY = "81a1736ac7277e352d742bdf30c13ac8";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// DOM Elements
const elements = {
    cityInput: document.getElementById("cityInput"),
    searchBtn: document.getElementById("searchBtn"),
    locationBtn: document.getElementById("locationBtn"),
    unitSelect: document.getElementById("unitSelect"),
    errorMessage: document.getElementById("errorMessage"),
    loader: document.getElementById("loader"),
    weatherWidget: document.getElementById("weatherWidget"),
    cityName: document.getElementById("cityName"),
    temperature: document.getElementById("temperature"),
    weatherDescription: document.getElementById("weatherDescription"),
    weatherIcon: document.getElementById("weatherIcon"),
    humidity: document.getElementById("humidity"),
    windSpeed: document.getElementById("windSpeed"),
};

// Charts configuration
const charts = {
    tempBar: null,
    weatherDoughnut: null,
    tempLine: null
};

// Weather background mapping
const weatherBackgrounds = {
    Clear: {
        day: 'weather-clear',
        night: 'weather-night'
    },
    Clouds: {
        day: 'weather-clouds',
        night: 'weather-night'
    },
    Rain: {
        day: 'weather-rain',
        night: 'weather-night'
    },
    Thunderstorm: {
        day: 'weather-thunderstorm',
        night: 'weather-night'
    },
    Snow: {
        day: 'weather-snow',
        night: 'weather-night'
    },
    Mist: {
        day: 'weather-mist',
        night: 'weather-night'
    },
    Drizzle: {
        day: 'weather-rain',
        night: 'weather-night'
    }
};

// Event Listeners
elements.searchBtn.addEventListener("click", () => handleSearch(elements.cityInput.value));
elements.cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch(elements.cityInput.value);
});
elements.locationBtn.addEventListener("click", handleGeolocation);
elements.unitSelect.addEventListener("change", () => handleSearch(elements.cityInput.value));

// UI Helper Functions
function showLoader() {
    elements.loader.classList.remove("hidden");
}

function hideLoader() {
    elements.loader.classList.add("hidden");
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.classList.remove("hidden");
    setTimeout(() => {
        elements.errorMessage.classList.add("hidden");
    }, 5000);
}

function resetUI() {
    elements.cityName.textContent = "-";
    elements.temperature.textContent = "--°";
    elements.weatherDescription.textContent = "-";
    elements.humidity.textContent = "--%";
    elements.windSpeed.textContent = "-- m/s";
    elements.weatherIcon.src = "";
    elements.weatherWidget.className = "relative rounded-xl shadow-lg p-8 mb-8 min-h-[300px] transition-all duration-500 weather-clear";
}

// Chart Creation Functions
function createTemperatureChart(forecast) {
    const ctx = document.getElementById('tempBarChart').getContext('2d');
    const dailyData = getDailyData(forecast.list);
    const labels = dailyData.map(day => day.date);
    const temperatures = dailyData.map(day => day.temp);

    if (charts.tempBar) charts.tempBar.destroy();
    
    charts.tempBar = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Temperature',
                data: temperatures,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: `Temperature (${elements.unitSelect.value === 'metric' ? '°C' : '°F'})`
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '5-Day Temperature Forecast'
                }
            },
            animation: {
                delay: (context) => {
                    let delay = 0;
                    if (context.type === 'data' && context.mode === 'default') {
                        delay = context.dataIndex * 300 + context.datasetIndex * 100;
                    }
                    return delay;
                },
            },
        }
    });
}

function createWeatherDistribution(forecast) {
    const ctx = document.getElementById('weatherDoughnutChart').getContext('2d');
    const weatherTypes = {};
    
    forecast.list.forEach(item => {
        const type = item.weather[0].main;
        weatherTypes[type] = (weatherTypes[type] || 0) + 1;
    });

    const total = Object.values(weatherTypes).reduce((sum, count) => sum + count, 0);
    const percentages = Object.entries(weatherTypes).map(([type, count]) => ({
        type,
        percentage: (count / total) * 100
    }));

    if (charts.weatherDoughnut) charts.weatherDoughnut.destroy();
    
    charts.weatherDoughnut = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: percentages.map(item => item.type),
            datasets: [{
                data: percentages.map(item => item.percentage),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Weather Distribution (5 Days)'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ${value.toFixed(1)}%`;
                        }
                    }
                }
            },
            animation: {
                delay: (context) => {
                    let delay = 0;
                    if (context.type === 'data' && context.mode === 'default') {
                        delay = context.dataIndex * 300;
                    }
                    return delay;
                },
            },
        }
    });
}

function createTemperatureTrend(forecast) {
    const ctx = document.getElementById('tempLineChart').getContext('2d');
    const dailyData = getDailyData(forecast.list);
    const labels = dailyData.map(day => day.date);
    const temperatures = dailyData.map(day => day.temp);

    if (charts.tempLine) charts.tempLine.destroy();
    
    charts.tempLine = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Temperature',
                data: temperatures,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: `Temperature (${elements.unitSelect.value === 'metric' ? '°C' : '°F'})`
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '5-Day Temperature Trend'
                }
            },
            animation: {
                x: {
                    type: 'number',
                    easing: 'linear',
                    duration: 500,
                    from: NaN, // the point is initially skipped
                    delay(ctx) {
                        if (ctx.type !== 'data' || ctx.xStarted) {
                            return 0;
                        }
                        ctx.xStarted = true;
                        return ctx.index * 300;
                    }
                },
                y: {
                    type: 'number',
                    easing: 'linear',
                    duration: 500,
                    from: 0,
                    delay(ctx) {
                        if (ctx.type !== 'data' || ctx.yStarted) {
                            return 0;
                        }
                        ctx.yStarted = true;
                        return ctx.index * 300;
                    }
                }
            },
        }
    });
}

// Helper function to get daily data from forecast
function getDailyData(forecastList) {
    const dailyData = [];
    const seenDates = new Set();

    for (const item of forecastList) {
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        if (!seenDates.has(date)) {
            seenDates.add(date);
            dailyData.push({
                date,
                temp: item.main.temp
            });
        }

        if (dailyData.length === 5) break;
    }

    return dailyData;
}

// Set weather background based on conditions
function setWeatherBackground(weatherMain, icon) {
    const isNight = icon.endsWith('n');
    const timeOfDay = isNight ? 'night' : 'day';
    const weatherType = weatherBackgrounds[weatherMain]
        ? weatherBackgrounds[weatherMain][timeOfDay]
        : 'weather-clear';
    
    elements.weatherWidget.className = `relative rounded-xl shadow-lg p-8 mb-8 min-h-[300px] transition-all duration-500 ${weatherType}`;
}

// API Calls
async function fetchWeatherData(city) {
    const units = elements.unitSelect.value;
    const url = `${BASE_URL}/weather?q=${city}&units=${units}&appid=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('City not found');
    return response.json();
}

async function fetchForecastData(city) {
    const units = elements.unitSelect.value;
    const url = `${BASE_URL}/forecast?q=${city}&units=${units}&appid=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Forecast data not available');
    return response.json();
}

// Handle search
async function handleSearch(city) {
    if (!city) return;
    showLoader();
    resetUI();
    try {
        const weatherData = await fetchWeatherData(city);
        const forecastData = await fetchForecastData(city);
        updateUI(weatherData);
        updateCharts(forecastData);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoader();
    }
}

// Handle geolocation
function handleGeolocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const units = elements.unitSelect.value;
            const url = `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${API_KEY}`;
            showLoader();
            try {
                const response = await fetch(url);
                const data = await response.json();
                elements.cityInput.value = data.name;
                handleSearch(data.name);
            } catch (error) {
                showError("Error fetching weather data");
            } finally {
                hideLoader();
            }
        }, () => {
            showError("Geolocation permission denied");
        });
    } else {
        showError("Geolocation is not supported by your browser");
    }
}

// Update UI with weather data
function updateUI(data) {
    elements.cityName.textContent = data.name;
    elements.temperature.textContent = `${Math.round(data.main.temp)}°`;
    elements.weatherDescription.textContent = data.weather[0].description;
    elements.humidity.textContent = `${data.main.humidity}%`;
    elements.windSpeed.textContent = `${data.wind.speed} ${elements.unitSelect.value === 'metric' ? 'm/s' : 'mph'}`;
    elements.weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    setWeatherBackground(data.weather[0].main, data.weather[0].icon);
}

// Update charts with forecast data
function updateCharts(forecast) {
    createTemperatureChart(forecast);
    createWeatherDistribution(forecast);
    createTemperatureTrend(forecast);
}

// Initial load
handleSearch("Islamabad");