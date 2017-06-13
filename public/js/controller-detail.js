var app = angular.module('j5netControllers');

app.controller('nodeDetailCtrl', ['$scope', 'webSocket', '$routeParams', 'nodes', function($scope, webSocket, $routeParams,nodes) {
    $scope.nodeId = $routeParams.nodeId;

    $scope.graphstate = 0;
    $scope.graphtitle = "title";

    $scope.nvd3_data = [
        {
            values : [],
            key : 'node values',
            color : '#ff7f0e'
        }
    ];

    $scope.nvd3_options = {
        chart: {
            type: 'lineChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function(d){ return d.x; },
            y: function(d){ return d.y; },
            useInteractiveGuideline: false,
            xAxis: {
                //axisLabel: 'X Axis',
                tickFormat: function(d) {
                    return d3.time.format('%d/%m/%y %H:%M')(new Date(d))
                },
                showMaxMin: false,
                staggerLabels: true
            },
            xScale : d3.time.scale(),
            interpolate : 'basis',
            yAxis: {
                axisLabel: 'temp (°C)',
                tickFormat: function(d){
                    return d3.format('.02f')(d);
                },
                axisLabelDistance: -10
            },
            callback: function(chart){
                //console.log("!!! lineChart callback !!!");
            }
        }
    };

    $scope.today = function() {
        $scope.dt = new Date();
    };

    $scope.today();

    $scope.clear = function() {
        $scope.dt = null;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        //minDate: new Date(),
        startingDay: 1
    };

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    // $scope.setDate = function(year, month, day) {
    //     $scope.dt = new Date(year, month, day);
    // };

    $scope.formats = ['dd-MMMM-yyyy', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[1];

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    $scope.$on('socket:node-detail', function (ev, data) {
        console.log("receiving node details");

        for (var i in data) {
            if (data[i]) {
                var obj = JSON.parse(data[i]);
                $scope.nvd3_data[0].values.push({x:new Date(i),y:obj.t});
            }
        }

        $scope.graphtitle = nodes.get($routeParams.nodeId).name;
        if (data.tmin && data.tmax)
            $scope.graphtitle += " min: "+data.tmin+"°C  max: "+data.tmax+"°C";

        $scope.graphstate = 2;

    });

    var askForDetail = function () {

        console.log("ask for detail");
        $scope.graphstate = 1;

        var startDate = new Date($scope.dt);
        startDate.setHours (0,0,0,0);
        var endDate = new Date($scope.dt);
        endDate.setHours (23,59,59,0);

        $scope.nvd3_data[0].values = [];

        webSocket.emit(
            'node-detail',
            {   id: $scope.nodeId,
                start : startDate.toISOString(),
                end : endDate.toISOString(),
            }
        );
    }

    $scope.$watch("dt", askForDetail);
}]);
