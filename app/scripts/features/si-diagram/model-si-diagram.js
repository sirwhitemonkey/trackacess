'use strict';

angular.module('trackaccess.services')

  .factory('$modelSIDiagram', ['$q', '$log', function ($q, $log) {
    var logMsgPrefix = '$modelSIDiagram ->';
    $log.debug(logMsgPrefix + ' created');

    var $modelSIDiagram = {
      data_colors: [
        {id: 'Black', hex: '#000000', img: 'black_icon'},
        {id: 'Red', hex: '#ff0000', img: 'red_icon'},
        {id: 'Green', hex: '#00ff00', img: 'green_icon'},
        {id: 'Blue', hex: '#0000ff', img: 'blue_icon'},
        {id: 'Yellow', hex: '#ffff00', img: 'yellow_icon'},
        {id: 'Alizarin', hex: '#e74c3c', img: 'alizarin_icon'},
        {id: 'Pomegrante', hex: '#c0392b', img: 'pomegrante_icon'},
        {id: 'Emerald', hex: '#2ecc71', img: 'emerald_icon'},
        {id: 'Torquoise', hex: '#1abc9c', img: 'torquoise_icon'},
        {id: 'PeterRiver', hex: '#3498db', img: 'peterriver_icon'},
        {id: 'Amethyst', hex: '#9b59b6', img: 'amethyst_icon'},
        {id: 'SunFlower', hex: '#f1c40f', img: 'sunflower_icon'},
        {id: 'Orange', hex: '#f39c12', img: 'orange_icon'},
        {id: 'Clouds', hex: '#ecf0f1', img: 'clouds_icon'},
        {id: 'Silver', hex: '#bdc3c7', img: 'silver_icon'},
        {id: 'Asbestos', hex: '#7f8c8d', img: 'asbestos_icon'},
        {id: 'WetAsphalt', hex: '#34495e', img: 'wetasphalt_icon'}
      ],
      data_size: [
        {id: 'Pencil', size: '1', img: 'pencil_icon'},
        {id: 'Pen', size: '3', img: 'pen_icon'},
        {id: 'Stick', size: '5', img: 'stick_icon'},
        {id: 'SmallBrush', size: '9', img: 'smallbrush_icon'},
        {id: 'MediumBrush', size: '15', img: 'mediumbrush_icon'},
        {id: 'BigBrush', size: '30', img: 'bigbrush_icon'},
        {id: 'Bucket', size: '50', img: 'bucket_icon'}
      ]
    };


    return $modelSIDiagram;

  }]);

