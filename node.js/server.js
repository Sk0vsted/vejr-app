// OBS - server skal køre for at kunne hente vejrdata fra OpenWeatherMap API
// Kør serveren ved at køre "node server.js" i terminalen

const https = require("https");
const http = require("http");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();
const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

const server = http.createServer((req, res) => {
  // Accepter CORS forespørgsler
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Håndter forskellige endpoints
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream(path.join(__dirname, "../index.html")).pipe(res);
  } else if (req.url.startsWith("/weather")) {
    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const cityName = urlParams.searchParams.get("city");

    if (!cityName) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("City name is required");
      return;
    }

    const apiUrl = `https://pro.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${API_KEY}&units=metric`;

    // Hent vejrdata fra OpenWeatherMap API
    https
      .get(apiUrl, (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          const weatherData = JSON.parse(data);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(weatherData));
        });
      })
      .on("error", (error) => {
        console.error(error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error fetching weather data");
      });
  } else if (req.url === "/script.js") {
    // Send script.js filen til klienten
    res.writeHead(200, { "Content-Type": "application/javascript" });
    fs.createReadStream(path.join(__dirname, "script.js")).pipe(res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

// Start serveren på port 3000
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
