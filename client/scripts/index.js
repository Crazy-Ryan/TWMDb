let classificationDb;
let movieDb;
let pastHighlightCatagoryBox;
let movieListToRender;
let movieRenderProgressIndex = 1;
const movieRenderInterval = 20;


initDb(fetchDataFromLocalStorage);
renderAllCatagorys();
movieListToRender = findMoviesIds(movieDb);
renderMovieListInInterval(movieListToRender, movieRenderProgressIndex, movieRenderProgressIndex + movieRenderInterval - 1);

function fetchDataFromLocalStorage() {
  classificationDb = readDbClassification();
  movieDb = readOnServiceDb();
}

// let showId = ["1292052", "1295644", "1307914", "1291841", "1296141", "1299131", "1293350", "26580232", "1305487"];

function onInterfaceClick(event) {
  const catagoryBox = 'catagory-box';
  const bannerImg = 'banner-img';
  let clickClass = event.target.getAttribute('class') || event.target.parentElement.getAttribute('class');
  console.log(clickClass);
  switch (clickClass) {
    case catagoryBox:
      selectCatagoryHandle(findCatagoryBox(event.target));
      break;
    case bannerImg:
      onClickBannerImg(event.target);
      break;
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
  if (pastHighlightCatagoryBox) {
    toggleHighlightCatagoryBox(pastHighlightCatagoryBox);
  }
  pastHighlightCatagoryBox = target;
}

function toggleHighlightCatagoryBox(target) {
  if ('darkcyan' === target.style.backgroundColor) {
    target.style.backgroundColor = 'transparent';
  } else {
    target.style.backgroundColor = 'darkcyan';
  }
}

function findCatagoryBox(target) {
  let targetEl;
  if (event.target.getAttribute('class')) {
    targetEl = event.target;
  } else {
    targetEl = event.target.parentElement;
  }
  return targetEl;
}

function selectCatagoryHandle(catagoryBoxEl) {
  let catagorySelected = catagoryBoxEl.firstElementChild.textContent;
  highlightCatagoryBox(catagoryBoxEl);
  removeMovies();
  movieRenderProgressIndex = 1;
  movieListToRender = findMoviesOfCatagory(classificationDb, catagorySelected);
  renderMovieListInInterval(movieListToRender, movieRenderProgressIndex, movieRenderProgressIndex + movieRenderInterval - 1);
  // window.scrollTo(0, 0);
}

function sortCatagoryByMovieCount(catagoryObjList) {
  return catagoryObjList.sort(function (a, b) {
    return b.id.length - a.id.length;
  });
}

function onClickBannerImg(target){
  let movieId = target.getAttribute("douban-id");
  const imgHrefPrefix = "../pages/detailPage.html?"
  window.open(imgHrefPrefix+movieId, '_blank');
}

function removeMovies() {
  let movieGallaryEl = document.getElementsByClassName("movie-gallary")[0];
  while (movieGallaryEl.firstChild) {
    movieGallaryEl.removeChild(movieGallaryEl.firstChild);
  }
}

function renderMovieListInInterval(idList, start, end) {
  let renderStart = start || 1;
  let renderEnd = end || idList.length;
  let movieGallaryEl = document.getElementsByClassName("movie-gallary")[0];
  idList.slice(renderStart - 1, renderEnd).forEach((id) => {
    movieGallaryEl.appendChild(renderSingleMovie(getDataById(movieDb, id)));
  })
}

function renderSingleMovie(movieObj) {
  let movieEl = document.createElement('div');
  movieEl.innerHTML = `
  <div class="movie-box">
    <a href="../pages/detailPage.html?${movieObj.id}" target="_blank">
      <div class="img-wrap">
        <img src=${movieObj.images.small}>
      </div>
      <div class="movie-title">${movieObj.title}</div>
    </a>
    <div class="movie-year">(${movieObj.year})</div>
    <div>
      <span class="rating-star">★</span><span class="movie-rating">${movieObj.rating.average.toFixed(1)}</span>
    </div>
  </div>`;
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
  renderCatagorysFromList(sortCatagoryByMovieCount(classificationDb));
}

function getDataById(database, id) {
  return database.find((movie) => (id.toString() === movie.id))
}

function getDocumentTop() {
  let scrollTop = 0,
    bodyScrollTop = 0,
    documentScrollTop = 0;
  if (document.body) {
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop;
  }
  scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
  return scrollTop;
}

function getWindowHeight() {
  let windowHeight = 0;
  if (document.compatMode == "CSS1Compat") {
    windowHeight = document.documentElement.clientHeight;
  } else {
    windowHeight = document.body.clientHeight;
  }
  return windowHeight;
}

function getScrollHeight() {
  let scrollHeight = 0,
    bodyScrollHeight = 0,
    documentScrollHeight = 0;
  if (document.body) {
    bodyScrollHeight = document.body.scrollHeight;
  }

  if (document.documentElement) {
    documentScrollHeight = document.documentElement.scrollHeight;
  }
  scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
  return scrollHeight;
}


window.onscroll = function () {
  // console.log(getWindowHeight(), getDocumentTop(), getScrollHeight());
  if (getScrollHeight() < getWindowHeight() + getDocumentTop() + 15) {
    let loadmore = document.getElementsByClassName('loadmore')[0];
    loadmore.innerHTML = '<span class="loading"></span>加载中..';
    if (getScrollHeight() - 1 <= getWindowHeight() + getDocumentTop()) {
      loadmore.innerHTML = ' ';
      // if ((movieRenderProgressIndex + movieRenderInterval) < movieListToRender.length) {
      movieRenderProgressIndex += movieRenderInterval;
      renderMovieListInInterval(movieListToRender, movieRenderProgressIndex, movieRenderProgressIndex + movieRenderInterval - 1);
      // }
    }
  }
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