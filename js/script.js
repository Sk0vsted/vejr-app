// Tilføjer en click-event til knappen "getWeather", som kalder "fetchWeather" funktionen for at hente vejrdata
document.getElementById('getWeather').addEventListener('click', () => fetchWeather());

// Tilføjer en keydown-event til input-feltet, så "Enter"-tasten også kan kalde "fetchWeather"
document.getElementById('cityInput').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    fetchWeather();
  }
});

// Objekt der gemmer vejrikoner for forskellige vejrtyper baseret på beskrivelsen fra API'et
const weatherIcons = {
  Solrig: 'img/icons/solrig.svg',
  'Mest Solrigt': 'img/icons/lidtSkyet.svg',
  'Delvis skyet': 'img/icons/lidtSkyet.svg',
  Skyet: 'img/icons/skyet.svg',
  Byger: 'img/icons/lidtRegn.svg',
  Regn: 'img/icons/megetRegn.svg',
  Tordenvejr: 'img/icons/tordenvejr.svg',
  Sne: 'img/icons/sne.svg',
  Tåge: 'img/icons/foggy.svg',
  'Let regn': 'img/icons/lidtRegn.svg',
  'Moderat regn': 'img/icons/megetRegn.svg',
  'Kraftig regn': 'img/icons/megetRegn.svg',
  Skybrud: 'img/icons/megetRegn.svg',
  Hagl: 'img/icons/sne.svg',
  'Tæt tåge': 'img/icons/foggy.svg',
  Overskyet: 'img/icons/skyet.svg',
  Røg: 'img/icons/foggy.svg',
  Vind: 'img/icons/vind.svg',
};

// Henter landet data fra JSON-fil og returnerer det som JSON-format
async function fetchCountryData() {
  const response = await fetch('../jsonData/countries.json');  // Starter en asynkron HTTP-forespørgsel
  const countryData = await response.json();  // Konverterer responsen til JSON-format, når data er modtaget
  return countryData;  // Returnerer det modtagne JSON-data
}

// Henter vejrbetingelser fra JSON-fil og returnerer det som JSON-format
async function fetchWeatherDescriptions() {
  const response = await fetch('../jsonData/weathers.json');  // Starter en asynkron HTTP-forespørgsel
  const weatherData = await response.json();  // Konverterer responsen til JSON-format
  return weatherData;  // Returnerer JSON-data med vejrbetingelser
}

// Funktion til at hente og vise vejrdata for en bestemt by, enten valgt af brugeren eller standard
async function fetchWeather(defaultCity) {
  let city = defaultCity || document.getElementById('cityInput').value;  // Sætter byen til brugerinput eller standard

  if (!city) {  // Hvis ingen by er valgt, logges en fejl
    console.error('Ingen by angivet');
    return;
  }

  const apiUrl = `http://localhost:3000/weather?city=${city}`;  // API-url, som henter vejrdata for den valgte by

  try {
    // `Promise.all()` venter på, at alle fetch-kald er færdige, så data kan bruges på samme tid
    const [weatherResponse, countryData, weatherDescriptions] = await Promise.all([
      fetch(apiUrl),  // Henter vejrdata for den valgte by
      fetchCountryData(),  // Henter landeinformation
      fetchWeatherDescriptions(),  // Henter vejrbetingelsesbeskrivelser
    ]);

    const weatherData = await weatherResponse.json();  // Konverterer vejrdata til JSON-format

    if (weatherResponse.ok) {  // Hvis vejrdata er korrekt modtaget, opdateres visningen med resultaterne
      document.getElementById('weatherResult').classList.remove('hidden');  // Gør vejrdata synligt på siden

      const weatherDescription = weatherData.weather[0].description;  // Henter vejrbeskrivelse fra API
      const translatedDescription = weatherDescriptions[weatherDescription] || weatherDescription;  // Oversætter beskrivelsen, hvis muligt
      const iconPath = weatherIcons[translatedDescription] || 'img/icons/solrig.svg';  // Vælger et ikon, der passer til vejret
      document.getElementById('weatherIcon').src = iconPath;  // Opdaterer ikonet på siden

      // Skifter baggrundsvideoen baseret på vejrtype
      let videoPath;
      switch (translatedDescription) {
        case 'Solrig': videoPath = './vid/sunny.mp4'; break;
        case 'Delvis skyet':
        case 'Mest Solrigt': videoPath = './vid/cloudy.mp4'; break;
        case 'Overskyet':
        case 'Skyet': videoPath = './vid/clouds.mp4'; break;
        case 'Byger':
        case 'Let regn':
        case 'Moderat regn':
        case 'Kraftig regn':
        case 'Skybrud': videoPath = './vid/rain.mp4'; break;
        case 'Tordenvejr': videoPath = './vid/thunder.mp4'; break;
        case 'Sne':
        case 'Hagl': videoPath = './vid/snow.mp4'; break;
        case 'Tåge':
        case 'Røg':
        case 'Tæt tåge': videoPath = './vid/rain.mp4'; break;
        default: videoPath = './vid/sunny.mp4'; break;
      }
      document.getElementById('videoBg').src = videoPath;  // Opdaterer video-kilden
      document.getElementById('videoBg').parentElement.load();  // Genindlæser videoen

      const countryCode = weatherData.sys.country;
      const countryName = countryData[countryCode] || 'Land ikke fundet';  // Finder landet ud fra landekode

      // Opdaterer vejr-elementer på siden med en kort forsinkelse for en glidende overgang
      setTimeout(() => {
        document.getElementById('degrees').innerText = `${parseFloat(weatherData.main.temp).toFixed(0)}°`;
        document.getElementById('city').innerText = city;
        document.getElementById('country').innerText = countryName;
        document.getElementById('feelsLike').innerText = `Føles som ${parseFloat(weatherData.main.feels_like).toFixed(0)}°`;
        document.getElementById('humidity').innerText = `${weatherData.rain ? weatherData.rain['1h'] : 0} mm `;
        document.getElementById('howWindy').innerText = `${parseFloat(weatherData.wind.speed).toFixed(0)} m/s`;
        document.getElementById('weatherDescription').innerText = translatedDescription;
      }, 500);  // Forsinkelse på 500ms for bedre brugeroplevelse

      // Viser ugentlig vejrudsigt med samme forsinkelse på 500ms
      setTimeout(() => {
        fetchWeeklyWeather(city, weatherDescriptions);
        document.getElementById('nextDaysWeather').style.display = 'block';
      }, 500);
    }
  } catch (error) {  // Håndterer fejl i datahentningen
    console.error('Fetch error:', error);  // Logger fejlen i konsollen
    // Viser en fejlbesked til brugeren efter en forsinkelse
    setTimeout(() => {
      document.getElementById('weatherResult').innerText = 'Fejl: Kunne ikke hente vejrdata';
    }, 500);
  }
}


// Funktion der henter og viser ugens vejrudsigt
async function fetchWeeklyWeather(city, weatherDescriptions) {
  // Gør sektionen `nextDaysWeather` synlig, som viser vejrudsigt for de kommende dage
  document.getElementById("nextDaysWeather").classList.remove("hidden");
  // Definerer ugedagene på dansk for at vise dem i vejrudsigt-sektionen
    const daysOfWeek = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];

  // API-URL til at hente ugentlig vejrdata for den valgte by
  const apiUrl = `http://localhost:3000/weeklyWeather?city=${city}`;

  try {
    // Henter data fra API’et og konverterer responsen til JSON
    const response = await fetch(apiUrl);
    const weeklyData = await response.json();

    // Tjekker om responsen er korrekt
    if (response.ok) {
      const today = new Date();  // Dagens dato bruges til at finde de næste dages navne

      // Gennemgår hver dag i API-data og opdaterer HTML-elementer for dagene
      weeklyData.list.forEach((dailyData, i) => {

        // Beregner indekset for ugedagen (0-6), så det passer med `daysOfWeek`
        const dayIndex = (today.getDay() + i) % 7;
        const dayName = daysOfWeek[dayIndex];  // Henter det danske navn på dagen

        // Henter temperatur, vindhastighed og mængden af regn for dagen
        const tempDay = dailyData.temp.day;
        const windSpeed = dailyData.speed;
        const rain = dailyData.rain || 0;

        // Henter og oversætter vejrbetingelse for dagen
        const apiDescription = dailyData.weather[0].description;
        const translatedDescription = weatherDescriptions[apiDescription] || apiDescription;

        // Vælger ikon til vejret for dagen
        const iconPath = weatherIcons[translatedDescription] || "img/icons/solrig.svg";

        // Opdaterer HTML-elementer for dagene i vejrudsigten
        document.getElementById(`day${i + 1}Name`).innerText = dayName;
        document.getElementById(`day${i + 1}Degrees`).innerText = `${tempDay.toFixed(0)}°`;
        document.getElementById(`day${i + 1}Wind`).innerText = `${windSpeed.toFixed(1)} m/s`;
        document.getElementById(`day${i + 1}Rain`).innerText = `${rain.toFixed(1)} mm`;

        // Tilføjer ikon og alt tekst baseret på oversat beskrivelse
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

// Henter og viser vejret for Aarhus som standard, når siden indlæses
window.onload = async () => {
  await fetchWeather('Aarhus');
};
