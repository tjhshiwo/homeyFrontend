/**
 * 
 */
var app = angular.module("myApp", [])
.factory("hobbyService", function(){
	var hobbyKind = {};
	return {
		setHobbyKind : function(data) {
			hobbyKind = data;
		},
		getHobbyKind : function(){
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
	$scope.getAllHobbyKind = function(){
		$http({
			url : 'http://localhost:8080/homeyBack/getAllHobbyServlet',
//			url : 'http://homeycloudback.azurewebsites.net/homeyBack/getAllHobbyServlet',
			method : "GET"
		}).then(function successCallback(response) {
			$scope.allHobbyKind = response.data;
		}, function errorCallback(response) {
//			alert(2);
		});
	}
	$scope.getHobbyDetail = function(kind) {
//		$scope.hobbyKind = "just now";
		console.log($scope.hobbykind);
//		hobbyService.setHobbyKind($scope.hobbykind);
		sessionStorage.setItem('hobbyKind', kind);
		$window.location.href = "hobby_detail.html";
	}
});

app.controller("getHobbyDetailCtrl", function($scope, $http) {
	$scope.hobbyKind = sessionStorage.getItem('hobbyKind');
	// get hobby description, image, title
	$scope.getHobbyDesc = function(){
		$http({
			// TODO get hobby description
			url: 'http://localhost:8080/homeyBack/getHobbyDetailServlet',
//			url: 'http://homeycloudback.azurewebsites.net/homeyBack/getHobbyDetailServlet',
			method : "GET",
			params: {hobbyKind: $scope.hobbyKind}
		}).then(function successCallback(response) {
			$scope.hobbyDesc = response.data;
		}, function errorCallback(response) {
//			alert("can't get hobby description");
		});
	}
	$scope.getHobbyFromServer = function() {
		$http({
			// http://118.139.20.206:8080/homey/javaAngularJS
			 url : 'http://localhost:8080/homeyBack/javaAngularJS',
//			url: 'http://homeycloudback.azurewebsites.net/homeyBack/javaAngularJS',
			method : "GET",
			params: {hobbyKind: $scope.hobbyKind}
		}).then(function successCallback(response) {
			var testDat = "[\"allAddress\":\"['PO Box 336,Warrandyte,VIC,3113','29 Regent Street,Mount Waverley,VIC,3149']\"]";
			alert(testDat);
			$scope.hobbyDetail = testDat;//response.data;
		}, function errorCallback(response) {
			alert("can't get hobby locations");
		});
	};
});