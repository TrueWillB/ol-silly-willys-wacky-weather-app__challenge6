var requestURL =
  "https://api.openweathermap.org/data/2.5/weather?q=Denver&units=imperial&appid=03367a7d999670d5ffb1a5e0906afaaa";

var currentWeatherText = $("#current-weather");
var currentWeatherImg = $("#current-weather-image");
var imageSourceBaseURL = "https://openweathermap.org/img/wn/";

function weatherFetcher() {
  console.log("function started");
  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var weatherObject = data;
      var conditions = weatherObject.weather[0];
      console.log(weatherObject); //Will display the URL of the dog photo in the console
      //   console.log(data.weather[0].main);
      currentWeatherText.text(conditions.main);
      currentWeatherImg.attr(
        "src",
        imageSourceBaseURL + conditions.icon + "@4x.png"
      );
      $("#current-temp").text(weatherObject.main.temp);
      $("#current-wind").text(weatherObject.wind.speed);
      $("#current-humidity").text(weatherObject.main.humidity);
    });
}

weatherFetcher();
