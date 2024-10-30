document.getElementById("getWeather").addEventListener("click", () => fetchWeather());
document.getElementById("cityInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    fetchWeather();
  }
});

const weatherIcons = {
  Solrig: "img/icons/solrig.svg",
  "Mest Solrigt": "img/icons/lidtSkyet.svg",
  "Delvis skyet": "img/icons/lidtSkyet.svg",
  Skyet: "img/icons/skyet.svg",
  Byger: "img/icons/lidtRegn.svg",
  Regn: "img/icons/megetRegn.svg",
  Tordenvejr: "img/icons/tordenvejr.svg",
  Sne: "img/icons/sne.svg",
  Tåge: "img/icons/foggy.svg",
  "Let regn": "img/icons/lidtRegn.svg",
  "Moderat regn": "img/icons/megetRegn.svg",
  "Kraftig regn": "img/icons/megetRegn.svg",
  Skybrud: "img/icons/megetRegn.svg",
  Hagl: "img/icons/sne.svg",
  "Tæt tåge": "img/icons/foggy.svg",
  Overskyet: "img/icons/skyet.svg",
  Røg: "img/icons/foggy.svg",
  Vind: "img/icons/vind.svg",
};

async function fetchCountryData() {
  const response = await fetch("../jsonData/countries.json");
  const countryData = await response.json();
  return countryData;
}

async function fetchWeatherDescriptions() {
  const response = await fetch("../jsonData/weathers.json");
  const weatherData = await response.json();
  return weatherData;
}

async function fetchWeather(defaultCity) {
  let city;
  
  if (defaultCity) {
    city = defaultCity;
  } else {
    city = document.getElementById("cityInput").value;
  }
  
  if (!city) {
    console.error("Ingen by angivet");
    return;
  }

  const apiUrl = `http://localhost:3000/weather?city=${city}`;

  try {
    const [weatherResponse, countryData, weatherDescriptions] =
      await Promise.all([
        fetch(apiUrl),
        fetchCountryData(),
        fetchWeatherDescriptions(),
      ]);

    const weatherData = await weatherResponse.json();

    if (weatherResponse.ok) {
      // Vis weatherResult div'en
      document.getElementById("weatherResult").classList.remove("hidden");
      
      const weatherDescription = weatherData.weather[0].description;
      const translatedDescription =
        weatherDescriptions[weatherDescription] || weatherDescription;

      const iconPath =
        weatherIcons[translatedDescription] || "img/icons/solrig.svg";
      document.getElementById("weatherIcon").src = iconPath;

      let videoPath;
      switch (translatedDescription) {
        case "Solrig":
          videoPath = "./vid/sunny.mp4";
          break;
        case "Delvis skyet":
        case "Mest Solrigt":
          videoPath = "./vid/cloudy.mp4";
          break;
        case "Overskyet":
        case "Skyet":
          videoPath = "./vid/clouds.mp4";
          break;
        case "Byger":
        case "Let regn":
        case "Moderat regn":
        case "Kraftig regn":
        case "Skybrud":
          videoPath = "./vid/rain.mp4";
          break;
        case "Tordenvejr":
          videoPath = "./vid/thunder.mp4";
          break;
        case "Sne":
        case "Hagl":
          videoPath = "./vid/snow.mp4";
          break;
        case "Tåge":
        case "Røg":
        case "Tæt tåge":
          videoPath = "./vid/rain.mp4";
          break;
        default:
          videoPath = "./vid/sunny.mp4";
          break;
      }

      document.getElementById("videoBg").src = videoPath;
      document.getElementById("videoBg").parentElement.load();

      const countryCode = weatherData.sys.country;
      const countryName = countryData[countryCode] || "Land ikke fundet";

      // Opdater weather data med 500ms delay
      setTimeout(() => {
        document.getElementById("degrees").innerText = `${parseFloat(
          weatherData.main.temp
        ).toFixed(0)}°`;
        document.getElementById("city").innerText = city;
        document.getElementById("country").innerText = countryName;
        document.getElementById("feelsLike").innerText = `Føles som ${parseFloat(
          weatherData.main.feels_like
        ).toFixed(0)}°`;
        document.getElementById("humidity").innerText = `${
          weatherData.rain ? weatherData.rain["1h"] : 0
        } mm `;
        document.getElementById("howWindy").innerText = `${parseFloat(
          weatherData.wind.speed
        ).toFixed(0)} m/s`;
        document.getElementById("weatherDescription").innerText =
          translatedDescription;
      }, 500);

      // Hent og vis ugentlig vejrudsigt med 500ms delay
      setTimeout(() => {
        fetchWeeklyWeather(city, weatherDescriptions);
        document.getElementById("nextDaysWeather").style.display = "block";
        document.getElementById("weatherResult").style.display = "block";
      }, 500);
    }
  } catch (error) {
    console.error("Fetch error:", error);
    setTimeout(() => {
      document.getElementById("weatherResult").innerText =
        "Fejl: Kunne ikke hente vejrdata";
    }, 500);
  }
}

// Start med at vise Aarhus vejret når siden indlæses
window.onload = async () => {
  // Hent vejr for Aarhus
  await fetchWeather("Aarhus");
};