var bikeShareApp = angular.module('bikeShareApp', []);

bikeShareApp.config(function($routeProvider) {

	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'app.html',
			controller  : 'FetchBikesCtrl'
		})

		// route for the bike details
		.when('/bikes/:bikeId', {
			templateUrl : 'bikedetails.html',
			controller  : 'FetchBikesCtrl'
		})
});


bikeShareApp.controller('FetchBikesCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {   

    var url = "http://jsonpwrapper.com/?urls%5B%5D=http%3A%2F%2Fbayareabikeshare.com%2Fstations%2Fjson&callback=JSON_CALLBACK";

	$http.jsonp(url).
	success(function (data) {

		//parse data
	    var actualData = JSON.parse(data[0].body);

	    //create empty array for station names
	    var dataArr = [];


	    //for loop to parse through station names via json object
	    for (i in actualData.stationBeanList) {
	    	stations = actualData.stationBeanList[i];
	    	dataArr.push(stations);
	    }		    	

	    //assign station names to list
	    $scope.results = dataArr;

	    //match array with routeparam id
	    for (i=0; i < dataArr.length; i++){

			var arrLongitude = dataArr[i].longitude;
			var arrLatitude = dataArr[i].latitude;

		    if($routeParams.bikeId)
		    {
		    	if (dataArr[i].id == $routeParams.bikeId){
		    		$scope.results = dataArr[i];
					  var myLatlng = new google.maps.LatLng(arrLatitude,arrLongitude);

					  var mapOptions = {
					    zoom: 15,
					    center: myLatlng
					  }
					  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

					  var marker = new google.maps.Marker({
					      position: myLatlng,
					      map: map,
					      title: 'Hello World!'
					  });
		    	}
		    }
		    else {
		        $scope.results = dataArr;
		    }
	    }


	    //find distance equation
		function distance(lon1, lat1, lon2, lat2) {
		  var R = 6371; // Radius of the earth in km
		  var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
		  var dLon = (lon2-lon1).toRad(); 
		  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
		          Math.sin(dLon/2) * Math.sin(dLon/2); 
		  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		  var d = R * c; // Distance in km
		  return d;
		}

		/** Converts numeric degrees to radians */
		if (typeof(Number.prototype.toRad) === "undefined") {
		  Number.prototype.toRad = function() {
		    return this * Math.PI / 180;
		  }
		}	

		//mozilla geolocation callback
		var geoSuccess = function(pos){

			//empty miles array
			//var milesArr = [];
			
			//assign longitude and latitude
			for (i=0; i<dataArr.length; i++){
				
				var arrLongitude = dataArr[i].longitude;
				var arrLatitude = dataArr[i].latitude;

				var distanceType = "mi";

			    // var img = new Image();
			    // img.src = "http://maps.googleapis.com/maps/api/staticmap?center=" + arrLatitude + "," + arrLongitude + "&markers=blue&zoom=13&size=300x300&sensor=false";

				var milesAway = distance(pos.coords.longitude, pos.coords.latitude, arrLongitude, arrLatitude) * .6214;

				//convert miles to feet when less than 0.1
				if (milesAway < 0.1) {
					milesAway = milesAway * 5280;
					distanceType = "ft";
				}

				actualData.stationBeanList[i].milesAway = milesAway.toFixed(2) + ' ' + distanceType;	
				actualData.stationBeanList[i].distanceType = distanceType;
				//actualData.stationBeanList[i].img = img;	

			}

			$scope.$apply();
			
		};

		


		navigator.geolocation.getCurrentPosition(geoSuccess);

		//console.log($location.path());
		//console.log($scope.path);

	});
}]);
