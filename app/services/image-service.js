angular.module('imageService', [])

.service('imageService', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        return $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function(response) {
        	return response.data;
        });
    }

    this.getUploadedFiles = function() {
       return $http.get('http://localhost:3000/api/files').then(function(response) {
       	return response.data;
       });
     }

    this.deleteFile = function(file) {
       return $http.delete('http://localhost:3000/api/uploads/'+file._id+'/remove').then(function(response) {
       	return response.data;
       });
     }

}]);
