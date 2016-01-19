/**
 * SI diagram page
 */
angular.module('trackaccess.controllers')

  .controller('CtrlSIDiagram', function ($scope, $rootScope, $log, $q, $modelForms, $timeout, $service, $fileReader, appConstants) {

    var logMsgPrefix = 'CtrlSIDiagram -> ';

    $log.debug(logMsgPrefix + ' created');


    $scope.ctrlSIDiagram = {
      content: '',
      originalContent: '',
      controlSave: false

    };

    /**
     * load the si diagram
     */
    var load = function () {
      $modelForms.filledForms = undefined;

      $modelForms.getPostFilledForm()
        .then(function (response) {

          if ($modelForms.currentForm === 'Form1') {
            var form1 = $modelForms.filledForms.json.forms.Form1;
            if (form1.si_diagram_attached !== undefined) {
              $scope.ctrlSIDiagram.content = form1.si_diagram_attached;
            }
          } else if ($modelForms.currentForm === 'Form9') {
            var form9 = $modelForms.filledForms.json.forms.Form9;
            if (form9.si_diagram_attached_primary_secondary !== undefined) {
              $scope.ctrlSIDiagram.content = form9.si_diagram_attached_primary_secondary;
            }
          }

        });

    };

    /**
     * hide the modal
     */
    $scope.ctrlSIDiagram.close = function () {
      $service.hideModal();
    };

    /**
     * save the si diagram
     */
    $scope.ctrlSIDiagram.save = function () {

      if ($scope.ctrlSIDiagram.content === undefined ||
        $scope.ctrlSIDiagram.content === '') {

        if ($modelForms.currentForm === 'Form1') {
          if ($modelForms.filledForms.json.forms['Form1'].si_diagram_attached === undefined ||
            $modelForms.filledForms.json.forms['Form1'].si_diagram_attached === '') {

            $modelForms.setPostFilledForm("Form1", "si_diagram_yes", false);
            $modelForms.setPostFilledForm("Form1", "si_diagram_no", true);
          }
        } else if ($modelForms.currentForm === 'Form9') {
          $modelForms.setPostFilledForm("Form9", "si_diagram_attached", false);
        }
        $service.hideModal();
        return;
      }

      if (!$scope.ctrlSIDiagram.controlSave) {
        $rootScope.$broadcast(appConstants.EVENT_SKETCH_INPUT);
      }
      $scope.ctrlSIDiagram.controlSave = true;
    };


    /**
     * listener for the event sketching output
     */
    $scope.$on(appConstants.EVENT_SKETCH_OUTPUT, function (event, param) {

      $scope.ctrlSIDiagram.controlSave = false;

      if (param.content === '') {
        $service.hideModal();
      } else {

        $service.confirm("Save SI Diagram?", function (response) {
          if (response) {
            if ($modelForms.currentForm === 'Form1') {
              $modelForms.setPostFilledForm("Form1", "si_diagram_attached", param.content);
              $modelForms.setPostFilledForm("Form1", "si_diagram_attached_actions", param.actions);
              $modelForms.setPostFilledForm("Form1", "si_diagram_attached_texts", param.texts);
              if ($scope.ctrlSIDiagram.originalContent !== '') {
                $modelForms.setPostFilledForm("Form1", "si_diagram_attached_copy", $scope.ctrlSIDiagram.originalContent);
              }
            } else if ($modelForms.currentForm === 'Form9') {
              $modelForms.setPostFilledForm("Form9", "si_diagram_attached_primary_secondary", param.content);
              $modelForms.setPostFilledForm("Form9", "si_diagram_attached_primary_secondary_actions", param.actions);
              $modelForms.setPostFilledForm("Form9", "si_diagram_attached_primary_secondary_texts", param.texts);
              if ($scope.ctrlSIDiagram.originalContent !== '') {
                $modelForms.setPostFilledForm("Form9", "si_diagram_attached_primary_secondary_copy", $scope.ctrlSIDiagram.originalContent);
              }
            }
          }
          $service.hideModal();

        }, "No", "Save");

      }

    });


    load();


    /**
     * File uploader
     */
    $scope.progress = {
      value: 0,
      max: 100
    };


    var reset = function () {
      var deferred = $q.defer();
      $scope.progress.value = 0;
      $scope.content = '';
      $scope.filedescription = '';
      deferred.resolve(true);
      return deferred.promise;
    };


    /**
     * file changed
     */
    $scope.onFileChanged = function () {

      reset().then(function (result) {
        $scope.filetarget = $('#si_diagram_photo_selection')[0].files[0];
        if ($scope.filetarget['size'] !== undefined) {
          if ($scope.filetarget.size >= 4000000) {
            $service.showAlert("File size must be less than 4MB size", true);
            $scope.filetarget = '';
          } else if ($scope.filetarget.type.indexOf("image") === -1) {
            $service.showAlert("File must be an image", true);
            $scope.filetarget = '';
          } else {

            $fileReader.readAsDataUrl($scope.filetarget, $scope)
              .then(function (result) {

                $service.confirm("New SI Diagram ?", function (response) {

                  if (response) {

                    var promises = [];

                    if ($modelForms.currentForm === 'Form1') {
                      promises.push($modelForms.setPostFilledForm("Form1", "si_diagram_attached_copy", undefined));
                      promises.push($modelForms.setPostFilledForm("Form1", "si_diagram_attached_actions", new Array()));
                      promises.push($modelForms.setPostFilledForm("Form1", "si_diagram_attached_texts", new Array()));

                    } else if ($modelForms.currentForm === 'Form9') {
                      promises.push($modelForms.setPostFilledForm("Form9", "si_diagram_attached_primary_secondary_copy", undefined));
                      promises.push($modelForms.setPostFilledForm("Form9", "si_diagram_attached_primary_secondary_actions", new Array()));
                      promises.push($modelForms.setPostFilledForm("Form9", "si_diagram_attached_primary_secondary_texts", new Array()));
                    }

                    $q.all(promises)
                      .then(function () {
                        $log.debug(logMsgPrefix + ' loading new content');
                        $scope.ctrlSIDiagram.content = result;
                        $scope.ctrlSIDiagram.originalContent = result;
                      });
                  }
                }, "Cancel", "Continue");


              });

          }
        }

      });


    };



  });



