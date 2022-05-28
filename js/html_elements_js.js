const getAllElementsAPI = "https://script.google.com/macros/s/AKfycbz0724tRW5GKyzBWxNogOH5TTsISZek9bJnApswODDsnYTOrVY3gexXHaiVpt4Wi6bPZA/exec";
async function fetchHTMLElements(url) {
    const response = await fetch(url);
    var data = await response.json();

    console.log(data.data);

    for (var obj in data.data) {
        let cardTitle = '';
        let cardSubTitle = '';
        let eleDisplayType = '';
        let eleDetail = '';
        let composeHTML = '';
        let eleDisplayTypeColorTextCode = '';
        // Element name
        cardTitle = data.data[obj].Element;

        // Element short mean
        cardSubTitle = data.data[obj]['Short mean'];

        // Element display type check
        if (data.data[obj]['Block Level Element'] == '〇') {
            eleDisplayType = 'Block';
            eleDisplayTypeColorTextCode = 'bg-primary';
        }
        if (data.data[obj]['Inline Level Element'] == '〇') {
            eleDisplayType = 'Inline';
            eleDisplayTypeColorTextCode = 'bg-warning';
        }

        // Element detail
        let detailSplitArr = (data.data[obj].Detail).split('\n');
        for(var sp in detailSplitArr){
            eleDetail += detailSplitArr[sp] + '<br>';
        }

        composeHTML = '<div class="col-md-6 col-12">';
        composeHTML += '<div class="card">';
        composeHTML += '<div class="card-body">';
        composeHTML += '<h5 class="card-title">' + cardTitle;
        composeHTML += '<span class="badge '+ eleDisplayTypeColorTextCode + ' ms-1">' + eleDisplayType + '</span>';
        composeHTML += '</h5><hr>';
        composeHTML += '<h6 class="card-subtitle mb-2 text-muted">' + cardSubTitle + '</h6>';
        composeHTML += '<p class="card-text">' + eleDetail + '</p></div></div></div>';
        
        document.getElementById('loading_layout_id').style.display = 'none';
        document.getElementById('html_elements_id').innerHTML += composeHTML;
        await sleep(100);
    }

}

const sleep = ms => new Promise(res => setTimeout(res, ms))

fetchHTMLElements(getAllElementsAPI);