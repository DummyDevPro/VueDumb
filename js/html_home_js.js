const getAllElementsAPI = sessionStorage.getItem("HTML Elements");

async function fetchHTMLElements(url) {
    const response = await fetch(url);
    let data = await response.json();

    let filterElementGroup = [];
    for (let obj in data.data) {
        if (filterElementGroup.length == 0) {
            filterElementGroup.push(data.data[obj]['Element Group']);
        } else {
            if (!filterElementGroup.includes(data.data[obj]['Element Group'])) {
                filterElementGroup.push(data.data[obj]['Element Group']);
            }
        }
    }

    if (filterElementGroup.length != 0) {
        document.getElementById('loading_layout_id').style.display = 'none';
        for (let filterIdx in filterElementGroup) {
            document.getElementById('html_elements_id').innerHTML += '<h3>' + filterElementGroup[filterIdx] + '</h3';

            for (let obj in data.data) {
                if (filterElementGroup[filterIdx] == data.data[obj]['Element Group']) {
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
                    for (var sp in detailSplitArr) {
                        eleDetail += detailSplitArr[sp] + '<br>';
                    }

                    composeHTML = '<div class="col-md-6 col-12">';
                    composeHTML += '<div class="card">';
                    composeHTML += '<div class="card-body">';
                    composeHTML += '<h5 class="card-title">' + cardTitle;
                    composeHTML += '<span class="badge ' + eleDisplayTypeColorTextCode + ' ms-1">' + eleDisplayType + '</span>';
                    composeHTML += '</h5><hr>';
                    composeHTML += '<h6 class="card-subtitle mb-2 text-muted">' + cardSubTitle + '</h6>';
                    composeHTML += '<p class="card-text">' + eleDetail + '</p></div></div></div>';
                    document.getElementById('html_elements_id').innerHTML += composeHTML;
                    // await sleep(150);
                }
            }

        }
    }
}

const sleep = ms => new Promise(res => setTimeout(res, ms))

fetchHTMLElements(getAllElementsAPI);