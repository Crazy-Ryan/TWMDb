const BASIC_URL = 'http://127.0.0.1:8888';
let movieId = window.location.search.slice(1);
let movieDb;
let classificationDb;
let movieInformations = document.getElementsByClassName('movie-informations')[0];
let movieSummarys = document.getElementsByClassName('movie-summary')[0];
let movieComments = document.getElementsByClassName('movie-comments')[0];
let movieRecommend = document.getElementsByClassName('recommend-information')[0];

function fetchDataFromLocalStorage() {
    classificationDb = readDbClassification();
    movieDb = readOnServiceDb();
}

function getMovieData() {
    let options = {
        url: BASIC_URL + '/v2/movie/subject/' + movieId,
        method: 'GET',
        success: function(res) {
            loadMovieDetail(res);
        },
        fail: function(error) {
            console.log('ERROR');
        }
    }
    AJAXHandle(options);
}


function loadMovieDetail(data) {
    let movieDirectors = data.directors.map(item => item.name).join(',');
    let movieCasts = data.casts.map(item => item.name).join(',');
    let movieGenres = data.genres.join(',');
    let movieCountries = data.countries.join(',');

    movieInformations.innerHTML = `<h2>${data.title}——${data.original_title}</h2>
    <div class="picAndDetail">
    <img src="${data.images.small}" />
    <div class="movie-details">
    <p>导演：${movieDirectors}</p>
    <p>主演：${movieCasts}</p>
    <p>类型：${movieGenres}</p>
    <p>制片国家/地区：${movieCountries}</p>
    <p>上映日期：${data.year}</p>
    <p>评分：${data.rating.average}</p></div></div>`;
    movieSummarys.innerHTML = `<h3>剧情简介</h3><p>${data.summary}</p>`;
}

function getMovieReviews() {
    let options = {
        url: BASIC_URL + '/v2/movie/subject/' + movieId + '/comments?start=1&count=100',
        method: 'GET',
        success: function(res) {
            loadMovieReviews(res);
        },
        fail: function(error) {
            console.log('ERROR');
        }
    }
    AJAXHandle(options);
}

function loadMovieReviews(data) {
    let comments = sortCommentsWithTime(data.comments).slice(0, 5);
    movieComments.innerHTML += `<h3>电影热评</h3>
    <div class="user-comments"></div>`;
    let userComments = document.getElementsByClassName('user-comments')[0];
    comments.forEach(element => {
        userComments.innerHTML += `
      <div class='user-comment'>
      <span>${element.author.name}</span>
      <span>${ratingToStar(element.rating.value)}</span>
      <span> ${element.created_at.split(' ')[0]}</span>
      <p>${element.content}</p>
      </div>`;
    });
}

function sortCommentsWithTime(comments) {
    let sortComments = comments.sort(function(movieA, movieB) {
        let yearA = Number(movieA.created_at.split(/[-: ]/).join(''));
        let yearB = Number(movieB.created_at.split(/[-: ]/).join(''));
        return yearB - yearA;
    })
    return sortComments;
}

function ratingToStar(num) {
    return "★".repeat(num) + "☆".repeat(5 - num);
}

function loadMovieRecommend(movieId) {
    let data = movieDb.filter(
        item => (item.id === movieId)
    )[0];
    let movieTitle = data.title;
    let movieRating = data.rating.average;
    let movieImages = data.images.small;
    let movieURL = `../pages/detailPage.html?${movieId}`;
    movieRecommend.innerHTML += `
    <div class="one-movie-recommend">
      <a href=${movieURL}>
        <img src="${movieImages}" />
        <p>${movieTitle}</p>
      </a>
        <p>评分：${movieRating}</p>
    </div>`;
}

function getMovieRecommendId(movieId) {
    let data = movieDb.filter(
        item => (item.id === movieId)
    );
    let recommendData = classificationDb.filter(
        item => (item.name === data[0].genres[0])
    );
    let recommendMovieIdList = recommendData[0].id.filter(
        item => (item !== movieId)
    );
    return recommendMovieIdList.slice(0, 6);
}


function getMovieRecommends() {
    let recommendMovieIdList = getMovieRecommendId(movieId);
    recommendMovieIdList.forEach(
        item => loadMovieRecommend(item)
    );
}

function keyEnterSearchProject() {
    if (13 == event.keyCode) {
        searchProject();
    }
}


function searchProject() {
    let inputValue = document.getElementById("search-movie").value;
    window.open(`../pages/searchPage.html?${inputValue}`, '_blank');
}

initDb(() => {
    fetchDataFromLocalStorage();
    getMovieData();
    getMovieReviews();
    getMovieRecommends();
});