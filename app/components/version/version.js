'use strict';

angular.module('portfvangular.version', [
  'portfvangular.version.interpolate-filter',
  'portfvangular.version.version-directive'
])

.value('version', '0.1');
