![Application screenshot](./public/screenshot.png)

<br/>
<br/>

With The Weather Forecasting, users can search locations by city name and observe the current weather plus a 5-6 day forecast at 3 hour intervals.
<br />
The app is built as a full-stack JavaScript project with a React frontend, Node.js REST API backend, Docker support, and GitHub Actions CI automation.

<br/>

## 💻 Live Demo:

https://the-weather-forecasting.netlify.app

<br/>

## ✨ Getting Started

- Make sure you already have `Node.js` and `npm` installed in your system.
- You need an API key from [OpenWeatherMap](https://openweathermap.org/). After creating an account, [grab your key](https://home.openweathermap.org/api_keys).
- Copy `.env.example` to `.env` and add your key:

```bash
OPENWEATHER_API_KEY=your_openweathermap_api_key_here
PORT=5050
```

<br/>

## ⚡ Install

- Clone the repository:

```bash
git clone https://github.com/Amin-Awinti/the-weather-forecasting.git

```

- Install the packages using the command `npm install`

- Run the Node.js API server:

```bash
npm run dev:api
```

- In another terminal, run the React frontend:

```bash
npm start
```

The React app runs on `http://localhost:3000` and proxies API calls to the Node server on `http://localhost:5050`.

<br/>

## 🔌 REST API

- `GET /api/health` - Health check endpoint.
- `GET /api/cities?search=Paris` - Search city options.
- `GET /api/weather?lat=48.8566&lon=2.3522` - Fetch current weather and forecast.

<br/>

## 🐳 Docker

Run the full application with Docker:

```bash
docker compose up --build
```

Then open `http://localhost:5050`.

<br/>

## 🚀 CI/CD

GitHub Actions runs on pushes and pull requests to `main`. The workflow installs dependencies, runs tests, builds the React app, and verifies the Docker image build.

<br/>

## 📙 Used libraries

- `react-js`
- `material-ui`
- `node-js`
- `docker`
- `github-actions`

Check `packages.json` for details

<br/>

## 📄 Todos

- [ ] Styled-components
- [ ] Convert the entire project to TypeScript
- [ ] Unit Testing
- [ ] On launch, find user location weather by utilizing GeolocationAPI/GEOCODING
- [ ] Celcius/Fahrenheit conversion
- [ ] Dark/Light Mode

<br/>
Thank You ☺
