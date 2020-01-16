let classificationDb;
let movieDb;
let pastHighlightCatagoryBox;

initDb(fetchDataFromLocalStorage);
renderAllCatagorys();
renderMovieList(findMoviesIds(movieDb));
function fetchDataFromLocalStorage() {
  classificationDb = readDbClassification();
  movieDb = readOnServiceDb();
}

// let showId = ["1292052", "1295644", "1307914", "1291841", "1296141", "1299131", "1293350", "26580232", "1305487"];

function onInterfaceClick(event) {
  const catagoryBox = 'catagory-box';
  let clickClass = event.target.getAttribute('class') || event.target.parentElement.getAttribute('class');
  // console.log(clickClass);
  if (catagoryBox === clickClass) {
    selectCatagoryHandle(findCatagoryBox(event.target));
  }
}

function findMoviesIds(movieList) {
  return movieList.map((movie) => (movie.id));
}

function findMoviesOfCatagory(catagoryList, catagoryName) {
  return catagoryList.find((catagory) => (catagoryName === catagory.name)).id;
}

function highlightCatagoryBox(target) {
  toggleHighlightCatagoryBox(target);
  if (pastHighlightCatagoryBox){
    toggleHighlightCatagoryBox(pastHighlightCatagoryBox);
  }
  pastHighlightCatagoryBox = target;
}

function toggleHighlightCatagoryBox(target) {
  if ('yellow' === target.style.backgroundColor){
    target.style.backgroundColor = 'transparent';
  }
  else{
    target.style.backgroundColor = 'yellow';
  }
}

function findCatagoryBox(target){
  let targetEl;
  if(event.target.getAttribute('class')){
    targetEl = event.target;
  }
  else{
    targetEl=event.target.parentElement;
  }
  return targetEl;
}

function selectCatagoryHandle(catagoryBoxEl){
  let catagorySelected = catagoryBoxEl.firstElementChild.textContent;
  highlightCatagoryBox(catagoryBoxEl);
  removeMovies();
  renderMovieList(findMoviesOfCatagory(classificationDb,catagorySelected));
  window.scrollTo(0,0);
}

function removeMovies() {
  let movieGallaryEl = document.getElementsByClassName("movie-gallary")[0];
  while (movieGallaryEl.firstChild) {
    movieGallaryEl.removeChild(movieGallaryEl.firstChild);
  }
}

function renderMovieList(idList) {
  let movieGallaryEl = document.getElementsByClassName("movie-gallary")[0];
  idList.forEach((id) => {
    movieGallaryEl.appendChild(renderSingleMovie(getDataById(movieDb, id)));
  })
}

function renderSingleMovie(movieObj) {
  let movieEl = document.createElement('div');
  movieEl.setAttribute('class', 'movie-box');
  movieEl.innerHTML = `
    <a href="../pages/detailPage.html?${movieObj.id}"><img src=${movieObj.images.small} />
      <div><span class="movie-title">${movieObj.title}</span>
    </a><span class="movie-year">(${movieObj.year})</span>
    </div>
    <div><span class="rating-star">★</span><span class="movie-rating">${movieObj.rating.average.toFixed(1)}</span></div>`;
  return movieEl;
}

function renderSingleCatagory(catagoryObj) {
  let catagoryEl = document.createElement('div');
  catagoryEl.setAttribute('class', 'catagory-box');
  catagoryEl.innerHTML = `
    <span>${catagoryObj.name}</span>
    <span>(${catagoryObj.id.length}部)</span>`
  return catagoryEl;
}

function renderCatagorysFromList(catagoryObjList) {
  let catagoryListEl = document.getElementsByClassName("catagory-list")[0];
  catagoryObjList.forEach((catagoryObj) => {
    catagoryListEl.appendChild(renderSingleCatagory(catagoryObj));
  })
}

function renderAllCatagorys() {
  renderCatagorysFromList(classificationDb);
}

function getDataById(database, id) {
  return database.find((movie) => (id.toString() === movie.id))
}

function searchProject() {
  let inputValue = document.getElementById("search-movie").value;
  content.innerHTML = `<h2>搜索：${inputValue}</h2>`;
  let searchMovieId = itemSearch(movieDb, inputValue);
  let searchMovie = movieSearch(searchMovieId);
  if (inputValue && searchMovie.length !== 0) {
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
    content.innerHTML += `<div class="searchResult">没有找到关于"${inputValue}"的电影，换个搜索词试试吧~</div>`;
  }
}

function keyEnterSearchProject(event) {
  if (13 == event.keyCode) {
    searchProject();
  }
}