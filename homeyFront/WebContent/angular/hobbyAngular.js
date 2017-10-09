/**
 * 
 */
var prefixUrl = "http://localhost:8080/homeyBack/"; 
// var prefixUrl = "https://homi.azurewebsites.net/homeyBack/";

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

//app.controller("myCtrl", function($scope, $http) {
//	$scope.getDataFromServer = function() {
//		$http({
//			method : 'GET',
//			url : prefixUrl + 'javaAngularJS'
//		}).then(function successCallback(response) {
//			// if success TODO
//			alert(response.data);
//			$scope.person = response.data;
//		}, function errorCallback(response) {
//			// if error TODO
//		});
//	};
//});

app
		.controller(
				"getHobbiesCtrl",
				function($scope, $http, $window) {

					/***********************************************************
					 * Get all hobby kinds
					 */
					$scope.getAllHobbyKind = function() {
						$http({
							url : prefixUrl + 'getAllHobbyServlet',
							method : "GET"
						}).then(function successCallback(response) {
							$scope.allHobbyKind = response.data;
						}, function errorCallback(response) {
							console.log();
						});
					}
					/***********************************************************
					 * Get hobby details, like hobby kind, description, image
					 */
					$scope.getHobbyDetail = function(kind) {
						// $scope.hobbyKind = "just now";
						console.log($scope.hobbykind);
						// hobbyService.setHobbyKind($scope.hobbykind);
						sessionStorage.setItem('hobbyKind', kind);
						$window.location.href = "hobby_detail.html";
					}

					/***********************************************************
					 * Send longitude and latitude to server
					 */
					$scope.sendLocation = function() {
						var laitude;
						var longitude;
						console.log("ssssss");
						if (navigator.geolocation) {
							navigator.geolocation
									.getCurrentPosition(showPosition);
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

					/***********************************************************
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
						})
								.then(
										function successCallback(response) {
											// if success
											$scope.recommend = response.data;
											var eventTypes = $scope.recommend[0].allEvents;
											var eventClass = $scope.recommend[0].allEventsClass;
											var eventBgColor = $scope.recommend[0].allEventsBgColor;

											// assemble array
											var eventArray = eventTypes
													.split("^");
											var classArray = eventClass
													.split("^");
											var bgColorArray = eventBgColor
													.split("^");

											// assign value to scope
											$scope.eventArray = eventArray;
											$scope.classArray = classArray;
											$scope.bgColorArray = bgColorArray;

											// address array
											var addresses = $scope.recommend[0].allAddress;

											// address map
											initMap(addresses);

										},
										function errorCallback(response) {
											// if error
											alert("Sorry, there is no appropiate locations found in the area.");
										});
					};

					/***********************************************************
					 * Search suburb
					 */
					$scope.searchSuburb = function() {
						if ($scope.postOrSub == "") {
							alert();
						}
						$http({
							method : 'GET',
							url : prefixUrl + 'postOrSubServlet',
							params : {
								postOrSub : $scope.postOrSub
							}
						})
								.then(
										function successCallback(response) {
											// if success
											$scope.recommend = response.data;
											var eventTypes = $scope.recommend[0].allEvents;
											var eventClass = $scope.recommend[0].allEventsClass;
											var eventBgColor = $scope.recommend[0].allEventsBgColor;
											var eventArray = eventTypes
													.split("^");
											var classArray = eventClass
													.split("^");
											var bgColorArray = eventBgColor
													.split("^");
											$scope.eventArray = eventArray;
											$scope.classArray = classArray;
											$scope.bgColorArray = bgColorArray;
											initMap($scope.recommend[0].allAddress);
										},
										function errorCallback(response) {
											// if error TODO
											alert("Sorry, there is no appropiate locations found in the area.");
										});
					};

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
			url : prefixUrl + 'returnHobbyAddServlet',
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

/*******************************************************************************
 * Family violence controller
 * 
 * @param $scope
 * @param $http
 * @returns
 */
app.controller("homelessIssueCtrl", function($scope, $http) {
	/***************************************************************************
	 * In family violence page, search institutions available
	 */
	$scope.searchSuburb4FamilyViolence = function() {
		$http({
			method : 'GET',
			url : prefixUrl + 'postOrSubViolenceServlet',
			params : {
				subOrPost : $scope.postOrSub
			}
		}).then(function successCallback(response) {
			var famVioPlaces = response.data.allAddress;
			// address list
			$scope.famVioPlacesArr = famVioPlaces.split("^");
			// address map
			initMap(famVioPlaces);
		}, function errorCallback(response) {
			// if error
			alert("Sorry, there is no institutions found in the area.");
		});
	}
	
	/***************************************************************************
	 * In addiction page, search institutions available
	 */
	$scope.searchSuburb4Addiction = function() {
		$http({
			method : 'GET',
			url : prefixUrl + 'addictionServlet',
			params : {
				subOrPost : $scope.postOrSub
			}
		}).then(function successCallback(response) {
			var famVioPlaces = response.data.allAddress;
			// address list
			$scope.famVioPlacesArr = famVioPlaces.split("^");
			// address map
			initMap(famVioPlaces);
		}, function errorCallback(response) {
			// if error
			alert("Sorry, there is no institutions found in the area.");
		});
	}
	
	/***************************************************************************
	 * In financial issue page, search institutions available
	 */
	$scope.searchSuburb4FancialIssue = function() {
		$http({
			method : 'GET',
			url : prefixUrl + 'financialServlet',
			params : {
				subOrPost : $scope.postOrSub
			}
		}).then(function successCallback(response) {
			var famVioPlaces = response.data.allAddress;
			// address list
			$scope.famVioPlacesArr = famVioPlaces.split("^");
			// address map
			initMap(famVioPlaces);
		}, function errorCallback(response) {
			// if error
			alert("Sorry, there is no institutions found in the area.");
		});
	}

	/***************************************************************************
	 * Based on the institution type, return corresponding color
	 */
	$scope.getAddColor = function(type) {
		switch (type) {
		case "pharmacy.png":
			return "g-color-pink";
		case "hospital.png":
			return "g-color-teal";
		case "counselling.png":
			return "g-color-blue";
		case "legalAdvice.png":
			return "g-color-teal";
		case "employ.png":
			return "g-color-blue";
		// for addiction
		default:
			return "g-color-blue";
		}
	}

	/***************************************************************************
	 * Based on the institution type, return corresponding color
	 */
	$scope.getAddHoverColor = function(type) {
		switch (type) {
		case "pharmacy.png":
			return "g-bg-pink--hover g-color-white--hover";
		case "hospital.png":
			return "g-bg-teal--hover g-color-white--hover";
		case "counselling.png":
			return "g-bg-primary--hover g-color-white--hover";
		case "legalAdvice.png":
			return "g-bg-teal--hover g-color-white--hover";
		case "employ.png":
			return "g-bg-primary--hover g-color-white--hover";
		default:
			return "g-bg-primary--hover g-color-white--hover";
		}
	}

	/***************************************************************************
	 * Based on the institution type, return corresponding background color
	 */
	$scope.getAddBgColor = function(type) {
		switch (type) {
		case "pharmacy.png":
			return "g-bg-pink";
		case "hospital.png":
			return "g-bg-teal";
		case "counselling.png":
			return "g-bg-blue";
		case "legalAdvice.png":
			return "g-bg-teal";
		case "employ.png":
			return "g-bg-blue";
		default:
			return "g-bg-blue";
		}
	}

	/***************************************************************************
	 * Based on the institution type, return corresponding icon
	 */
	$scope.getAddIcon = function(type) {
		switch (type) {
		case "pharmacy.png":
			return "icon-medical-001 u-line-icon-pro";
		case "hospital.png":
			return "icon-medical-019 u-line-icon-pro";
		case "counselling.png":
			return "icon-science-020 u-line-icon-pro";
		case "legalAdvice.png":
			return "icon-finance-025 u-line-icon-pro";
		case "employ.png":
			return "icon-finance-125 u-line-icon-pro";
		default:
			return "icon-medical-022 u-line-icon-pro";
		}
	}

	$scope.openInfo = function(index) {
		window.openInfo(index);
	}
});
