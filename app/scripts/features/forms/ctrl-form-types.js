/**
 * form types page
 */
angular.module('trackaccess.controllers')

  .controller('CtrlFormTypes',function($scope,$log,$rootScope,$modelForms,$modelFormsValidator,$service,appConstants) {

    var logMsgPrefix = "CtrlFormTypes -> ";
    $log.debug(logMsgPrefix + ' created');

    $scope.ctrlFormTypes={
      formtypes: $modelForms.formtypes
    };

    /**
     * set the form type
     * @param formtype the formtype {form_type_1,form_type_2,form_type_3}
     */
    $scope.ctrlFormTypes.setFormType=function(formtype) {

      $modelFormsValidator['validate_Prefilled']()
        .then(function() {
          if (!$modelFormsValidator.error) {

            $modelForms.formtype=formtype;


            var create=function() {
              //$service.showAlert("New form has been created",false);
              $modelForms.id=$service.uniqueId();
              $scope.navigateRoute('main.forms',{},true);
            };


            $modelForms.getPostFilledForms()
              .then(function(docs){

                if (docs !== undefined && docs !== null && docs.length > 0) {
                  $service.confirm("Duplicate from existing forms ?",
                    function(response){
                      if (response) {
                        $service.showModal('scripts/features/dashboard/dashboard-forms.html');
                      } else {
                        create();
                      }
                    },'New','Duplicate');
                } else {
                  create();
                }
              });

          }
        });
      $rootScope.$broadcast(appConstants.EVENT_DESTROY_POPOVER);

    };


  });