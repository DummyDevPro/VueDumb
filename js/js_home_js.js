function drawerShowHide(ele) {
    let showHideDrawer = document.getElementById('left-aside');
    let showHideDrawerMobile = document.getElementById('left-aside-mobile');
    let middleLeftContent = document.getElementById('middle-left-wrapper');
    let mql = window.matchMedia('(max-width: 767.98px)');

    if (mql.matches) {
        showHideDrawerMobile.classList.toggle('left-aside-mobile-d-sh');
    } else {
        showHideDrawer.classList.toggle('left-aside-d-sh');
        middleLeftContent.classList.toggle('col-md-9');
        middleLeftContent.classList.toggle('container');
        let showHideIcon = document.getElementById('icon-sh');
        if (showHideIcon.classList.contains('bi-caret-right-fill')) {
            showHideIcon.classList.replace('bi-caret-right-fill', 'bi-caret-left-fill');
            ele.title = 'click to hide drawer';
        } else {
            showHideIcon.classList.replace('bi-caret-left-fill', 'bi-caret-right-fill');
            ele.title = 'click to show drawer';
        }
    }
}

function moveToView(event, e) {
    event.preventDefault();
    let scrollLayout = document.getElementById('middle-content');
    let ele = document.getElementById(e.getAttribute('my-href'));
    scrollLayout.scroll({
        top: ele.offsetTop,
        behavior: "smooth"
    })
}

let mql = window.matchMedia('(max-width: 767.98px)');
function changeMode(data) {
    let showHideDrawerMobile = document.getElementById('left-aside-mobile');
    if (!data.matches) {
        if (!showHideDrawerMobile.classList.contains('left-aside-mobile-d-sh')) {
            showHideDrawerMobile.classList.add('left-aside-mobile-d-sh')
        }
    }
}
mql.addEventListener("change", changeMode);

function jsLinkPreventDefault(e) {
    e.preventDefault();
}

function smapleJsCodeOne() {
    let codeOne = document.getElementById('smaple-js-internal-structure');
    codeOne.innerText = '<!DOCTYPE html>' + '\n';
    codeOne.innerText += '<html lang="en">' + '\n';
    codeOne.innerText += '<head>' + '\n';
    codeOne.innerText += '    <meta charset="UTF-8">' + '\n';
    codeOne.innerText += '    <meta http-equiv="X-UA-Compatible" content="IE=edge">' + '\n';
    codeOne.innerText += '    <meta name="viewport" content="width=device-width, initial-scale=1.0">' + '\n';
    codeOne.innerText += '    <title>Document</title>' + '\n';
    codeOne.innerText += '</head>' + '\n';
    codeOne.innerText += '<body>' + '\n';
    codeOne.innerText += '    <h1>JS : Internal Coding</h1>' + '\n';
    codeOne.innerText += '' + '\n';
    codeOne.innerText += '    <script>' + '\n';
    codeOne.innerText += '        // write javascript code inside html document' + '\n';
    codeOne.innerText += '        // is called internal structure' + '\n';
    codeOne.innerText += '        document.write(\'This is my first page.\');' + '\n';
    codeOne.innerText += '    </script>' + '\n';
    codeOne.innerText += '</body>' + '\n';
    codeOne.innerText += '</html>';
}

function smapleJsCodeTwo() {
    let codeOne = document.getElementById('smaple-js-external-structure');
    codeOne.innerText = '<!DOCTYPE html>' + '\n';
    codeOne.innerText += '<html lang="en">' + '\n';
    codeOne.innerText += '<head>' + '\n';
    codeOne.innerText += '    <meta charset="UTF-8">' + '\n';
    codeOne.innerText += '    <meta http-equiv="X-UA-Compatible" content="IE=edge">' + '\n';
    codeOne.innerText += '    <meta name="viewport" content="width=device-width, initial-scale=1.0">' + '\n';
    codeOne.innerText += '    <title>Document</title>' + '\n';
    codeOne.innerText += '</head>' + '\n';
    codeOne.innerText += '<body>' + '\n';
    codeOne.innerText += '    <h1>JS : Internal Coding</h1>' + '\n';
    codeOne.innerText += '\n';
    codeOne.innerText += '    // import external javascript file' + '\n';
    codeOne.innerText += '    <script src="index.js"></script>' + '\n';
    codeOne.innerText += '</body>' + '\n';
    codeOne.innerText += '</html>';
}

function init(){
    smapleJsCodeOne();
    smapleJsCodeTwo();
}

init();