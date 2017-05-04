/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
    var app = angular.module('j4net', ['ngRoute', 'j4netControllers','btford.socket-io', 'ngMap']);

    app.config(['$routeProvider',
    function($routeProvider) {
    $routeProvider.
        when('/dashboard', {
            templateUrl: 'partials/dashboard.html',
            controller: 'dashboardCtrl'
        }).
         when('/list', {
            templateUrl: 'partials/list.html',
            controller: 'listCtrl'
        }).
        when('/setup', {
            templateUrl: 'partials/setup.html',
            controller: 'setupCtrl'
        }).
        when('/debug', {
            templateUrl: 'partials/debug.html',
            controller: 'debugCtrl'
        }).
        when('/detail/:nodeId', {
            templateUrl: 'partials/detail.html',
            controller: 'nodeDetailCtrl'
        }).
        otherwise({
            redirectTo: '/dashboard'
      });
    }]);

    app.factory('webSocket', function (socketFactory) {
        var mySocket = socketFactory();
        mySocket.forward('connect');
        mySocket.forward('connect_error');
        mySocket.forward('nodes');
        mySocket.forward('node-detail');
        mySocket.forward('car-position');
        return mySocket;
    });

    app.factory('nodes', function () {
        var nodes = {};
        nodes.list = {};
        nodes.count = 0;

        nodes.set = function(newvals) {
            nodes.list = newvals;
            nodes.count = Object.keys(nodes.list).length;
        }

        nodes.get = function(i) {
            if (i) {
                return nodes.list[i];
            }
            else {
                return nodes.list;
            }
        }

        return nodes;
    });

    // app.directive('myRoundProgress', function() {
    //     return {
    //         templateUrl : 'partials/my-round-progress.html',
    //         scope: {
    //             value: "@value"
    //         }
    //     };
    // });

    app.filter('secondsToDateTime', [function() {
        return function(seconds) {
            return new Date(1970, 0, 1).setSeconds(seconds);
        };
    }]);

    app.filter('secondsToString', [function() {
        return function(totalSec) {
            var hours = parseInt( totalSec / 3600);
            var minutes = parseInt( (totalSec - hours * 3600) / 60 );
            var seconds = parseInt( totalSec - hours * 3600 - minutes * 60);
            if (hours===0)
                return (minutes < 10 ? "0" + minutes : minutes)+'m '+(seconds  < 10 ? "0" + seconds : seconds)+'s';
            else
                return (hours < 10 ? "0" + hours : hours)+'h '+(minutes < 10 ? "0" + minutes : minutes)+'m '+(seconds  < 10 ? "0" + seconds : seconds)+'s';
        };
    }]);
