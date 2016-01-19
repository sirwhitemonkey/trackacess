'use strict';

angular.module('trackaccess.services')
  .factory('$chart', ['$q', '$log', '$modelGraphs', '$modelApp', '$modelForms', function ($q, $log, $modelGraphs, $modelApp, $modelForms) {
    var logMsgPrefix = '$chart ->';
    $log.debug(logMsgPrefix + ' created');

    var $chart = {};

    /**
     * graph summary
     * @param summary the chart data
     * @returns {chart} the chart object
     */
    var graph_summary = function (summary) {

      var deferred = $q.defer();

      var colors = [];

      $modelApp.getTheme()
        .then(function (theme) {

          if (theme.css === 'theme1') {
            colors = ['#A91D46', '#19AD51', '#F7A51C'];
          }
          else if (theme.css === 'theme2') {
            colors = ['#0599C6', '#E41C39', '#F7A51C'];
          }
          else if (theme.css === 'theme3') {
            colors = ['#E41C39', '#19AD51', '#F7A51C'];
          }

          deferred.resolve({
            chart: {
              type: 'pie',
              backgroundColor: 'transparent',
              options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
              }
            },
            title: {
              text: ''
            },
            credits: {
              enabled: false
            },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 35,
                dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
              }
            },
            series: [
              {
                type: 'pie',
                colors: colors,
                data: summary

              }
            ]
          });
        });

      return deferred.promise;

    };

    /**
     * graph summary dashboard
     * @param summary the chart data
     * @returns {chart} the chart object
     */
    var graph_summary_dashboard = function (summary) {

      var deferred = $q.defer();

      var colors = [];

      $modelApp.getTheme()
        .then(function (theme) {

          if (theme.css === 'theme1') {
            colors = ['#A91D46', '#19AD51', '#F7A51C'];
          }
          else if (theme.css === 'theme2') {
            colors = ['#0599C6', '#E41C39', '#F7A51C'];
          }
          else if (theme.css === 'theme3') {
            colors = ['#E41C39', '#19AD51', '#F7A51C'];
          }

          deferred.resolve({
            chart: {
              type: 'pie',
              height: 120,

              backgroundColor: 'transparent',
              options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
              }
            },
            title: {
              text: ''
            },
            credits: {
              enabled: false
            },
            tooltip: {
              pointFormat: '<b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 35,
                dataLabels: {
                  enabled: true,
                  format: '</b>{point.percentage:.1f} %'
                },
                showInLegend: false

              }
            },
            series: [
              {
                type: 'pie',
                colors: colors,
                data: summary

              }
            ]
          });
        });

      return deferred.promise;

    };

    /**
     * graph form
     * @param forms the chart data
     * @returns {chart} the chart object
     */
    var graph_form = function (forms) {
      var deferred = $q.defer();

      deferred.resolve({
        chart: {
          backgroundColor: 'transparent'
        },
        title: {
          text: ''
        },
        credits: {
          enabled: false
        },
        xAxis: {
          categories: [ $modelForms.formtypes.form_type_1, $modelForms.formtypes.form_type_2, $modelForms.formtypes.form_type_3]
        },
        series: [
          {
            type: 'column',
            name: 'Form1',
            data: [forms.form_type_1[0], forms.form_type_2[0], forms.form_type_3[0]]
          },
          {
            type: 'column',
            name: 'Form2',
            data: [forms.form_type_1[1], forms.form_type_2[1], forms.form_type_3[1]]
          },
          {
            type: 'column',
            name: 'Form3',
            data: [forms.form_type_1[2], forms.form_type_2[2], forms.form_type_3[2]]
          },
          {
            type: 'column',
            name: 'Form4',
            data: [forms.form_type_1[3], forms.form_type_2[3], forms.form_type_3[3]]
          },
          {
            type: 'column',
            name: 'Form5',
            data: [forms.form_type_1[4], forms.form_type_2[4], forms.form_type_3[4]]
          },
          {
            type: 'column',
            name: 'Form6',
            data: [forms.form_type_1[5], forms.form_type_2[5], forms.form_type_3[5]]
          },
          {
            type: 'column',
            name: 'Form7',
            data: [forms.form_type_1[6], forms.form_type_2[6], forms.form_type_3[6]]
          },
          {
            type: 'column',
            name: 'Form8',
            data: [forms.form_type_1[7], forms.form_type_2[7], forms.form_type_3[7]]
          },
          {
            type: 'column',
            name: 'Form9',
            data: [forms.form_type_1[8], forms.form_type_2[8], forms.form_type_3[8]]
          }
        ]
      });

      return deferred.promise;

    };

    /**
     * graph forms
     * @param forms the chart data
     * @returns {chart} the chart object
     */
    var graph_forms = function (forms) {
      var deferred = $q.defer();


      deferred.resolve(
        {
          chart: {
            backgroundColor: 'transparent'
          },
          title: {
            text: ''
          },
          credits: {
            enabled: false
          },
          xAxis: {
            categories: ['Draft', 'Favourites', 'Completed']
          },

          /*
           labels: {
           items: [{
           html: 'Summary',
           style: {
           left: '300px',
           top: '18px',
           color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
           }
           }]
           },*/
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              depth: 35,
              dataLabels: {
                enabled: true,
                format: '</b>{point.percentage:.1f} %'
              },
              showInLegend: false
            }
          },
          series: [
            {
              type: 'column',
              name: $modelForms.formtypes.form_type_1,
              data: forms.form_type_1
            },
            {
              type: 'column',
              name: $modelForms.formtypes.form_type_2,
              data: forms.form_type_2
            },
            {
              type: 'column',
              name: $modelForms.formtypes.form_type_3,
              data: forms.form_type_3
            },
            {
              type: 'pie',
              name: 'Summary',
              data: [
                {
                  name: $modelForms.formtypes.form_type_1,
                  y: forms.form_type_1[0] + forms.form_type_2[0] + forms.form_type_3[0],
                  color: Highcharts.getOptions().colors[0]
                },
                {
                  name: $modelForms.formtypes.form_type_2,
                  y: forms.form_type_1[1] + forms.form_type_2[1] + forms.form_type_3[1],
                  color: Highcharts.getOptions().colors[1],
                  sliced: true,
                  selected: true
                },
                {
                  name: $modelForms.formtypes.form_type_3,
                  y: forms.form_type_1[2] + forms.form_type_2[2] + forms.form_type_3[2],
                  color: Highcharts.getOptions().colors[2]
                }
              ],
              center: [300, 30],
              size: 100,
              showInLegend: false,
              dataLabels: {
                enabled: true
              }
            }
          ]
        }
      );
      return deferred.promise;

    };


    $chart.drawGraph = function (graph) {

      var deferred = $q.defer();

      if (graph === 'Summary' || graph === 'Summary Dashboard') {
        $modelGraphs.summary()
          .then(function (data) {
            if (data !== undefined && data !== '') {
              if (graph === 'Summary Dashboard') {
                graph_summary_dashboard(data)
                  .then(function (data) {
                    deferred.resolve(data);
                  });
              }
              else if (graph === 'Summary') {
                graph_summary(data)
                  .then(function (data) {
                    deferred.resolve(data);
                  });
              }
            }
          });
      }
      else if (graph === 'Form') {
        $modelGraphs.form()
          .then(function (data) {
            if (data !== undefined && data !== '') {
              graph_form(data)
                .then(function (data) {
                  deferred.resolve(data);
                });
            }
          });
      }
      else if (graph === 'Forms') {
        $modelGraphs.forms()
          .then(function (data) {
            if (data !== undefined && data !== '') {
              graph_forms(data)
                .then(function (data) {
                  deferred.resolve(data);
                });
            }
          });
      }

      return deferred.promise;
    };

    return $chart;

  }]);







