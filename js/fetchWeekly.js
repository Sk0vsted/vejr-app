// Definer ugedage på dansk
const daysOfWeek = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];

// Brug `fetchWeatherDescriptions` fra `script.js` og kald `fetchWeeklyWeather(city, weatherDescriptions)`
async function fetchWeeklyWeather(city, weatherDescriptions) {
  // Vis nextDaysWeather div'en
  document.getElementById("nextDaysWeather").classList.remove("hidden");
  
  const apiUrl = `http://localhost:3000/weeklyWeather?city=${city}`;

  try {
    const response = await fetch(apiUrl);
    const weeklyData = await response.json();

    if (response.ok && weeklyData.list) {
      const today = new Date();

      // Iterér over hver dag i listen og opdater HTML-elementerne
      weeklyData.list.forEach((dailyData, i) => {
        const dayIndex = (today.getDay() + i) % 7;
        const dayName = daysOfWeek[dayIndex];

        const tempDay = dailyData.temp.day;
        const windSpeed = dailyData.speed;
        const rain = dailyData.rain || 0;

        const apiDescription = dailyData.weather[0].description;
        const translatedDescription = weatherDescriptions[apiDescription] || apiDescription;

        const iconPath = weatherIcons[translatedDescription] || "img/icons/solrig.svg";

        // Opdater HTML-elementer
        document.getElementById(`day${i + 1}Name`).innerText = dayName;
        document.getElementById(`day${i + 1}Degrees`).innerText = `${tempDay.toFixed(0)}°`;
        document.getElementById(`day${i + 1}Wind`).innerText = `${windSpeed.toFixed(1)} m/s`;
        document.getElementById(`day${i + 1}Rain`).innerText = `${rain.toFixed(1)} mm`;

        // Tilføj ikon og alt tekst baseret på oversat beskrivelse
        document.getElementById(`day${i + 1}Icon`).src = iconPath;
        document.getElementById(`day${i + 1}Icon`).alt = translatedDescription;
      });
    } else {
      console.error("Error fetching weekly weather data:", response.status);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}