const getComputerTermsChapterOneAPI = sessionStorage.getItem("Computer Terms Chapter One");
const saveExamDataAPI = sessionStorage.getItem("Save Kanji Exam Result");
const getLoginActionAPI = sessionStorage.getItem("Login Action");

var app = angular.module("myApp", []);

app.controller('myCtrl', function ($scope, $http, $timeout, $filter) {

    $scope.curPos = 0;
    $scope.lastPos = 19;
    $scope.testData = [];
    $scope.date = '';
    $scope.yourMark = 0;

    $scope.randomData30 = [];
    /* {
     "question" : "漢字" 
     "yourAnswer" : "かんじ"
     "correct" : -1 / 0 / 1 ( -1 : unknown / 0 : false / 1 : true)
    } */

    // Fetch data from API
    $http.get(getComputerTermsChapterOneAPI)
        .then(function (response) {
            $scope.testData = $scope.shuffle(response.data.data);
            $scope.date = new Date();
            $scope.formatedStartDate = $filter("date")($scope.date,
                "dd'日'MM'月'yyyy'年' HH'時'mm'分'ss'秒'");
        });

    // go next question
    $scope.goNext = function () {
        $scope.curPos += 1;
        if ($scope.randomData30[$scope.curPos]) {
            $scope.answerData = ($scope.randomData30[$scope.curPos]).yourAnswer;
        } else {
            $scope.answerData = '';
        }

        if (($scope.randomData30).length - 1 < $scope.curPos) {
            $scope.randomData30.push({
                "question": $scope.testData[$scope.curPos].Kanji,
                "yourAnswer": "",
                "correct": -1
            });
        }
    }

    // go previous question
    $scope.goPrev = function () {
        $scope.curPos -= 1;
        $scope.answerData = ($scope.randomData30[$scope.curPos]).yourAnswer;
    }

    // listen when you typing answer
    $scope.typingAnswer = function (data) {
        if ($scope.curPos <= ($scope.randomData30).length) {
            $scope.randomData30[$scope.curPos] = {
                "question": $scope.testData[$scope.curPos].Kanji,
                "yourAnswer": data,
                "correct": ($scope.testData[$scope.curPos].Yomi == data) || ($scope.testData[
                    $scope.curPos].Romaji == data)
            };
        } else {
            ($scope.randomData30).push({
                "question": $scope.testData[$scope.curPos].Kanji,
                "yourAnswer": data,
                "correct": ($scope.testData[$scope.curPos].Yomi == data) || ($scope
                    .testData[$scope.curPos].Romaji == data)
            });
        }
    }


    // generate random array 
    $scope.shuffle = ([...array]) => {
        for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    $scope.goResult = function () {
        for (let d in $scope.randomData30) {
            if (($scope.randomData30[d]).correct > 0) {
                $scope.yourMark += 1;
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

        fd.append('startDateTime', $scope.formatedStartDate);
        fd.append('examResult', JSON.stringify($scope.randomData30));
        fd.append('endDateTime', $scope.formatedEndDate);
        fd.append('loginId', sessionStorage.getItem("loginId"));
        fd.append('nameEn', sessionStorage.getItem("nameEn"));
        fd.append('nameJp', sessionStorage.getItem("nameJp"));
        fd.append('yourMark', $scope.yourMark);
        fd.append('questionTotal', $scope.lastPos + 1);

        sessionStorage.setItem("startDateTime", $scope.formatedStartDate);
        sessionStorage.setItem("endDateTime", $scope.formatedEndDate);

        sessionStorage.setItem("yourMark", $scope.yourMark);
        sessionStorage.setItem("questionTotal", $scope.lastPos + 1);

        sessionStorage.setItem("nameEn", sessionStorage.getItem("nameEn"));
        sessionStorage.setItem("nameJp", sessionStorage.getItem("nameJp"));

        sessionStorage.setItem("examResult", $scope.randomData30);

        $http.post(
            saveExamDataAPI,
            fd,
            conf
        ).then(function (success) {
            // TODO
            // var element = document.getElementById("confirmModal");
            // element.modal('hide')
            // element.style.display = 'none';
            // hideModal();
            $timeout(function () {
                window.location.replace("./kanji_exam_result.html");
            }, 3000);
        }, function (error) {
            console.error(error);
        });
    }
});


// TODO
// function hideModal() {
//     $('#confirmModal').modal('hide');
// }