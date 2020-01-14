const BASIC_URL = 'http://127.0.0.1:8888';
let movieId = '26942674';
let movieInformations = document.getElementsByClassName('movie-informations')[0];
let movieSummarys = document.getElementsByClassName('movie-summary')[0];
let movieComments = document.getElementsByClassName('movie-comments')[0];

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
    ajax(options);
}


function loadMovieDetail(data) {
    //电影名称（中英）、时间  
    let movieTitle = data.title;
    let movieOriginalTitle = data.original_title;
    let movieYear = data.year;
    //剧照  
    let movieImages = data.images; //{small: large: medium:}
    //导演 主演 类型 国家地区  语言 时长 上映日期 评分
    let movieDirectors = data.directors; //[{alt: name: id: }]
    let movieCasts = data.casts; //[{alt: name: id:},{..},{..}]
    movieDirectors = data.directors.map(item => item.name).join(',');
    movieCasts = data.casts.map(item => item.name).join(',');
    let movieGenres = data.genres.join(','); //[1,2]
    let movieCountries = data.countries.join(','); //[]
    let movieRating = data.rating; //{max: avg:stars: min:}
    //剧情简介
    let movieSummary = data.summary;

    movieInformations.innerHTML = `<h2>${movieTitle}——${movieOriginalTitle}</h2>
    <div class="picAndDetail">
    <img src="${movieImages.small}" />
    <div class="movie-details">
    <p>导演：${movieDirectors}</p>
    <p>主演：${movieCasts}</p>
    <p>类型：${movieGenres}</p>
    <p>制片国家/地区：${movieCountries}</p>
    <p>上映日期：${movieYear}</p>
    <p>评分：${movieRating.average}</p></div></div>`;
    movieSummarys.innerHTML = `<h3>剧情简介</h3><p>${movieSummary}</p>`;
}


//影评
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
    ajax(options);
}

function loadMovieReviews(data) {
    let comments = data.comments.slice(0, 5); //[{},{}]
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

function ratingToStar(num) {
    return "★".repeat(num) + "☆".repeat(5 - num);
}

getMovieData();
getMovieReviews();