const app = {
  city: 'tokyo',
  baseUrl: `https://api.openweathermap.org/data/2.5/weather`,

  // timers
  statusTimer: null,
  uiTimer: null,
  searchTimer: null,

  // target elements
  statusMsg: document.querySelector('#statusMsg'),
  cityInput: document.querySelector('#cityInput'),
  searchBtn: document.querySelector('#searchBtn'),
  cityName: document.querySelector('#cityName'),
  temperature: document.querySelector('#temperature'),
  description: document.querySelector('#description'),
  humidity: document.querySelector('#humidity'),
  windSpeed: document.querySelector('#windSpeed'),
  pressure: document.querySelector('#pressure'),
  weatherIcon: document.querySelector('#weatherIcon'),
  weatherDisplay: document.querySelector('#weatherDisplay'),
  dateTime: document.querySelector('#dateTime'),

  // Delay Method
  delay: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  // init function
  init: function () {
    this.getWeather();

    const handleSearch = () => {
      const val = this.cityInput.value.trim().toLowerCase();

      if (this.statusTimer) {
        clearTimeout(this.statusTimer);
      }

      if (val) {
        this.city = val;
        this.getWeather();
      } else {
        this.statusMsg.innerHTML =
          '<em>❌ Please write any city name first!</em>';
        this.statusMsg.style.color = 'red';
        this.statusTimer = setTimeout(() => {
          this.statusMsg.innerHTML = '';
          this.statusTimer = null;
        }, 1000);
      }
    };

    // 2. Click Event
    this.searchBtn.addEventListener('click', handleSearch);

    // key press
    this.cityInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        handleSearch();
      }
    });

    this.cityInput.addEventListener('input', () => {
      if (this.searchTimer) clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        const val = this.cityInput.value.trim().toLowerCase();
        if (val.length > 2) {
          this.city = val;
          this.getWeather();
        }
      }, 500);
    });
  },

  // getWeather App
  getWeather: async function () {
    this.weatherDisplay.classList.add('display-hidden');
    this.statusMsg.innerText = `🔃 Waiting for connection......`;

    const url = `${this.baseUrl}?q=${this.city}&appid=${this.apiKey}&units=metric`;
    try {
      if (this.uiTimer) {
        clearTimeout(this.uiTimer);
      }

      // delay for 3sec
      await this.delay(3000);
      const response = await fetch(url);

      // status code
      console.log(`status code : ${response.status} & ${response.statusText}`);

      if (!response.ok) {
        const errorMsg =
          response.status === 404 ? '❌ City not found' : '⚠️ API Error';
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log(data);

      this.render(data);
      this.uiTimer = setTimeout(() => {
        this.statusMsg.innerText = '';
        this.cityInput.value = '';
        this.uiTimer = null;
      }, 300);
    } catch (error) {
      if (this.statusTimer) clearTimeout(this.statusTimer);
      this.statusMsg.innerText = error.message;
      this.statusMsg.style.color = '#f43f5e';

      this.statusTimer = setTimeout(() => {
        this.statusMsg.innerText = '';
      }, 3000);
    }
  },

  // render data
  render: function (data) {
    const { name, main, weather, wind, dt, timezone } = data;
    const localTime = dt + timezone;
    const date = new Date(localTime * 1000);
    // date & time format
    const options = {
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    };

    const formattedTime = date.toLocaleString('en-US', options);
    this.dateTime.innerText = `Local Time: ${formattedTime}`;

    this.cityName.innerText = name;
    this.temperature.innerText = Math.round(main.temp);
    this.description.innerText = weather[0].description;
    this.humidity.innerText = `${main.humidity}%`;
    this.windSpeed.innerText = `${wind.speed} km/h`;
    this.pressure.innerText = `${main.pressure} hPa`;

    const iconCode = weather[0].icon;
    this.weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Dynamic Background Logic
    const condition = weather[0].main;
    let bgColor = '#ffffff';
    let textColor = '#ffffff';
    switch (condition) {
      case 'Rain':
        bgColor = '#3182ce';
        textColor = '#ffffff';
        break;
      case 'Clouds':
        bgColor = '#4a5568';
        textColor = '#ffffff';
        break;
      case 'Clear':
        bgColor = '#f6e05e';
        textColor = '#000';
        break;
      case 'Snow':
        bgColor = '#edf2f7';
        textColor = '#2d3748';
        break;
      default:
        bgColor = 'rgba(30, 41, 59, 0.7)';
        textColor = '#ffffff';
    }

    Object.assign(this.weatherDisplay.style, {
      backgroundColor: bgColor,
      color: textColor,
    });

    // Display card
    this.weatherDisplay.classList.remove('display-hidden');
  },
};

app.init();
