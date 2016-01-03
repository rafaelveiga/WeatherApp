var el, s,
WeatherApp = {
	// Caching all elements on the page for access inside WeatherApp
	cachedElements: {
		$city          : $(".city"),
		$weatherIcon   : $(".weatherIcon"),
		$temperature   : $(".temperature"),
		$maxTemperature: $(".maxTemp p"),
		$minTemperature: $(".minTemp p"),
		$wind          : $(".wind p"),
		$sunrise       : $(".sunrise p"),
		$sunset        : $(".sunset p"),
		$humidity      : $(".humidity p")
	},

	// Common vars
	settings: {
		baseURL: "http://api.openweathermap.org/data/2.5/weather?jsoncallback",
		appID: "2de143494c0b295cca9337e1e96b00e0",
		userCity: null,
		weatherDesc: null,
		colorScheme: $("body").attr("id")
	},

	//Init function
	init: function() {
		// Sets the cachedElements to the el variable
		// Sets the settings to the s variable
		// which are in the same level as WeatherApp
		// making it available for all functions inside this object
		el = this.cachedElements;
		s = this.settings;

		//Initiates the app
		this.updateUserLocation();
		this.getWeatherData();
		this.updateAppColor(s.weatherDesc);
	},

	//Gets the user location from IpInfo and updates the page and settings
	updateUserLocation: function() {
		//Async AJAX request to IPInfo	
		$.ajax({
			url: 'http://ipinfo.io',
			async: false,
			dataType: 'json',
			success: function(data){
				//Updates global settings
				s.userCity = data.city;

				//Updates cached element
				el.$city.text(data.city);
			}
		});
	},

	//Queries the weater API and retrieves the info from user's city
	getWeatherData: function() {
		//Async AJAX request to the API 
		$.ajax({
			url: s.baseURL,
			async: false,
			data: {
				appid: s.appID,
				q: s.userCity,
				units: "metric"
			},
			dataType: 'json',
			success: function(data) {
				// Organizing all the response info
				var temperature    = Math.floor(data.main.temp);
				var maxTemperature = Math.floor(data.main.temp_max);
				var minTemperature = Math.floor(data.main.temp_min);
				var windSpeed      = data.wind.speed;
				var windDeg        = data.wind.deg;
				var sunrise        = WeatherApp.convertUNIXDate(data.sys.sunrise);
				var sunset         = WeatherApp.convertUNIXDate(data.sys.sunset);
				var humidity       = data.main.humidity;
				var weatherIcon    = data.weather[0].icon;

				//Updating weather description on the global settings object
				s.weatherDesc    = data.weather[0].main;

				// Updating cached elements with response content
				el.$temperature.text(temperature + "°C");
				el.$weatherIcon.attr("src", "http://openweathermap.org/img/w/" + weatherIcon + ".png");
				el.$maxTemperature.text(maxTemperature  + "°C");
				el.$minTemperature.text(minTemperature  + "°C");
				el.$wind.html(windSpeed + "<small>km/h</small> " + windDeg + "°");
				el.$sunrise.html(sunrise);
				el.$sunset.html(sunset);
				el.$humidity.html(humidity);
			}
		});	
	},

	//Updates app color according to weather description
	updateAppColor: function(weatherDescription) {
		// Gets weatherDesc from global settings and converts to lowercase_underline
		weatherDescription = weatherDescription.replace(" ", "_");
		weatherDescription = weatherDescription.toLowerCase();

		//Updates body id
		$("body").attr("id", weatherDescription);
	},

	//Convert UNIX timestamp to hh:mm
	convertUNIXDate: function(date) {
		var date = new Date(date*1000);

		var hours = date.getHours();
		if (hours.toString().length === 1) {
			hours = "0" + hours;
		};

		var minutes = date.getMinutes();
		if (minutes.toString().length === 1) {
			minutes = "0" + minutes;
		};

		var dateConverted = hours + ':' + minutes;

		return dateConverted;
	}
}

WeatherApp.init();