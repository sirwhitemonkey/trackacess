'use strict';

angular.module('trackaccess.filters',[])

  .filter('dateLabel', function($filter) {

    return function(value,format) {

      if (value === undefined ||
        value === '') {
        return;
      }

      return $filter('date')(value,format);

    };
  })

  .filter('capitalizedFirstCharacterInWord', function() {

    return function(value) {
      return value.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    };
  })

  .filter('capitalizedFirstCharacter', function() {

    return function(value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    };
  })


  .filter('cutoffLabel', function($filter) {

    return function (value, size) {

      if (value === undefined ||
        value === '') {
        return;
      }

      if (value.length > size) {
        value = value.substring(0, size) + '...';
      }
      return value;

    };

  });






