$(function () {
	var tableData = $('#tableData');
	var totelPage;
	var recordsToDisplay = 10;//Number of Recoard to DISPLAY
	var records = recordsToDisplay - 1;
	var min = 0;
	var max = records + min;
	var allRecords;

	function display10Record() {
		$('#bottomContent').show();
		tableData.empty();
		totelPage = allRecords.length / (records + 1);
		max = records + min;
		for (var i = min; i <= max; i++) {
			if (allRecords[i] == undefined) {
				console.log('data not found');
				max = i - 1;
				break;
			}
			var date = 'Today';
			if (new Date(allRecords[i].dt_txt).toDateString() !== new Date().toDateString()) {
				date = new Date(allRecords[i].dt_txt).toDateString();
			}
			tableData.append('<tr class="dataRow"><td style="display:none;"></td><td>'
				+ new Date(allRecords[i].dt_txt).toLocaleTimeString() + '<br>' + date
				+ '</td> <td style="text-align:center">' + 'Avg : ' + (allRecords[i].main.temp - 273.15).toFixed(1) + '&#8451;'
				+ '<br><span class="text-primary"><i class="fa fa-chevron-down"></i> ' + (allRecords[i].main.temp_min - 273.15).toFixed(1) + '&#8451;</span>'
				+ '  <span class="text-danger"> <i class="fa fa-chevron-up"></i> ' + (allRecords[i].main.temp_max - 273.15).toFixed(1) + '&#8451;</span>'
				+ '</td> <td>'
				+ allRecords[i].weather[0].main + '<img src="http://openweathermap.org/img/w/' + allRecords[i].weather[0].icon + '.png" alt="forecast">'
				+ '<br>' + allRecords[i].wind.speed + ' m/s , Clouds ' + allRecords[i].clouds.all + '% ,' + allRecords[i].main.pressure + ' hpa'
				+ '</td></tr>'
			);
		};
		$('#pageDetail').empty();
		$('#pageDetail').append('<b>Page : ' + (min / (records + 1) + 1) + ' / ' + Math.ceil(totelPage)
			+ '<br>Showing Records : ' + (min + 1) + ' to ' + (max + 1) + '</b>');

		if (max == allRecords.length - 1) {
			$('#next').attr('disabled', true);
		}
		else if (max < allRecords.length - 1) {
			$('#next').attr('disabled', false);
		}
		if (min == 0) {
			$('#prev').attr('disabled', true);
		}
		else if (min > 0) {
			$('#prev').attr('disabled', false);
		}
	}

	//On Page load
	getPosition();

	function getPosition() {
		window.navigator.geolocation.getCurrentPosition(function (pos) {
			console.log(pos.coords);
			const position = { lat: pos.coords.latitude, lng: pos.coords.longitude }
			getWeatherByLatLng(position);
		}, function (err) {
			console.log(err);
			const position = { lat: 12.838059099999999, lng: 77.6478817 };
			$('#info-text').append(err.message, ' Showing Default Location');
			getWeatherByLatLng(position);
		});
	}

	function getWeatherByLatLng(pos) {
		$.ajax({
			type: 'GET',
			dataType: 'json',
			// headers: {
			// 	'Access-Control-Allow-Origin': '*',
			// },
			url: 'https://api.openweathermap.org/data/2.5/forecast?lat=' + pos.lat + '&lon=' + pos.lng + '&appid=f5f7c182f4a8850365de9575b191124b',
			// url: 'http://localhost:3000/weather',
			success: function (data) {
				$('#heading-text').append(data.city.name + ', ' + data.city.country)
				allRecords = data.list;
				display10Record();
			}
		});
	}

	//Next Page Button Working 
	$('#next').on('click', function () {
		min = min + recordsToDisplay;
		max = max + recordsToDisplay;
		var currentPage = ((max + 1) / (records + 1));
		if (currentPage <= Math.ceil(totelPage)) {
			display10Record();
		}
		else {
			min = min - recordsToDisplay;
			max = max - recordsToDisplay;
		}
	});

	//Prev Page Button Working
	$('#prev').on('click', function () {
		if (min >= 4) {
			min = min - recordsToDisplay;
			max = max - recordsToDisplay;
			display10Record();
		}
	});

});
