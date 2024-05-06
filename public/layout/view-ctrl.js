var app = angular.module('Layout', ['ngFitText']);

app.controller('viewCtrl', ['$scope', 'socket', function($scope, socket) {
    //defaults
    $scope.totals = [0, 0];
    $scope.alerts = {
        type: 'follower',
        name: 'MEGAMAN.EXE',
        pic: 'https://3.bp.blogspot.com/_vBCSLbKJ7nI/TOHHto6tFhI/AAAAAAAAF78/3qWGXEa6BLg/w1200-h630-p-k-no-nu/mmbn2.jpg'
    }
    $scope.socials = [
        {
            type: 'facebook',
            class: 'fa-brands fa-facebook-f',
            name: 'Kumar Unlimited'
        },
        {
            type: 'discord',
            class: 'fa-brands fa-discord',
            name: 'Kumar Unlimited'
        },
        {
            type: 'youtube',
            class: 'fa-brands fa-youtube',
            name: 'Kumar Unlimited'
        },
        {
            type: 'twitter',
            class: 'fa-brands fa-twitter',
            name: 'KumarNT7'
        }
    ]

    $scope.follower = {
               total: 0,
               name: 'No Data',
               pic: 'https://www.freeiconspng.com/uploads/user-login-icon-14.png',
               type: 'follow'
               };
    $scope.subscriber = {
               total: 0,
               name: 'No Data',
               pic: 'https://www.freeiconspng.com/uploads/user-login-icon-14.png',
               type: 'subscriber'
               };
    $scope.broadcaster = {
               name: 'KumarNT',
               pic: 'https://www.freeiconspng.com/uploads/user-login-icon-14.png',
               type: 'broadcaster'
               };
    
    $scope.start = function() {
        $scope.totals = [$scope.follower.total, $scope.subscriber.total];
    }
    $scope.addStuff = function(type) {
        if(type == 'follow') {
            $scope.totals[0] += 1;
        } else if(type == 'subscriber') {
            $scope.totals[1] += 1;
        }
    }
               
    $scope.update = function(info) {
        if(info.type == 'follow') {
            $scope.follower = info;
        } else if(info.type == 'subscriber' || info.type == 'sub-message') {
            $scope.subscriber = info;
        } else if(info.type == 'broadcaster') {
            $scope.broadcaster = info;
        }
    }
    $scope.alert = function(info) {
        if(info.type == 'follow') {
            info.type = 'follower';
        } else if(info.type == 'raid') {
            info.type = 'raider';
        } else if(info.type == 'sub-message') {
            info.type = 'sub message';
        } else if(info.type == 'sub-gift') {
            info.type = 'sub gifter';
        } else if(info.type == 'cheer') {
            info.type = 'cheerer';
        }
        $scope.alerts = info;
        console.log(info);
    }
    //WEBSOCKETS
    socket.onmessage(function(e) {
        let data = JSON.parse(e.data);
        console.log(data);
        var opt = new Object();
        if(data.viewers) {
            opt["viewers"] = data.viewers;
        }
        if(data.tier) {
            opt["tier"] = data.tier;
        }

        if(data.length > 1) {
           data.forEach(ch => {
               $scope.update(ch);
           });
           $scope.start();
           $scope.$digest();
        } else {
            $scope.addStuff(data.type);
            $scope.update(data);
            $scope.alert(data);
            $scope.$digest();
            //add to queue, and let queue handle alerts
            alertQueue.enqueue($scope.alerts.type, data);
            //layoutAlert($scope.alerts.type, data);
        }
    });
}]);

app.factory('socket', [function() {
    var stack = [];
    var onmessageDefer;
    var socket = {
        ws: new WebSocket('ws://localhost:443'),
        send: function(data) {
            data = JSON.stringify(data);
            if (socket.ws.readyState == 1) {
                socket.ws.send(data);
            } else {
                stack.push(data);
            }
        },
        onmessage: function(callback) {
            if (socket.ws.readyState == 1) {
                socket.ws.onmessage = callback;
            } else {
                onmessageDefer = callback;
            }
        }
    };
    socket.ws.onopen = function(event) {
        for (i in stack) {
            socket.ws.send(stack[i]);
        }
        stack = [];
        if (onmessageDefer) {
            socket.ws.onmessage = onmessageDefer;
            onmessageDefer = null;
        }
    };
    return socket;
}]);