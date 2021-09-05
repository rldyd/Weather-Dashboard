const apiKey = "3adf057c70211b88b6508fbff16b4365";
var currentWeather = [];
var currentCity = [];

$("#searchBtn").on("click", function (e) {
    e.preventDefault();
    var place = $("#citySearch").val().trim();
    console.log(place);
    currentCity.push(place);
    getWeather(place);
    localStorage.setItem("cities", JSON.stringify(currentCity));
    var newButton = document.createElement("button");
    newButton.innerHTML = place;
    newButton.setAttribute("id", "button");
    newButton.setAttribute("class", "btn btn-light");
    newButton.onclick = function () {
        getWeather(place);
    };
    $("#past-searches").append(newButton);
});

function siteLoad() {
    var storedCity = JSON.parse(localStorage.getItem("cities"));
    if (storedCity !== null) {
        currentCity = storedCity;
    }
    if (storedCity) {
        var loadCity = currentCity[currentCity.length - 1];
        console.log(loadCity);
        getWeather(loadCity);
    }
}

var getWeather = function (place) {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${place}&APPID=${apiKey}`
    )
        .then((response) => response.json())
        .then(function (response) {
            console.log(response);
            var location = response.name;
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;
            getFiveDay(latitude, longitude, location);
        });
};

// Ben's Code Start
function getFiveDay(latitude, longitude, location) {
    fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={part}&appid=${apiKey}`
    )
        .then((response) => response.json())
        .then(function (data) {
            console.log(data);
            var current = data.current;
            var city = location;
            //grab data
            currentWeather = [""];
            currentWeather.temp = Math.round((current.temp - 273.15) * 1.8 + 32);
            currentWeather.humidity = current.humidity;
            currentWeather.wind = current.wind_speed + "MPH";
            currentWeather.uvIndex = current.uvi;
            currentWeather.icon = data.daily[0].weather[0].icon;

            var datetime = data.current.dt * 1000;
            var dtMili = new Date(datetime);
            var humanDate = dtMili.toLocaleDateString();
            currentWeather.date = humanDate;

            document.getElementById("oneDay").innerHTML = "";
            document.querySelector(".fiveDayWeather").innerHTML = "";

            $("#oneDay").append(
                `<div class= "card" id= "oneDayForecast">
        <h3>${city}, ${currentWeather.date}</h3>
        <img src = "http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png" style = "width: 100px; height: 70px"></img>
        <p> Temp: ${currentWeather.temp}</p>
        <p> Wind Speed: ${currentWeather.wind}</p>
        <p> Humidity: ${currentWeather.humidity}</p>
        <p> UV Index: <span class="p-2" id= "uvColor">${currentWeather.uvIndex}</span></p>
        </div> `
            );

            for (i = 1; i < 6; i++) {
                var list = data.daily[i];
                var temps = list.temp.day;
                var fahrenheit = Math.round((temps - 273.15) * 1.8 + 32);
                var wind = list.wind_speed;
                var icon = list.weather[0].icon;
                var humid = list.humidity;
                var dt = list.dt * 1000;
                var date = new Date(dt).toLocaleDateString();

                $(".fiveDayWeather").append(
                    `<div class = "card singleOfFive" style="width: 12rem">
            <h5> Date: ${date}</h5>
            <img src = "http://openweathermap.org/img/wn/${icon}@2x.png" style = "width: 70px; height: 80px"></img>
            <p> Temp: ${fahrenheit}</p>
            <p> Wind Speed: ${wind}</p>
            <p> Humidity: ${humid}</p>
            </div>`
                );
            }
            colorCode(currentWeather.uvIndex);
        });
}

function colorCode(index) {
    console.log(index);
    if (index >= 0 && index < 3) {
        $("#uvColor").attr("style", "background-color: green");
    } else if (index >= 3 && index < 6) {
        $("#uvColor").attr("style", "background-color: yellow");
    } else if (index >= 6 && index < 8) {
        $("#uvColor").attr("style", "background-color: orange");
    } else if (index >= 8 && index < 11) {
        $("#uvColor").attr("style", "background-color: red");
    } else if (index >= 11) {
        $("#uvColor").attr("style", "background-color: hotpink");
    }
}
//Ben's code end

$("#citySearch").keyup(function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        document.getElementById("searchBtn").click();
    }
});

siteLoad();
