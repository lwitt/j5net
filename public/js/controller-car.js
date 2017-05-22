var app = angular.module('j4netControllers');

app.controller('carCtrl', ['$scope', 'webSocket', '$http', function($scope, webSocket, $http) {
      $scope.config = {};

      // loading config (nodes to show in dashboard,..)
      $http.get('config.json').success(function(data) {
            $scope.config = data;
            $scope.googleMapsUrl ="https://maps.googleapis.com/maps/api/js?key="+$scope.config.googleMapsAPIkey;
      });

      $scope.lat = NaN;
      $scope.lng = NaN;
      $scope.lastCarUpdate = NaN;
      $scope.distanceFromWork = NaN;
      $scope.distanceFromHome = NaN;

      $scope.$on('socket:car-position', function (ev, data) {
            if (data.lat)                 $scope.lat = data.lat;
            if (data.lng)                 $scope.lng = data.lng;
            if (data.lastUpdate)          $scope.lastCarUpdate = (Date.now()-data.lastUpdate)/1000;
            if (data.distanceFromWork)    $scope.distanceFromWork = data.distanceFromWork;
            if (data.distanceFromHome)    $scope.distanceFromHome = data.distanceFromHome;
      });
      if ($scope.connected==true)
            webSocket.emit('car-position');
}]);
