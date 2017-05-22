var app = angular.module('j4netControllers', ['ngResource','nvd3','ui.bootstrap','angular-svg-round-progressbar']);


app.controller('mainController', ['$scope', 'webSocket', '$http', 'nodes', 'NgMap', function($scope, webSocket, $http, nodes, NgMap) {
      $scope.connected = false;
      $scope.nodes = nodes.get();

      $scope.weather = {};

      $scope.graphstate = 0;

      $scope.nvd3_data = [
            {
                  values : [],
                  key : 'node values',
                  color : '#ff7f0e'
            }
      ];

      $scope.nvd3_options = {
            chart: {
                  type: 'historicalBarChart',
                  margin : {
                        top: 20,
                        right: 20,
                        bottom: 40,
                        left: 55
                  },
                  x: function(d){ return d.x; },
                  y: function(d){ return d.y; },
                  xAxis: {
                        //axisLabel: 'X Axis',
                        tickFormat: function(d) {
                              return d3.time.format('%d/%m/%y %H:%M')(new Date(d))
                        },
                        showMaxMin: false,
                        staggerLabels: true
                  },
                  xScale : d3.time.scale(),
                  yAxis: {
                        axisLabel: 'temp (°C)',
                        tickFormat: function(d){
                              return d3.format('.02f')(d);
                        },
                        axisLabelDistance: -10
                  }
            }
      };

      var timer = null, timer2 = null;



      $scope.$on('socket:nodes', function (ev, data) {
            // console.log("receiving nodes");
            for (var i in data) {
                  data[i].lastUpdate = (new Date()-new Date(data[i].lastUpdate))/1000;
                  data[i].firstSeen = (new Date()-new Date(data[i].firstSeen))/1000;
            }

            if (data[20] && data[21]) {
                  data[2021] = {
                        lastData : {
                              t: Math.min(data[20].lastData.t,data[21].lastData.t)
                        },
                        lastUpdate : Math.min(data[20].lastUpdate,data[21].lastUpdate),
                        firstSeen : 0,
                        name : "extérieur"
                  };
            }
            else {
                  data[2021] = {
                        lastData : {
                              t: 0
                        },
                        lastUpdate : 999999,
                        firstSeen : 0,
                        name : "extérieur"
                  }
            }

            nodes.set(data);
            $scope.nodes = nodes.get();
            //console.log(nodes.list);
            //console.log(nodes.count + " nodes");
      });


      $scope.$on('socket:connect', function (ev, data) {
            console.log('connected!');
            $scope.connected = true;

            // getting the initial node list
            webSocket.emit('nodes');
            webSocket.emit('weather');
      });

      $scope.$on('socket:connect_error', function (ev, data){
            console.log('connect_error');
            $scope.connected = false;
            clearInterval(timer);
            clearInterval(timer2);
            timer = null; time2 = null;
      });

      setInterval(function() {
            if (timer==null && $scope.connected==true) {
                  // console.log("initializing timer");
                  timer = setInterval(function() {
                        webSocket.emit('nodes');
                        webSocket.emit('car-position');
                        // console.log("asked for nodes");
                  },20000);
            }

            if (timer2==null && $scope.connected==true) {
                  // console.log("initializing timer2");
                  timer2 = setInterval(function() {
                        webSocket.emit('weather');
                  },10*60000);
            }
      },5000);


      $scope.$on('socket:node-detail', function (ev, data) {
            // console.log("receiving node details");

            for (var i in data) {
                  if (data[i]) {
                        var obj = JSON.parse(data[i]);
                        $scope.nvd3_data[0].values.push({x:new Date(i),y:obj.t});
                  }
            }

            $scope.graphstate = 2;

      });

      $scope.$on('socket:weather', function (ev, data) {
            // console.log("weather received");
            // console.log(data);
            $scope.weather = data;
      });

      // var askForDetail = function () {
      //
      //     console.log("ask for detail");
      //     $scope.graphstate = 1;
      //
      //     var startDate = new Date();
      //     startDate.setHours (0,0,0,0);
      //     var endDate = new Date();
      //     endDate.setHours (23,59,59,0);
      //
      //     $scope.nvd3_data[0].values = [];
      //
      //     webSocket.emit(
      //         'node-detail',
      //         {   id: 25,
      //             start : startDate.toISOString(),
      //             end : endDate.toISOString(),
      //         }
      //     );
      // }
      //
      // askForDetail();

}]);



app.controller('dashboardCtrl', ['$scope',function($scope) {

}]);

app.controller('listCtrl', ['$scope','$rootScope','nodes',function($scope,$rootScope,nodes) {
      $scope.nodes = nodes.list;
}]);

app.controller('debugCtrl', function() {

});

app.controller('setupCtrl', ['$scope',function($scope) {

}]);
