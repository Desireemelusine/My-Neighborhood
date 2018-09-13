// DOMContentLoaded : everytime the page makes a reload, he will grab this function again and refresh the information
// this is how you connect with index
document.addEventListener('DOMContentLoaded', apiWeather);

// we create the  function to  assemble all this information
function apiWeather() {
    //calling the  weather  third-party api
    var api = 'https://api.openweathermap.org/data/2.5/weather?q=Lisbon,pt&appid=5b3fd44bf7afb7ba0adacecea6b5616d';
    //jQuery - getJSON to get your API in your HTML
    $.getJSON(api, function (data) {
      var KelvinTemp, fahreTemp, celsiusTemp, weather;
      // tempExchange to exchange between Celsius and Fahrenheit;
      var tempExchange = true;
      // use the alert to just confirm it gets the correct api o your html
      // alert(data.coord.lon);
      var city = data.name;
      // it comes in Kelvin
      KelvinTemp = data.main.temp;
      celsiusTemp = (KelvinTemp-273).toFixed(0);
      fahreTemp = (KelvinTemp*(9/5)-459.67).toFixed(0);

      var windSpeed = data.wind.speed;
      //it comes in m/sec
      windSpeed = (2.237 * windSpeed).toFixed(0);

      var humidity = data.main.humidity;
      var weatherType = data.weather[0].description;
      var weatherIcon = data.weather[0].icon;

      var iconUrl= "http://openweathermap.org/img/w/" + weatherIcon +".png";
      $(".iconWeather").attr('src', iconUrl);
      $(".apiWeather").html(city + ': ' + celsiusTemp + '°C'+ ' | ' + fahreTemp + '°F . ' + weatherType);
      //console.log(api);
      //console.log(weather);

    });

  }
