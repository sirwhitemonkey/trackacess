/**
 * main form page
 */
angular.module('trackaccess.controllers')

  .controller('CtrlForms', function ($rootScope, $scope, $log, $modelForms, $stateParams, $timeout, $filter, $q, $service, $modelApp, $modelFormsValidator, $api, appConstants) {

    var logMsgPrefix = "CtrlForms -> ";
    $log.debug(logMsgPrefix + ' created');

    $scope.ctrlForms = {
      title: 'Forms',
      icon: '',
      status: 'Draft',
      detachform: false,
      tractionform6: false,
      tractionform7: false,
      tractionform8: false
    };


    /**
     *  load the content of all forms
     */
    var load = function () {
      $modelForms.getPostFilledForm()
        .then(function (response) {
          if ($modelForms.filledForms !== undefined) {
            $scope.ctrlForms.status = $modelForms.filledForms.json.status;
          }
        });
    };

    /**
     * validating traction form
     */
    $scope.ctrlForms.tractionform = function () {
      $scope.ctrlForms.tractionform6 = false;
      $scope.ctrlForms.tractionform7 = false;
      $scope.ctrlForms.tractionform8 = false;
      if ($modelForms.filledForms.json.forms !== undefined) {
        if ($modelForms.filledForms.json.forms['Form6'] !== undefined) {
          $scope.ctrlForms.tractionform6 = true;
        }
        if ($modelForms.filledForms.json.forms['Form7'] !== undefined) {
          $scope.ctrlForms.tractionform7 = true;
        }
        if ($modelForms.filledForms.json.forms['Form8'] !== undefined) {
          $scope.ctrlForms.tractionform8 = true;
        }
      }

    };

    /**
     * get a form
     * @param id the id of the form
     * @returns {form} the form object
     */
    $scope.ctrlForms.getForm = function (id) {
      var form = $modelForms.getForm(id);
      return form;
    };

    /**
     * displaying a form
     * @param form the form page
     */
    $scope.ctrlForms.showForm = function (form) {

      if ($modelForms.currentForm !== undefined &&
        $modelForms.currentForm === form) {
        $log.debug(logMsgPrefix + 'showForm: already the current form');
        return;
      }

      $log.debug(logMsgPrefix + 'showForm: ' + $modelApp.current.name);

      if ($modelFormsValidator.submit === undefined ||
        ($modelFormsValidator.submit !== undefined && $modelFormsValidator.submit === false)) {
        $rootScope.$broadcast(appConstants.EVENT_CLEAR_ERROR);
      }

      /**
       * route validators
       * @param form the target form
       */
      var route = function (form) {

        if (form === 'Form2') {
          if ($modelForms.filledForms.json.forms['Form1'] === undefined ||
            ($modelForms.filledForms.json.forms['Form1'] !== undefined && !$modelForms.filledForms.json.forms['Form1'].communication_plan_yes)) {
            $service.showAlert(" Form1  'Communication Plan' is required", true);
            return;
          }
        } else if (form === 'Form3') {
          if ($modelForms.formtype === 'form_type_1' || $modelForms.formtype === 'form_type_2') {
            if (!$modelForms.filledForms.json.forms['Form1'].re_railing && !$modelForms.filledForms.json.forms['Form1'].lca_disconnected && !$modelForms.filledForms.json.forms['Form1'].lca_manual_control && !$modelForms.filledForms.json.forms['Form1'].kv_signals) {
              $service.showAlert(" Form1  'Re railing/LCA Disconnected/LCA Manual Control/KV Signals' is required", true);
              return;
            }
          } else {
            if ($modelForms.filledForms.json['forms'] === undefined) {
              /*$modelForms.filledForms.json.forms={};
               $modelForms.filledForms.json.forms['Form1']={};
               $modelForms.filledForms.json.forms['Form1'].re_railing = true;
               $modelForms.filledForms.json.forms['Form1'].lca_disconnected = true;
               $modelForms.filledForms.json.forms['Form1'].lca_manual_control = true;
               $modelForms.filledForms.json.forms['Form1'].kv_signals = true;
               */
            }
          }

        } else if (form === 'Form4') {

          if ($modelForms.formtype === 'form_type_1') {
            if ($modelForms.filledForms.json.forms['Form1'] === undefined ||
              ($modelForms.filledForms.json.forms['Form1'] !== undefined && !$modelForms.filledForms.json.forms['Form1'].mtmv_work_protection_plan_required)) {
              $service.showAlert(" Form1  'MTMV Work and Protection Plan' is required", true);
              return;
            }
          }
          else if ($modelForms.formtype === 'form_type_2') {
            if ($modelForms.filledForms.json.forms === undefined) {
              $modelForms.filledForms.json['forms'] = {};
              $modelForms.filledForms.json.forms['Form1'] = {};
              $modelForms.filledForms.json.forms['Form1'].mtmv_work_protection_plan_required = true;
            } else {
              if ($modelForms.filledForms.json.forms['Form1'] === undefined) {
                $modelForms.filledForms.json.forms['Form1'] = {};
                $modelForms.filledForms.json.forms['Form1'].mtmv_work_protection_plan_required = true;
              } else {
                if (!$modelForms.filledForms.json.forms['Form1'].mtmv_work_protection_plan_required) {
                  $service.showAlert("Form1  'MTMV Work and Protection Plan' is required", true);
                  return;
                }
              }
            }
          }
        } else if (form === 'Form5') {

          if ($modelForms.filledForms.json.forms['Form1'] === undefined ||
            ($modelForms.filledForms.json.forms['Form1'] !== undefined && !$modelForms.filledForms.json.forms['Form1'].work_train_required)) {
            $service.showAlert(" Form1  'Work Train' is required", true);
            return;
          }
        } else if (form === 'Form9') {

          if ($modelForms.filledForms.json.forms['Form1'] === undefined ||
            ($modelForms.filledForms.json.forms['Form1'] !== undefined && !$modelForms.filledForms.json.forms['Form1'].line_impassable)) {
            $service.showAlert(" Form1  'Line Impassable' is required", true);
            return;
          }
        } else if (form === 'Form6' || form === 'Form7' || form === 'Form8') {

          if ($modelForms.formtype === 'form_type_1') {
            if ($modelForms.filledForms.json.forms['Form1'] === undefined ||
              ($modelForms.filledForms.json.forms['Form1'] !== undefined && !$modelForms.filledForms.json.forms['Form1'].traction_personnel_advised)) {
              $service.showAlert(" Form1  'Traction' is required", true);
              return;
            } else {
              if ($modelForms.filledForms.json.forms[form] === undefined) {
                $modelForms.filledForms.json.forms[form] = {};
              }
            }
          } else if ($modelForms.formtype === 'form_type_2') {
            if ($modelForms.filledForms.json.forms['Form4'] === undefined ||
              ($modelForms.filledForms.json.forms['Form4'] !== undefined && !$modelForms.filledForms.json.forms['Form4'].need_overhead_power_cutoff)) {
              $service.showAlert(" Form4  'Traction' is required", true);
              return;
            } else {
              if ($modelForms.filledForms.json.forms[form] === undefined) {
                $modelForms.filledForms.json.forms[form] = {};
              }
            }
          }

        }

        form = $scope.ctrlForms.getForm(form);
        $log.debug(logMsgPrefix + 'showForm tab selected:' + form.id);
        $scope.ctrlForms.title = form.name;
        $scope.ctrlForms.icon = form.icon;
        $scope.navigateRoute('main.forms.' + form.id, {}, false);
        $rootScope.$broadcast(appConstants.EVENT_FORMS, form.id);

        $modelForms.currentForm = form.id;

        if (($modelForms.formtype === 'form_type_1' ||
          $modelForms.formtype === 'form_type_2') &&
          form.id == 'Form3') {
          $scope.ctrlForms.detachform = true;
        } else {
          $scope.ctrlForms.detachform = false;
        }

      };

      route(form);

    };

    /**
     * remove the current active set of forms
     */
    $scope.ctrlForms.remove = function () {

      $service.confirm("This will remove the forms permanently. Remove ?",
        function (response) {
          if (response) {
            $modelForms.remove()
              .then(function (response) {
                if (response) {
                  $service.showAlert("The form has been removed", false);
                  $scope.navigateRoute('main.dashboard', {});
                }
              })
          }
        });

    };

    /**
     * remove an instance of a form in the set of forms
     * @param form the form page
     */
    $scope.ctrlForms.removeform = function (form) {
      delete $modelForms.filledForms.json.forms[form];
      $modelForms.replacePostFilledForm()
        .then(function (response) {

          $modelForms.filledForms = undefined;

          $modelForms.getPostFilledForm()
            .then(function (response) {
              $service.showAlert(form + " has been detached", false);
              $modelForms.currentForm = undefined;
              if ($modelForms.formtype === 'form_type_1') {
                form = 'Form1';
              } else if ($modelForms.formtype === 'form_type_2') {
                form = 'Form4';
              }
              $scope.ctrlForms.showForm(form);

            });

        });
    };


    /**
     * favourites validators
     */
    $scope.ctrlForms.favourites = function () {

      var status = 'Favourites';
      if ($modelForms.filledForms.json.status === 'Favourites' && $modelForms.filledForms.json['submitted'] !== undefined) {
        status = 'Completed';
      } else if ($modelForms.filledForms.json.status === 'Favourites' && $modelForms.filledForms.json['submitted'] === undefined) {
        status = 'Draft';
      }
      $modelForms.setFormsStatus(status, true)
        .then(function (response) {
          if (response) {
            $scope.ctrlForms.status = status;
            $service.showAlert("The form has been set as " + status, false);
            $scope.navigateRoute('main.dashboard', {});
          }
        });
    };

    /**
     * submit the forms for validation
     */
    $scope.ctrlForms.submit = function () {

      $service.showLoading("Checking device network ...");
      $service.networkInfo()
        .then(function (networkConnected) {
          $service.hideLoading(0)
            .then(function () {
              if (!networkConnected) {
                $service.showAlert("No internet connection", true);

              } else {
                $service.showModal('scripts/features/forms/forms-validators.html');
              }
            });
        })

    };

    /**
     * remove a form
     * @param form the form page
     */
    $scope.ctrlForms.removeform = function (form) {


      if (form === 'Form6' || form === 'Form7' || form === 'Form8') {


        var $index = 0;
        if ($modelForms.filledForms.json.forms['Form6'] !== undefined) {
          $index++;
        }
        if ($modelForms.filledForms.json.forms['Form7'] !== undefined) {
          $index++;
        }
        if ($modelForms.filledForms.json.forms['Form8'] !== undefined) {
          $index++;
        }

        if ($index === 1) {
          $service.showAlert("At least 1 traction form is required", false);
          return;
        }
      }

      $service.confirm("'" + form + "' already attached in the form, you want to remove the contents ?",
        function (response) {
          if (response) {
            delete $modelForms.filledForms.json.forms[form];
            $modelForms.replacePostFilledForm()
              .then(function (response) {

                $modelForms.filledForms == undefined;

                $modelForms.getPostFilledForm()
                  .then(function (response) {

                    $scope.ctrlForms.tractionform();

                  });
              });
          }
        });
    };


    $modelFormsValidator.loadedForms = {};


    var form = 'Overview';
    if ($modelForms.formtype === 'form_type_1') {
      form = 'Form1';
    } else if ($modelForms.formtype === 'form_type_2') {
      form = 'Form4';
    } else if ($modelForms.formtype === 'form_type_3') {
      form = 'Form3';
    }

    $scope.ctrlForms.showForm(form);

    $modelForms.onLoadForms = false;


    /**
     * listener for the event form
     */
    $scope.$on(appConstants.EVENT_NAVIGATE_FORM, function (event, form) {
      $scope.ctrlForms.showForm(form);
    });

    load();


  });


