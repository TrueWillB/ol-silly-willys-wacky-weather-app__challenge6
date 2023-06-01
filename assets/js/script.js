var testRequestURL =
  "https://api.openweathermap.org/data/2.5/forecast/daily?lat=51.5073219&lon=-0.1276474&cnt=3&appid=03367a7d999670d5ffb1a5e0906afaaa";

var requestURL =
  "https://api.openweathermap.org/data/2.5/weather?q=London&units=imperial&appid=03367a7d999670d5ffb1a5e0906afaaa";
var baseRequestURL = "https://api.openweathermap.org/data/2.5/weather?";
var URLEnding = "&units=imperial&appid=03367a7d999670d5ffb1a5e0906afaaa";

var currentWeatherText = $("#current-weather");
var currentWeatherImg = $("#current-weather-image");
var imageSourceBaseURL = "https://openweathermap.org/img/wn/";
// var targetCity = "Denver";

//TODO Add function that stores all of the previously entered cities, in an array and in permanent storage. The array should then build the history up until 10 items.
//TODO figure out wtf you're doing for the forecast, it is very unclear
//TODO create geolocation function for entered city, needed for the 5 day forecast
function weatherFetcher(location) {
  console.log("function started");

  requestURL = baseRequestURL + "q=" + location + URLEnding;

  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var weatherObject = data;
      var conditions = weatherObject.weather[0];
      console.log(weatherObject); //Will display the URL of the dog photo in the console
      //   console.log(data.weather[0].main);
      $("#current-weather-location-text").text(weatherObject.name);
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

$("#location-input").on("keydown", function (event) {
  if (event.key == "Enter") {
    event.preventDefault();
    var inputCity = $("#location-input").val();
    $("#location-input").val("");
    weatherFetcher(inputCity);
  }
});

weatherFetcher("Denver"); //I'm making the default city Denver because it's my app and I'm the boss
// weatherFetcher();
// testFetcher();

function testFetcher() {
  fetch(testRequestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}
