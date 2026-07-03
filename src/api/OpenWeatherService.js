const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export async function fetchWeatherData(lat, lon) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/weather?lat=${lat}&lon=${lon}`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Unable to fetch weather data');
    }

    return [data.current, data.forecast];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function fetchCities(input) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/cities?search=${encodeURIComponent(input)}`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Unable to fetch cities');
    }

    return data;
  } catch (error) {
    console.log(error);
    return;
  }
}
