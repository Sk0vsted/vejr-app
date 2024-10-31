// Importerer nødvendige moduler
const https = require('https');
const http = require('http');
const dotenv = require('dotenv');

dotenv.config();  // Læs API-nøglen fra .env-filen
const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

// Opretter en HTTP-server, som håndterer forespørgsler
const server = http.createServer((req, res) => {

  // CORS...
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Endpoint for nuværende vejrdata
  if (req.url.startsWith('/weather')) { // f.eks. http://localhost:3000/weather?city=Aarhus
    const cityName = req.url.split('city=')[1]?.split('&')[0];  // Henter "city" parameteren fra URL'en

    // Hvis "city" mangler, sendes en 400-fejl (Bad Request)
    if (!cityName) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('City name is required');
      return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${API_KEY}&units=metric`;

    // Sender en GET-forespørgsel til OpenWeatherMap API
    https
      .get(apiUrl, (response) => {
        // Her bliver en callback-funktion registreret til at køre, når vi modtager svar fra API'et.
        // Denne callback vil først blive lagt på callstack'en, når vi modtager data.
        
        let data = '';  // Bruges til at samle data fra API'et
        response.on('data', (chunk) => {
          data += chunk;  // Tilføjer hver "chunk" til den tomme variabel "data"
          // "data"-eventen kører en callback, hver gang der modtages en chunk fra API’et.
          // Hver "data"-callback tilføjes til callstack’en, når en ny chunk modtages.
        });
        response.on('end', () => { 
          // Når "end"-eventen aktiveres, placeres denne callback på callstack'en og køres. Response.on('end') kører kun når alle response.on('data') er kørt.
          // Dette sker først, når al data er modtaget fra API’et, som nævnt ovenfor.

          const weatherData = JSON.parse(data);  // Konverterer data til JSON-format
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(weatherData));  // Sender dataen tilbage til klienten via. res (som står for response)
        });
      })
      .on('error', (error) => {
        // Fejl i API-kaldet aktiverer denne "error"-callback, som lægges på callstack'en, og kører når der opstår en fejl.
        // Denne callback bliver kun kørt hvis der opstår enhver form for fejl i API-kaldet.
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error fetching weather data');
      });



  // ENDPOINT TIL FREMVISNING AF UGENTLIG VEJRUDSIGT
  // Hvis URL'en starter med '/weeklyWeather', henter vi ugentlig vejrudsigt
  // Vi bruger mere eller mindre det samme princip som før. Dog ændres API URL og parametren i vores HTTPS GET request til weeklyResponse istedet.
  // Endpoint til ugentlig vejrudsigt
  } else if (req.url.startsWith('/weeklyWeather')) {
    const cityName = req.url.split('city=')[1]?.split('&')[0];

    if (!cityName) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('City name is required');
      return;
    }

    const weeklyApiUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${cityName}&cnt=7&units=metric&appid=${API_KEY}`;

    https
      .get(weeklyApiUrl, (weeklyResponse) => {
        // Ligesom før registreres callback-funktioner for både data- og end-events her.
        
        let weeklyData = '';  // Samler data fra API'et
        weeklyResponse.on('data', (chunk) => {
          weeklyData += chunk;  // Tilføjer hver "chunk" til "weeklyData"
          // Hver "data" callback tilføjes til callstack'en og kører, når en ny chunk modtages.
        });
        weeklyResponse.on('end', () => {
          // "end"-callbacken lægges på callstack'en, når al data er modtaget.
          const weeklyWeatherData = JSON.parse(weeklyData);  // Konverterer data til JSON-format
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(weeklyWeatherData));  // Sender dataen tilbage til klienten
        });
      })
      .on('error', (error) => {
        // "error"-callbacken tilføjes til callstack'en, hvis der opstår en fejl.
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error fetching weekly weather data');
      });

  } else {  // Hvis URL'en ikke matcher nogen endpoints, returneres en 404-fejl
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

// Starter serveren og lytter på port 3000
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
