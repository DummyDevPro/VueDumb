var examTitle = sessionStorage.getItem('examTitle');
var examData = sessionStorage.getItem('examData');
var examCode = sessionStorage.getItem('examCode');
var saveJSExamDataAPI = sessionStorage.getItem('Save JS Exam Data');

var userInfo = JSON.parse(sessionStorage.getItem('UserInfo'));
var userId = userInfo != null ? userInfo.stdId : '';
var userNameEn = userInfo != null ? userInfo.nameEn : '';
var userNameJp = userInfo != null ? userInfo.nameJp : '';

document.title = 'GAIGO | ' + examTitle;
document.querySelector('h1').innerText = examTitle;
document.querySelector('h1').style.textAlign = 'center';

let btnExamDataSubmit = document.getElementById('id-btn-submit');

var app = angular.module("myApp", ['ngSanitize']);
app.controller('myCtrl', function ($scope, $filter, $http, $timeout) {
    $scope.userId = userId;
    $scope.userNameEn = userNameEn;
    $scope.userNameJp = userNameJp;
    $scope.examData = [];
    $scope.formatedStartDate = null;
    $scope.examCode = examCode;

    $scope.sToB = function (one, two) {
        if (one == '' || one == undefined)
            return;

        let comOne = angular.lowercase(one.trim());
        if (comOne === 'true') {
            return two === true;
        } else if (comOne === 'false') {
            return two === false;
        }
        return false;
    }

    if (examTitle == null || examTitle == undefined) {
        alert('Unauthorized Access!');
        window.location.replace('../../../../index.html');
        return;
    } else {
        $scope.date = new Date();
        $scope.formatedStartDate = $filter("date")($scope.date,
            "dd'日'MM'月'yyyy'年' HH'時'mm'分'ss'秒'");
        $scope.examData = JSON.parse(examData);

        for (var key in $scope.examData) {
            $scope.examData[key]['result_key'] = '';
            $scope.examData[key]['answer_key'] = '';
        }

        $scope.collectAnswersAndSendToServer = function () {
            btnExamDataSubmit.innerHTML = '<div style="display:inline-block;" class="rotate-arrow"><i class="bi bi-arrow-repeat"></i></div><span class="ms-2">Calculating...</span>';
            var correcCnt = 0;
            for (var i = 0; i < $scope.examData.length; i++) {
                if ($scope.examData[i]['result_key'] == true) {
                    correcCnt++;
                }
            }

            var conf = {
                headers: {
                    "Content-type": undefined
                },
                transformRequest: null
            };
            var fd = new FormData();
            var endDate = new Date();
            $scope.formatedEndDate = $filter("date")(endDate, "dd'日'MM'月'yyyy'年' HH'時'mm'分'ss'秒'");

            fd.append('examCode', $scope.examCode);
            fd.append('startDateTime', $scope.formatedStartDate);
            fd.append('examResult', JSON.stringify($scope.examData));
            fd.append('endDateTime', $scope.formatedEndDate);
            fd.append('loginId', $scope.userId);
            fd.append('nameEn', $scope.userNameEn);
            fd.append('nameJp', $scope.userNameJp);
            fd.append('yourMark', correcCnt);
            fd.append('questionTotal', $scope.examData.length);

            sessionStorage.setItem("yourMark",correcCnt);
            sessionStorage.setItem("nameEn",$scope.userNameEn);
            sessionStorage.setItem("nameJp",$scope.userNameJp);
            sessionStorage.setItem("startDateTime",$scope.formatedStartDate);
            sessionStorage.setItem("endDateTime",$scope.formatedEndDate);
            sessionStorage.setItem("questionTotal",$scope.examData.length);
            sessionStorage.setItem("fromExam",true);
            $http.post(
                saveJSExamDataAPI,
                fd,
                conf
            ).then(function (success) {
                $timeout(function () {
                    window.location.replace('js_exam_result.html');
                }, 1000);
            }, function (error) {
                console.error(error);
            });
        }
    }
});