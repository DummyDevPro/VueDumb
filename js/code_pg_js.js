const apiListURL = "https://script.google.com/macros/s/AKfycbxRY8fvuTnOXT26eUr-0v5qNgygk11ZXykihI1Vy3KFXHx-Fzym9ZhiA9tu1z86e4AAzg/exec";
var currentUrl = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/';
var logger = document.getElementById('log');
var jsRawCode = document.getElementById('id-js-input');
var collectLog = '';
var app = angular.module("myApp", []);

var getLoginActionAPI = sessionStorage.getItem("Login Action");
let modalBtnLoginId = document.getElementById('modal-login-id');

// Login State Check
var loginStatus = sessionStorage.getItem('LoginStatus') == null ? false : sessionStorage.getItem('LoginStatus');
var userInfo = JSON.parse(sessionStorage.getItem('UserInfo'));
var userNameEn = userInfo != null ? userInfo.nameEn : '';
var userNameJp = userInfo != null ? userInfo.nameJp : '';
var map = {};

var hrLine = '<hr style="border:none;border-bottom:2px dashed red;margin:0.25rem 0px;">';

// Customize default log
(function () {
    console.log = function (message) {
        var lineBreakJudge = (message == hrLine) ? '' : '<br>';

        if (typeof message == 'object') {
            collectLog += (JSON && JSON.stringify ? JSON.stringify(message) : message) +
                lineBreakJudge;
        } else {
            collectLog += message + lineBreakJudge;
        }
    }

    console.error = function (message) {
        var lineBreakJudge = (message == hrLine) ? '' : '<br>';

        if (typeof message == 'object') {
            // message = message.replaceAll(currentUrl, '../');
            collectLog += '<span style="color:red;">' + (JSON && JSON.stringify ? JSON.stringify(
                message) : message) + '</span>' + lineBreakJudge;
        } else {
            message = message.replaceAll(currentUrl, '../');
            collectLog += '<span style="color:red;">' + message + '</span>' + lineBreakJudge;
        }
    }
})();

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

    $scope.jsCodeInputChangeListener = function () {
        console.info($scope.loginStatus);
        collectLog = '';
        try {
            if (jsRawCode.value.toString().trim() != '') {
                eval(jsRawCode.value);
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            if (jsRawCode.value.toString().trim() != '') {
                if (collectLog != '') {
                    var div = document.createElement('div');
                    div.innerHTML = '<p class="p-1" style="margin-bottom:0px;">' +
                        collectLog +
                        '</p><p style="font-size:.75rem;margin:0px;background-color:gray;border-bottom-left-radius:8px;border-bottom-right-radius:8px;background-color: rgba(211, 47, 47, 0.1)" class="p-1">' +
                        $scope.getCurrentDateTime() + '</p></div>';
                    div.className += 'bg-light';
                    div.className += ' slide-rtl';
                    div.className += ' div-console-layout';
                    div.className += ' mb-1';

                    logger.appendChild(div);
                    logger.scrollTo(0, logger.scrollHeight);
                }
            }
        }
    }

    $scope.clearAllLog = function () {
        logger.innerHTML = '';
    }

    $scope.getCurrentDateTime = function () {
        return new Date().toISOString();
    }

    jsRawCode.onkeydown = jsRawCode.onkeypress = function (e) {
        e = e || event; // to deal with IE
        if (e.key == 'Control') {
            map[e.key] = true;
        }
        if (e.key == 'Enter') {
            map[e.key] = true;
        }

        if (map['Control'] && map['Enter']) {
            $scope.jsCodeInputChangeListener();
            // prevent 2 times enter
            map['Enter'] = false;
        }
    }

    jsRawCode.onkeyup = function (event) {
        if (Object.keys(map).length != 0) {
            if (event.key == 'Enter') {
                map['Enter'] = false;
            }
            if (event.key == 'Control') {
                map['Control'] = false;
            }
        }
    }

    $scope.loginAction = async function () {
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
                }, 1000);
            } else {
                $timeout(function () {
                    modalBtnLoginId.classList.replace('btn-primary', 'btn-danger');
                    modalBtnLoginId.innerHTML = '<div style="display:inline-block;"><i class="bi bi-exclamation-square"></i></div><span class="ms-2">Authentication Fail</span>';
                    $timeout(function () {
                        modalBtnLoginId.classList.replace('btn-danger', 'btn-primary');
                        modalBtnLoginId.innerText = 'Log In';
                        loginFormId.reset();
                    }, 1500)
                }, 1500);
            }
        }, function (error) {
            console.info(error);
        });
    }
});