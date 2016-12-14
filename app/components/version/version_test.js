'use strict';

describe('portfvangular.version module', function() {
  beforeEach(module('portfvangular.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
