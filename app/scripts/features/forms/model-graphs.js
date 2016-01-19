'use strict';

angular.module('trackaccess.services')

  .factory('$modelGraphs', ['$q', '$log', '$modelForms', function ($q, $log, $modelForms) {
    var logMsgPrefix = '$modelGraphs ->';
    $log.debug(logMsgPrefix + ' created');

    var $modelGraphs = {};


    /**
     * get the summary chart
     * @returns {chart} the chart data
     */
    $modelGraphs.summary = function () {

      var deferred = $q.defer();

      $modelForms.getPostFilledForms()
        .then(function (forms) {

          var drafts = 0;
          var Favourites = 0;
          var completed = 0;

          if (forms !== undefined &&
            forms !== null &&
            forms.length !== 0) {

            drafts = _(forms).filter(function (form) {
              return form.json.status === 'Draft'
            }).value().length;

            Favourites = _(forms).filter(function (form) {
              return form.json.status === 'Favourites'
            }).value().length;

            completed = _(forms).filter(function (form) {
              return form.json.status === 'Completed'
            }).value().length;
          }

          var data = [
            ['Draft', drafts],
            {
              name: 'Favourites',
              y: Favourites,
              sliced: true,
              selected: true
            }
            ,
            ['Completed', completed]
          ];
          deferred.resolve(data);

        });

      return deferred.promise;
    };

    /**
     * get the form chart
     * @returns {chart} the chart data
     */
    $modelGraphs.form = function () {
      var deferred = $q.defer();

      $modelForms.getPostFilledForms()
        .then(function (forms) {

          var formkeys = ['Form1', 'Form2', 'Form3', 'Form4', 'Form5', 'Form6', 'Form7', 'Form8', 'Form9'],
            form_type_1s = [0, 0, 0, 0, 0, 0, 0, 0, 0],
            form_type_2s = [0, 0, 0, 0, 0, 0, 0, 0, 0],
            form_type_3s = [0, 0, 0, 0, 0, 0, 0, 0, 0];

          if (forms !== undefined &&
            forms !== null &&
            forms.length !== 0) {

            var form_type_1 = _(forms).filter(function (form) {
              return form.json.form_type === 'form_type_1'
            }).value();

            var i = 0;
            if (form_type_1.length > 0) {
              i = 0;
              angular.forEach(formkeys, function (key) {
                form_type_1s[i] = _(form_type_1).filter(function (form) {
                  return form.json.forms[key] !== undefined
                }).value().length;
                i++;
              });
            }

            var form_type_2 = _(forms).filter(function (form) {
              return form.json.form_type === 'form_type_2'
            }).value();
            if (form_type_2.length > 0) {
              i = 0;
              angular.forEach(formkeys, function (key) {
                form_type_2s[i] = _(form_type_2).filter(function (form) {
                  return form.json.forms[key] !== undefined
                }).value().length;
                i++;
              });
            }

            var form_type_3 = _(forms).filter(function (form) {
              return form.json.form_type === 'form_type_3'
            }).value();
            if (form_type_3.length > 0) {
              i = 0;
              angular.forEach(formkeys, function (key) {
                form_type_3s[i] = _(form_type_3).filter(function (form) {
                  return form.json.forms[key] !== undefined
                }).value().length;
                i++;
              });
            }


            var data = {
              form_type_1: form_type_1s,
              form_type_2: form_type_2s,
              form_type_3: form_type_3s
            };
            deferred.resolve(data);

          }
        });

      return deferred.promise;
    };

    /**
     * get the forms chart
     * @returns {chart} the chart data
     */
    $modelGraphs.forms = function () {
      var deferred = $q.defer();

      $modelForms.getPostFilledForms()
        .then(function (forms) {


          var statuses = ['Draft', 'Favourites', 'Completed'],
            form_type_1s = [0, 0, 0],
            form_type_2s = [0, 0, 0],
            form_type_3s = [0, 0, 0];

          if (forms !== undefined &&
            forms !== null &&
            forms.length !== 0) {

            var form_type_1 = _(forms).filter(function (form) {
              return form.json.form_type === 'form_type_1'
            }).value();

            var i = 0;
            if (form_type_1.length > 0) {
              i = 0;
              angular.forEach(statuses, function (key) {
                form_type_1s[i] = _(form_type_1).filter(function (form) {
                  return form.json.status === key
                }).value().length;
                i++;
              });
            }

            var form_type_2 = _(forms).filter(function (form) {
              return form.json.form_type === 'form_type_2'
            }).value();
            if (form_type_2.length > 0) {
              i = 0;
              angular.forEach(statuses, function (key) {
                form_type_2s[i] = _(form_type_2).filter(function (form) {
                  return form.json.status === key
                }).value().length;
                i++;
              });
            }

            var form_type_3 = _(forms).filter(function (form) {
              return form.json.form_type === 'form_type_3'
            }).value();
            if (form_type_3.length > 0) {
              i = 0;
              angular.forEach(statuses, function (key) {
                form_type_3s[i] = _(form_type_3).filter(function (form) {
                  return form.json.status === key
                }).value().length;
                i++;
              });
            }
            var data = {
              form_type_1: form_type_1s,
              form_type_2: form_type_2s,
              form_type_3: form_type_3s
            };
            deferred.resolve(data);

          }
        });

      return deferred.promise;
    };

    return $modelGraphs;

  }]);