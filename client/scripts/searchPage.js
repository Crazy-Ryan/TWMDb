let content = document.getElementsByClassName('content')[0];
// let searchTitle = content.children[0];

function searchProject() {
    let x = document.getElementById("search-movie").value;
    console.log(x);
    content.innerHTML = `<h2>搜索：${x}</h2>`;
    if (false) {} else {
        content.innerHTML += `<div class="searchResult">没有找到关于"${x}"的电影，换个搜索词试试吧~</div>`;
    }
}

function keyEnterSearchProject(event) {
    if (13 == event.keyCode) {
        searchProject();
    }
}