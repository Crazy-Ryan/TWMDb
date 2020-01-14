const BASIC_URL = 'http://127.0.0.1:8888';
let movieId = '26942674';
let movieDetail = document.getElementsByClassName('content')[0];

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
    movieDetail.innerHTML += `<h2>${movieTitle}——${movieOriginalTitle}</h2>
    <div class="movie-informations">
    <img src="${movieImages.small}" />
    <div class="movie-details">
    <p>导演：${movieDirectors}</p>
    <p>主演：${movieCasts}</p>
    <p>类型：${movieGenres}</p>
    <p>制片国家/地区：${movieCountries}</p>
    <p>上映日期：${movieYear}</p>
    <p>评分：${movieRating.average}</p></div></div>
    <div class="movie-summary"><h3>剧情简介</h3><p>${movieSummary}</p></div>`;
}


getMovieData();