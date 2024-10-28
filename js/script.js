document.getElementById("getWeather").addEventListener("click", fetchWeather);

function translateWeather(description) {
  const translations = {
    "clear sky": "Solrig",
    "few clouds": "Mest Solrigt",
    "scattered clouds": "Delvis skyet",
    "broken clouds": "Skyet",
    "shower rain": "Byger",
    rain: "Regn",
    thunderstorm: "Tordenvejr",
    snow: "Sne",
    mist: "Tåge",

    // Thunderstorm group (2xx)
    "thunderstorm with light rain": "Tordenvejr med let regn",
    "thunderstorm with rain": "Tordenvejr med regn",
    "thunderstorm with heavy rain": "Tordenvejr med kraftig regn",
    "light thunderstorm": "Let tordenvejr",
    thunderstorm: "Tordenvejr",
    "heavy thunderstorm": "Kraftigt tordenvejr",
    "ragged thunderstorm": "Ujævnt tordenvejr",
    "thunderstorm with light drizzle": "Tordenvejr med let støvregn",
    "thunderstorm with drizzle": "Tordenvejr med støvregn",
    "thunderstorm with heavy drizzle": "Tordenvejr med kraftig støvregn",

    // Drizzle group (3xx)
    "light intensity drizzle": "Let støvregn",
    drizzle: "Støvregn",
    "heavy intensity drizzle": "Kraftig støvregn",
    "light intensity drizzle rain": "Let støvregn og regn",
    "drizzle rain": "Støvregn og regn",
    "heavy intensity drizzle rain": "Kraftig støvregn og regn",
    "shower rain and drizzle": "Bygeregn og støvregn",
    "heavy shower rain and drizzle": "Kraftig bygeregn og støvregn",
    "shower drizzle": "Byger og støvregn",

    // Rain group (5xx)
    "light rain": "Let regn",
    "moderate rain": "Moderat regn",
    "heavy intensity rain": "Kraftig regn",
    "very heavy rain": "Meget kraftig regn",
    "extreme rain": "Skybrud",
    "freezing rain": "Hagl",
    "light intensity shower rain": "Let bygeregn",
    "shower rain": "Bygeregn",
    "heavy intensity shower rain": "Kraftig bygeregn",
    "ragged shower rain": "Ujævnt bygeregn",

    // Snow group (6xx)
    "light snow": "Let sne",
    snow: "Sne",
    "heavy snow": "Kraftig sne",
    sleet: "Slud",
    "light shower sleet": "Let bygeslud",
    "shower sleet": "Bygeslud",
    "light rain and snow": "Let regn og sne",
    "rain and snow": "Regn og sne",
    "light shower snow": "Let bygesne",
    "shower snow": "Bygesne",
    "heavy shower snow": "Kraftig bygesne",

    // Atmosphere group (7xx)
    mist: "Tåge",
    smoke: "Røg",
    haze: "Dis",
    "sand/dust whirls": "Sand-/støvhvirvler",
    fog: "Tæt tåge",
    sand: "Sand",
    dust: "Støv",
    "volcanic ash": "Vulkansk aske",
    squalls: "Kastevinde",
    tornado: "Tornado",

    // Clear and Clouds group (800-80x)
    "clear sky": "Solrig",
    "few clouds": "Mest solrigt",
    "scattered clouds": "Delvis skyet",
    "broken clouds": "Skyet",
    "overcast clouds": "Overskyet",
  };

  return translations[description] || description; // Returner originalen, hvis der ikke findes en oversættelse
}

async function fetchWeather() {
  let city = document.getElementById("cityInput").value;
  const apiUrl = `http://localhost:3000/weather?city=${city}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
      const translatedDescription = translateWeather(
        data.weather[0].description
      );
      document.getElementById(
        "weatherResult"
      ).innerText = `Vejr i ${city}, : ${translatedDescription}, Temperaturen er: ${parseFloat(
        data.main.temp
      ).toFixed(0)}°C`;
    } else {
      document.getElementById("weatherResult").innerText =
        "Error fetching weather data";
    }
  } catch (error) {
    console.error("Fetch error:", error);
    document.getElementById("weatherResult").innerText =
      "Failed to fetch weather data";
  }
}
