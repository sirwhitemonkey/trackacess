'use strict';

(function () {

  angular.module('trackaccess.directives')

  /**
   * sketchCanvas
   */
    .directive('sketchCanvas', function ($log, $q, $modelSIDiagram, $interval, $modelForms, $rootScope, $service, $timeout, appConstants) {

      var logMsgPrefix = 'sketchCanvas ->';
      $log.debug(logMsgPrefix + 'created');


      return {
        restrict: 'E',
        templateUrl: 'scripts/features/si-diagram/sketch-canvas.html',
        replace: true,
        scope: {
          content: '=',
          canvas: '@'
        },
        /**
         * @param $scope the isolated scope{content,canvas}
         */
        controller: function ($scope) {

          $scope.data_colors = $modelSIDiagram.data_colors;
          $scope.data_sizes = $modelSIDiagram.data_size;
          $scope.tool_color = '';
          $scope.tool_size = '';
          $scope.labelStarted = false;
          var actions = [];
          var texts = [];
          var canvasHeight = 0;
          var canvasWidth = 0;

          $scope.strokes_eraser = true;


          var canvas = undefined;
          var canvas_save_content = undefined;

          var lower_scale = 1;
          var upper_scale = 5.0;
          var static_scale = 0.3;
          var scale = lower_scale;


          /**
           * load the si diagram
           * @returns {empty}
           */
          var load = function () {
            actions = [], texts = [];
            var deferred = $q.defer();
            $modelForms.filledForms = undefined;
            $modelForms.getPostFilledForm()
              .then(function (response) {

                if (canvas !== undefined) {
                  try {
                    canvas.sketch().clear();
                    $log.debug(logMsgPrefix + ' clearing canvas');
                  } catch (e) {

                  }

                }

                if ($modelForms.currentForm === 'Form1') {
                  var form1 = $modelForms.filledForms.json.forms.Form1;
                  if (form1.si_diagram_attached_copy !== undefined) {
                    $scope.content = form1.si_diagram_attached_copy;
                  }
                  if (form1.si_diagram_attached_actions !== undefined) {
                    actions = form1.si_diagram_attached_actions;
                  }
                  if (form1.si_diagram_attached_texts !== undefined) {
                    texts = form1.si_diagram_attached_texts;
                  }
                } else if ($modelForms.currentForm === 'Form9') {
                  var form9 = $modelForms.filledForms.json.forms.Form9;
                  if (form9.si_diagram_attached_primary_secondary_copy !== undefined) {
                    $scope.content = form9.si_diagram_attached_primary_secondary_copy;
                  }
                  if (form9.si_diagram_attached_primary_secondary_actions !== undefined) {
                    actions = form9.si_diagram_attached_primary_secondary_actions;
                  }
                  if (form9.si_diagram_attached_primary_secondary_texts !== undefined) {
                    texts = form9.si_diagram_attached_primary_secondary_texts;
                  }
                }

                deferred.resolve();
              });

            return deferred.promise;
          };

          /**
           * scaling on portrait/landscape
           * @returns {empty}
           */
          var scaling = function () {
            var deferred = $q.defer();
            if (scale !== lower_scale) {
              canvas.css({'-moz-transform': 'scale(1,1)', '-webkit-transform': 'scale(1,1)',
                'transform': 'scale(1,1)'});
              scale = lower_scale;
            }

            $timeout(function () {
              deferred.resolve();
            }, 500);

            return deferred.promise;
          };


          var w = angular.element($(window));
          var el;

          var initCanvas = function () {
            var deferred = $q.defer();

            $timeout(function () {
              canvas = $('#' + $scope.canvas);
              canvas_save_content = $('#canvas_save_content');
              el = angular.element($(canvas));
              deferred.resolve();
            }, 2000);

            return deferred.promise;
          }

          var interval;
          var initialised = false;

          /**
           * objectify the image
           * @param content the content of the si diagram
           * @returns {Image} the image
           */
          var objectifyImage = function objectifyImage(content) {
            var img_obj = new Image();
            img_obj.src = content;
            return img_obj;
          };

          /**
           * save the image with content
           * @returns {empty}
           */
          var saveImageWithContent = function () {
            var deferred = $q.defer();

            canvas_sync()
              .then(function () {
                var _actions = canvas.sketch().actions;
                var _texts = canvas.sketch().texts;
                canvas_save_content.sketch().actions = _actions;
                canvas_save_content.sketch().texts = _texts;
                canvas_save_content.sketch().painting = true;
                canvas_save_content.sketch().drawStrokes();
                canvas_save_content.sketch().painting = false;
                canvas_save_content.sketch().drawTexts();
                deferred.resolve();

              });

            return deferred.promise;

          };

          /**
           * canvas dimension
           */
          var canvasDimension = function () {


            canvas[0].width = canvasWidth;
            canvas[0].height = canvasHeight - 20; //margin-bottom

            $log.debug(logMsgPrefix + ' canvasDimension canvasHeight:' + canvasHeight + ' canvasWidth:' + canvasWidth);

            canvas.css({'background-size': canvas[0].width + 'px ' + canvas[0].height + 'px', 'background-repeat': 'no-repeat',
              '-moz-transition': 'all 50ms', '-webkit-transition': 'all 50ms', 'transition': 'all 50ms',
              '-moz-transform': 'scale(1,1)', '-webkit-transform': 'scale(1,1)', 'transform': 'scale(1,1)',
              'z-index': '0'});


            var context = canvas_save_content.get(0).getContext('2d');
            var imageObj = objectifyImage($scope.content);
            canvas_save_content[0].width = canvas[0].width;
            canvas_save_content[0].height = canvas[0].height;
            imageObj.onload = function () {
              context.drawImage(this, 0, 0, canvas_save_content[0].width, canvas_save_content[0].height);
            };
            canvas_save_content.sketch();

            canvas_sync()
              .then(function () {
              });

          };

          /**
           * resize the canvas
           */
          var resize = function () {

            var action = function () {
              $log.debug(logMsgPrefix + ' resize canvasHeight:' + canvasHeight + ' canvasWidth:' + canvasWidth);
              if (canvas.css !== undefined) {
                canvasDimension();
              }

              $rootScope.$broadcast(appConstants.EVENT_DROPDOWN_HIDE);
              $interval.cancel(interval);
            };

            /**
             * compute the canvas dimension
             */
            var compute = function () {
              canvasHeight = w.height() - (parseInt(el.offset().top));
              canvasWidth = w.width();
            };
            if (scale !== lower_scale) {
              scaling()
                .then(function () {
                  compute();
                  action();
                });
            } else {
              compute();
              action();
            }

          };

          w.bind('resize', function (event) {
            $interval.cancel(interval);
            interval = $interval(function () {
              resize();
            }, 1000);
          })

          /**
           * sync the canvas
           * @returns {empty}
           */
          var canvas_sync = function () {
            var deferred = $q.defer();

            var strokes = function () {
              var stroke = $q.defer();
              canvas.sketch().painting = true;
              canvas.sketch().drawStrokes();
              canvas.sketch().painting = false;
              stroke.resolve();
              return stroke.promise;
            };

            var texts = function () {
              var text = $q.defer();
              canvas.sketch().drawTexts();
              text.resolve();
              return text.promise;
            };

            strokes()
              .then(function () {
                texts()
                  .then(function () {
                    deferred.resolve();
                  });
              });
            return deferred.promise;
          };

          /**
           * listener for the content of the si diagram
           */
          $scope.$watch(function () {
            return $scope.content;
          }, function () {

            if ($scope.content === undefined ||
              $scope.content === '') {
              return;
            }

            $rootScope.$broadcast(appConstants.EVENT_DROPDOWN_HIDE);
            scaling();

            $service.showLoading("Initialising  canvas ...");
            initCanvas()
              .then(function () {
                canvas.css({'background-image': 'url(' + $scope.content + ')'});
                load()
                  .then(function () {


                    canvasDimension();

                    $log.debug(logMsgPrefix + ' load content');

                    canvas.sketch().actions = actions;
                    canvas.sketch().texts = texts;
                    canvas.sketch().drawStrokes();
                    canvas.sketch().drawTexts();

                    canvas.sketch('tool', 'marker');

                  });
              });
            $service.hideLoading(2000);

          });

          /**
           * label completed
           */
          $scope.labelCompleted = function () {

            $scope.strokes_eraser = true;

            $rootScope.$broadcast(appConstants.EVENT_DROPDOWN_HIDE);
            scaling();

            canvas.sketch().reset();
            $scope.labelStarted = false;

            canvas.sketch('tool', 'marker');

          };

          /**
           * label removed
           */
          $scope.labelRemove = function () {

            $rootScope.$broadcast(appConstants.EVENT_DROPDOWN_HIDE);
            scaling();

            if (!$scope.labelStarted) {
              return;
            }

            if (canvas.sketch().selectedText !== -1) {

              var text = canvas.sketch().texts[canvas.sketch().selectedText];
              $service.confirm('Remove annotation text "' + text.text + '" ?',
                function (response) {
                  canvas.sketch().texts.splice(canvas.sketch().selectedText, 1);
                  canvas.sketch().reset();


                }, "Cancel", "Remove");


            } else {
              $service.showAlert("No selected text", true);
            }

          };

          /**
           * label
           */
          $scope.label = function () {

            $scope.strokes_eraser = false;

            $rootScope.$broadcast(appConstants.EVENT_DROPDOWN_HIDE);
            scaling();

            canvas.sketch('tool', 'label');

            if (!$scope.labelStarted) {


              canvas_sync()
                .then(function () {
                  canvas.sketch().texting = true;
                });


            } else {
              $service.prompt('', 'Enter your label', 'text', 'Label',
                function (response) {
                  if (response) {

                    canvas.sketch('text', response);

                    canvas_sync()
                      .then(function () {
                        canvas.sketch().texting = true;
                      });
                  }
                }, 'Cancel', 'New');
            }
            $scope.labelStarted = true;
          };

          /**
           * eraser
           */
          $scope.eraser = function () {

            $scope.strokes_eraser = false;

            $rootScope.$broadcast(appConstants.EVENT_DROPDOWN_HIDE);
            scaling();

            canvas.sketch('tool', 'eraser');

            $scope.strokes_eraser = true;

          };


          /**
           * zoom
           * @param zoom the zoom -/+
           */
          $scope.zoom = function (zoom) {

            $rootScope.$broadcast(appConstants.EVENT_DROPDOWN_HIDE);

            if (zoom === '-') {

              if ((scale - static_scale) >= lower_scale) {
                scale -= static_scale;
              } else {
                scale = 1;
              }
            } else if (zoom == '+') {
              if ((scale + static_scale) <= upper_scale) {
                scale += static_scale;
              }
            }
            canvas.css({'-moz-transform': 'scale(' + scale + ',' + scale + ')', '-webkit-transform': 'scale(' + scale + ',' + scale + ')',
              'transform': 'scale(' + scale + ',' + scale + ')'});

          };


          /**
           * listener for the event sketch input
           */
          $scope.$on(appConstants.EVENT_SKETCH_INPUT, function () {

            $rootScope.$broadcast(appConstants.EVENT_DROPDOWN_HIDE);


            var sync = function () {
              var deferred = $q.defer();

              $service.showLoading("Synchronising canvas ....")
                .then(function () {

                  $timeout(function () {
                    //Trigger to finalise contents
                    canvas.trigger('touchstart');
                    canvas.trigger('mousedown');
                    deferred.resolve();
                  }, 3000);
                });
              return deferred.promise;
            };

            sync()
              .then(function () {
                $service.hideLoading(0);
                saveImageWithContent()
                  .then(function () {
                    $rootScope.$broadcast(appConstants.EVENT_SKETCH_OUTPUT, {content: canvas_save_content.get(0).toDataURL(), actions: canvas.sketch().actions, texts: canvas.sketch().texts});
                  });
              });
          });

          /**
           * tool color
           * @param tool_color
           */
          $scope.onToolColor = function (tool_color) {


            $scope.tool_color = tool_color;


            if (!$scope.labelStarted) {
              canvas.sketch('tool', 'marker');
              $log.debug(logMsgPrefix + ' sketching colour ...' + JSON.stringify(tool_color));
              //$scope.strokes_eraser=true;

              scaling();
            }
            canvas.sketch('color', tool_color.hex);
          };

          /**
           * tool size
           * @param tool_size the tool_size
           */
          $scope.onToolSize = function (tool_size) {

            $scope.tool_size = tool_size;

            if (!$scope.labelStarted) {
              canvas.sketch('tool', 'marker');
              $log.debug(logMsgPrefix + ' sketching size ...' + JSON.stringify(tool_size));
              canvas.sketch('size', parseInt(tool_size.size));
              scaling();
              //$scope.strokes_eraser=true;
            }


          };


          // delaying the $watch on load.
          $timeout(function () {
            $scope.$watch(function () {
              return $scope.strokes_eraser;
            }, function (value) {
              if (value === true) {
                $service.hideAlert();
                $service.showAlert("Tap the canvas after erase/strokes", false);
              }
            });

          }, 5000);

        }
      };

    })


}());




