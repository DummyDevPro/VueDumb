const getComputerTermsChapterOneAPI = sessionStorage.getItem("Computer Terms Chapter One");

var app = angular.module("myApp", []);

app.controller('myCtrl', function ($scope, $http) {
    $scope.hide = true;
    $scope.filterResult = [];
    $scope.paginationCount = 0;
    $scope.dataList = [];
    $scope.prevActiveState = 'disabled';
    $scope.nextActiveState = 'disabled';
    $scope.pageNoCnt = 0;

    // Fetch data from API
    $http.get(getComputerTermsChapterOneAPI)
        .then(function (response) {
            $scope.pagelimit = 5;
            $scope.limit = 10;
            $scope.startPos = 0;
            $scope.dataListOrigin = response.data.data;
            $scope.dataList = $scope.dataListOrigin;
            $scope.filterResult = $scope.dataListOrigin;
            $scope.pageMoveCnt = 1;

            if ($scope.dataList.length > 0) {
                $scope.pageNoCnt = Math.ceil($scope.dataList.length / $scope.limit);
                if ($scope.pageNoCnt > 1) {
                    $scope.nextActiveState = '';
                }
            }
        });

    // Previous Button Click
    $scope.pageMinus = function () {
        let tmp = $scope.pageMoveCnt - 1;
        if (tmp > 0) {
            $scope.startPos -= $scope.limit;
            $scope.pageMoveCnt--;

            $scope.changePreNextActiveStatus(tmp);
        }

        if (tmp == 1 || tmp < 0) {
            $scope.prevActiveState = 'disabled';
        }
    }

    // Next Button Click
    $scope.pagePlus = function () {
        let tmp = $scope.pageMoveCnt + 1;
        if (tmp <= $scope.pageNoCnt) {
            $scope.startPos += $scope.limit;
            $scope.pageMoveCnt++;

            $scope.changePreNextActiveStatus(tmp);
        }

        if (tmp == $scope.pageNoCnt) {
            $scope.nextActiveState = 'disabled';
        }
    }

    // When clicking page number
    $scope.loadPageByNo = function (pageNo) {
        $scope.pageMoveCnt = pageNo + 1;
        $scope.startPos = pageNo * $scope.limit;

        $scope.changePreNextActiveStatus($scope.pageMoveCnt);
    }

    // After clicked (Previous or Next Button) , change their active state 
    $scope.changePreNextActiveStatus = function (num) {
        if (num < $scope.pageNoCnt) {
            $scope.nextActiveState = '';
        } else {
            $scope.nextActiveState = 'disabled';
        }
        if (num > 1) {
            $scope.prevActiveState = '';
        } else {
            $scope.prevActiveState = 'disabled';
        }
    }

    // Input Text Change 
    $scope.calculatePageCount = function () {
        if ($scope.filterResult.length > 0) {
            $scope.pageNoCnt = Math.ceil($scope.filterResult.length / $scope.limit);

            if ($scope.pageMoveCnt > $scope.pageNoCnt) {
                $scope.pageMoveCnt = 1;
                $scope.startPos = 0;
            }

            if ($scope.pageNoCnt > 1 && $scope.pageMoveCnt != $scope.pageNoCnt) {
                $scope.nextActiveState = '';
            } else {
                $scope.nextActiveState = 'disabled';
            }

            if ($scope.pageMoveCnt == 1) {
                $scope.prevActiveState = 'disabled';
            } else {
                $scope.prevActiveState = '';
            }

        } else {
            $scope.pageNoCnt = 0;
            $scope.prevActiveState = 'disabled';
            $scope.nextActiveState = 'disabled';
        }
    }
});