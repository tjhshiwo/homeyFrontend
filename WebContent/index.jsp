<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>AJAX with Servlets using AngularJS</title>
<script type="text/javascript" src="js/angular-2.js"></script>
<script type="text/javascript" src="angularDemo.js"></script>
<script>
	/* var app = angular.module('myApp', []);*/
	/* function MyController($scope, $http) {
		$scope.getDataFromServer = function() {
			$http({
				method : 'GET',
				url : 'javaAngularJS'
			}).then(function successCallback(response) {
				// 请求成功执行代码
				$scope.person = data;
			}, function errorCallback(response) {
				// 请求失败执行代码
			});

			/* success(function(data, status, headers, config) {
			        $scope.person = data;
			}).error(function(data, status, headers, config) {
			        // called asynchronously if an error occurs
			        // or server returns response with an error status.
			}); 
		};
	}; */
</script>
</head>
<body>
	<div data-ng-app="myApp">
		<div data-ng-controller="myCtrl">
			<button data-ng-click="getDataFromServer()">Fetch data from
				server</button>
			{{person}}
			<p>First Name : {{person.firstName}}</p>
			<p>Last Name : {{person.lastName}}</p>
		</div>
	</div>
</body>
</html>