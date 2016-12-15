'use strict';

angular.module('portfvangular.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['Images', '$scope', function(Images, $scope) {
	 Images.get()
            .success(function(data) {
                $scope.images = data;
            });

     $scope.getImage = function(data){
    	return 'data:image/jpeg;base64,' + data;
	}

	$scope.deleteImage = function(id) {
		// todo build delete function
	}

}]);