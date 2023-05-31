var requestURL =
"https://api.openweathermap.org/data/2.5/weather?q=Denver&units=imperial&appid=03367a7d999670d5ffb1a5e0906afaaa";

function weatherFetcher() {
  console.log("function started");
  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      weatherObject = data;
      console.log("URL of dog photo is: " + weatherObject); //Will display the URL of the dog photo in the console
    });
}

}

weatherFetcher();
