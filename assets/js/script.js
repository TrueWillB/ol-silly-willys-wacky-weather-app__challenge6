var test = dayjs.unix(1685674800);

console.log(dayjs.unix(1685674800).format("MMM[ ]DD[, ]YYYY"));

var testRequestURL =
  "http://api.openweathermap.org/geo/1.0/direct?q=Denver&limit=5&appid=03367a7d999670d5ffb1a5e0906afaaa";
//   "https://api.openweathermap.org/data/2.5/forecast/daily?lat=51.5073219&lon=-0.1276474&cnt=3&appid=03367a7d999670d5ffb1a5e0906afaaa";

var baseRequestURL = "https://api.openweathermap.org/data/2.5/weather?";
var baseGeoRequestURL = "http://api.openweathermap.org/geo/1.0/direct?q=";
var baseForecastURL = "https://api.openweathermap.org/data/2.5/forecast?";
var URLEnding = "&units=imperial&appid=03367a7d999670d5ffb1a5e0906afaaa";
var appID = "03367a7d999670d5ffb1a5e0906afaaa"; //This is my API key, just to have it saved
var currentWeatherText = $("#current-weather");
var currentWeatherImg = $("#current-weather-image");
var imageSourceBaseURL = "https://openweathermap.org/img/wn/";
var cityHistoryArray;
var activeButton;
if (localStorage.getItem("storedCityHistoryArray") == null) {
  cityHistoryArray = ["Denver"];
} else {
  cityHistoryArray = JSON.parse(localStorage.getItem("storedCityHistoryArray"));
}
weatherFetcher(cityHistoryArray[0]); //This function starts the page, it will default to Denver if there is no saved history

// This function was made asynchronous in order to allow the "coordinates" variable to await the results of the fetchCoordinates function
async function weatherFetcher(location) {
  var geocodeObject = await fetchCoordinates(location); //Takes the input from the listener or from the
  try {
    var coordinates = [geocodeObject[0].lat, geocodeObject[0].lon];
    $("#locationHelp").removeClass();
    $("#locationHelp").addClass("form-text text-light");
    $("#locationHelp").text("Please enter desired location below");
  } catch {
    //coordinates are [lat, lon]
    console.log("error error");
    $("#locationHelp").text("Location not found, please try again");
    $("#locationHelp").removeClass("text-light");
    $("#locationHelp").addClass("text-warning");
  }
  var locName = geocodeObject[0].name;

  buildHistoryButtons(locName);

  var requestURL =
    baseRequestURL +
    "lat=" +
    coordinates[0] +
    "&lon=" +
    coordinates[1] +
    URLEnding;
  // console.log("requestURL: " + requestURL);

  //This section gets the current weather and displays it
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

  //This section of the function gets the forecast and displays it. SEE README FOR IMPORTANT DETAILS
  var forecastRequestURL =
    baseForecastURL +
    "lat=" +
    coordinates[0] +
    "&lon=" +
    coordinates[1] +
    URLEnding;

  fetch(forecastRequestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var forecastObject = data;
      for (i = 0; i < 5; i++) {
        var currentDayCard = $("#day-" + i);
        unixTime = forecastObject.list[(i + 1) * 8 - 1].dt; //This is a very complicated function because of the limitations of the API we were given, and the impossible task we were to figure out. Please see "API issues" seciton of readme
        forecastIconUrl =
          imageSourceBaseURL +
          forecastObject.list[(i + 1) * 8 - 1].weather[0].icon +
          "@4x.png";
        forecastTemp = forecastObject.list[(i + 1) * 8 - 1].main.temp;
        forecastWind = forecastObject.list[(i + 1) * 8 - 1].wind.speed;
        forecastHumidity = forecastObject.list[(i + 1) * 8 - 1].main.humidity;
        // unixTime = forecastObject.list[(i + 1) * 8 - 1].dt
        // unixTime = forecastObject.list[(i + 1) * 8 - 1].dt
        formattedDate = dayjs.unix(unixTime).format("MMM[ ]DD");

        currentDayCard.children(".forecast-date").text(formattedDate);
        currentDayCard.children(".forecast-image").attr("src", forecastIconUrl);
        currentDayCard
          .children("p")
          .children("span.forecast-temp")
          .text(forecastTemp);
        currentDayCard
          .children("p")
          .children("span.forecast-wind")
          .text(forecastWind);
        currentDayCard
          .children("p")
          .children("span.forecast-humidity")
          .text(forecastHumidity);

        console.log(forecastTemp);
      }
    });
}

$("#location-input").on("keydown", function (event) {
  if (event.key == "Enter") {
    searchForLocation(event);
  }
});

$("#search-button").on("click", function (event) {
  searchForLocation(event);
});

$("#city-history-list").on("click", ".city-list-button", function (event) {
  weatherFetcher($(event.target).text());
});

function searchForLocation(event) {
  event.preventDefault();
  var inputCity = $("#location-input").val();
  $("#location-input").val("");
  weatherFetcher(inputCity);
}

// I found that because the fetch.then.then structure worked with asynchronous data, I was unable to get out data from this function. So I researched how to solve this problem and learned about async functionsand awaiting data
async function fetchCoordinates(location) {
  var geoRequestURL =
    baseGeoRequestURL +
    location +
    "&limit=5&appid=03367a7d999670d5ffb1a5e0906afaaa";
  var response = await fetch(geoRequestURL);
  var data = await response.json();
  geocodeObject = data;
  return geocodeObject;
}

//This function adds to the location history of searched cities
function buildHistoryButtons(locName) {
  var sameName = false;
  if (cityHistoryArray.includes(locName)) {
    sameName = true;
  }

  if (sameName === false) {
    if (cityHistoryArray.length < 10) {
      cityHistoryArray.unshift(locName);
    } else {
      cityHistoryArray.pop();
      cityHistoryArray.unshift(locName);
    }
  }
  console.log(cityHistoryArray);
  $("#city-history-list").empty();
  for (i = 0; i < cityHistoryArray.length; i++) {
    var cityListButton = $("<li>");
    cityListButton.addClass("city-list-button list-group-item");
    cityListButton.text(cityHistoryArray[i]);
    if (cityListButton.text() == locName) {
      cityListButton.addClass("active");
    }
    $("#city-history-list").append(cityListButton);
  }

  localStorage.setItem(
    "storedCityHistoryArray",
    JSON.stringify(cityHistoryArray)
  );
}
