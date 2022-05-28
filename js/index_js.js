const apiListURL = "https://script.google.com/macros/s/AKfycbxRY8fvuTnOXT26eUr-0v5qNgygk11ZXykihI1Vy3KFXHx-Fzym9ZhiA9tu1z86e4AAzg/exec";

async function fetchAPIList(url) {
    const response = await fetch(url);
    var data = await response.json();

    for (var obj in data.data) {
        let keyArr = Object.keys(data.data[obj]);
        sessionStorage.setItem(data.data[obj][keyArr[0]],data.data[obj][keyArr[1]]);
    }
}

fetchAPIList(apiListURL);