function changeDetailPage(where) {
    switch (where) {
        case 'if-condition':
            window.location.href = 'if_condition.html';
            break;

        case 'comparison-operator':
            window.location.href = 'comparison_operator.html';
            break;
    }
}

function drawerShowHide(div) {
    let drawerToggleLayout = document.getElementById('aside-content-list');
    let mainContentWrapper = document.getElementById('middle-right-content-wrapper');
    let middleContent = document.getElementById('middle-content');
    let rightContent = document.getElementById('aside-index-content-list');
    drawerToggleLayout.classList.toggle('toggle-layout');
    mainContentWrapper.classList.toggle('container');
    if(middleContent.classList.contains('col-8')){
        middleContent.classList.replace('col-8','col-9');
        rightContent.classList.replace('col-4','col-3');
    }else{
        middleContent.classList.replace('col-9','col-8');
        rightContent.classList.replace('col-3','col-4');
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