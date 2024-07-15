import OutfitRenderer from "./outfit"

class WeatherRenderer {
  constructor() {
    this.initEventListeners()
    this.outfitRenderer = new OutfitRenderer()
    this.getWeatherData()
  }

  initEventListeners() {
    document.getElementById('weather-input').addEventListener('keyup', (event) => {
      if (event.code === 'Enter') {
        const zipCode = event.target.value
        if (this.isValidZipCode(zipCode))
          this.getWeatherData(zipCode)
      }
    })
    document.getElementById('search-button').addEventListener('click', () => {
      const zipCode = document.getElementById('weather-input').value
      if (this.isValidZipCode(zipCode))
        this.getWeatherData(zipCode)
    })
  }

  getWeatherData(zipCode = undefined) {
    if (!zipCode) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.getWeatherDataFromAPI({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          })
        })
      } else {
        console.error('Geolocation is not supported by this browser.')
      }
    } else {
      this.getWeatherDataFromAPI({
        zipCode: zipCode,
        countryCode: 'in'
      })
    }
  }

  getWeatherDataFromAPI(locationData) {
    const apiKey = '22b028eb6b59e858567cad384261bde1';
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=imperial`;
    if (locationData.lat !== undefined && locationData.lon !== undefined) {
      url += `&lat=${locationData.lat}&lon=${locationData.lon}`
    } else {
      url += `&zip=${locationData.zipCode},${locationData.countryCode}`
    }

    console.log('Request URL:', url); // Log the request URL for debugging

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json()
      })
      .then(weatherData => {
        console.log('Weather Data:', weatherData); // Log the weather data for debugging
        this.displayWeatherData(weatherData)

        const categories = this.getCategories(weatherData)
        this.outfitRenderer.displayCategories(categories)
      })
      .catch(error => console.error('Error:', error))
  }
  displayWeatherData(weatherData) {
    // Adjusted paths assuming images are in the same directory as the HTML file
    document.getElementById('temperature-icon').src = weatherData.main.temp > 60 ? 'assets/images/clear.png' : 'assets/images/mist.png';

    document.getElementById('temperature-text').innerText = `${Math.round(weatherData.main.temp)}°F`;

    document.getElementById('location-text').innerText = weatherData.name;

    document.getElementById('min-temperature-text').innerHTML = `<div>Low</div><div>${Math.round(weatherData.main.temp_min)}°F</div>`;
    document.getElementById('max-temperature-text').innerHTML = `<div>High</div><div>${Math.round(weatherData.main.temp_max)}°F</div>`;
}


  getCategories(weatherData) {
    const mensCategories = []
    const womensCategories = []

    const temperature = weatherData.main.temp

    if (temperature <= 40) {
      mensCategories.push('men_jacketscoats', 'men_hoodiessweatshirts', 'men_shirts', 'men_trousers', 'men_jeans')
      womensCategories.push('ladies_jacketscoats', 'ladies_hoodiessweatshirts', 'ladies_trousers', 'ladies_jeans')
    } else if (temperature > 40 && temperature <= 60) {
      mensCategories.push('men_cardigansjumpers', 'men_hoodiessweatshirts', 'men_shirts', 'men_trousers', 'men_jeans')
      womensCategories.push('ladies_cardigansjumpers', 'ladies_hoodiessweatshirts', 'ladies_tops', 'ladies_shirtsblouses', 'ladies_trousers', 'ladies_jeans', 'ladies_dresses')
    } else if (temperature > 60 && temperature <= 70) {
      mensCategories.push('men_shirts', 'men_tshirtstanks', 'men_shorts', 'men_trousers', 'men_jeans')
      womensCategories.push('ladies_tops', 'ladies_shirtsblouses', 'ladies_trousers', 'ladies_jeans', 'ladies_skirts', 'ladies_dresses')
    } else {
      mensCategories.push('men_tshirtstanks', 'men_shorts')
      womensCategories.push('ladies_tops', 'ladies_shirtsblouses', 'ladies_skirts', 'ladies_shorts', 'ladies_dresses')
    }
    return { men: mensCategories, women: womensCategories }
  }

  isValidZipCode(zipCode) {
    return zipCode?.length == 6 && /^\d+$/.test(zipCode)
  }
}

export default WeatherRenderer;
