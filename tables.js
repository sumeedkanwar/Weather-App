// Constants
const API_KEY = "81a1736ac7277e352d742bdf30c13ac8";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEMINI_API_KEY = "AIzaSyB7ByD8qNVelWmVmjHDNtekDRmY9cjtSa4";

// DOM Elements
const elements = {
  cityInput: document.getElementById("cityInput"),
  searchBtn: document.getElementById("searchBtn"),
  locationBtn: document.getElementById("locationBtn"),
  unitSelect: document.getElementById("unitSelect"),
  errorMessage: document.getElementById("errorMessage"),
  loader: document.getElementById("loader"),
  forecastTableBody: document.getElementById("forecastTableBody"),
  startEntry: document.getElementById("startEntry"),
  endEntry: document.getElementById("endEntry"),
  totalEntries: document.getElementById("totalEntries"),
  prevPage: document.getElementById("prevPage"),
  nextPage: document.getElementById("nextPage"),
  chatMessages: document.getElementById("chatMessages"),
  chatForm: document.getElementById("chatForm"),
  chatInput: document.getElementById("chatInput"),
};

// Global variables
let forecastData = [];
let currentPage = 1;
const entriesPerPage = 10;

// Event Listeners
elements.searchBtn.addEventListener("click", () =>
  handleSearch(elements.cityInput.value)
);
elements.cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSearch(elements.cityInput.value);
});
elements.locationBtn.addEventListener("click", handleGeolocation);
elements.unitSelect.addEventListener("change", handleUnitChange);
elements.prevPage.addEventListener("click", () => changePage(-1));
elements.nextPage.addEventListener("click", () => changePage(1));
elements.chatForm.addEventListener("submit", handleChatSubmit);

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

// API Calls
async function fetchCurrentWeather(city) {
  const units = elements.unitSelect.value;
  const url = `${BASE_URL}/weather?q=${city}&units=${units}&appid=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather data not available for ${city}`);
  }
  return response.json();
}

async function fetchForecastData(city) {
  const units = elements.unitSelect.value;
  const url = `${BASE_URL}/forecast?q=${city}&units=${units}&appid=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Forecast data not available for ${city}`);
  }
  return response.json();
}

// Handle search
async function handleSearch(city) {
  if (!city) return;
  showLoader();
  try {
    const data = await fetchForecastData(city);
    forecastData = processForecastData(data);
    updateTable();
  } catch (error) {
    showError(error.message);
  } finally {
    hideLoader();
  }
}

// Handle geolocation
function handleGeolocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
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
      },
      () => {
        showError("Geolocation permission denied");
      }
    );
  } else {
    showError("Geolocation is not supported by your browser");
  }
}

// Process forecast data
function processForecastData(data) {
  const processedData = [];
  const seenDates = new Set();

  for (const item of data.list) {
    const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    if (!seenDates.has(date)) {
      seenDates.add(date);
      processedData.push({
        date,
        temp: item.main.temp,
        weather: item.weather[0].main,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
      });
    }

    if (processedData.length === 5) break;
  }

  return processedData;
}

// Update table
function updateTable() {
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, forecastData.length);
  const tableData = forecastData.slice(startIndex, endIndex);

  elements.forecastTableBody.innerHTML = tableData
    .map(
      (item) => `
        <tr>
            <td class="p-4 border-b">${item.date}</td>
            <td class="p-4 border-b">${item.temp.toFixed(1)}°${
        elements.unitSelect.value === "metric" ? "C" : "F"
      }</td>
            <td class="p-4 border-b">${item.weather}</td>
            <td class="p-4 border-b">${item.humidity}%</td>
            <td class="p-4 border-b">${item.windSpeed.toFixed(1)} ${
        elements.unitSelect.value === "metric" ? "m/s" : "mph"
      }</td>
        </tr>
    `
    )
    .join("");

  elements.startEntry.textContent = startIndex + 1;
  elements.endEntry.textContent = endIndex;
  elements.totalEntries.textContent = forecastData.length;

  elements.prevPage.disabled = currentPage === 1;
  elements.nextPage.disabled = endIndex >= forecastData.length;
}

// Change page
function changePage(direction) {
  currentPage += direction;
  updateTable();
}

// Handle chat submit
async function handleChatSubmit(e) {
  e.preventDefault();
  const userMessage = elements.chatInput.value.trim();
  if (!userMessage) return;

  addChatMessage("user", userMessage);
  elements.chatInput.value = "";

  // Show a loading message
  const loadingMessageId = addChatMessage("bot", "Thinking...");

  try {
    const botResponse = await generateBotResponse(userMessage);
    // Replace the loading message with the actual response
    updateChatMessage(loadingMessageId, "bot", botResponse);
  } catch (error) {
    console.error("Error generating bot response:", error);
    updateChatMessage(
      loadingMessageId,
      "bot",
      "I'm sorry, I encountered an error. Please try again."
    );
  }
}

// Add chat message
function addChatMessage(sender, message) {
  const messageElement = document.createElement("div");
  messageElement.className = `mb-2 ${
    sender === "user" ? "text-right" : "text-left"
  }`;
  messageElement.innerHTML = `
        <span class="inline-block px-4 py-2 rounded-lg ${
          sender === "user"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800"
        }">
            ${message}
        </span>
    `;

  elements.chatMessages.appendChild(messageElement);
  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
  return (messageElement.id = `message-${Date.now()}`); // Return the ID of the new message
}

// Update chat message
function updateChatMessage(messageId, sender, newMessage) {
  const messageElement = document.getElementById(messageId);
  if (messageElement) {
    messageElement.innerHTML = `
            <span class="inline-block px-4 py-2 rounded-lg ${
              sender === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }">
                ${newMessage}
            </span>
        `;
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
  }
}

// Generate bot response using Gemini API
async function generateBotResponse(userMessage) {
  const lowercaseMessage = userMessage.toLowerCase();

  if (!lowercaseMessage.includes("weather")) {
    return "I'm sorry, I can only answer weather-related questions. Please ask about the weather.";
  }

  // Extract city name from the user's message
  const cityMatch = lowercaseMessage.match(/weather (?:in|at|for) (\w+)/i);
  const city = cityMatch ? cityMatch[1] : elements.cityInput.value;

  try {
    const [weatherData, forecastData] = await Promise.all([
      fetchCurrentWeather(city),
      fetchForecastData(city),
    ]);

    const prompt = `
        You are a weather chatbot. Answer the following question based on this weather data:
        Current weather: ${JSON.stringify(weatherData)}
        Forecast: ${JSON.stringify(processForecastData(forecastData))}
        
        User question: ${userMessage}
        
        Provide a concise and accurate response based solely on the given weather data. If the question cannot be answered with the available information, politely state that you don't have enough information to answer.
        `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate response from Gemini API");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error processing weather query:", error);
    if (
      error.message.includes("Weather data not available") ||
      error.message.includes("Forecast data not available")
    ) {
      return `I'm sorry, I couldn't fetch weather data for ${city}. Please check the city name and try again.`;
    }
    return "I'm sorry, I encountered an error while processing your request. Please try again later.";
  }
}

// Filter functions
function filterTemperatureAsc() {
  forecastData.sort((a, b) => a.temp - b.temp);
  currentPage = 1;
  updateTable();
}

function filterTemperatureDesc() {
  forecastData.sort((a, b) => b.temp - a.temp);
  currentPage = 1;
  updateTable();
}

function filterRainyDays() {
  forecastData = forecastData.filter((item) =>
    item.weather.toLowerCase().includes("rain")
  );
  currentPage = 1;
  updateTable();
}

function filterHighestTemp() {
  const highestTemp = Math.max(...forecastData.map((item) => item.temp));
  forecastData = forecastData.filter((item) => item.temp === highestTemp);
  currentPage = 1;
  updateTable();
}

function clearFilters() {
  handleSearch(elements.cityInput.value);
}

// Temperature conversion functions
function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

function fahrenheitToCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}

// Handle unit change
function handleUnitChange() {
  const newUnit = elements.unitSelect.value;
  forecastData = forecastData.map((item) => {
    if (newUnit === "imperial") {
      return {
        ...item,
        temp: celsiusToFahrenheit(item.temp),
        windSpeed: item.windSpeed * 2.237, // Convert m/s to mph
      };
    } else {
      return {
        ...item,
        temp: fahrenheitToCelsius(item.temp),
        windSpeed: item.windSpeed / 2.237, // Convert mph to m/s
      };
    }
  });
  updateTable();
}

// Add event listeners for filter buttons
document
  .querySelector('[data-filter="asc"]')
  .addEventListener("click", filterTemperatureAsc);
document
  .querySelector('[data-filter="desc"]')
  .addEventListener("click", filterTemperatureDesc);
document
  .querySelector('[data-filter="rain"]')
  .addEventListener("click", filterRainyDays);
document
  .querySelector('[data-filter="highest"]')
  .addEventListener("click", filterHighestTemp);
document
  .querySelector('[data-filter="clear"]')
  .addEventListener("click", clearFilters);

// Initial load
handleSearch("Islamabad");
