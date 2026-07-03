import React, { useState } from 'react';
import { Box, Container, Grid, Link, SvgIcon, Typography } from '@mui/material';
import Search from './components/Search/Search';
import WeeklyForecast from './components/WeeklyForecast/WeeklyForecast';
import TodayWeather from './components/TodayWeather/TodayWeather';
import { fetchWeatherData } from './api/OpenWeatherService';
import { transformDateFormat } from './utilities/DatetimeUtils';
import UTCDatetime from './components/Reusable/UTCDatetime';
import LoadingBox from './components/Reusable/LoadingBox';
import { ReactComponent as SplashIcon } from './assets/splash-icon.svg';
import Logo from './assets/logo.png';
import ErrorBox from './components/Reusable/ErrorBox';
import { ALL_DESCRIPTIONS } from './utilities/DateConstants';
import GitHubIcon from '@mui/icons-material/GitHub';
import {
  getTodayForecastWeather,
  getWeekForecastWeather,
} from './utilities/DataUtils';

function App() {
  const [todayWeather, setTodayWeather] = useState(null);
  const [todayForecast, setTodayForecast] = useState([]);
  const [weekForecast, setWeekForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const searchChangeHandler = async (enteredData) => {
    const [latitude, longitude] = enteredData.value.split(' ');

    setIsLoading(true);

    const currentDate = transformDateFormat();
    const date = new Date();
    let dt_now = Math.floor(date.getTime() / 1000);

    try {
      const [todayWeatherResponse, weekForecastResponse] =
        await fetchWeatherData(latitude, longitude);
      const all_today_forecasts_list = getTodayForecastWeather(
        weekForecastResponse,
        currentDate,
        dt_now
      );

      const all_week_forecasts_list = getWeekForecastWeather(
        weekForecastResponse,
        ALL_DESCRIPTIONS
      );

      setTodayForecast([...all_today_forecasts_list]);
      setTodayWeather({ city: enteredData.label, ...todayWeatherResponse });
      setWeekForecast({
        city: enteredData.label,
        list: all_week_forecasts_list,
      });
    } catch (error) {
      setError(true);
    }

    setIsLoading(false);
  };

  let appContent = (
    <Box
      xs={12}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: '100%',
        minHeight: '500px',
      }}
    >
      <SvgIcon
        component={SplashIcon}
        inheritViewBox
        sx={{ fontSize: { xs: '100px', sm: '120px', md: '140px' } }}
      />
      <Typography
        variant="h4"
        component="h4"
        sx={{
          fontSize: { xs: '12px', sm: '14px' },
          color: '#111827',
          fontFamily: 'Poppins',
          textAlign: 'center',
          margin: '2rem 0',
          maxWidth: '80%',
          lineHeight: '22px',
        }}
      >
        Explore current weather data and 6-day forecast of more than 200,000
        cities!
      </Typography>
    </Box>
  );

  if (todayWeather && todayForecast && weekForecast) {
    appContent = (
      <React.Fragment>
        <Grid item xs={12} md={todayWeather ? 6 : 12}>
          <Grid item xs={12}>
            <TodayWeather data={todayWeather} forecastList={todayForecast} />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <WeeklyForecast data={weekForecast} />
        </Grid>
      </React.Fragment>
    );
  }

  if (error) {
    appContent = (
      <ErrorBox
        margin="3rem auto"
        flex="inherit"
        errorMessage="Something went wrong"
      />
    );
  }

  if (isLoading) {
    appContent = (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: '500px',
        }}
      >
        <LoadingBox value="1">
          <Typography
            variant="h3"
            component="h3"
            sx={{
              fontSize: { xs: '10px', sm: '12px' },
              color: '#111827',
              lineHeight: 1,
              fontFamily: 'Poppins',
            }}
          >
            Loading...
          </Typography>
        </LoadingBox>
      </Box>
    );
  }

  return (
    <Container
      disableGutters
      sx={{
        maxWidth: { xs: 'calc(100% - 2rem)', sm: '80%', md: '1100px' },
        width: '100%',
        height: '100%',
        margin: { xs: '1rem auto 0', sm: '2.5rem auto 0' },
        padding: { xs: '1.5rem 0 3rem', sm: '2rem 0 3.5rem' },
        marginBottom: '1rem',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        borderRadius: {
          xs: 'none',
          sm: '0 0 1rem 1rem',
        },
        boxShadow: {
          xs: 'none',
          sm: 'rgba(15, 23, 42, 0.18) 0px 18px 45px -18px, rgba(15, 23, 42, 0.12) 0px 8px 18px -12px',
        },
      }}
    >
      <Grid container columnSpacing={{ xs: 0, md: 2 }}>
        <Grid item xs={12}>
          <Box
            display="grid"
            alignItems="center"
            sx={{
              width: '100%',
              boxSizing: 'border-box',
              gridTemplateColumns: {
                xs: 'minmax(0, 1fr) auto minmax(40px, 1fr)',
                sm: '1fr auto 1fr',
              },
              columnGap: { xs: '.75rem', sm: '1.5rem' },
              marginBottom: { xs: '1.25rem', sm: '1.75rem' },
              padding: { xs: '0 1.75rem', sm: '0 2.25rem', md: '0 3rem' },
            }}
          >
            <Box
              component="img"
              sx={{
                height: { xs: '16px', sm: '22px', md: '26px' },
                maxWidth: { xs: '120px', sm: '180px' },
                width: 'auto',
                justifySelf: 'start',
              }}
              alt="logo"
              src={Logo}
            />

            <UTCDatetime color="#111827" />
            <Link
              href="https://github.com/manisha666-star/The-Weather-Forecasting"
              target="_blank"
              underline="none"
              sx={{
                display: 'flex',
                justifySelf: 'end',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: '32px', sm: '36px' },
                height: { xs: '32px', sm: '36px' },
                borderRadius: '50%',
                '&:hover': {
                  backgroundColor: 'rgba(17,24,39,.08)',
                },
              }}
            >
              <GitHubIcon
                sx={{
                  fontSize: { xs: '20px', sm: '22px', md: '26px' },
                  color: '#111827',
                  '&:hover': { color: '#2d95bd' },
                }}
              />
            </Link>
          </Box>
          <Box
            sx={{
              boxSizing: 'border-box',
              padding: { xs: '0 1.75rem', sm: '0 2.25rem', md: '0 3rem' },
            }}
          >
            <Search onSearchChange={searchChangeHandler} />
          </Box>
        </Grid>
        {appContent}
      </Grid>
    </Container>
  );
}

export default App;
