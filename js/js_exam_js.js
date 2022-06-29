const getJSExamDataAPI = sessionStorage.getItem("JS Exam List");
const getJSExamDataByDateAPI = sessionStorage.getItem("JS Exam Data By Date");
var app = angular.module("myApp", []);
var examListSection = document.getElementById('exam-list-section');
var loadinIcon = document.getElementById('loading-icon');

// Login State Check
var loginStatus = sessionStorage.getItem('LoginStatus') == null ? false : sessionStorage.getItem('LoginStatus');
var userInfo = JSON.parse(sessionStorage.getItem('UserInfo'));
var userNameEn = userInfo != null ? userInfo.nameEn : '';
var userNameJp = userInfo != null ? userInfo.nameJp : '';

app.controller('myCtrl', function ($scope, $http, $compile, $timeout) {
    $scope.loginStatus = loginStatus;
    $scope.userNameEn = userNameEn;
    $scope.userNameJp = userNameJp;

    if(!$scope.loginStatus){
        window.alert('You can\'t access without logging in!');
        window.location.replace('../../../../index.html');
        return;
    }

    // Fetch data from API
    try {
        $http.get(getJSExamDataAPI)
            .then(function (response) {
                loadinIcon.remove();
                $scope.bindingWithHTML(response.data.data);
            });
    } catch (error) {
        console.info(error);
    }

    // Binding with HTML
    $scope.bindingWithHTML = function (data) {
        console.log(data);
        for (let key in data) {
            let htmlData = '';
            htmlData += '<div class="col-12  col-md-6 p-2"><details><summary>';
            htmlData += ' ' + data[key]['exam_date'] + ' 試験';
            htmlData += '</summary>';
            htmlData += data[key]['exam_detail'];
            htmlData += '<button class="btn btn-primary ms-3 btn-sm" ng-click="loadExamDataAndChangePage(\'' + data[key]['exam_date'] + '\',\''+ data[key]['exam_code'] +'\')" id="id' + data[key]['exam_date'] + '">START</button></details></div>';

            let temp = $compile(htmlData)($scope);
            angular.element(examListSection).append(temp);
        }
    }

    // Load Exam Data By Exam Date
    // And If the result is Ok 
    // Render to the exam page
    $scope.loadExamDataAndChangePage = function (date,examCode) {
        var buttonId = document.getElementById('id' + date);
        buttonId.innerHTML = '<div style="display:inline-block;" class="rotate-arrow"><i class="bi bi-arrow-repeat"></i></div><span class="ms-2">Loading...</span>';

        var conf = {
            headers: {
                "Content-type": undefined
            },
            transformRequest: null
        };
        var fd = new FormData();
        fd.append('date', date);

        $http.post(
            getJSExamDataByDateAPI,
            fd,
            conf
        ).then(function (success) {
            if (success.data.status == 200) {
                console.log(success.data.data)
                if (success.data.data.length > 0) {
                    sessionStorage.setItem('examTitle', date + ' (JS:試験)');
                    sessionStorage.setItem('examData', JSON.stringify(success.data.data));
                    sessionStorage.setItem('examCode',examCode);
                    $timeout(function () {
                        window.location.href = 'exam.html';
                    }, 1000);
                } else {
                    buttonId.innerHTML = 'START';
                }
            }
        }, function (error) {
            console.error(error);
            buttonId.innerHTML = 'START';
        });
    }
});