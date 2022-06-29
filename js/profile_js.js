// Login State Check
var loginStatus = sessionStorage.getItem('LoginStatus') == null ? false : sessionStorage.getItem('LoginStatus');
var userInfo = JSON.parse(sessionStorage.getItem('UserInfo'));
var userId = userInfo != null ? userInfo.stdId : '';
var userNameEn = userInfo != null ? userInfo.nameEn : '';
var userNameJp = userInfo != null ? userInfo.nameJp : '';
var gender = userInfo != null ? userInfo.gender : -1;
var phoneNo = userInfo != null ? userInfo.phone_no : '000-000-000-0000';
var emailAddress = userInfo != null ? userInfo.mail_address : 'example@gmail.com';

var examHistoryAPI = sessionStorage.getItem('JS Exam Data History');

var app = angular.module("myApp", []);
app.controller('myCtrl', function ($scope, $http, $timeout) {
    $scope.tableDataMessage = 'Collecting your exam history...';
    $scope.loginStatus = loginStatus;
    $scope.userNameEn = userNameEn;
    $scope.userNameJp = userNameJp;
    $scope.gender = gender;
    $scope.phoneNo = phoneNo;
    $scope.emailAddress = emailAddress;
    $scope.userId = userId;
    $scope.examDataHistory = [];

    if (!$scope.loginStatus) {
        alert('Unauthorized Access!');
        window.location.replace('../../../../index.html');
        return;
    }

    $scope.getExamDataHistory = function (userId) {
        console.log(userId);
        console.log(examHistoryAPI);

        var conf = {
            headers: {
                "Content-type": undefined
            },
            transformRequest: null
        };
        var fd = new FormData();
        fd.append('userId', userId);

        $http.post(
            examHistoryAPI,
            fd,
            conf
        ).then(function (success) {
            if ((success.data.data).length == 0) {
                $scope.tableDataMessage = 'There is no exam history.';
            } else {
                $scope.examDataHistory = success.data.data;
            }
        }, function (error) {
            $scope.tableDataMessage = 'Server connecting error.';
            console.error(error);
        });
    }

    $scope.getExamDataHistory($scope.userId);

});