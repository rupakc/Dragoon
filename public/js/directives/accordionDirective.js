var app = angular.module('dragoonApplication');

app.directive('customAngularAccordion', function() {
    return {
      restrict: 'EA',
      templateUrl: 'js/directives/accordionView.html'
    };
  });
