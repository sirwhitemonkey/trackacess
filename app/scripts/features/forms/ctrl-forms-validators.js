/**
 * form validator page
 */
angular.module('trackaccess.controllers')

  .controller('CtrlFormsValidators',function($scope,$log,$q,$modelForms,$api,$modelFormsValidator,$service,$rootScope,$timeout,appConstants) {

    var logMsgPrefix = "CtrlFormsValidators -> ";
    $log.debug(logMsgPrefix + ' created');

    $scope.ctrlFormsValidators={
      forms:[],
      submit: false
    };


    /**
     * organise the forms in the lists
     */
    var forms = function() {

      var $index=0;
      $scope.ctrlFormsValidators.forms.push({form: 'Overview', order:$index, done: false, error:false});
       _.each($modelForms.filledForms.json.forms, function (value, key) {
        $index++;
        $scope.ctrlFormsValidators.forms.push({form: key, order:$index, done: false, error:false});
      });
    };

    /**
     * load and validate all forms
     */
    var load=function() {

      $modelForms.getPostFilledForm()
        .then(function(response) {
          $modelFormsValidator.validators = {};


          var  validators = function(form) {
            var deferred=$q.defer();

            $timeout(function() {
              $modelFormsValidator['validate_' + form]().then(function () {

                $log.debug(logMsgPrefix  + 'validators -> completed -> ' + form);
                var $index=0;
                _.each($scope.ctrlFormsValidators.forms,function(value){

                  if (value.form === form) {
                    $log.debug(logMsgPrefix + ' value.form:' + form);
                    value.done=true;
                    value.error = $modelFormsValidator.validators[form];
                  }
                });
            },800);

              deferred.resolve();
            });


            return deferred.promise;
          };


          var promises = [];
          promises.push(validators('Overview'));

          _.each($modelForms.filledForms.json.forms, function (value, key) {
            promises.push(validators(key));
          });

          $q.all(promises)
            .then(function () {

              var error = _($modelFormsValidator.validators)
                .filter(function (error) {
                  return error === true;
                })
                .value();

              if (error.length === 0) {
                $scope.ctrlFormsValidators.submit = true;

              } else {
                $scope.ctrlFormsValidators.submit = false;
              }
            });
        });
    };

    /**
     * show form
     * @param o the instance of the form during validation
     */
    $scope.ctrlFormsValidators.showForm=function(o) {

      if (!o.done || (o.done && !o.error)) {
        return;
      }

      $rootScope.$broadcast(appConstants.EVENT_NAVIGATE_FORM, o.form);

      $timeout(function() {
        $modelFormsValidator['validate_'+ o.form]().then(function(){});
      },1500);

      $service.hideModal();


    };


    /**
     * hide the modal
     */
    $scope.ctrlFormsValidators.close = function() {
      $service.hideModal();
    };

    /**
     * submit forms to worklight
     */
    $scope.ctrlFormsValidators.submitAction = function() {

      $rootScope.$broadcast(appConstants.EVENT_CLEAR_ERROR);

      $service.showLoading("Processing ...");
      $api.controller.submit($modelForms.filledForms)
        .then(function(response) {

          $service.hideLoading(0)
            .then(function() {

              $service.hideModal();

              if (response.error) {
                $service.showAlert(response.message,true);
              } else {
                $modelForms.setFormsStatus('Completed')
                  .then(function(response) {
                    $modelForms.currentForm=undefined;
                    $service.showAlert("Forms submission successful",false);

                    $rootScope.$broadcast(appConstants.EVENT_STATE_TRANSITION,{state:'main.dashboard',params:{}});

                    $timeout(function() {
                      $rootScope.$broadcast(appConstants.EVENT_FORM_SUBMISSION_SUCCESS);
                    },500);

                  });
              }
            });
        });
    };

    forms();

    // timeout reference for the validators page
    $timeout(function() {
      load();
    },800);


  });




