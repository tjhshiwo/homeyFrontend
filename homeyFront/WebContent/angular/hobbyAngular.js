/**
 * 
 */
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
			url : 'http://localhost:8080/homeyBack/javaAngularJS'
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
			url : 'http://localhost:8080/homeyBack/getAllHobbyServlet',
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
		$window.location.href = "hobby_detail.html";
	}

	/***************************************************************************
	 * Send longitude and latitude to server
	 */
	$scope.sendLocation = function() {
		var laitude;
		var longitude;
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
		} else {
			alert("Geolocation is not supported by this browser.");
		}
		function showPosition(position) {
			laitude = position.coords.latitude
			longitude = position.coords.longitude;
			// search weather info, including events, addresses
			// $scope.searchWeather(laitude, longitude);
		}
	};

	/***************************************************************************
	 * Search weather
	 */
	$scope.searchWeather = function(laitude, longitude) {
		$http({
			method : 'GET',
			url : 'http://localhost:8080/homeyBack/weatherServlet',
			params : {
				lat : laitude,
				lon : longitude
			}
		}).then(function successCallback(response) {
			// if success
			$scope.recommend = response.data;
		}, function errorCallback(response) {
			// if error TODO
			alert("Failed to connect to server");
		});
	};

});

app.controller("getHobbyDetailCtrl", function($scope, $http) {
	$scope.hobbyKind = sessionStorage.getItem('hobbyKind');
	// get hobby description, image, title
	$scope.getHobbyDesc = function() {
		$http({
			// TODO get hobby description
			url : 'http://localhost:8080/homeyBack/getHobbyDetailServlet',
			// url:
			// 'http://homeycloudback.azurewebsites.net/homeyBack/getHobbyDetailServlet',
			method : "GET",
			params : {
				hobbyKind : $scope.hobbyKind
			}
		}).then(function successCallback(response) {
			$scope.hobbyDesc = response.data;
		}, function errorCallback(response) {
			// alert("can't get hobby description");
		});
	}
	$scope.getHobbyFromServer = function() {
		$http({
			// http://118.139.20.206:8080/homey/javaAngularJS
			url : 'http://localhost:8080/homeyBack/javaAngularJS',
			// url:
			// 'http://homeycloudback.azurewebsites.net/homeyBack/javaAngularJS',
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
