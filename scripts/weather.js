async function changeWeatherData() {

    let city 
    let inputValue = document.getElementById("header__input").value
    if(inputValue !== ''){
        city = inputValue        
    }else {
        if(localStorage.getItem('current_city')){
            city = localStorage.getItem('current_city')
        }
        else{
            city = 'Minsk'
        }
        
    }
    console.log(city)
    const key = "132a369a2d31b40d11029b9f913b16a6"
    const currentWeatherURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&lang=ru`
    const forecastURL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&lang=ru`
    let currentWeather
    let forecast
    
        weather_response = await fetch(currentWeatherURL)
        forecast_response = await fetch(forecastURL)
        currentWeather = await weather_response.json()
        forecast = await forecast_response.json()
        localStorage.setItem('current_city', city)
        console.log(currentWeather.cod)
        if (currentWeather.cod == 200 && forecast.cod == 200){
            changeDateTime(currentWeather)
            await changeLocation(currentWeather)
            await changeCurrentWeather(currentWeather)
            await changeForecast(forecast)
        }
        else{
            alert("Город не найден")
        }
}

function changeDateTime(response) {
    localStorage.setItem("currentTimeZone", response.timezone + "000")
}

async function changeCurrentWeather(response) {
    document.getElementById("weather__desc").textContent = response.weather[0].description
    document.getElementById("weather__feels").textContent =
        `Ощущается как: ${Math.round(response.main.feels_like - KELVIN_ABSOLUTE_ZERO)}°`
    document.getElementById("weather__wind").textContent =
        `Ветер: ${response.wind.speed} m/s`
    document.getElementById("weather__humidity").textContent =
        `Влажность: ${response.main.humidity}%`
    document.getElementById("today__temperature").textContent =
        `${Math.round(response.main.temp - KELVIN_ABSOLUTE_ZERO)}°`
    let picture_name = "img/weather/" + response.weather[0].main.toLowerCase() + ".svg"
    document.getElementById("today__image").setAttribute("src", picture_name)
}


async function changeForecast(response) {
    const findElementByDate = (date) => {
        let local_date = date.toLocaleDateString('ko-KR', {year: "numeric", month: "2-digit", day: "2-digit"})
            .replaceAll(". ", "-")
            .replaceAll(".", "")
        local_date += " 12:00:00"
        // console.log(local_date)
        let found_day
        for (let day of response.list) {
            if (day.dt_txt === local_date) {
                found_day = day
                break
            }
        }
        return found_day
    }

    const changeTemperatureValue = (day, index) => {
        document.getElementById(`next-day__temperature${index}`).textContent =
            `${Math.round(day.main.temp - KELVIN_ABSOLUTE_ZERO)}°`
    }

    const changeImage = (day, index) => {
        let picture_name = "img/weather/" + day.weather[0].main.toLowerCase() + ".svg"
        document.getElementById(`next-day__image${index}`).setAttribute("src", picture_name)
    }

    let now = Date.now()
    let day1 = findElementByDate(new Date(now + MILLISECONDS_IN_DAY))
    let day2 = findElementByDate(new Date(now + 2 * MILLISECONDS_IN_DAY))
    let day3 = findElementByDate(new Date(now + 3 * MILLISECONDS_IN_DAY))

    changeTemperatureValue(day1, 1)
    changeTemperatureValue(day2, 2)
    changeTemperatureValue(day3, 3)

    changeImage(day1, 1)
    changeImage(day2, 2)
    changeImage(day3, 3)
}


async function changeLocation(response) {
    let country = response.sys.country
    let regionNames = new Intl.DisplayNames(['ru'], {type: 'region'});
    country = regionNames.of(country);  // "United States"
    document.getElementById("location").textContent = response.name + ",  " + country
}

