angular.module('imageService', [])

    // super simple service
    // each function returns a promise object 
    .factory('Images', function($http) {
        return {
            get : function() {
            	console.log('called test');
                return $http.get('http://localhost:3000/api/images');
            },
            create : function(imageData) {
                return $http.post('http://localhost:3000/api/images', imageData);
            },
            delete : function(id) {
                return $http.delete('http://localhost:3000/api/images' + id);
            }
        }
    });