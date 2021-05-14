// DOM Elements
const time = document.querySelector('.time'),
  date = document.querySelector('.date'), 
  greeting = document.querySelector('.greeting'),
  name = document.querySelector('.name'),
  focus = document.querySelector('.focus');
  nextBG = document.querySelector("#next-bg"),
  imageArray = generateImageArray(),
  jokeLabel = document.querySelector(".joke"),
  city = document.querySelector(".city")
;

const jokesUrl = 'https://api.chucknorris.io/jokes/random';

currentImageIndex = {
  index: 0,
  aListener: function(val) {}, 
  set index(val) {
    this.aInternal = val;
    this.aListener(val);
  }, 
  get index() {
    return this.aInternal;
  },
  registerListener: function(listener) {
    this.aListener = listener;
  }
}

var userScroll = 0;
currentImageIndex.registerListener(async function(val) {
  var img = new Image();
  img.onload = function() { console.log("Height: " + this.height); }
  img.src = imageArray[val % 24];
  await new Promise(r => setTimeout(r, 100));
  document.body.style.backgroundImage = `url(${img.src})`;
});
currentImageIndex.index = new Date().getHours();

async function getJoke() {
    let response =  await fetch(jokesUrl);
    let data = await response.json();
    let value = data.value;
    return value;
}

// Show Time
function showTime() {
  let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds();

  let dateOptions = {weekday : 'long', month: 'long', day: 'numeric'};
  let dateTimeFormat = new Intl.DateTimeFormat('ru-RU', dateOptions);
  
  date.innerHTML = `${dateTimeFormat.format(today)}`;

  // Output Time
  time.innerHTML = 
  `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;

  if (hour != currentImageIndex.index - userScroll) {
    currentImageIndex.index = hour + userScroll;
  }

  setTimeout(showTime, 1000);
}

// Add Zeros
function addZero(n) {
  return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

// Set Background and Greeting
function setGreet() {
  let today = new Date(),
  hour = today.getHours();
  console.log(hour);

  if (hour < 6) {
    greeting.textContent = 'Доброй ночи, ';
    document.body.style.color = "white";
  } else if (hour < 12) {
    greeting.textContent = 'Доброе утро, ';
  } else if (hour < 18) {
    greeting.textContent = 'Добрый день, ';
  } else {
    greeting.textContent = 'Добрый вечер, ';
    document.body.style.color = "white";
  }
}

function generateImageArray() {
  let arr = new Array();
  for (let i = 0; i < 24; i++) {
    let imagePath = addZero(Math.floor(Math.random() * 20) + 1) + '.jpg';
    if (i < 6) {
      arr.push(`assets/images/night/${imagePath}`);
    }
    else if (i < 12) {
      // Morning
      arr.push(`assets/images/morning/${imagePath}`);
    } else if (i < 18) {
      // Afternoon
      arr.push(`assets/images/day/${imagePath}`);
    } else {
      // Evening
      arr.push(`assets/images/evening/${imagePath}`);
    }
  }
  return arr;
}

function setBG() {
  currentImageIndex.index++;
  userScroll++;
}

// Get Name
function getName() {
  if (localStorage.getItem('name') === null) {
    name.textContent = '[Имя]';
  } else {
    name.textContent = localStorage.getItem('name');
  }
}

// Set Name
function setName(e) {
  if (e.type === 'keypress') {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      if (name.innerHTML != '') {
        localStorage.setItem('name', e.target.innerText);
      } else {
        getName();
      }
      name.blur();
    }
  } else {
    if (e.target.innerHTML != '') {
      localStorage.setItem('name', e.target.innerText);
    } else {
      getName();
    }
  }
}


// Get Focus
function getFocus() {
  if (localStorage.getItem('focus') === null) {
    focus.textContent = '[Цель]';
  } else {
    focus.textContent = localStorage.getItem('focus');
  }
}

// Set Focus
function setFocus(e) {
    // Make sure enter is pressed
  if (e.type === 'keypress') {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      if (focus.innerHTML != '') {
        localStorage.setItem('focus', e.target.innerText);
      } else {
        getFocus();
      }
      focus.blur();
    }
  } else {
    if (e.target.innerHTML != '') {
      localStorage.setItem('focus', e.target.innerText);
    } else {
      getFocus();
    }
  }
}

async function setJoke(){
  let joke = await getJoke();
  //console.log(joke);
  jokeLabel.innerHTML = joke;
}

async function getWeather() {
  let city = document.querySelector(".city");
  const temperatureLabel = document.querySelector(".temperature");
  const humidityLabel = document.querySelector(".humidity");
  const windLabel = document.querySelector(".wind");
  const weatherDescription = document.querySelector(".weather-description");
  let error = document.querySelector('.error');

  let wheatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.innerHTML}&lang=ru&appid=08f2a575dda978b9c539199e54df03b0&units=metric`;
  let response = await fetch(wheatherUrl);
  let data = await response.json();
  
  if (data.cod != 200) {
    error.innerHTML = 'Ошибка! Нет такого города'; 
    error.style.display = 'initial';
    temperatureLabel.style.display = 'none';
    humidityLabel.style.display = 'none';
    windLabel.style.display = 'none';
    weatherDescription.style.display = 'none';
  } else {
    error.style.display = 'none';
    temperatureLabel.style.display = 'initial';
    humidityLabel.style.display = 'initial';
    windLabel.style.display = 'initial';
    weatherDescription.style.display = 'initial';
    let temperature = data.main.temp;
    let humidity = data.main.humidity;
    let wind = data.wind.speed;
    let description = data.weather[0].description;
    temperatureLabel.innerHTML = `Температура: ${temperature} ℃ <br/>`;
    humidityLabel.innerHTML = `Влажность: ${humidity} %<br/>`;
    windLabel.innerHTML = `Ветер ${wind} м/c <br/>`;
    weatherDescription.innerHTML = description;
  }

}

function getCity() {
  if (localStorage.getItem('city') === null) {
    city.textContent = 'Минск';
  } else {
    city.textContent = localStorage.getItem('city');
  }
  getWeather();
}

// Set Focus
function setCity(e) {
    // Make sure enter is pressed
  if (e.type === 'keypress') {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      if (city.innerHTML != '') {
        localStorage.setItem('city', e.target.innerText);
        getWeather();
      } else {
        getCity();
      }
      city.blur();
    }
  } else {
    if (e.target.innerHTML != '') {
      localStorage.setItem('city', e.target.innerText);
      getWeather();
    } else {
      getCity();
    }
  }
}

name.addEventListener('click', () => {
  name.innerHTML = '';
});

focus.addEventListener('click', () => {
  focus.innerHTML = '';
})

city.addEventListener('click', () => {
  city.innerHTML = '';
})

name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);
focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);
city.addEventListener('keypress', setCity);
city.addEventListener('blur', setCity);
nextBG.addEventListener('click', setBG);
jokeLabel.addEventListener('click', setJoke);

// Run
showTime();
setGreet();
setBG();
getName();
getFocus();
setJoke();
getCity();