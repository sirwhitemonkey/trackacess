'use strict';

angular.module('trackaccess.services')

  .factory('$modelForms', ['$q', '$log', '$localDataStorage', '$http', '$jsonDataStore', 'appConstants',
    function ($q, $log, $localDataStorage, $http, $jsonDataStore, appConstants) {
      var logMsgPrefix = '$modelForms ->';
      $log.debug(logMsgPrefix + ' created');

      var $modelForms = {
        id: '',
        formtype: '',
        formtypes: {
          form_type_1: 'Universal',
          form_type_2: 'MTMV Ganger & Field Engr.',
          form_type_3: 'Signals'
        },
        forms: [
          {id: 'Overview', name: 'Overview', title: 'Overview', icon: 'ion-ios-list'},
          {id: 'Form1', name: 'Application for Planned Work', title: 'Form 1', icon: 'ion-document-text'},
          {id: 'Form2', name: 'Work Area Communication Plan', title: 'Form 2', icon: 'ion-document-text'},
          {id: 'Form3', name: 'Application for Signals', title: 'Form 3', icon: 'ion-document-text'},
          {id: 'Form4', name: 'MTMV Work and Protection Plan', title: 'Form 4', icon: 'ion-document-text'},
          {id: 'Form5', name: 'Application for Work Train', title: 'Form 5', icon: 'ion-document-text'},
          {id: 'Form6', name: 'Application for Traction Overhead Power-off: Wellington', title: 'Form 6', icon: 'ion-document-text'},
          {id: 'Form7', name: 'Application for Traction Overhead Power-off: NIMT', title: 'Form 7', icon: 'ion-document-text'},
          {id: 'Form8', name: 'Application for Traction Overhead Power-off: Auckland', title: 'Form 8', icon: 'ion-document-text'},
          {id: 'Form9', name: 'Application for Secondary Protection', title: 'Form 9', icon: 'ion-document-text'}
        ],
        /*
         sequence:[
         {
         id: 'form_type_1',
         order: ['Form1','Form2','Form9','Form3','Form6','Form7','Form8','Form6','Form4']
         },
         {
         id: 'form_type_2',
         order: ['Form4','Form6','Form1','Form2','Form9','Form3','Form6','Form7','Form8']
         },
         {
         id: 'form_type_3',
         order: ['Form3','Form6','Form7','Form8','Form1','Form2','Form9','Form6','Form4']
         }
         ]*/
        data: {
          tamper_nos: [],
          regulator_nos: [],
          stabiliser_nos: [],
          low_loader_nos: [],
          rail_grinder_nos: [],
          ballast_cleaner_nos: [],
          gopher_nos: [],
          position_secured: [],
          isolator: [],
          tss: [],
          termination: [],
          lines: [],
          substations: [],
          wellingplatforms: []

        }
      };

      $modelForms.filledForms = undefined;


      /*
       $modelForms.getSequence=function() {
       var sequence= _($modelForms.sequence)
       .filter(function(seq){
       return seq.id === $modelForms.formtype
       })
       .pluck('order')
       .value();
       return sequence[0];

       };
       */

      /**
       * load the default forms data .. referred to forms.json
       */
      var load = function () {
        $http.get('scripts/features/forms/forms.json').then(function (result) {
          $modelForms.data.regulator_nos = result.data.regulator_nos.data;
          $modelForms.data.tamper_nos = result.data.tamper_nos.data;
          $modelForms.data.low_loader_nos = result.data.low_loader_nos.data;
          $modelForms.data.ballast_cleaner_nos = result.data.ballast_cleaner_nos.data;
          $modelForms.data.rail_grinder_nos = result.data.rail_grinder_nos.data;
          $modelForms.data.stabiliser_nos = result.data.stabiliser_nos.data;
          $modelForms.data.gopher_nos = result.data.gopher_nos.data;
          $modelForms.data.position_secured = result.data.position_secured.data;
          $modelForms.data.isolator = result.data.isolator.data;
          $modelForms.data.tss = result.data.tss.data;
          $modelForms.data.termination = result.data.termination.data;
          $modelForms.data.lines = result.data.lines.data;
          $modelForms.data.substations = result.data.substations.data;
          $modelForms.data.wellingplatforms = result.data.wellingplatforms.data;
        });
      };

      /**
       * get a  form
       * @param id the form id
       * @returns {form} the form
       */
      $modelForms.getForm = function (id) {
        var form = _($modelForms.forms)
          .filter(function (seq) {
            return seq.id === id
          })
          .value();
        return form[0];

      };


      /**
       * get the prefilled form
       * @returns {form} the prefilled form
       */
      $modelForms.getPreFilledForm = function () {

        var deferred = $q.defer();
        $localDataStorage.loadObj(appConstants.LOCAL_STORAGE_PREFILLED_FORMS)
          .then(function (prefilledforms) {
            $log.debug(logMsgPrefix + 'getPreFilledForm:' + JSON.stringify(prefilledforms));

            deferred.resolve(prefilledforms);
          });
        return deferred.promise;
      };

      /**
       * set the prefilled form
       * @param key the form field
       * @param value the form value
       * @returns {boolean} the true/false
       */
      $modelForms.setPreFilledForm = function (key, value) {
        $log.debug(logMsgPrefix + 'setPreFilledForm key:' + key + ' value:' + value);

        var deferred = $q.defer();

        $localDataStorage.loadObj(appConstants.LOCAL_STORAGE_PREFILLED_FORMS)
          .then(function (prefilledforms) {

            var data = {};
            if (prefilledforms === null) {
              data[key] = value;
              $localDataStorage.saveObj(appConstants.LOCAL_STORAGE_PREFILLED_FORMS, data)
                .then(function (response) {
                  deferred.resolve(true);
                });

            } else {
              data = prefilledforms;
              data[key] = value;
              $localDataStorage.saveObj(appConstants.LOCAL_STORAGE_PREFILLED_FORMS, data)
                .then(function (response) {
                  deferred.resolve(true);
                });
            }

          });
        return deferred.promise;
      };

      /**
       * set the post filled form
       * @param form the form name
       * @param key the form field
       * @param value the form value of the field
       * @returns {boolean} the true/false
       */
      $modelForms.setPostFilledForm = function (form, key, value) {

        var deferred = $q.defer();

        if (key === undefined) {
          deferred.resolve(true);
          $log.debug(logMsgPrefix + 'setPostFilledForm form:' + form + ' key is undefined');
          return deferred.promise;
        }

        $log.debug(logMsgPrefix + 'setPostFilledForm form:' + form + ' key:' + key + ' value:' + value);

        var field = {};
        field[key] = value;

        if ($modelForms.filledForms !== undefined) {

          if ($modelForms.filledForms.json.forms === undefined) {
            $modelForms.filledForms.json.forms = {};
          }

          if ($modelForms.filledForms.json.forms[form] === undefined) {
            $modelForms.filledForms.json.forms[form] = {};
          }

          if (key === 'reference_no') {
            $modelForms.filledForms.json.reference_no = value;
          } else {
            var _fields = $modelForms.filledForms.json.forms[form];

            _fields[key] = value;
            $modelForms.filledForms.json.forms[form] = _fields;
          }

          $modelForms.replacePostFilledForm()
            .then(function (response) {
              deferred.resolve(response);
            })

        }

        return deferred.promise;

      };

      /**
       * replace a post filled forms
       * @returns {boolean} true/false
       */
      $modelForms.replacePostFilledForm = function () {
        var deferred = $q.defer();
        $modelForms.filledForms.json.modified_date = new Date();
        $jsonDataStore.replace(appConstants.LOCAL_STORAGE_POSTFILLED_FORMS, [$modelForms.filledForms], {markDirty: true})
          .then(function (response) {
            $log.debug(logMsgPrefix + ' replacePostFilledForm:' + response);
            deferred.resolve(true);

          });
        return deferred.promise;
      };

      /**
       * get the post filled forms
       * @returns {boolean} true/false
       */
      $modelForms.getPostFilledForm = function () {
        $log.debug(logMsgPrefix + 'getPostFilledForm');

        var deferred = $q.defer();

        if ($modelForms.filledForms !== undefined) {
          deferred.resolve($modelForms.filledForms);
        } else {
          var query = {id: $modelForms.id};
          $jsonDataStore.getQuery(appConstants.LOCAL_STORAGE_POSTFILLED_FORMS, query)
            .then(function (docs) {
              if (docs !== undefined && docs !== null && docs.length !== 0) {
                $modelForms.filledForms = docs[0];
                deferred.resolve(true);
              } else {
                $modelForms.filledForms = undefined;
                deferred.resolve(false);
              }
            });
        }
        return deferred.promise;

      };


      /**
       * get all the post filled forms
       * @returns {forms} the post filled forms
       */
      $modelForms.getPostFilledForms = function () {
        $log.debug(logMsgPrefix + 'getPostFilledForms');

        var deferred = $q.defer();
        $jsonDataStore.get(appConstants.LOCAL_STORAGE_POSTFILLED_FORMS)
          .then(function (docs) {
            deferred.resolve(docs);
          });

        return deferred.promise;

      };

      /**
       * create a form
       * @returns {boolean} the true/false
       */
      $modelForms.create = function () {

        var deferred = $q.defer();

        $modelForms.getPostFilledForm()
          .then(function (response) {

            if (!response) {
              var status = 'Draft';
              var data = {
                id: $modelForms.id,
                created_date: new Date(),
                modified_date: new Date(),
                status: status,
                form_type: $modelForms.formtype,
                form_type_name: $modelForms.formtypes[$modelForms.formtype]
              };

              if ($modelForms.duplicateForms !== undefined) {
                data.forms = $modelForms.duplicateForms;
                $modelForms.duplicateForms = undefined;
              }

              $jsonDataStore.add(appConstants.LOCAL_STORAGE_POSTFILLED_FORMS, [data], {markDirty: true})
                .then(function (response) {
                  $modelForms.getPostFilledForm()
                    .then(function (response) {
                      deferred.resolve(response);
                    });
                });
            } else {
              deferred.resolve(response);
            }
          });

        return deferred.promise;
      };

      /**
       * remove the post filled forms
       * @returns {boolean} the true/false
       */
      $modelForms.remove = function () {
        $log.debug(logMsgPrefix + 'remove');

        var deferred = $q.defer();
        var query = {id: $modelForms.id};
        $jsonDataStore.getQuery(appConstants.LOCAL_STORAGE_POSTFILLED_FORMS, query)
          .then(function (docs) {
            if (docs !== undefined && docs !== null && docs.length !== 0) {

              $jsonDataStore.remove(appConstants.LOCAL_STORAGE_POSTFILLED_FORMS, [docs[0]])
                .then(function (response) {
                  deferred.resolve(true);
                });
            } else {
              deferred.resolve(false);
            }
          });

        return deferred.promise;
      };


      /**
       * set the form status
       * @param status the status{'draft','favourites','completed'}
       * @param taggedFavourites the tagged favourites true/false
       * @returns {boolean} the true/false
       */
      $modelForms.setFormsStatus = function (status, taggedFavourites) {
        $log.debug(logMsgPrefix + 'setFormsStatus');

        var deferred = $q.defer();
        var query = {id: $modelForms.id};
        $jsonDataStore.getQuery(appConstants.LOCAL_STORAGE_POSTFILLED_FORMS, query)
          .then(function (docs) {
            if (docs !== undefined && docs !== null && docs.length !== 0) {

              docs[0].json.modified_date = new Date();

              if (status === 'Completed' || status === 'Draft' || status === 'Favourites') {

                docs[0].json.status = status;
                if (!taggedFavourites) {
                  if (status === 'Completed' && docs[0].json.status === 'Favourites') {
                    docs[0].json.status = 'Favourites';
                    docs[0].json.submitted = true;
                  } else if (status === 'Completed' && docs[0].json.status !== 'Favourites') {
                    docs[0].json.submitted = true;
                  }
                }


              }

              $jsonDataStore.replace(appConstants.LOCAL_STORAGE_POSTFILLED_FORMS, [docs[0]], {markDirty: true})
                .then(function (response) {
                  deferred.resolve(true);
                });

            } else {
              deferred.resolve(false);
            }
          });

        return deferred.promise;
      };

      load();

      return $modelForms;

    }]);


