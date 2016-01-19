'use strict';


angular.module('trackaccess.services')
  .factory('$utilString', ['$log', function ($log) {

    var $utilString = {};
    $utilString.logMsgPrefix = '$utilString';
    $log.debug($utilString.logMsgPrefix + ' -> CREATED');


    $utilString.isStringNotEmpty = function (foo) {
      var flag = false;
      if (foo && foo.length > 0) {
        flag = true;
      }
      return flag;
    };
    $utilString.isStringEmpty = function (foo) {
      return !$utilString.isStringNotEmpty(foo);
    };

    $utilString.doesStringStartWith = function (foo, bar) {
      var flag = false;
      if ($utilString.isStringNotEmpty(foo) === true && $utilString.isStringNotEmpty(bar) === true) {
        flag = (foo.substring(0, bar.length) === bar);
      }
      return flag;
    };

    $utilString.doesStringIncludeIgnoringCase = function (foo, bar) {
      var flag = false;
      if ($utilString.isStringNotEmpty(foo) === true && $utilString.isStringNotEmpty(bar) === true) {
        flag = foo.toLowerCase().indexOf(bar.toLowerCase()) !== -1;
      }
      return flag;
    };

    $utilString.doesPasswordStringIncludeForbiddenChars = function (password) {
      var flag = false;
      if ($utilString.isStringEmpty(password)) {
        flag = true;
      }
      else if (password.indexOf(' ') !== -1) {
        flag = true;
      }
      return flag;
    };

    $utilString.regexpEmail = function () {
      return (/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/);
    };

    $utilString.regexpLettersApostrophesHyphens = function () {
      return (/^[a-zA-Z'\-]+$/);
    };

    $utilString.regexpLettersApostrophesHyphensSpaces = function () {
      return (/^[a-zA-Z'\- ]+$/);
    };

    $utilString.regexpLettersAndNumbers = function () {
      return (/^([a-zA-Z0-9])+$/);
    };

    $utilString.regexpInternationalDialingCode = function () {
      return (/^\+\d{1,3}?$/);
    };

    $utilString.regexpPhoneNumberForEBet = function () {
      return (/^\d{8,12}$/);
    };

    $utilString.regexpPostCodeAny = function () {
      return (/.*/);
    };

    $utilString.regexpPostCodeNZ = function () {
      return  (/^([0-9]){4}?$/);
    };

    $utilString.regexpFloatingPointNumber = function () {
      return  (/^[0-9]*\.?[0-9]+$/);
    };

    $utilString.regexpRealFloatingPointNumber = function () {
      return (/^-?[0-9]\d*(\.\d+)?$/);
    };

    $utilString.regexpNumeric = function () {
      return ( /^\d+$/);
    };

    // At least one letter, one number and no spaces
    $utilString.regexpPassword = function () {
      return  (/^(?=.*[0-9])(?=.*[a-zA-Z])(?!.*\s).*$/);
    };


    return $utilString;
  }]);




