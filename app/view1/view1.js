angular.module('portfvangular.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['imageService', '$scope', '$http', function(imageService, $scope, $http) {
	 $scope.files = [];
	 $scope.uploadFile = function(){
        var file = $scope.uploadedFile;
        var uploadUrl = "http://localhost:3000/api/uploads";
        imageService.uploadFileToUrl(file, uploadUrl).then(function(file) {
       	 $scope.files.push(file);
        });
    };

    $scope.getFiles = function() {
    	imageService.getUploadedFiles().then(function(files) {
    		$scope.files = files;
    	});
    };

    $scope.deleteFile = function(file) {
    	imageService.deleteFile(file).then(function() {
    		var index = $scope.files.indexOf(file);
  			$scope.files.splice(index, 1);
    	});
    }

    $scope.getFiles();
}]);

