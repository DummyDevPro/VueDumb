const apiListURL = "https://script.google.com/macros/s/AKfycbxRY8fvuTnOXT26eUr-0v5qNgygk11ZXykihI1Vy3KFXHx-Fzym9ZhiA9tu1z86e4AAzg/exec";
var app = angular.module("myApp", []);

// Login State Check
var loginStatus = sessionStorage.getItem('LoginStatus') == null ? false : sessionStorage.getItem('LoginStatus');
var userInfo = JSON.parse(sessionStorage.getItem('UserInfo'));
var userNameEn = userInfo != null ? userInfo.nameEn : '';
var userNameJp = userInfo != null ? userInfo.nameJp : '';
var getLoginActionAPI = sessionStorage.getItem("Login Action");

let modalBtnLoginId = document.getElementById('modal-login-id');

app.controller('myCtrl', function ($scope, $http, $timeout) {
    $scope.loginStatus = loginStatus;
    $scope.userNameEn = userNameEn;
    $scope.userNameJp = userNameJp;
    // Fetch data from API
    $scope.getBasicAPI = function (fromLoginAction) {
        $http.get(apiListURL)
            .then(function (response) {
                var res = response.data.data;
                for (var obj in res) {
                    let keyArr = Object.keys(res[obj]);
                    sessionStorage.setItem(res[obj][keyArr[0]], res[obj][keyArr[1]]);
                }
                if (fromLoginAction) {
                    getLoginActionAPI = sessionStorage.getItem("Login Action");
                    $scope.loginProcess();
                }
            });
    }

    $scope.getBasicAPI(false);

    $scope.loginAction = function () {
        modalBtnLoginId.innerHTML = '<div style="display:inline-block;" class="rotate-arrow"><i class="bi bi-arrow-repeat"></i></div><span class="ms-2">Accessing...</span>';

        if (getLoginActionAPI == null || getLoginActionAPI == undefined) {
            $scope.getBasicAPI(true);
        } else {
            $scope.loginProcess();
        }
    }

    $scope.loginProcess = function () {
        let loginModal = document.getElementById('modal-close-id');
        let loginFormId = document.getElementById('login-form');
        var conf = {
            headers: {
                "Content-type": undefined
            },
            transformRequest: null
        };
        var fd = new FormData();
        fd.append('stdId', $scope.stdId);
        fd.append('password', $scope.password);

        $http.post(
            getLoginActionAPI,
            fd,
            conf
        ).then(function (success) {
            if (success.data.status == 200) {
                modalBtnLoginId.innerHTML = '<div style="display:inline-block;"><i class="bi bi-check-square"></i></div><span class="ms-2">Authentication Success</span>';
                modalBtnLoginId.classList.replace('btn-primary', 'btn-success');

                sessionStorage.setItem("LoginStatus", true);
                sessionStorage.setItem("UserInfo", JSON.stringify(success.data.data));

                $timeout(function () {
                    loginModal.click();


                    $scope.loginStatus = true;
                    $scope.userNameEn = success.data.data.nameEn;
                    $scope.userNameJp = success.data.data.nameJp;
                }, 1500);
            } else {
                $timeout(function () {
                    modalBtnLoginId.classList.replace('btn-primary', 'btn-danger');
                    modalBtnLoginId.innerHTML = '<div style="display:inline-block;"><i class="bi bi-exclamation-square"></i></div><span class="ms-2">Authentication Fail</span>';
                    $timeout(function () {
                        modalBtnLoginId.classList.replace('btn-danger', 'btn-primary');
                        modalBtnLoginId.innerText = 'Log In';
                        loginFormId.reset();
                    }, 1500);
                }, 1500);
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.goNext = function (where) {
        switch (where) {
            case 'html':
                break;
            case 'css':
                break;
            case 'js':
                window.location.href = 'pages/frontend/javascript/js_home.html';
                break;
            case 'java':
                break;
            case 'naming-convention':
                window.location.href = 'pages/common/naming_convention.html';
                break
        }
    }
});