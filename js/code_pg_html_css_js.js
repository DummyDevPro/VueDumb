const apiListURL = "https://script.google.com/macros/s/AKfycbxRY8fvuTnOXT26eUr-0v5qNgygk11ZXykihI1Vy3KFXHx-Fzym9ZhiA9tu1z86e4AAzg/exec";

let modalBtnLoginId = document.getElementById('modal-login-id');

// Login State Check
var loginStatus = sessionStorage.getItem('LoginStatus') == null ? false : sessionStorage.getItem('LoginStatus');
var userInfo = JSON.parse(sessionStorage.getItem('UserInfo'));
var userNameEn = userInfo != null ? userInfo.nameEn : '';
var userNameJp = userInfo != null ? userInfo.nameJp : '';

var getLoginActionAPI = sessionStorage.getItem("Login Action");

var app = angular.module("myApp", []);
app.controller('myCtrl', function ($scope, $http, $timeout) {
    $scope.loginStatus = loginStatus;
    $scope.userNameEn = userNameEn;
    $scope.userNameJp = userNameJp;

    // change coding ground orientation
    $scope.changeLayoutOrientation = function () {
        var orientation = document.getElementById("layoutChangeIconId");
        var leftCodeInputDiv = document.getElementById("leftCodeInputDivId");
        var leftCodeResultDiv = document.getElementById("leftCodeResultDivId");
        if (orientation.classList.contains("bi-symmetry-vertical")) {
            leftCodeInputDiv.classList.remove("col-md-6");
            leftCodeResultDiv.classList.remove("col-md-6");

            orientation.classList.remove("bi-symmetry-vertical");
            orientation.classList.add("bi-symmetry-horizontal");
        } else {
            leftCodeInputDiv.classList.add("col-md-6");
            leftCodeResultDiv.classList.add("col-md-6");

            orientation.classList.remove("bi-symmetry-horizontal");
            orientation.classList.add("bi-symmetry-vertical");
        }
    }

    // listen textarea user input change
    $scope.codeHTMLInputChange = function () {
        $scope.writeOutput();
    }

    // listen textarea user input change
    $scope.codeCSSInputChange = function () {
        $scope.writeOutput();
    }

    // html code input result write on right iframe
    $scope.writeOutput = function () {
        var doc = document.getElementById('leftCodeResult').contentWindow.document;
        doc.clear();
        doc.open();
        doc.write(`<html><head><style>` + $scope.cssSourceCode + `</style></head><body>` + $scope.htmlSourceCode + `</body></html>`);
        doc.close();
    }

    // change coding ground theme
    $scope.changeThemeMode = function () {
        var layout = document.getElementById("layoutBg");
        // Layout
        if (layout.classList.contains("bg-secondary")) {
            layout.classList.remove("bg-secondary");
            layout.classList.remove("bg-opacity-25");

            layout.classList.add("bg-dark");
            $scope.changeTextTheme(true);
        } else {
            layout.classList.remove("bg-dark");

            layout.classList.add("bg-secondary");
            layout.classList.add("bg-opacity-25");
            $scope.changeTextTheme(false);
        }
    }

    // change coding ground theme (text)
    $scope.changeTextTheme = function (isDark) {
        //    var title = document.getElementById("cdgTitleId");
        var themeChange = document.getElementById("themeChangeIconId");
        var layoutChange = document.getElementById("layoutChangeIconId");
        var leftHTMLCodeArea = document.getElementById("leftHTMLCodeInput");
        var leftCSSCodeArea = document.getElementById("leftCSSCodeInput");
        if (!isDark) {
            //        title.classList.remove("text-white");
            themeChange.classList.remove("text-white");
            layoutChange.classList.remove("text-white");

            //        title.classList.add("text-dark");
            themeChange.classList.add("text-dark");
            layoutChange.classList.add("text-dark");

            leftHTMLCodeArea.classList.remove("text-white");
            leftHTMLCodeArea.classList.add("text-dark");
            leftHTMLCodeArea.classList.remove("bg-secondary");
            leftHTMLCodeArea.classList.add("bg-white");

            leftCSSCodeArea.classList.remove("text-white");
            leftCSSCodeArea.classList.add("text-dark");
            leftCSSCodeArea.classList.remove("bg-secondary");
            leftCSSCodeArea.classList.add("bg-white");

            leftHTMLCodeArea.classList.remove("text-area-place-holder-dark-theme");
            leftHTMLCodeArea.classList.add("text-area-place-holder-light-theme");

            leftCSSCodeArea.classList.remove("text-area-place-holder-dark-theme");
            leftCSSCodeArea.classList.add("text-area-place-holder-light-theme");
        } else {
            //        title.classList.remove("text-dark");
            themeChange.classList.remove("text-dark");
            layoutChange.classList.remove("text-dark");

            //        title.classList.add("text-white");
            themeChange.classList.add("text-white");
            layoutChange.classList.add("text-white");

            leftHTMLCodeArea.classList.remove("text-dark");
            leftHTMLCodeArea.classList.add("text-white");
            leftHTMLCodeArea.classList.remove("bg-white");
            leftHTMLCodeArea.classList.add("bg-secondary");

            leftCSSCodeArea.classList.remove("text-dark");
            leftCSSCodeArea.classList.add("text-white");
            leftCSSCodeArea.classList.remove("bg-white");
            leftCSSCodeArea.classList.add("bg-secondary");

            leftHTMLCodeArea.classList.remove("text-area-place-holder-light-theme");
            leftHTMLCodeArea.classList.add("text-area-place-holder-dark-theme");

            leftCSSCodeArea.classList.remove("text-area-place-holder-light-theme");
            leftCSSCodeArea.classList.add("text-area-place-holder-dark-theme");
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