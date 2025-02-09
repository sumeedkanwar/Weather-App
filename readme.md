# Weather Dashboard

## Overview

The Weather Dashboard is a web application that provides real-time weather information and forecasts for any city around the world. It features a user-friendly interface with a sidebar navigation, search functionality, and dynamic weather widgets. The application also includes interactive charts and a chatbot for weather-related queries.

![image](https://github.com/user-attachments/assets/3bdf2a21-362d-42a1-93f7-1ee29cee6a6c)


## Features

- **Real-Time Weather Data**: Get current weather conditions for any city.
- **5-Day Forecast**: View a 5-day weather forecast with detailed information.
- **Interactive Charts**: Visualize temperature trends and weather distribution over the next 5 days.
- **Chatbot**: Interact with a chatbot to ask weather-related questions.
- **Geolocation**: Automatically fetch weather data based on the user's current location.
- **Unit Conversion**: Switch between Celsius and Fahrenheit.
- **Filter and Sort**: Filter and sort weather data based on various criteria.

## Technologies Used

- **HTML/CSS**: Structure and styling of the web application.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **JavaScript**: Logic and interactivity for the application.
- **Chart.js**: Library for creating interactive charts.
- **OpenWeatherMap API**: Source of weather data.
- **Gemini API**: Used for generating chatbot responses.

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Open the Application**:
   Simply open the `index.html` file in your web browser to start using the Weather Dashboard.

## Usage

### Dashboard

1. **Search for a City**:

   - Enter the name of the city in the search bar and click the search icon or press Enter.
   - Alternatively, click the location icon to fetch weather data based on your current location.

2. **View Weather Information**:

   - The main weather widget displays the current temperature, weather description, humidity, and wind speed.
   - The background of the widget changes dynamically based on the weather conditions.

3. **Interactive Charts**:
   - The dashboard includes three charts:
     - **5-Day Temperature Forecast**: A bar chart showing the temperature forecast for the next 5 days.
     - **Weather Distribution**: A doughnut chart displaying the distribution of different weather types over the next 5 days.
     - **Temperature Trend**: A line chart showing the temperature trend over the next 5 days.

### Tables

1. **Forecast Table**:

   - The table displays the 5-day weather forecast with columns for date, temperature, weather, humidity, and wind speed.
   - Use the pagination controls at the bottom to navigate through the entries.

2. **Filters**:
   - Apply filters to sort and display specific weather data:
     - **Temperature ↑**: Sort by ascending temperature.
     - **Temperature ↓**: Sort by descending temperature.
     - **Rainy Days**: Display only rainy days.
     - **Highest Temp**: Display the day with the highest temperature.
     - **Clear Filters**: Reset filters to show the original data.

### Chatbot

1. **Ask Weather Questions**:
   - Use the chatbot to ask weather-related questions.
   - The chatbot will respond based on the current weather data and forecast.

## API Keys

The application uses the OpenWeatherMap API and the Gemini API for fetching weather data and generating chatbot responses, respectively. You will need to obtain API keys from these services and replace the placeholder keys in the code.

- **OpenWeatherMap API Key**: Replace `API_KEY` in `dashboard.js` and `tables.js` with your OpenWeatherMap API key.
- **Gemini API Key**: Replace `GEMINI_API_KEY` in `tables.js` with your Gemini API key.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you find any bugs or have suggestions for improvements.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Acknowledgements

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather data.
- [Chart.js](https://www.chartjs.org/) for the interactive charts.
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework.
- [Gemini API](https://developers.google.com/generative-ai) for the chatbot responses.

---

Enjoy using the Weather Dashboard! If you have any questions or need further assistance, please don't hesitate to reach out.
