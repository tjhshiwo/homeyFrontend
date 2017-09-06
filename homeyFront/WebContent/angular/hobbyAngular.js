/**
 * 
 */
// var prefixUrl = "http://localhost:8080/homeyBack/";
var prefixUrl = "http://118.139.11.247:8080/homeyBack/";

var app = angular.module("myApp", []).factory("hobbyService", function() {
	var hobbyKind = {};
	return {
		setHobbyKind : function(data) {
			hobbyKind = data;
		},
		getHobbyKind : function() {
			return hobbyKind;
		}
	};
});

app.controller("myCtrl", function($scope, $http) {
	$scope.getDataFromServer = function() {
		$http({
			method : 'GET',
			url : prefixUrl + 'javaAngularJS'
		}).then(function successCallback(response) {
			// if success TODO
			alert(response.data);
			$scope.person = response.data;
		}, function errorCallback(response) {
			// if error TODO
		});
	};
});

app.controller("getHobbiesCtrl", function($scope, $http, $window) {

	/***************************************************************************
	 * Get all hobby kinds
	 */
	$scope.getAllHobbyKind = function() {
		$http({
			url : prefixUrl + 'getAllHobbyServlet',
			method : "GET"
		}).then(function successCallback(response) {
			$scope.allHobbyKind = response.data;
		}, function errorCallback(response) {
		});
	}

	/***************************************************************************
	 * Get hobby details, like hobby kind, description, image
	 */
	$scope.getHobbyDetail = function(kind) {
		// $scope.hobbyKind = "just now";
		console.log($scope.hobbykind);
		// hobbyService.setHobbyKind($scope.hobbykind);
		sessionStorage.setItem('hobbyKind', kind);
		$window.location.href = "hobby_detail2.html";
	}

	/***************************************************************************
	 * Send longitude and latitude to server
	 */
	$scope.sendLocation = function() {
		var laitude;
		var longitude;
		console.log("ssssss");
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
		} else {
			alert("Geolocation is not supported by this browser.");
		}
		function showPosition(position) {
			laitude = position.coords.latitude
			longitude = position.coords.longitude;
			// search weather info, including events, addresses
			$scope.searchWeather(laitude, longitude);
		}
	};

	/***************************************************************************
	 * Search weather
	 */
	$scope.searchWeather = function(laitude, longitude) {
		console.log("lai:  " + laitude);
		console.log("lon:  " + longitude);
		$http({
			method : 'GET',
			url : prefixUrl + 'lonLatServlet',
			params : {
				lat : laitude,
				lon : longitude
			}
		}).then(function successCallback(response) {
			// if success
			$scope.recommend = response.data;
			var eventTypes = $scope.recommend[0].allEvents;
			var eventClass = $scope.recommend[0].allEventsClass;
			var eventBgColor = $scope.recommend[0].allEventsBgColor;
			// assemble array
			var eventArray = eventTypes.split("^");
			var classArray = eventClass.split("^");
			var bgColorArray = eventBgColor.split("^");
			// assign value to scope
			$scope.eventArray = eventArray;
			$scope.classArray = classArray;
			$scope.bgColorArray = bgColorArray;
			
			initMap($scope.recommend[0].allAddress);
		}, function errorCallback(response) {
			// if error TODO
			alert("Failed to search weather and activities when initializing the page");
		});
	};
	
	/***************************************************************************
	 * Search suburb
	 */
	$scope.searchSuburb = function() {
		$http({
			method : 'GET',
			url : prefixUrl + 'postOrSubServlet',
			params : {
				postOrSub : $scope.postOrSub
			}
		}).then(function successCallback(response) {
			// if success
			$scope.recommend = response.data;
			var eventTypes = $scope.recommend[0].allEvents;
			var eventClass = $scope.recommend[0].allEventsClass;
			var eventBgColor = $scope.recommend[0].allEventsBgColor;
			var eventArray = eventTypes.split("^");
			var classArray = eventClass.split("^");
			var bgColorArray = eventBgColor.split("^");
			$scope.eventArray = eventArray;
			$scope.classArray = classArray;
			$scope.bgColorArray = bgColorArray;
			initMap($scope.recommend[0].allAddress);
		}, function errorCallback(response) {
			// if error TODO
			alert("Failed to search suburb");
		});
	};
	
	/***
	 * 
	 */
	$scope.searchSuburb4Institution = function(){
		$http({
			method : 'GET',
			url : prefixUrl + 'postOrSubViolenceServlet',
			params : {
				subOrPost : $scope.postOrSub
			}
		}).then(function successCallback(response) {
			// if success
			$scope.famVioPlaces = response.data;
			initMap();
		}, function errorCallback(response) {
			// if error TODO
			alert("Sorry, there is no institutions found in the area.");
		});
	}

});

app.controller("getHobbyDetailCtrl", function($scope, $http) {
	$scope.hobbyKind = sessionStorage.getItem('hobbyKind');
	// get hobby description, image, title
	$scope.getHobbyDesc = function() {
		$http({
			// TODO get hobby description
			url : prefixUrl + 'getHobbyDetailServlet',
			// url:
			// 'http://homeycloudback.azurewebsites.net/homeyBack/getHobbyDetailServlet',
			method : "GET",
			params : {
				hobbyKind : $scope.hobbyKind
			}
		}).then(function successCallback(response) {
			$scope.hobbyDesc = response.data;
		}, function errorCallback(response) {
		});
	}
	$scope.getHobbyFromServer = function() {
		$http({
			url : prefixUrl + 'javaAngularJS',
			method : "GET",
			params : {
				hobbyKind : $scope.hobbyKind
			}
		}).then(function successCallback(response) {
			// var testDat = "[{\"allAddress\":\"['PO Box
			// 336,Warrandyte,VIC,3113','29 Regent Street,Mount
			// Waverley,VIC,3149']\"}]";
			$scope.hobbyDetail = response.data;
			// alert($scope.hobbyDetail);
		}, function errorCallback(response) {
			alert("can't get hobby locations");
		});
	};
});
