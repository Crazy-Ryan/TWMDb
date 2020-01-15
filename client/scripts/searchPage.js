let content = document.getElementsByClassName('content')[0];
let moviesTest = [{
    "title": "\u8096\u7533\u514b\u7684\u6551\u8d4e",
    "rating": 9.7,
    "genres": ["\u72af\u7f6a", "\u5267\u60c5"],
    "images": "http://img3.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p480747492.jpg",
    "casts": ["\u8482\u59c6\u00b7\u7f57\u5bbe\u65af", "\u6469\u6839\u00b7\u5f17\u91cc\u66fc", "\u9c8d\u52c3\u00b7\u5188\u987f"],
    "directors": ["\u5f17\u5170\u514b\u00b7\u5fb7\u62c9\u90a6\u7279"],
}];
initDb();
let movieTop250 = readOnServiceDb();

function searchProject() {
    let x = document.getElementById("search-movie").value;
    content.innerHTML = `<h2>搜索：${x}</h2>`;
    // let hasMovie;
    // let searchMovieId = [];
    // for (let i = 0; i < moviesTest.length; i++) {
    //     if (moviesTest[i].title.search(x) !== -1) {
    //         searchMovieId.push(i);
    //         hasMovie = true;
    //         break;
    //     } else {
    //         hasMovie = false;
    //     }
    // }
    let searchMovieId = itemSearch(movieTop250, x);
    let searchMovie = movieSearch(searchMovieId);
    console.log(searchMovieId);
    console.log(searchMovie);
    if (x && searchMovie) {
        searchMovie.forEach(item => {
            content.innerHTML += `<div class="searchResult">
            <div class="picAndDetail">
            <a href="../pages/detailPage.html?${item.id}" target="_blank"><img src="${item.images.small}" /></a>
            <div class="movie-details">
            <p>${item.title}</p>
            <p>导演：${item.directors.map(item => item.name).join(',')}</p>
            <p>主演：${item.casts.map(item => item.name).join(',')}</p>
            <p>类型：${item.genres.join(',')}</p>
            <p>评分：${item.rating.average}</p>
      </div></div></div>`;
        });
    } else {
        content.innerHTML += `<div class="searchResult">没有找到关于"${x}"的电影，换个搜索词试试吧~</div>`;
    }
}

function keyEnterSearchProject(event) {
    if (13 == event.keyCode) {
        searchProject();
    }
}

function movieSearch(searchMovieId) {
    let res = movieTop250.filter(movie => (searchMovieId.indexOf(movie.id) !== -1));
    return res;
}