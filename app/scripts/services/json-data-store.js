'use strict';

angular.module('trackaccess.services')

  .factory('$jsonDataStore',['$q','$log',function($q,$log) {

    var logMsgPrefix = '$jsonDataStore -> ';

    $log.debug(logMsgPrefix + ' created');

    var $jsonDataStore={};

    /**
     * add to collection
     * @param key the collection name
     * @param jsonArray the data array
     * @param addOptions the options
     * @returns {boolean} the true/false
     */
    $jsonDataStore.add = function(key, jsonArray, addOptions ){
      var deferred = $q.defer();
      try {

        WL.JSONStore.get(key).add(jsonArray, addOptions)
          .then(function (result) {
            $log.debug(logMsgPrefix + '{jsonstore-add} successful to:' + key);
            deferred.resolve(true);

          })
          .fail(function (errorObject) {
            $log.debug(logMsgPrefix + '{jsonstore-add} failure to:' + key);
            deferred.resolve(false);
          });
      } catch (e) {
        deferred.resolve(false);
      }

      return deferred.promise;
    };


    /**
     * remove from collection
     * @param key the collection name
     * @param jsonArray the data array
     * @returns {boolean} the true/false
     */
    $jsonDataStore.remove = function(key,jsonArray) {
      $log.debug(logMsgPrefix + '{jsonstore-remove}:' + key);
      var deferred = $q.defer();

      try {

        WL.JSONStore.get(key).remove(jsonArray, {push: false, markDirty: false}).then(function (result) {
          deferred.resolve(true);
        });
      } catch(e) {
        deferred.resolve(false);
      }

      return deferred.promise;
    };

    /**
     * set the collection
     * @param key the collection name
     * @param value the data array
     * @returns {boolean} the true/false
     */
    $jsonDataStore.set = function(key,value) {
      $log.debug(logMsgPrefix + '{jsonstore-set}:' + key);
      var deferred = $q.defer();

      try {

        WL.JSONStore.get(key).findAll({}).then(function (docs) {
          if (docs) {
            WL.JSONStore.get(key).remove(docs, {push: false}).then(function (result) {
              $jsonDataStore.add(key, value, {}).then(function (result) {
                deferred.resolve(true);
              });
            });
          }
        });
      } catch(e) {
        deferred.resolve(false);
      }

      return deferred.promise;
    };

    /**
     * get the collection
     * @param key the collection name
     * @returns {collection} the collection array
     */
    $jsonDataStore.get = function(key) {
      $log.debug(logMsgPrefix + '{jsonstore-get}:'+key);
      var deferred=$q.defer();

      try {
        WL.JSONStore.get(key).findAll({}).then(function (docs) {
          deferred.resolve(docs);
        });
      } catch(e) {
        deferred.resolve([]);
      }
      return deferred.promise;
    };

    /**
     * replace the collection
     * @param key the collection name
     * @param jsonArray the data array
     * @param dirty the dirty flags true/false
     * @returns {boolean} the true/false
     */
    $jsonDataStore.replace = function(key,jsonArray,dirty) {
      var options={
        markDirty:dirty,
        push:false
      };

      $log.debug(logMsgPrefix + '{jsonstore-replace}:'+key);

      var deferred=$q.defer();

      try {

        WL.JSONStore.get(key).replace(jsonArray, options).then(function (result) {
          deferred.resolve(result);
        });
      } catch(e) {
        deferred.resolve([]);
      }
      return deferred.promise;
    };


    /**
     * get the collection
     * @param key the collection name
     * @param query the query filter
     * @returns {collection} the collection array
     */
    $jsonDataStore.getQuery = function(key,query) {
      $log.debug(logMsgPrefix + '{jsonstore-getQuery}:'+key);
      var deferred=$q.defer();

      try {

        WL.JSONStore.get(key).find(query).then(function(docs){
          deferred.resolve(docs);
        });
      }catch(e) {
        deferred.resolve([]);
      }
      return deferred.promise;
    };


    return $jsonDataStore;


  }]);
