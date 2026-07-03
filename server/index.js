const fs = require('fs');
const http = require('http');
const path = require('path');
const { URL } = require('url');

const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'build');

loadEnvFile(path.join(rootDir, '.env'));

const PORT = process.env.PORT || 5050;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

const OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
const OPENWEATHER_GEO_API_URL = 'https://api.openweathermap.org/geo/1.0';

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (requestUrl.pathname === '/api/health') {
      return sendJson(res, 200, { status: 'ok' });
    }

    if (requestUrl.pathname === '/api/weather') {
      return handleWeatherRequest(requestUrl, res);
    }

    if (requestUrl.pathname === '/api/cities') {
      return handleCitiesRequest(requestUrl, res);
    }

    return serveReactApp(requestUrl.pathname, res);
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { message: 'Internal server error' });
  }
});

async function handleWeatherRequest(requestUrl, res) {
  if (!OPENWEATHER_API_KEY) {
    return sendJson(res, 500, { message: 'Missing OPENWEATHER_API_KEY' });
  }

  const lat = requestUrl.searchParams.get('lat');
  const lon = requestUrl.searchParams.get('lon');

  if (!lat || !lon) {
    return sendJson(res, 400, { message: 'lat and lon are required' });
  }

  const query = `lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(
    lon
  )}&appid=${OPENWEATHER_API_KEY}&units=metric`;

  const [currentResponse, forecastResponse] = await Promise.all([
    fetch(`${OPENWEATHER_API_URL}/weather?${query}`),
    fetch(`${OPENWEATHER_API_URL}/forecast?${query}`),
  ]);

  const [current, forecast] = await Promise.all([
    currentResponse.json(),
    forecastResponse.json(),
  ]);

  if (!currentResponse.ok || !forecastResponse.ok) {
    return sendJson(res, currentResponse.status || forecastResponse.status, {
      message: current.message || forecast.message || 'Weather API failed',
    });
  }

  return sendJson(res, 200, { current, forecast });
}

async function handleCitiesRequest(requestUrl, res) {
  if (!OPENWEATHER_API_KEY) {
    return sendJson(res, 500, { message: 'Missing OPENWEATHER_API_KEY' });
  }

  const search = requestUrl.searchParams.get('search') || '';

  if (search.trim().length < 2) {
    return sendJson(res, 200, { data: [] });
  }

  const response = await fetch(
    `${OPENWEATHER_GEO_API_URL}/direct?q=${encodeURIComponent(
      search
    )}&limit=10&appid=${OPENWEATHER_API_KEY}`
  );
  const data = await response.json();

  if (!response.ok) {
    return sendJson(res, response.status, {
      message: data.message || 'City search failed',
    });
  }

  return sendJson(res, 200, {
    data: data.map((city) => ({
      latitude: city.lat,
      longitude: city.lon,
      name: city.name,
      countryCode: city.country,
    })),
  });
}

function serveReactApp(pathname, res) {
  let filePath = path.join(buildDir, pathname === '/' ? 'index.html' : pathname);

  if (!filePath.startsWith(buildDir)) {
    return sendText(res, 403, 'Forbidden');
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(buildDir, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    return sendText(res, 404, 'Build folder not found. Run npm run build first.');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType =
    {
      '.css': 'text/css',
      '.html': 'text/html',
      '.ico': 'image/x-icon',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
      '.txt': 'text/plain',
    }[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, message) {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
  res.end(message);
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

server.listen(PORT, () => {
  console.log(`Weather app server running on http://localhost:${PORT}`);
});
