var testRequestURL =
  "http://api.openweathermap.org/geo/1.0/direct?q=Denver&limit=5&appid=03367a7d999670d5ffb1a5e0906afaaa";
//   "https://api.openweathermap.org/data/2.5/forecast/daily?lat=51.5073219&lon=-0.1276474&cnt=3&appid=03367a7d999670d5ffb1a5e0906afaaa";

var requestURL =
  "https://api.openweathermap.org/data/2.5/weather?q=London&units=imperial&appid=03367a7d999670d5ffb1a5e0906afaaa";
var baseRequestURL = "https://api.openweathermap.org/data/2.5/weather?";
var baseGeoRequestURL = "http://api.openweathermap.org/geo/1.0/direct?q=";
var URLEnding = "&units=imperial&appid=03367a7d999670d5ffb1a5e0906afaaa";
var appID = "03367a7d999670d5ffb1a5e0906afaaa"; //This is my API key, just to have it saved

var currentWeatherText = $("#current-weather");
var currentWeatherImg = $("#current-weather-image");
var imageSourceBaseURL = "https://openweathermap.org/img/wn/";
// var targetCity = "Denver";

//TODO figure out async data
//TODO Add function that stores all of the previously entered cities, in an array and in permanent storage. The array should then build the history up until 10 items.
//TODO figure out wtf you're doing for the forecast, it is very unclear
//TODO create geolocation function for entered city, needed for the 5 day forecast

// This function was made asynchronous in order to allow the "coordinates" variable to await the results of the fetchCoordinates function
async function weatherFetcher(location) {
  var coordinates = await fetchCoordinates(location); //coordinates are [lat, lon]
  console.log("coordinates below");
  console.log(coordinates);

  requestURL =
    baseRequestURL +
    "lat=" +
    coordinates[0] +
    "&lon=" +
    coordinates[1] +
    URLEnding;
  console.log("requestURL: " + requestURL);
  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var weatherObject = data;
      var conditions = weatherObject.weather[0];
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

// I found that because the fetch.then.then structure worked with asynchronous data, I was unable to get out
async function fetchCoordinates(location) {
  var geoRequestURL =
    baseGeoRequestURL +
    location +
    "&limit=5&appid=03367a7d999670d5ffb1a5e0906afaaa";
  console.log("The URL is: " + geoRequestURL);
  var response = await fetch(geoRequestURL);
  var data = await response.json();
  geocodeObject = data;
  var coordinates = [geocodeObject[0].lat, geocodeObject[0].lon];
  console.log(coordinates);
  return coordinates;
}
