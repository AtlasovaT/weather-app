<template>
    <div class="weather-wrapper">
      <div class="weather-wrapper__icon">
        <img
          :src="getImgUrl(weather_icon)"
          alt="Vue logo"
        />
      </div>
      <div class="weather-wrapper__head">{{ weather_name }} in {{ titleLoc }}</div>
      <div class="weather-wrapper__current">Current: <span>{{ current }}&deg;</span></div>
      <div class="weather-wrapper__high">High: <span>{{ temperatureMax }}&deg;</span></div>
      <div class="weather-wrapper__low">Low: <span>{{ temperatureMin }}&deg;</span></div>
      <div class="weather-wrapper__wind">Wind Speed: <span>{{ wind_speed }} mi/hr</span></div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'weather',
  data () {
    return {
      titleLoc: String,
      temperatureMin: Number,
      temperatureMax: Number,
      weather: Object,
      weather_name: String,
      current: Number,
      wind_speed: Number,
      weather_icon: String,
      woeId: String,
      weather_state: String,
      pictures_day: [
        { state: 'sn', path: 'icons/snow.png' },
        { state: 'sl', path: 'icons/sleet.png' },
        { state: 'h', path: 'icons/hail.svg' },
        { state: 't', path: 'icons/thunder.png' },
        { state: 'hr', path: 'icons/rain.png' },
        { state: 'lr', path: 'icons/rain.png' },
        { state: 's', path: 'icons/day_rain.png' },
        { state: 'hc', path: 'icons/cloudy.png' },
        { state: 'lc', path: 'icons/day_partial_cloud.png' },
        { state: 'c', path: 'icons/day_clear.png' }
      ],
      pictures_night: [
        { state: 'sn', path: 'icons/snow.png' },
        { state: 'sl', path: 'icons/sleet.png' },
        { state: 'h', path: 'icons/hail.svg' },
        { state: 't', path: 'icons/thunder.png' },
        { state: 'hr', path: 'icons/rain.png' },
        { state: 'lr', path: 'icons/rain.png' },
        { state: 's', path: 'icons/night_half_moon_rain.png' },
        { state: 'hc', path: 'icons/cloudy.png' },
        { state: 'lc', path: 'icons/night_half_moon_partial_cloud.png' },
        { state: 'c', path: 'icons/night_half_moon_clear.png' }
      ]
    }
  },
  methods: {
    getWeatherData: function (lat, long) {
      axios.get('/api/location/search/?lattlong=' + lat + ',' + long)
        .then((response) => {
          this.woeId = response.data[0].woeid
          axios.get('/api/location/' + this.woeId + '/')
            .then((response) => {
              this.weather = response.data
              this.weather_name = this.weather.consolidated_weather[0].weather_state_name
              this.titleLoc = this.weather.title
              this.temperatureMax = Math.round(this.weather.consolidated_weather[0].max_temp)
              this.temperatureMin = Math.round(this.weather.consolidated_weather[0].min_temp)
              this.current = Math.round(this.weather.consolidated_weather[0].the_temp)
              this.wind_speed = Math.round(this.weather.consolidated_weather[0].wind_speed)
              this.weather_state = this.weather.consolidated_weather[0].weather_state_abbr
              let i = 0
              const now = this.weather.time
              let periodDay
              if ((now >= this.weather.sun_rise) && (now < this.weather.sun_set)) {
                periodDay = this.pictures_day
              } else {
                periodDay = this.pictures_night
              }
              while (i < periodDay.length) {
                if (periodDay[i].state === this.weather_state) {
                  this.weather_icon = periodDay[i].path
                }
                i++
              }
            })
        })
    },
    visibility: function () {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude.toFixed(3)
        const long = position.coords.longitude.toFixed(3)
        this.getWeatherData(lat, long)
      })
    },
    getImgUrl: function (pic) {
      return require('@/assets/' + pic)
    }
  },
  created: function () {
    this.visibility()
  }
}
</script>
